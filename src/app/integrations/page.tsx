"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  FileSpreadsheet, 
  LayoutGrid, 
  Camera, 
  Mail, 
  Globe,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X,
  Link2,
  Lock
} from 'lucide-react';
import styles from './integrations.module.css';

const INTEGRATIONS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Envie mensagens automatizadas e sincronize o histórico de chat diretamente no funil do CRM.',
    icon: MessageCircle,
    category: 'Comunicação',
    status: 'connected', // Simulando já conectado
    color: '#25D366'
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Exporte leads e dados de desempenho automaticamente para suas planilhas compartilhadas.',
    icon: FileSpreadsheet,
    category: 'Produtividade',
    status: 'not_connected',
    color: '#0F9D58'
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads & Instagram',
    description: 'Sincronize seus formulários de leads do Facebook e direct do Instagram para acompanhamento instantâneo.',
    icon: LayoutGrid,
    category: 'Marketing',
    status: 'not_connected',
    color: '#1877F2'
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Conecte seu e-mail comercial para rastrear taxas de abertura e histórico de respostas automaticamente.',
    icon: Mail,
    category: 'Comunicação',
    status: 'not_connected',
    color: '#EA4335'
  },
  {
    id: 'webhook',
    name: 'Webhooks Customizados',
    description: 'Crie integrações personalizadas com qualquer serviço externo usando nossa robusta API.',
    icon: Globe,
    category: 'Desenvolvimento',
    status: 'not_connected',
    color: '#3b82f6'
  }
];

const CATEGORIES = ['Todos', 'Marketing', 'Comunicação', 'Produtividade', 'Desenvolvimento'];

export default function Integrations() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredIntegrations = INTEGRATIONS.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openAppModal = (id: string) => {
    setActiveModal(id);
  };

  const renderModalContent = () => {
    if (activeModal === 'whatsapp') {
      return (
        <>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>
              <div className={styles.iconBox} style={{ width: 40, height: 40, background: '#25D36622', color: '#25D366' }}>
                <MessageCircle size={20} />
              </div>
              Conexão WhatsApp (Baileys API)
            </div>
            <button className={styles.closeBtn} onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
          <div className={styles.modalBody}>
            <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.5 }}>
              Sua instância atual está ativa! Todos os leads gerados e fluxos engatilhados usarão o número <strong>+55 (11) 99999-9999</strong>.
            </p>

            <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Status da Conexão</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>Sessão Aberta</span>
                </div>
              </div>
              <button style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Desconectar</button>
            </div>
            
            <div className={styles.formGroup}>
              <label>Nome da Instância</label>
              <input type="text" defaultValue="Vendas Principal - SP" />
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={() => setActiveModal(null)}>Fechar</button>
            <button className={styles.btnSave}>Salvar Configuração</button>
          </div>
        </>
      );
    }

    if (activeModal === 'meta-ads') {
      return (
        <>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>
              <div className={styles.iconBox} style={{ width: 40, height: 40, background: '#1877F222', color: '#1877F2' }}>
                <LayoutGrid size={20} />
              </div>
              Sincronização com Meta (FB/IG)
            </div>
            <button className={styles.closeBtn} onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
          <div className={styles.modalBody}>
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: 64, height: 64, background: '#1877F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(24, 119, 242, 0.3)' }}>
                <LayoutGrid size={28} color="white" />
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Autenticação OAuth2</h4>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '2rem' }}>Ao conectar sua conta, o Vórtice CRM poderá ler seus Forms de Lead e mensagens do Direct automaticamente.</p>
              
              <button style={{ width: '100%', padding: '14px', background: '#1877F2', color: 'white', borderRadius: '12px', border: 'none', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                <Lock size={18} /> Validar com Facebook
              </button>
            </div>
          </div>
        </>
      );
    }

    if (activeModal === 'google-sheets') {
      return (
        <>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>
              <div className={styles.iconBox} style={{ width: 40, height: 40, background: '#0F9D5822', color: '#0F9D58' }}>
                <FileSpreadsheet size={20} />
              </div>
              Integração Google Sheets
            </div>
            <button className={styles.closeBtn} onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
          <div className={styles.modalBody}>
             <p style={{ opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem' }}>
              Cole o link compartilhado da sua planilha do Google Sheets. Toda vez que um Lead for inserido no pipeline, ele será escrito na primeira aba (aba base).
            </p>
            <div className={styles.formGroup}>
              <label>Link da Planilha (URL ou ID)</label>
              <input type="text" placeholder="https://docs.google.com/spreadsheets/d/1A2B3C..." />
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', marginTop: '1rem', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link2 size={24} color="#0F9D58" opacity={0.5} />
              <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                Lembre-se de dar permissão de "Editor" para <strong>vortice-api@appspot.gserviceaccount.com</strong> na sua planilha.
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={() => setActiveModal(null)}>Cancelar</button>
            <button className={styles.btnSave} style={{ background: '#0F9D58' }}>Sincronizar Planilha</button>
          </div>
        </>
      );
    }

    // Default Custom Integration 
    return (
       <>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>Conexão Genérica</div>
            <button className={styles.closeBtn} onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
          <div className={styles.modalBody}>
            <p>Integração será construída via Backend.</p>
          </div>
       </>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className={styles.title}>Centro de Integrações</h2>
            <p className={styles.subtitle}>Potencialize seu CRM Vórtice com as plataformas oficiais de vendas.</p>
          </motion.div>
          
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>1</span>
              <span className={styles.statLabel}>Conectado</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>5</span>
              <span className={styles.statLabel}>Disponíveis</span>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar integrações..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.filterList}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <motion.div 
        className={styles.grid}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredIntegrations.map((item, index) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <div 
                  className={styles.iconBox}
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  <item.icon size={24} />
                </div>
                <div className={styles.statusBadge}>
                   {item.status === 'connected' && (
                    <span className={styles.activeLabel}>
                      <CheckCircle2 size={12} /> Conectado
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span className={styles.pendingLabel}>
                      <Clock size={12} /> Pendente
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.name}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
                <div className={styles.categoryTag}>{item.category}</div>
              </div>

              <div className={styles.cardFooter}>
                <button 
                  className={`${item.status === 'connected' ? styles.configureBtn : styles.connectBtn}`}
                  onClick={() => openAppModal(item.id)}
                >
                  {item.status === 'connected' ? 'Configurar Instância' : 'Conectar Agora'}
                  {item.status !== 'connected' && <ArrowUpRight size={16} />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className={styles.customRequest}>
        <div className={styles.requestContent}>
          <h3>Precisa de uma integração personalizada via API?</h3>
          <p>Fale com nossa equipe técnica engenharia para desenhar endpoints dedicados.</p>
        </div>
        <button className={styles.requestBtn}>
          Falar com Suporte Técnico
        </button>
      </div>

      {activeModal && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}
