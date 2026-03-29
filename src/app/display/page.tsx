'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './display.module.css';

interface Ticket {
  id: string;
  number: number;
  desk: string;
  status: string;
  created_at: string;
}

interface QueueSettings {
  logo_url: string;
  banner_url: string;
  primary_color: string;
  welcome_text: string;
}

export default function DisplayPage() {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [history, setHistory] = useState<Ticket[]>([]);
  const [settings, setSettings] = useState<QueueSettings | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchTickets = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('queue_tickets')
      .select('*')
      .or('status.eq.calling,status.eq.completed')
      .order('updated_at', { ascending: false })
      .limit(6);

    if (data && data.length > 0) {
      // Find the most recent 'calling' ticket for the main display
      const calling = data.find(t => t.status === 'calling') || data[0];
      setCurrentTicket(calling);
      
      // The rest is history, excluding the current one if it's there
      setHistory(data.filter(t => t.id !== calling.id));
    } else {
      setCurrentTicket(null);
      setHistory([]);
    }
  };

  const fetchSettings = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('queue_settings').select('*').eq('id', 'default').single();
    if (data) setSettings(data);
  };

  useEffect(() => {
    // Current time clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    fetchTickets();
    fetchSettings();

    // Subscribe to changes
    const channel = supabase
      ?.channel('queue_changes')
      .on(
        'postgres_changes',
        { event: '*', table: 'queue_tickets', schema: 'public' },
        (payload) => {
          console.log('Realtime update:', payload);
          // Refresh data on any change
          fetchTickets();
          
          // Play sound if a new ticket is called
          if (payload.eventType === 'UPDATE' && payload.new.status === 'calling') {
            audioRef.current?.play().catch(e => console.log('Audio error:', e));
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      supabase?.removeChannel(channel!);
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* Invisible audio element for the chime */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

      <header className={styles.header}>
        <div className={styles.logo}>
          {settings?.logo_url ? (
            <img src={settings.logo_url} alt="Logo" style={{ height: '50px' }} />
          ) : (
            'VÓRTICE PAINEL'
          )}
        </div>
        <div className={styles.clock}>
          {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      <main className={styles.mainDisplay}>
        <div className={styles.currentTicketCard}>
          <span className={styles.label}>Senha Atual</span>
          <h1 className={styles.ticketNumber} style={{ color: settings?.primary_color || 'white' }}>
            {currentTicket ? currentTicket.number.toString().padStart(2, '0') : '--'}
          </h1>
          <div className={styles.deskInfo} style={{ color: settings?.primary_color || '#3b82f6' }}>
            {currentTicket ? `GUICHÊ ${currentTicket.desk}` : 'AGUARDANDO...'}
          </div>
        </div>

        <div className={styles.history}>
          <h2 className={styles.historyTitle}>Últimas Senhas</h2>
          {history.length > 0 ? (
            history.map((ticket) => (
              <div key={ticket.id} className={styles.historyItem}>
                <span className={styles.historyTicket}>
                  #{ticket.number.toString().padStart(2, '0')}
                </span>
                <span className={styles.historyDesk}>Guichê {ticket.desk}</span>
              </div>
            ))
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center' }}>Sem histórico</p>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <div style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600 }}>
          {settings?.welcome_text || 'ATENÇÃO AO NÚMERO CHAMADO NO PAINEL'}
        </div>
        {settings?.banner_url && (
          <div style={{ marginTop: '20px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={settings.banner_url} alt="Banner" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}
      </footer>
    </div>
  );
}
