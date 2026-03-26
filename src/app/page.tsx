"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  MessageCircle,
  AlertCircle,
  Calendar,
  Activity,
  UserCheck
} from 'lucide-react';

import styles from './page.module.css';

const kpis = [
  { label: 'Receita Total', value: 'R$ 124.500', trend: '+12.5%', icon: DollarSign, color: '#3b82f6' },
  { label: 'Leads Ativos', value: '1.280', trend: '+8.2%', icon: Users, color: '#8b5cf6' },
  { label: 'Tempo Médio Espera', value: '4m 12s', trend: '-30s', icon: Clock, color: '#f59e0b' },
  { label: 'Tempo Médio Atendimento', value: '18m 45s', trend: '+1m', icon: Activity, color: '#10b981' },
];


const activities = [
  { user: 'João Silva', action: 'moveu o lead "Auto Peças LTDA" para', stage: 'Negociação', time: '2 min atrás', icon: TrendingUp },
  { user: 'Bia Santos', action: 'enviou uma mensagem de WhatsApp para', target: 'Mário Lima', time: '15 min atrás', icon: MessageCircle },
  { user: 'Sistema', action: 'atribuiu 5 novos leads do Site', time: '1 hora atrás', icon: Users },
  { user: 'Pedro Costa', action: 'fechou negócio com "Tech Solutions"', time: '3 horas atrás', icon: DollarSign },
];

const userData = [
  { name: 'João Silva', status: 'online', activeChats: 5, tma: '12m 30s', sales: 12, uptime: '4h 15m' },
  { name: 'Bia Santos', status: 'online', activeChats: 3, tma: '15m 10s', sales: 8, uptime: '6h 40m' },
  { name: 'Pedro Costa', status: 'offline', activeChats: 0, tma: '10m 45s', sales: 15, uptime: '0h 00m' },
  { name: 'Ana Oliveira', status: 'online', activeChats: 7, tma: '14m 20s', sales: 10, uptime: '2h 10m' },
  { name: 'Carlos Lima', status: 'offline', activeChats: 0, tma: '18m 00s', sales: 5, uptime: '0h 00m' },
];


const eventsBanners = [
  {
    title: "Vórtice Summit 2026",
    description: "O maior evento sobre o Futuro do CRM e Gestão Comercial do Brasil.",
    date: "15 de Agosto",
    type: "Presencial • SP",
    color: "linear-gradient(135deg, #1d4ed8, #8b5cf6)",
    icon: Users
  },
  {
    title: "Masterclass: Alta Conversão",
    description: "Aprenda a estruturar um processo de vendas irresistível.",
    date: "Amanhã, 19:00",
    type: "Online • Gratuito",
    color: "linear-gradient(135deg, #10b981, #059669)",
    icon: Calendar
  },
  {
    title: "Imersão SSD",
    description: "Structure, Scale & Dominate: Escala baseada em dados precisos.",
    date: "Vagas Limitadas",
    type: "Mentoria Vip",
    color: "linear-gradient(135deg, #f59e0b, #d97706)",
    icon: TrendingUp
  }
];

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.welcomeSection}>
        <div className={styles.headerContent}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Bem-vindo de volta, Admin 👋</h2>
            <p>Aqui está o que está acontecendo no seu funil de vendas hoje.</p>
          </motion.div>
          
          <div className={styles.filterGroup}>
            <div className={styles.datePicker}>
              <Calendar size={18} />
              <select className={styles.dateSelect}>
                <option value="today">Hoje</option>
                <option value="yesterday">Ontem</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            <button className={styles.filterBtn}>
              Filtrar
            </button>
          </div>
        </div>
      </header>

      {/* Banners de Eventos da Vórtice */}
      <section className={styles.bannersSection}>
        <div className={styles.bannersScroll}>
          {eventsBanners.map((banner, idx) => (
            <motion.div 
              key={idx} 
              className={styles.bannerCard}
              style={{ background: banner.color }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <div className={styles.bannerContent}>
                <span className={styles.bannerType}>{banner.type}</span>
                <h3 className={styles.bannerTitle}>{banner.title}</h3>
                <p className={styles.bannerDesc}>{banner.description}</p>
                <div className={styles.bannerFooter}>
                  <Calendar size={14} />
                  <span>{banner.date}</span>
                </div>
              </div>
              <div className={styles.bannerIconOverlay}>
                <banner.icon size={110} strokeWidth={1.5} />
              </div>
              <button className={styles.bannerAction}>Saber mais</button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.kpiGrid}>
        {kpis.map((kpi, index) => (
          <motion.div 
            key={kpi.label}
            className={styles.kpiCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.kpiCardHeader}>
              <div className={styles.iconWrapper} style={{ color: kpi.color, background: `${kpi.color}15` }}>
                <kpi.icon size={20} />
              </div>
              <span className={`${styles.trend} ${styles.trendUp}`}>{kpi.trend}</span>
            </div>
            <div className={styles.kpiValue}>{kpi.value}</div>
            <div className={styles.kpiLabel}>{kpi.label}</div>
          </motion.div>
        ))}

        <motion.div 
          className={`${styles.kpiCard} ${styles.usersOnlineCard}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.kpiCardHeader}>
            <div className={styles.iconWrapper} style={{ color: '#10b981', background: '#10b98115' }}>
              <UserCheck size={20} />
            </div>
            <span className={styles.onlineBadge}>Live</span>
          </div>
          <div className={styles.kpiValue}>8 / 12</div>
          <div className={styles.kpiLabel}>Usuários Online</div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarFiller} style={{ width: '66.6%' }}></div>
          </div>
          <div className={styles.progressInfo}>
            <span>66% da equipe ativa</span>
          </div>
        </motion.div>
      </section>


      <div className={styles.mainGrid}>
        <section className={styles.chartContainer}>
          <h3 className={styles.sectionTitle}>Crescimento do Funil</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)', opacity: 0.2 }}>

            {/* Visual placeholder for a real chart */}
            <div style={{ textAlign: 'center' }}>
              <TrendingUp size={48} style={{ marginBottom: '1rem' }} />
              <p>Carregando Mapa de Calor de Interações...</p>
            </div>
          </div>
        </section>

        <section className={styles.chartContainer}>
          <h3 className={styles.sectionTitle}>Atividade Recente</h3>
          <div className={styles.activityList}>
            {activities.map((act, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <act.icon size={16} />
                </div>
                <div>
                  <p>
                    <strong>{act.user}</strong> {act.action} {act.stage || act.target || ''}
                  </p>
                  <span className={styles.activityTime}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.performanceSection}>
        <h3 className={styles.sectionTitle}>Performance da Equipe</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.performanceTable}>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Status</th>
                <th>Atendimentos</th>
                <th>TMA</th>
                <th>Vendas</th>
                <th>Tempo Ativo</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td>
                    <div className={styles.userNameColumn}>
                      <div className={styles.userAvatar}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${user.status === 'online' ? styles.statusOnline : styles.statusOffline}`}>
                      {user.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td>{user.activeChats} ativos</td>
                  <td>{user.tma}</td>
                  <td>
                    <span className={styles.salesCount}>{user.sales}</span>
                  </td>
                  <td>{user.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>

  );
}
