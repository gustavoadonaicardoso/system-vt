import { supabase } from './supabase';

export interface ZApiConfig {
  instanceId: string;
  token: string;
}

export async function sendWhatsApp(phone: string, message: string) {
  if (!supabase) return;

  try {
    // 1. Fetch current Z-API settings
    const { data: config, error: configError } = await supabase
      .from('integrations_config')
      .select('config')
      .eq('provider', 'zapi')
      .single();

    if (configError || !config) {
      console.warn('Z-API não configurada ou instâncias não encontradas.');
      return;
    }

    const { instanceId, token } = config.config as ZApiConfig;

    if (!instanceId || !token) {
      console.warn('Credenciais Z-API incompletas.');
      return;
    }

    // 2. Format phone number (ensure only digits and starts with 55)
    let cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone.startsWith('55')) {
      cleanPhone = '55' + cleanPhone;
    }

    // 3. Send Request
    const response = await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: cleanPhone,
        message: message
      })
    });

    const result = await response.json();
    return result;

  } catch (err) {
    console.error('Falha ao enviar WhatsApp via Z-API:', err);
    return null;
  }
}
