"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Upload, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2
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
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('vortice-master-settings');
    if (stored) setSettings(JSON.parse(stored));
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
    // Apply CSS variables live
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
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1>Painel Master</h1>
            <p>Configure o white-label do sistema. Apenas admins têm acesso a esta área.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.resetBtn} onClick={handleReset}>
            <RotateCcw size={16} /> Restaurar Padrão
          </button>
          <button className={`${styles.saveBtn} ${saved ? styles.saveBtnSuccess : ''}`} onClick={handleSave}>
            {saved ? <><CheckCircle2 size={16} /> Salvo!</> : <><Save size={16} /> Salvar Alterações</>}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className={styles.grid}>

        {/* Identity Card */}
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
              placeholder="Ex: Minha Empresa CRM"
              className={styles.input}
            />
            <span className={styles.hint}>Aparece na aba do navegador e no cabeçalho.</span>
          </div>

          <div className={styles.field}>
            <label>Texto do Logo (Fallback)</label>
            <input
              type="text"
              value={settings.logoText}
              onChange={e => handleChange('logoText', e.target.value)}
              placeholder="Ex: Minha Empresa"
              className={styles.input}
            />
            <span className={styles.hint}>Exibido quando não há imagem de logo.</span>
          </div>
        </div>

        {/* Logo Upload */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <ImageIcon size={20} />
            <h2>Logo & Favicon</h2>
          </div>

          <div className={styles.uploadArea}>
            <div className={styles.uploadBox} onClick={() => logoRef.current?.click()}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className={styles.previewImg} />
              ) : (
                <>
                  <Upload size={28} className={styles.uploadIcon} />
                  <p>Clique para fazer upload do Logo</p>
                  <span>PNG, SVG, JPG — Recomendado: 200x60px</span>
                </>
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" hidden onChange={e => handleFileUpload('logoUrl', e)} />

            <div className={`${styles.uploadBox} ${styles.uploadBoxSmall}`} onClick={() => faviconRef.current?.click()}>
              {settings.faviconUrl ? (
                <img src={settings.faviconUrl} alt="Favicon" style={{ width: 32, height: 32 }} />
              ) : (
                <>
                  <Upload size={20} className={styles.uploadIcon} />
                  <p>Favicon</p>
                  <span>32x32px</span>
                </>
              )}
            </div>
            <input ref={faviconRef} type="file" accept="image/*" hidden onChange={e => handleFileUpload('faviconUrl', e)} />
          </div>
        </div>

        {/* Colors */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Palette size={20} />
            <h2>Paleta de Cores</h2>
          </div>

          <div className={styles.colorGrid}>
            {[
              { key: 'primaryColor', label: 'Cor Primária', hint: 'Botões, links e destaques' },
              { key: 'accentColor', label: 'Cor de Destaque', hint: 'Gradientes e badges' },
              { key: 'bgColor', label: 'Cor de Fundo', hint: 'Background geral do sistema' },
            ].map(({ key, label, hint }) => (
              <div key={key} className={styles.colorItem}>
                <div className={styles.colorPreview} style={{ background: settings[key as keyof typeof settings] }}>
                  <input
                    type="color"
                    value={settings[key as keyof typeof settings]}
                    onChange={e => handleChange(key, e.target.value)}
                    className={styles.colorInput}
                  />
                </div>
                <div>
                  <p className={styles.colorLabel}>{label}</p>
                  <p className={styles.colorHint}>{hint}</p>
                  <p className={styles.colorValue}>{settings[key as keyof typeof settings]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Eye size={20} />
            <h2>Pré-visualização</h2>
          </div>
          <div className={styles.preview} style={{ background: settings.bgColor }}>
            <div className={styles.previewSidebar} style={{ background: `${settings.bgColor}dd`, borderRight: `1px solid ${settings.primaryColor}22` }}>
              <div className={styles.previewLogo} style={{ color: settings.primaryColor }}>
                {settings.logoUrl ? <img src={settings.logoUrl} alt="logo" style={{ height: 24 }} /> : settings.logoText}
              </div>
              {['Início', 'Pipeline', 'Leads', 'Automações'].map(item => (
                <div key={item} className={styles.previewNavItem}>{item}</div>
              ))}
            </div>
            <div className={styles.previewContent}>
              <div className={styles.previewBar} style={{ background: `${settings.bgColor}cc` }}>
                <div className={styles.previewDot} style={{ background: settings.primaryColor }} />
                <div className={styles.previewDot} style={{ background: settings.accentColor }} />
              </div>
              <div className={styles.previewBtn} style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.accentColor})` }}>
                {settings.siteName}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
