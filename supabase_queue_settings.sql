-- Create queue settings table
CREATE TABLE IF NOT EXISTS queue_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    total_desks INTEGER DEFAULT 5,
    logo_url TEXT,
    banner_url TEXT,
    app_name TEXT DEFAULT 'VÓRTICE PAINEL',
    primary_color TEXT DEFAULT '#3b82f6',
    secondary_color TEXT DEFAULT '#8b5cf6',
    welcome_text TEXT DEFAULT 'Bem-vindo ao nosso atendimento',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO queue_settings (id, total_desks, primary_color, secondary_color, app_name)
VALUES ('default', 5, '#3b82f6', '#8b5cf6', 'VÓRTICE PAINEL')
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for easy access (or add policies)
ALTER TABLE queue_settings DISABLE ROW LEVEL SECURITY;
