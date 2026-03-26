"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MessageCircle, 
  UserPlus, 
  Clock, 
  Target,
  Play,
  Webhook,
  Bot,
  Database,
  Smartphone,
  Workflow
} from 'lucide-react';
import styles from './automations.module.css';

export default function Automations() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header className={styles.automationHeader}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Automações de Fluxo</h2>
          <p style={{ color: 'var(--foreground)', opacity: 0.5 }}>Construa fluxos visuais estilo n8n, integre com Typebot e multiplique resultados.</p>
        </div>
        <button className={styles.newFlowBtn} style={{ background: '#ff6d5a', color: 'white', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Play size={18} fill="currentColor" /> Executar Workflow
        </button>
      </header>

      <div className={styles.workArea}>
        {/* Componente: Biblioteca de Nós */}
        <div className={styles.nodeLibrary}>
          <div className={styles.libraryTitle}>Gatilhos Iniciais</div>
          <div className={styles.libraryItem}>
            <Webhook size={18} color="#ff6d5a" /> 
            <span>Webhook (n8n API)</span>
          </div>
          <div className={styles.libraryItem}>
            <UserPlus size={18} color="#3b82f6" /> 
            <span>Lead Entrou no Funil</span>
          </div>

          <div className={styles.libraryTitle} style={{ marginTop: '1rem' }}>Integrações Externas</div>
          <div className={styles.libraryItem}>
            <Bot size={18} color="var(--foreground)" /> 
            <span>Flow Typebot</span>
          </div>
          <div className={styles.libraryItem}>
            <MessageCircle size={18} color="#25D366" /> 
            <span>WhatsApp (Baileys)</span>
          </div>
          <div className={styles.libraryItem}>
            <Database size={18} color="#0096FF" /> 
            <span>Kommo CRM / Vórtice</span>
          </div>
          <div className={styles.libraryItem}>
            <Workflow size={18} color="#ff6d5a" /> 
            <span>Executar n8n Workflow</span>
          </div>

          <div className={styles.libraryTitle} style={{ marginTop: '1rem' }}>Lógica & Tempo</div>
          <div className={styles.libraryItem}>
            <Clock size={18} color="#f59e0b" /> 
            <span>Delay (Aguardar)</span>
          </div>
          <div className={styles.libraryItem}>
            <Target size={18} color="#8b5cf6" /> 
            <span>Condição If/Else</span>
          </div>
        </div>

        {/* Componente: Canvas Principal */}
        <div className={styles.flowCanvas}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--panel-bg)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid var(--border)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <div className={styles.statusPulse}></div> Ativo: Jornada de Qualificação
          </div>

          {/* Wrapper flex para os nós horizontais */}
          <div style={{ display: 'flex', gap: '6rem', alignItems: 'center', minWidth: 'max-content', padding: '2rem' }}>
            
            {/* Nó 1: Webhook */}
            <motion.div 
              className={styles.n8nNode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={styles.nodeHeader}>
                <div className={styles.nodeIcon} style={{ background: '#ff6d5a' }}>
                  <Webhook size={18} />
                </div>
                <div>
                  <div className={styles.nodeTitle}>Webhook n8n</div>
                  <div className={styles.nodeType}>Gatilho de Entrada</div>
                </div>
              </div>
              <div className={styles.nodeContent}>
                <div className={styles.nodeDesc}>Recebe payload com os dados do lead oriundos de uma landing page.</div>
              </div>
              
              <div className={styles.horizontalPipe}></div>
              <div className={`${styles.handle} ${styles.handleRight}`}></div>
            </motion.div>

            {/* Nó 2: Typebot */}
            <motion.div 
              className={styles.n8nNode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.nodeHeader}>
                <div className={styles.nodeIcon} style={{ background: '#000', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Bot size={18} color="#fff" />
                </div>
                <div>
                  <div className={styles.nodeTitle}>Iniciar Typebot</div>
                  <div className={styles.nodeType}>Integração Externa</div>
                </div>
              </div>
              <div className={styles.nodeContent}>
                <div className={styles.nodeDesc}>Lança o bot "Qualificador_01" para interagir com o lead via chat autônomo.</div>
              </div>
              
              <div className={`${styles.handle} ${styles.handleLeft}`}></div>
              <div className={styles.horizontalPipe}></div>
              <div className={`${styles.handle} ${styles.handleRight}`}></div>
            </motion.div>

            {/* Nó 3: WhatsApp */}
            <motion.div 
              className={styles.n8nNode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.nodeHeader}>
                <div className={styles.nodeIcon} style={{ background: '#25D366' }}>
                  <MessageCircle size={18} />
                </div>
                <div>
                  <div className={styles.nodeTitle}>WhatsApp Instância</div>
                  <div className={styles.nodeType}>Ação de Mensagem</div>
                </div>
              </div>
              <div className={styles.nodeContent}>
                <div className={styles.nodeDesc}>Se a lead pontuar na qualificação, notifica o vendedor pelo celular.</div>
              </div>

              <div className={`${styles.handle} ${styles.handleLeft}`}></div>
              <div className={styles.horizontalPipe}></div>
              <div className={`${styles.handle} ${styles.handleRight}`}></div>
            </motion.div>

            {/* Nó 4: CRM */}
            <motion.div 
              className={styles.n8nNode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className={styles.nodeHeader}>
                <div className={styles.nodeIcon} style={{ background: '#0096FF' }}>
                  <Database size={18} />
                </div>
                <div>
                  <div className={styles.nodeTitle}>Pipeline CRM</div>
                  <div className={styles.nodeType}>Gestão Interna</div>
                </div>
              </div>
              <div className={styles.nodeContent}>
                <div className={styles.nodeDesc}>Insere ou avança automaticamente o card do lead para a coluna "Quente".</div>
              </div>

              <div className={`${styles.handle} ${styles.handleLeft}`}></div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
