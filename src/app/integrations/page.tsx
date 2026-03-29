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
  Lock,
  ChevronRight,
  Loader2
} from 'lucide-react';
import styles from './integrations.module.css';
import { supabase } from '@/lib/supabase';
import { WhatsAppService } from '@/lib/whatsapp';

const INTEGRATIONS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Integração oficial via Meta para envio de mensagens escaláveis e automação profissional.',
    icon: MessageCircle,
    category: 'Comunicação',
    status: 'pending', // Mudando para pendente para incentivar a configuração
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
    name: 'Meta (IG Direct & Messenger)',
    description: 'Centralize mensagens do Direct e Messenger. Sincronize leads do Facebook Ads automaticamente.',
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
  const [filter, setFilter] = useState('Todos'); // Changed to localized "Todos"
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // WhatsApp Config State
  const [waConfig, setWaConfig] = useState({
    token: '',
    phoneId: '',
    wabaId: ''
  });
  
  // Meta Config State
  const [metaConfig, setMetaConfig] = useState({
    pageToken: '',
    pageId: '',
    instagramId: ''
  });

  const [isTesting, setIsTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleTestConnection = async () => {
    if (!waConfig.token || !waConfig.phoneId) {
       alert("Preencha o Token e o Phone ID primeiro!");
       return;
    }
    
    setIsTesting(true);
    const success = await WhatsAppService.validateConnection({
      token: waConfig.token,
      phoneId: waConfig.phoneId
    });
    
    setIsTesting(false);
    if (success) {
      alert("✅ Conexão validada com sucesso via Meta Graph API!");
    } else {
      alert("❌ Falha na conexão. Verifique o Token e o ID do Telefone.");
    }
  };

  const handleSaveConfig = async (type: 'whatsapp' | 'meta' = 'whatsapp') => {
     setSaveStatus('saving');
     // Logic for saving to Supabase (Mocked metadata for now)
     console.log(`Saving ${type} config:`, type === 'whatsapp' ? waConfig : metaConfig);
     
     // Simulation of Supabase save
     setTimeout(() => {
        setSaveStatus('success');
        setTimeout(() => {
          setActiveModal(null);
          setSaveStatus('idle');
          
          // Update local status mock
          const target = INTEGRATIONS.find(i => i.id === (type === 'whatsapp' ? 'whatsapp' : 'meta-ads'));
          if (target) target.status = 'connected';
        }, 1500);
     }, 1000);
  };

  const filteredIntegrations = INTEGRATIONS.filter(item => {
    const matchesFilter = filter === 'Todos' || item.category === filter;
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
              <div>
                <span style={{ fontSize: '1.1rem', display: 'block' }}>Configuração Official WhatsApp API</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 400 }}>Plataforma Meta for Developers</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.alertBox}>
              <p>Utilize o <strong>Token de Acesso Permanente (System User)</strong> para garantir que a conexão não expire.</p>
              <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" style={{ color: '#25D366', fontSize: '0.8rem', textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}>Acessar Portal do Desenvolvedor →</a>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Token de Acesso (API Key)</label>
                <div className={styles.inputWrapper}>
                   <input 
                      type="password" 
                      placeholder="EAAG..." 
                      className={styles.premiumInput} 
                      value={waConfig.token}
                      onChange={(e) => setWaConfig({...waConfig, token: e.target.value})}
                   />
                   <Lock size={14} className={styles.inputIcon} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>ID do Número de Telefone</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 109283..." 
                    className={styles.premiumInput} 
                    value={waConfig.phoneId}
                    onChange={(e) => setWaConfig({...waConfig, phoneId: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ID da Conta Business (WABA)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 987654..." 
                    className={styles.premiumInput} 
                    value={waConfig.wabaId}
                    onChange={(e) => setWaConfig({...waConfig, wabaId: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Webhook Verify Token (Opcional)</label>
                <div className={styles.inputWrapper}>
                  <input type="text" defaultValue="vortice_verify_token_2024" readOnly className={styles.premiumInput} style={{ background: 'rgba(255,255,255,0.03)', cursor: 'not-allowed' }} />
                  <CheckCircle2 size={14} className={styles.inputIcon} color="#25D366" />
                </div>
                <small style={{ opacity: 0.5, marginTop: '4px', display: 'block' }}>URL Webhook: https://api.vorticecrm.com/webhooks/whatsapp</small>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
               <h5 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Recursos Ativados:</h5>
               <ul style={{ fontSize: '0.85rem', opacity: 0.7, paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li>Envio de Templates Oficiais (Utility, Marketing)</li>
                  <li>Recebimento de Mensagens e Mídia em Tempo Real</li>
                  <li>Métricas de Entrega e Leitura (Read Receipts)</li>
                  <li>Suporte a Botões Interativos e Listas</li>
               </ul>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={() => setActiveModal(null)}>Cancelar</button>
            <div style={{ display: 'flex', gap: '10px' }}>
               <button 
                  className={styles.btnTest} 
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '10px 15px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
               >
                 {isTesting && <Loader2 size={14} className={styles.loader} />}
                 {isTesting ? 'Validando...' : 'Testar Conexão'}
               </button>
               <button 
                  className={styles.btnSave} 
                  onClick={() => handleSaveConfig('whatsapp')}
                  disabled={saveStatus !== 'idle'}
                  style={{ background: '#25D366', color: 'black' }}
               >
                 {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'success' ? 'Salvo!' : 'Salvar e Ativar API'}
               </button>
            </div>
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
              <div>
                <span style={{ fontSize: '1.1rem', display: 'block' }}>Configuração Meta Messaging</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>Messenger & Instagram Direct API</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
          <div className={styles.modalBody}>
             <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, padding: '1rem', background: 'rgba(24, 119, 242, 0.05)', borderRadius: '12px', border: '1px solid rgba(24, 119, 242, 0.2)', textAlign: 'center' }}>
                    <MessageCircle size={20} color="#1877F2" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Messenger</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Ativo via Page API</div>
                </div>
                <div style={{ flex: 1, padding: '1rem', background: 'rgba(225, 48, 108, 0.05)', borderRadius: '12px', border: '1px solid rgba(225, 48, 108, 0.2)', textAlign: 'center' }}>
                    <Camera size={20} color="#E1306C" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Instagram</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Ativo via Graph API</div>
                </div>
             </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Page Access Token (Token da Página)</label>
                <div className={styles.inputWrapper}>
                   <input 
                      type="password" 
                      placeholder="EAAO..." 
                      className={styles.premiumInput} 
                      value={metaConfig.pageToken}
                      onChange={(e) => setMetaConfig({...metaConfig, pageToken: e.target.value})}
                   />
                   <Lock size={14} className={styles.inputIcon} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>ID da Página Facebook</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 1045..." 
                    className={styles.premiumInput} 
                    value={metaConfig.pageId}
                    onChange={(e) => setMetaConfig({...metaConfig, pageId: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ID Instagram Business</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 1784..." 
                    className={styles.premiumInput} 
                    value={metaConfig.instagramId}
                    onChange={(e) => setMetaConfig({...metaConfig, instagramId: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                 <p style={{ fontSize: '0.8rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={14} /> Webhook Meta: <code>https://api.vorticecrm.com/webhooks/meta</code>
                 </p>
              </div>

               <button 
                  style={{ width: '100%', padding: '12px', background: '#1877F2', color: 'white', borderRadius: '12px', border: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', marginTop: '0.5rem' }}
                >
                  <Lock size={16} /> Autenticar via OAuth2 (Rápido)
                </button>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.btnCancel} onClick={() => setActiveModal(null)}>Cancelar</button>
            <button 
                className={styles.btnSave} 
                onClick={() => handleSaveConfig('meta')}
                style={{ background: '#1877F2', color: 'white' }}
                disabled={saveStatus !== 'idle'}
            >
               {saveStatus === 'saving' ? 'Conectando...' : saveStatus === 'success' ? 'Salvo!' : 'Ativar Integração Meta'}
            </button>
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
