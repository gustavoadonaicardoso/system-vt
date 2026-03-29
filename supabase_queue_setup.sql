-- Create tickets table for queuing system
CREATE TABLE IF NOT EXISTS queue_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INTEGER NOT NULL,
    desk TEXT, -- desk where ticket was called
    status TEXT DEFAULT 'waiting', -- waiting, calling, completed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to reset ticket count at start of day (Optional) or just keep incrementing
-- For now, let's create a simple trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_queue_tickets_updated_at
BEFORE UPDATE ON queue_tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE queue_tickets;
