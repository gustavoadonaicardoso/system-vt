-- SCRIPT DE BANCO DE DADOS: INDICADORES CRM VORTICE --

-- 1. Atualizar Tabela de Leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Site';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS wait_time_minutes INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS handling_time_minutes INTEGER DEFAULT 0;

-- 2. Tabela de Registros de Atendimento (Histórico Real) para TMA/TME
CREATE TABLE IF NOT EXISTS conversation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES profiles(id),
    status TEXT CHECK (status IN ('OPEN', 'FINISHED', 'TRANSFERRED')) DEFAULT 'OPEN',
    source TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    wait_time_minutes INTEGER DEFAULT 0,
    handling_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices de Performance
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_conv_status ON conversation_logs(status);
CREATE INDEX IF NOT EXISTS idx_conv_lead_id ON conversation_logs(lead_id);

-- 4. Tabela de Atualizações do Sistema (Manual via Painel Master)
CREATE TABLE IF NOT EXISTS system_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT,
    icon_name TEXT DEFAULT 'TrendingUp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Configurações de Marca (Personalização via Painel Master)
CREATE TABLE IF NOT EXISTS system_config (
    id TEXT PRIMARY KEY DEFAULT 'branding',
    primary_color TEXT DEFAULT '#3b82f6',
    secondary_color TEXT DEFAULT '#8b5cf6',
    logo_url TEXT,
    favicon_url TEXT,
    app_name TEXT DEFAULT 'Vórtice CRM',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir valor inicial padrão
INSERT INTO system_config (id, primary_color, secondary_color, app_name)
VALUES ('branding', '#3b82f6', '#8b5cf6', 'Vórtice CRM')
ON CONFLICT (id) DO NOTHING;
