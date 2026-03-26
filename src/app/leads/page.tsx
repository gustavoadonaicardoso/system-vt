"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Search, 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Edit3, 
  Eye, 
  Trash2, 
  Ban,
  Tag as TagIcon,
  Filter,
  Globe,
  MoreVertical
} from 'lucide-react';

import styles from './leads.module.css';
import { useLeads } from '@/context/LeadContext';

const ChannelIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'whatsapp': return <MessageSquare size={14} />;
    case 'instagram': return <MessageSquare size={14} />;
    case 'facebook': return <Globe size={14} />;
    case 'site': return <Globe size={14} />;
    default: return null;
  }
};

export default function LeadsPage() {
  const { leads, openModal } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const kpis = [
    { label: 'Total de Leads', value: leads.length.toString(), icon: Users, color: '#3b82f6' },
    { label: 'Leads Ativos', value: leads.filter(l => l.status === 'Ativo').length.toString(), icon: UserCheck, color: '#10b981' },
    { label: 'Leads Bloqueados', value: leads.filter(l => l.status === 'Bloqueado').length.toString(), icon: UserMinus, color: '#ef4444' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Gestão de Leads</h1>
          <p>Visualize e gerencie todos os contatos da sua base em um só lugar.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.tagBtn}>
            <TagIcon size={18} /> Configurar Tags
          </button>
          <button className={styles.primaryBtn} onClick={openModal}>
            <Plus size={18} /> Novo Lead
          </button>
        </div>
      </header>

      <section className={styles.kpiGrid}>
        {kpis.map((kpi, i) => (
          <motion.div 
            key={kpi.label}
            className={styles.kpiCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={styles.kpiIcon} style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
              <kpi.icon size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <span className={styles.kpiValue}>{kpi.value}</span>
            </div>
          </motion.div>
        ))}
      </section>

      <div className={styles.listContainer}>
        <div className={styles.listHeader}>
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, telefone ou tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.filterBtn}>
            <Filter size={18} /> Filtrar
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome do Lead</th>
                <th>Telefone</th>
                <th>Tags</th>
                <th>Canais</th>
                <th>Entrada</th>
                <th>Última Msg</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className={styles.leadCell}>
                      <div className={styles.avatar} style={{ background: `linear-gradient(135deg, ${lead.color}, #000)` }}>
                        {lead.name[0]}
                      </div>
                      <span className={styles.leadName}>{lead.name}</span>
                    </div>
                  </td>
                  <td>{lead.phone}</td>
                  <td>
                    <div className={styles.tagList}>
                      {lead.tags.map(tag => (
                        <span key={tag} className={styles.tagBadge}>{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={styles.channelList}>
                      {lead.channels.map(ch => (
                        <div key={ch} className={styles.channelIcon}>
                          <ChannelIcon type={ch} />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{lead.entryDate}</td>
                  <td>{lead.lastMsg}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${lead.status === 'Ativo' ? styles.statusActive : styles.statusBlocked}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} title="Mensagem"><MessageSquare size={16} /></button>
                      <button className={styles.actionBtn} title="Ver Detalhes" onClick={() => setSelectedLead(lead)}><Eye size={16} /></button>
                      <button className={styles.actionBtn} title="Editar"><Edit3 size={16} /></button>
                      <button className={styles.actionBtn} title="Mais"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pop-up de Detalhes (Simplificado aqui para exemplo) */}
      {selectedLead && (
        <div className={styles.modalOverlay} onClick={() => setSelectedLead(null)}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <h2>Detalhes do Lead</h2>
              <button onClick={() => setSelectedLead(null)}>X</button>
            </header>
            <div className={styles.modalContent}>
              <div className={styles.modalProfile}>
                <div className={styles.largeAvatar} style={{ background: `linear-gradient(135deg, ${selectedLead.color}, #000)` }}>
                  {selectedLead.name[0]}
                </div>
                <h3>{selectedLead.name}</h3>
                <p>{selectedLead.phone}</p>
              </div>
              <div className={styles.modalInfoGrid}>
                <div className={styles.infoItem}>
                  <label>Status</label>
                  <span>{selectedLead.status}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Entrou em</label>
                  <span>{selectedLead.entryDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Última Interação</label>
                  <span>{selectedLead.lastMsg}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Canais Ativos</label>
                  <div className={styles.channelList}>
                    {selectedLead.channels.map((ch: string) => (
                      <span key={ch} className={styles.channelTag}>{ch}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <footer className={styles.modalFooter}>
              <button className={styles.blockBtn}><Ban size={16} /> Bloquear</button>
              <button className={styles.deleteBtn}><Trash2 size={16} /> Excluir</button>
              <button 
                className={styles.primaryBtn}
                onClick={() => window.location.href = `/messages?chatId=${selectedLead.id}`}
              >
                Abrir Conversa
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </div>
  );
}
