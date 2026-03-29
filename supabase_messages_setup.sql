-- SQL para criar a tabela de agendamento de mensagens no Supabase
-- Copie e cole este código no SQL Editor do seu Dashboard do Supabase

CREATE TABLE IF NOT EXISTS scheduled_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  channel TEXT NOT NULL, -- whatsapp, instagram, messenger, email
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  lead_name TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  template_name TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' -- pending, sent, failed
);

-- Habilitar RLS (Segurança de Nível de Linha)
ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso (Permitir tudo para usuários autenticados)
CREATE POLICY "Allow all messages for authenticated" 
ON scheduled_messages FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
