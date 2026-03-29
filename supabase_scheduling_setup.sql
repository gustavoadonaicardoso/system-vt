-- SQL para criar a tabela de agendamento no Supabase
-- Copie e cole este código no SQL Editor do seu Dashboard do Supabase

CREATE TABLE IF NOT EXISTS scheduling_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  status TEXT NOT NULL DEFAULT 'todo', -- 'todo', 'in-progress', 'done'
  date DATE NOT NULL,
  time TIME,
  type TEXT NOT NULL DEFAULT 'task', -- 'task', 'event'
  lead TEXT
);

-- Habilitar RLS (Segurança de Nível de Linha)
ALTER TABLE scheduling_items ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso (Permitir tudo para usuários autenticados)
-- Nota: Para produção, refine estas políticas conforme necessário.
CREATE POLICY "Allow all for authenticated users" 
ON scheduling_items FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
