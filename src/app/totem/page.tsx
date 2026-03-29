'use client';

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './totem.module.css';

export default function TotemPage() {
  const [name, setName] = useState('');
  const [issuedTicket, setIssuedTicket] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // 1. Get highest current number
      const { data, error: fetchError } = await (supabase?.from('queue_tickets').select('number').order('number', { ascending: false }).limit(1) || { data: null });
      
      const lastNumber = data?.[0]?.number || 0;
      const nextNumber = lastNumber + 1;

      // 2. Insert new ticket
      const { error: insertError } = await (supabase?.from('queue_tickets').insert([
        { number: nextNumber, name: name || 'Paciente/Cliente', status: 'waiting' }
      ]) || { error: 'No client' });

      if (!insertError) {
        setIssuedTicket(nextNumber);
      } else {
        alert('Erro ao gerar senha, tente novamente.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIssuedTicket(null);
    setName('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>VÓRTICE TOTEM</div>
        
        {issuedTicket === null ? (
          <>
            <h1 className={styles.title}>Retirar Senha</h1>
            <p className={styles.subtitle}>Insira seu nome para entrar na fila</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>NOME (opcional)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? 'GERANDO...' : 'RETIRAR MINHA SENHA'}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successDisplay}>
            <h1 className={styles.title}>Sua Senha</h1>
            <div className={styles.ticketResult}>
              #{issuedTicket.toString().padStart(2, '0')}
            </div>
            <p className={styles.subtitle} style={{ color: '#10b981', fontWeight: 'bold' }}>
              AGUARDE SER CHAMADO NO PAINEL
            </p>
            
            <button className={styles.resetBtn} onClick={handleReset}>
              CONCLUÍDO / VOLTAR AO INÍCIO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
