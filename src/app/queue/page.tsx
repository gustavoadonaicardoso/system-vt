'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './queue.module.css';

interface Ticket {
  id: string;
  number: number;
  name?: string;
  desk: string;
  status: 'waiting' | 'calling' | 'completed';
  created_at: string;
}

export default function QueuePage() {
  const [desk, setDesk] = useState('01');
  const [totalDesks, setTotalDesks] = useState(5);
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [lastTicketIssued, setLastTicketIssued] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('queue_settings').select('*').eq('id', 'default').single();
    if (data) setTotalDesks(data.total_desks);
  };

  useEffect(() => {
    fetchQueue();
    fetchSettings();
    const channel = supabase
      ?.channel('queue_staff')
      .on(
        'postgres_changes',
        { event: '*', table: 'queue_tickets', schema: 'public' },
        () => fetchQueue()
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel!);
    };
  }, []);

  const fetchQueue = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('queue_tickets')
      .select('*')
      .order('created_at', { ascending: true });

    if (data) {
      setWaitingTickets(data.filter((t: Ticket) => t.status === 'waiting'));
      
      // Find the one currently being "called" by this desk
      const calling = data.find((t: Ticket) => t.status === 'calling' && t.desk === desk);
      setCurrentTicket(calling || null);

      // Find highest ticket number issued
      const maxNum = data.length > 0 ? Math.max(...data.map((t: Ticket) => t.number)) : 0;
      setLastTicketIssued(maxNum);
    }
    setIsLoading(false);
  };

  const generateTicket = async () => {
    const nextNumber = lastTicketIssued + 1;
    const { error } = await supabase?.from('queue_tickets').insert([
      { number: nextNumber, status: 'waiting' },
    ]) || { error: 'Supabase client missing' };

    if (error) alert('Erro ao gerar senha');
    fetchQueue();
  };

  const callNext = async () => {
    if (waitingTickets.length === 0) {
      alert('Não há senhas aguardando');
      return;
    }

    const nextOne = waitingTickets[0];
    
    // Mark previous current ticket (if any) as completed
    if (currentTicket) {
      await supabase?.from('queue_tickets')
        .update({ status: 'completed' })
        .eq('id', currentTicket.id);
    }

    // Call the next one
    const { error } = await supabase?.from('queue_tickets')
      .update({ status: 'calling', desk: desk })
      .eq('id', nextOne.id) || { error: 'Supabase client missing' };

    if (error) alert('Erro ao chamar próxima');
    fetchQueue();
  };

  const recallCurrent = async () => {
    if (!currentTicket) return;
    
    // Re-trigger calling animation on screen by updating updated_at
    const { error } = await supabase?.from('queue_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', currentTicket.id) || { error: 'Supabase client missing' };

    if (error) alert('Erro ao chamar novamente');
  };

  const completeTicket = async () => {
    if (!currentTicket) return;

    const { error } = await supabase?.from('queue_tickets')
      .update({ status: 'completed' })
      .eq('id', currentTicket.id) || { error: 'Supabase client missing' };

    if (error) alert('Erro ao finalizar');
    fetchQueue();
  };

  const resetQueue = async () => {
    if (!confirm('Tem certeza que deseja zerar a fila e começar do 01?')) return;

    const { error } = await supabase?.from('queue_tickets').delete().filter('status', 'in', '("waiting", "calling", "completed")') || { error: 'Supabase client missing' };
    
    if (error) {
      console.error(error);
      alert('Erro ao zerar fila');
    }
    fetchQueue();
  };

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>Painel de Controle</h1>
        <p style={{ color: '#64748b' }}>Gerencie as senhas e atendimentos presenciais</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <span className={styles.label}>Configuração de Atendimento</span>
          <div className={styles.configRow}>
            <div>
              <span className={styles.label} style={{ fontSize: '0.7rem' }}>GUICHÊ</span>
              <select 
                className={styles.input} 
                value={desk} 
                onChange={(e) => setDesk(e.target.value)}
                style={{ width: '120px' }}
              >
                {Array.from({ length: totalDesks }, (_, i) => (
                  <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                    Guichê {(i + 1).toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <button className={styles.secondaryButton} onClick={generateTicket}>
              Gerar Ticket #{(lastTicketIssued + 1).toString().padStart(2, '0')}
            </button>
          </div>
          
          <div className={styles.mainAction}>
            <button className={styles.primaryButton} onClick={callNext}>
              CHAMAR PRÓXIMA
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={styles.secondaryButton} 
                style={{ flex: 1 }} 
                onClick={recallCurrent}
                disabled={!currentTicket}
              >
                Chamar Denovo
              </button>
              <button 
                className={styles.secondaryButton} 
                style={{ flex: 1 }} 
                onClick={completeTicket}
                disabled={!currentTicket}
              >
                Finalizar
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <button className={styles.dangerButton} onClick={resetQueue}>
              Zerar Fila Atual
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <span className={styles.label}>Fila de Espera ({waitingTickets.length})</span>
          <div className={styles.queueList}>
            {waitingTickets.length > 0 ? (
              waitingTickets.map((t) => (
                <div key={t.id} className={styles.queueItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span className={styles.numberTag}>#{t.number.toString().padStart(2, '0')}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '1rem' }}>{t.name || 'Sem nome'}</span>
                      <div className={styles.statusIndicator}>
                        <div className={styles.dot}></div>
                        <span>Aguardando...</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                Ninguém na fila
              </div>
            )}

            {currentTicket && (
              <div 
                className={styles.queueItem} 
                style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span className={styles.numberTag} style={{ background: '#3b82f6', color: 'white' }}>
                    #{currentTicket.number.toString().padStart(2, '0')}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: '#3b82f6' }}>{currentTicket.name}</span>
                    <div className={styles.statusIndicator}>
                      <div className={styles.dotActive}></div>
                      <span style={{ color: '#3b82f6', fontWeight: '600' }}>EM ATENDIMENTO (GUICHÊ {currentTicket.desk})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <a href="/display" target="_blank" className={styles.secondaryButton}>
          Ver Painel Público ↗
        </a>
        <a href="/totem" target="_blank" className={styles.secondaryButton}>
          Abrir Totem ↗
        </a>
      </div>
    </div>
  );
}
