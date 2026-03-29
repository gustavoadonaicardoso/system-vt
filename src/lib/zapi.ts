import { supabase } from './supabase';
import { logAudit } from './audit';

export interface ZApiConfig {
  instanceId: string;
  token: string;
  clientToken?: string;
  receiveGroups?: boolean;
}

/**
 * Send a text message through Z-API
 */
export async function sendWhatsApp(phone: string, message: string, leadId?: string, options?: { delayMessage?: number; delayTyping?: number }) {
  if (!supabase) return { success: false, error: 'Supabase não inicializado' };

  try {
    const { data: item, error: configError } = await supabase
      .from('integrations_config')
      .select('config')
      .eq('provider', 'zapi')
      .maybeSingle();

    if (configError || !item) {
      return { success: false, error: 'Z-API não configurada' };
    }

    const { instanceId, token, clientToken } = item.config as ZApiConfig;

    if (!instanceId || !token) {
      return { success: false, error: 'Credenciais Z-API incompletas' };
    }

    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return { success: false, error: 'Número inválido' };
    
    if (!cleanPhone.startsWith('55')) {
      cleanPhone = '55' + cleanPhone;
    }

    const response = await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(clientToken ? { 'Client-Token': clientToken } : {})
      },
      body: JSON.stringify({
        phone: cleanPhone,
        message: message,
        delayMessage: options?.delayMessage || 0,
        delayTyping: options?.delayTyping || 0
      })
    });

    const result = await response.json();
    
    if (response.ok && leadId) {
        // Save to Database
        await supabase.from('chat_messages').insert([{
            lead_id: leadId,
            text: message,
            sent_by_me: true,
            type: 'text'
        }]);
    }

    return { success: response.ok, data: result };

  } catch (err: any) {
    console.error('Z-API Send Error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Handle incoming Webhook from Z-API
 */
export async function handleZapiWebhook(payload: any) {
    if (!supabase) return { success: false, error: 'Supabase não inicializado' };

    try {
        let rawPhone = payload.phone || '';
        let cleanPhone = rawPhone.replace(/\D/g, '');
        
        // Z-API sends country code. Remove it to find local leads if necessary, 
        // but it's better to keep it if the DB phone also has it.
        // We will try a robust search:
        const searchSuffix = cleanPhone.slice(-8); // Get last 8 digits

        const isReceivedMessage = payload.isGroup === false;
        
        if (isReceivedMessage && (payload.text?.message || payload.audio?.audioUrl)) {
            const senderName = payload.senderName || 'Cliente WhatsApp';
            const messageText = payload.text?.message || '';
            const audioUrl = payload.audio?.audioUrl || null;
            const messageType = audioUrl ? 'audio' : 'text';

            // 1. Find existing lead by normalized phone
            // PostgreSQL trick to compare only digits
            const { data: lead } = await supabase
                .rpc('find_lead_by_phone', { search_phone: cleanPhone }) // Recommended SQL function approach
                .maybeSingle();
            
            // Fallback if RPC not defined
            let targetLead: any = lead;
            if (!targetLead) {
                const { data: leads } = await supabase.from('leads').select('id, name, phone');
                targetLead = leads?.find((l: any) => l.phone.replace(/\D/g, '').endsWith(searchSuffix));
            }

            let leadId = targetLead?.id;

            if (!leadId) {
                // 2. Create new lead
                const { data: stages } = await supabase.from('pipeline_stages').select('id').order('position').limit(1);
                const firstStageId = stages && stages.length > 0 ? stages[0].id : null;

                const { data: newLead } = await supabase.from('leads').insert([{
                    name: senderName,
                    phone: cleanPhone,
                    stage_id: firstStageId
                }]).select().single();

                if (newLead) {
                    leadId = newLead.id;
                    await logAudit(null, 'LEAD_CREATE', `Lead ${senderName} criado via Z-API.`, 'lead', newLead.id);
                }
            }
            
            if (leadId) {
                // 3. Save Message to Database
                await supabase.from('chat_messages').insert([{
                    lead_id: leadId.toString(),
                    text: messageText,
                    audio_url: audioUrl,
                    sent_by_me: false,
                    type: messageType
                }]);
                
                // 4. Update lead lastMsg
                await supabase.from('leads').update({ 
                    last_msg: messageText || (audioUrl ? '🎵 Áudio' : 'Nova mensagem') 
                }).eq('id', leadId);
            }
        }
        
        return { success: true };
    } catch (error: any) {
        console.error('Z-API Webhook Error:', error);
        return { success: false, error: error.message };
    }
}
