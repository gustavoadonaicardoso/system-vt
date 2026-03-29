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
export async function sendWhatsApp(phone: string, message: string, options?: { delayMessage?: number; delayTyping?: number }) {
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
        // Normalize phone for comparison
        let rawPhone = payload.phone || '';
        let cleanPhone = rawPhone.replace(/\D/g, '');
        
        // Handle message event
        // Note: Z-API typically uses 'type' or follows an event pattern
        const isReceivedMessage = payload.isGroup === false; // Usually only handle direct messages unless configured
        
        if (isReceivedMessage && payload.text?.message) {
            const senderName = payload.senderName || 'Cliente WhatsApp';
            const messageText = payload.text.message;

            // 1. Find existing lead
            const { data: existingLeads } = await supabase
                .from('leads')
                .select('id, name')
                .eq('phone', cleanPhone)
                .maybeSingle();

            if (existingLeads) {
                // Update last activity or similar if you have the fields
                console.log(`[Z-API] Mensagem de lead existente: ${existingLeads.name}`);
            } else {
                // 2. Create new lead if not found
                // Get the first stage ID
                const { data: stages } = await supabase
                    .from('pipeline_stages')
                    .select('id')
                    .order('position', { ascending: true })
                    .limit(1);

                const firstStageId = stages && stages.length > 0 ? stages[0].id : null;

                const { data: newLead, error: createError } = await supabase
                    .from('leads')
                    .insert([{
                        name: senderName,
                        phone: cleanPhone,
                        stage_id: firstStageId,
                        email: ''
                    }])
                    .select()
                    .single();

                if (!createError && newLead) {
                    await logAudit(
                        null, 
                        'LEAD_CREATE', 
                        `Lead ${senderName} criado automaticamente via WhatsApp (Z-API).`,
                        'lead',
                        newLead.id
                    );
                }
            }
            
            // 3. Optional: Save to a separate messages/conversations table
        }
        
        return { success: true };
    } catch (error: any) {
        console.error('Z-API Webhook Error:', error);
        return { success: false, error: error.message };
    }
}
