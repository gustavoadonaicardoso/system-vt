"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Zap, 
  Shield, 
  ChevronRight,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import styles from './help.module.css';

const CATEGORIES = [
  { title: 'Primeiros Passos', icon: Zap, desc: 'Aprenda o básico para configurar seu CRM em minutos.' },
  { title: 'Gestão de Leads', icon: Book, desc: 'Como capturar, organizar e converter leads no funil SSD.' },
  { title: 'Automações', icon: MessageCircle, desc: 'Configure fluxos de WhatsApp e e-mail automático.' },
  { title: 'Segurança & Conta', icon: Shield, desc: 'Gerencie permissões, usuários e dados da empresa.' }
];

const FAQS = [
  { q: 'Como conectar meu WhatsApp Business?', a: 'Vá em Integrações > WhatsApp e escaneie o QR Code com seu celular.' },
  { q: 'O que é o método SSD?', a: 'É nossa metodologia proprietária: Estruturar, Escalar e Dominar seu mercado.' },
  { q: 'Posso exportar meus dados?', a: 'Sim, você pode exportar para CSV ou Google Sheets a qualquer momento.' }
];

export default function HelpCenter() {
  const [search, setSearch] = useState('');

  return (
    <div className={styles.container}>
      <header className={styles.helpHeader}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.badge}>
            <LifeBuoy size={14} /> Suporte Vórtice
          </div>
          <h1>Como podemos ajudar hoje?</h1>
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Pesquisar artigos, tutoriais e soluções..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>
      </header>

      <section className={styles.categories}>
        {CATEGORIES.map((cat, i) => (
          <motion.div 
            key={cat.title}
            className={styles.catCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={styles.catIcon}>
              <cat.icon size={24} />
            </div>
            <h3>{cat.title}</h3>
            <p>{cat.desc}</p>
            <button className={styles.learnMore}>
              Ver artigos <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
      </section>

      <div className={styles.mainGrid}>
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.contactSupport}>
          <div className={styles.supportCard}>
            <h3>Ainda precisa de ajuda?</h3>
            <p>Nossa equipe de especialistas está pronta para ajudar você a escalar sua operação.</p>
            <div className={styles.contactButtons}>
              <button className={styles.primaryBtn}>
                <MessageCircle size={18} /> Abrir Ticket
              </button>
              <button className={styles.secondaryBtn}>
                Falar no WhatsApp <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
