"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Upload, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Layout,
  ShieldAlert,
  Activity,
  Settings,
  ChevronRight
} from 'lucide-react';
import styles from './master.module.css';

const DEFAULT_SETTINGS = {
  siteName: 'Vórtice CRM',
  primaryColor: '#3b82f6',
  accentColor: '#8b5cf6',
  bgColor: '#0a0a0f',
  logoText: 'Vórtice CRM',
  logoUrl: '',
  faviconUrl: '',
};

export default function MasterPanel() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'modules'>('modules');
  const router = useRouter();
  
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const masterModules = [
    {
      id: 'banners',
      title: 'Gestão de Banners',
      desc: 'Altere os destaques e avisos exibidos na página inicial para todos os usuários.',
      icon: Layout,
      color: '#3b82f6',
      path: '/admin/banners'
    },
    {
      id: 'permissions',
      title: 'Níveis de Permissão',
      desc: 'Configure papéis de acesso e permissões granulares de toda a estação.',
      icon: ShieldAlert,
      color: '#ef4444',
      path: '/users'
    },
    {
      id: 'logs',
      title: 'Audit Logs',
      desc: 'Veja o histórico completo de ações de todos os atendentes e robôs.',
      icon: Activity,
      color: '#10b981',
      path: '#'
    },
    {
      id: 'automations',
      title: 'Configurações Master',
      desc: 'Ajuste tempos globais de expiração e limites de API.',
      icon: Settings,
      color: '#f59e0b',
      path: '/automations'
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('vortice-master-settings');
    if (stored) setSettings(JSON.parse(stored));
    
    // Initial CSS apply
    if (stored) {
      const s = JSON.parse(stored);
      document.documentElement.style.setProperty('--brand-primary', s.primaryColor);
      document.documentElement.style.setProperty('--brand-accent', s.accentColor);
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (key: 'logoUrl' | 'faviconUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSettings(prev => ({ ...prev, [key]: url }));
  };

  const handleSave = () => {
    localStorage.setItem('vortice-master-settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--brand-primary', settings.primaryColor);
    document.documentElement.style.setProperty('--brand-accent', settings.accentColor);
    document.title = settings.siteName;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('vortice-master-settings');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1>Painel Master</h1>
            <p>Controle total sobre a infraestrutura e identidade do sistema.</p>
          </div>
        </div>
        
        <div className={styles.tabNav}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'modules' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            Módulo de Comando
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'branding' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            Identidade Visual
          </button>
        </div>

        <div className={styles.headerActions}>
           {activeTab === 'branding' && (
             <>
               <button className={styles.resetBtn} onClick={handleReset}>
                <RotateCcw size={16} /> Padrões
               </button>
               <button className={`${styles.saveBtn} ${saved ? styles.saveBtnSuccess : ''}`} onClick={handleSave}>
                {saved ? <><CheckCircle2 size={16} /> Salvo!</> : <><Save size={16} /> Salvar</>}
               </button>
             </>
           )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'modules' ? (
          <motion.div 
            key="modules"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={styles.modulesGrid}
          >
            {masterModules.map((mod, idx) => (
              <div 
                key={mod.id} 
                className={styles.moduleCard}
                onClick={() => router.push(mod.path)}
              >
                <div className={styles.cardHeaderSmall}>
                  <div className={styles.iconBox} style={{ color: mod.color, background: `${mod.color}15` }}>
                    <mod.icon size={22} />
                  </div>
                  <ChevronRight size={18} className={styles.arrowIcon} />
                </div>
                <div className={styles.cardBodySmall}>
                  <h3>{mod.title}</h3>
                  <p>{mod.desc}</p>
                </div>
              </div>
            ))}

            <div className={styles.systemStatus}>
              <div className={styles.statusHeader}>
                 <h3>Estação Vórtice Alpha • Status Operacional</h3>
                 <span className={styles.liveIndicator}><div className={styles.pulse}></div> Online</span>
              </div>
              <div className={styles.statsRow}>
                 <div className={styles.statItem}>
                   <label>Consumo Provedor</label>
                   <div className={styles.statValue}>12.4% <small>OK</small></div>
                 </div>
                 <div className={styles.statItem}>
                   <label>Latência média</label>
                   <div className={styles.statValue}>32ms <small>ÓTIMO</small></div>
                 </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="branding"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={styles.grid}
          >
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Type size={20} />
                <h2>Identidade do Sistema</h2>
              </div>
              <div className={styles.field}>
                <label>Nome do Sistema</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={e => handleChange('siteName', e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Texto do Logo (Fallback)</label>
                <input
                  type="text"
                  value={settings.logoText}
                  onChange={e => handleChange('logoText', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <ImageIcon size={20} />
                <h2>Logo & Favicon</h2>
              </div>
              <div className={styles.uploadArea}>
                <div className={styles.uploadBox} onClick={() => logoRef.current?.click()}>
                  {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className={styles.previewImg} /> : <Upload size={24} />}
                </div>
                <input ref={logoRef} type="file" hidden onChange={e => handleFileUpload('logoUrl', e)} />
                <div className={styles.uploadBoxSmall} onClick={() => faviconRef.current?.click()}>
                   {settings.faviconUrl ? <img src={settings.faviconUrl} alt="Favicon" style={{width:24}} /> : <ImageIcon size={20} />}
                </div>
                <input ref={faviconRef} type="file" hidden onChange={e => handleFileUpload('faviconUrl', e)} />
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Palette size={20} />
                <h2>Paleta de Cores</h2>
              </div>
              <div className={styles.colorGrid}>
                {['primaryColor', 'accentColor', 'bgColor'].map(key => (
                  <div key={key} className={styles.colorItem}>
                    <div className={styles.colorPreview} style={{ background: settings[key as keyof typeof settings] }}>
                      <input type="color" value={settings[key as keyof typeof settings]} onChange={e => handleChange(key, e.target.value)} className={styles.colorInput} />
                    </div>
                    <span>{key === 'primaryColor' ? 'Primária' : key === 'accentColor' ? 'Destaque' : 'Fundo'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Eye size={20} />
                <h2>Pré-visualização</h2>
              </div>
              <div className={styles.preview} style={{ background: settings.bgColor }}>
                 <div style={{ padding: '20px', color: settings.primaryColor }}>{settings.siteName}</div>
                 <div style={{ marginLeft: '20px', padding: '10px 20px', borderRadius: '8px', background: settings.primaryColor, color: '#fff', width: 'fit-content' }}>Botão de Exemplo</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
