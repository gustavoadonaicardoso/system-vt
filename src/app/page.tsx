"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  UserCheck,
  X,
  Send,
  Loader2,
  Flame,
  Rocket,
  Star,
  Shield,
  Globe,
  Award,
  Sparkles,
  Zap as ZapIcon,
  Settings
} from 'lucide-react';

const PRESET_ICONS_MAP: Record<string, any> = {
  zap: ZapIcon,
  flame: Flame,
  rocket: Rocket,
  star: Star,
  shield: Shield,
  globe: Globe,
  award: Award,
  sparkles: Sparkles,
};

import styles from './page.module.css';

const initialKpis = [
  { label: 'Receita Total', value: 'R$ 124.500', trend: '+12.5%', icon: DollarSign, color: '#3b82f6' },
  { label: 'Leads Ativos', value: '1.280', trend: '+8.2%', icon: Users, color: '#8b5cf6' },
  { label: 'Tempo Médio Espera', value: '4m 12s', trend: '-30s', icon: Clock, color: '#f59e0b' },
  { label: 'Tempo Médio Atendimento', value: '18m 45s', trend: '+1m', icon: Activity, color: '#10b981' },
];

const periodData: Record<string, typeof initialKpis> = {
  today: initialKpis,
  yesterday: [
    { label: 'Receita Total', value: 'R$ 98.200', trend: '+5.1%', icon: DollarSign, color: '#3b82f6' },
    { label: 'Leads Ativos', value: '1.150', trend: '+4.2%', icon: Users, color: '#8b5cf6' },
    { label: 'Tempo Médio Espera', value: '5m 05s', trend: '-15s', icon: Clock, color: '#f59e0b' },
    { label: 'Tempo Médio Atendimento', value: '19m 20s', trend: '+2m', icon: Activity, color: '#10b981' },
  ],
  '7days': [
    { label: 'Receita Total', value: 'R$ 845.000', trend: '+15.8%', icon: DollarSign, color: '#3b82f6' },
    { label: 'Leads Ativos', value: '8.450', trend: '+12.5%', icon: Users, color: '#8b5cf6' },
    { label: 'Tempo Médio Espera', value: '4m 45s', trend: '-45s', icon: Clock, color: '#f59e0b' },
    { label: 'Tempo Médio Atendimento', value: '17m 30s', trend: '+30s', icon: Activity, color: '#10b981' },
  ],
  '30days': [
    { label: 'Receita Total', value: 'R$ 3.840.000', trend: '+22.4%', icon: DollarSign, color: '#3b82f6' },
    { label: 'Leads Ativos', value: '32.100', trend: '+18.1%', icon: Users, color: '#8b5cf6' },
    { label: 'Tempo Médio Espera', value: '4m 30s', trend: '-1m', icon: Clock, color: '#f59e0b' },
    { label: 'Tempo Médio Atendimento', value: '18m 05s', trend: '+1m', icon: Activity, color: '#10b981' },
  ]
};


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


interface Banner {
  title: string;
  description: string;
  date: string;
  type: string;
  color: string;
  icon: any;
  iconName?: string;
}

const eventsBanners: Banner[] = [];

const funnelData = [
  { label: 'Leads', value: 1280, icon: Users, color: '#3b82f6' },
  { label: 'Qualificados', value: 840, icon: UserCheck, color: '#8b5cf6' },
  { label: 'Proposta', value: 320, icon: MessageCircle, color: '#f59e0b' },
  { label: 'Fechados', value: 145, icon: DollarSign, color: '#10b981' },
];

const periodTeamData: Record<string, typeof userData> = {
  today: userData,
  yesterday: [
    { name: 'João Silva', status: 'online', activeChats: 4, tma: '14m 10s', sales: 10, uptime: '8h 00m' },
    { name: 'Bia Santos', status: 'online', activeChats: 2, tma: '16m 00s', sales: 6, uptime: '7h 30m' },
    { name: 'Pedro Costa', status: 'online', activeChats: 5, tma: '11m 30s', sales: 12, uptime: '8h 15m' },
    { name: 'Ana Oliveira', status: 'online', activeChats: 6, tma: '15m 45s', sales: 9, uptime: '6h 00m' },
    { name: 'Carlos Lima', status: 'online', activeChats: 3, tma: '19m 20s', sales: 4, uptime: '8h 00m' },
  ],
  '7days': [
    { name: 'João Silva', status: 'online', activeChats: 32, tma: '13m 20s', sales: 85, uptime: '54h 20m' },
    { name: 'Bia Santos', status: 'online', activeChats: 28, tma: '15m 50s', sales: 64, uptime: '48h 15m' },
    { name: 'Pedro Costa', status: 'offline', activeChats: 40, tma: '10m 55s', sales: 92, uptime: '50h 10m' },
    { name: 'Ana Oliveira', status: 'online', activeChats: 35, tma: '14m 40s', sales: 78, uptime: '45h 30m' },
    { name: 'Carlos Lima', status: 'offline', activeChats: 22, tma: '18m 15s', sales: 45, uptime: '42h 00m' },
  ],
  '30days': [
    { name: 'João Silva', status: 'online', activeChats: 145, tma: '12m 55s', sales: 342, uptime: '220h 10m' },
    { name: 'Bia Santos', status: 'online', activeChats: 128, tma: '15m 30s', sales: 285, uptime: '195h 45m' },
    { name: 'Pedro Costa', status: 'online', activeChats: 162, tma: '11m 10s', sales: 410, uptime: '215h 20m' },
    { name: 'Ana Oliveira', status: 'online', activeChats: 154, tma: '14m 15s', sales: 328, uptime: '202h 30m' },
    { name: 'Carlos Lima', status: 'online', activeChats: 98, tma: '18m 45s', sales: 185, uptime: '188h 00m' },
  ]
};
const periodFunnelData: Record<string, typeof funnelData> = {
  today: funnelData,
  yesterday: [
    { label: 'Leads', value: 980, icon: Users, color: '#3b82f6' },
    { label: 'Qualificados', value: 620, icon: UserCheck, color: '#8b5cf6' },
    { label: 'Proposta', value: 210, icon: MessageCircle, color: '#f59e0b' },
    { label: 'Fechados', value: 85, icon: DollarSign, color: '#10b981' },
  ],
  '7days': [
    { label: 'Leads', value: 8450, icon: Users, color: '#3b82f6' },
    { label: 'Qualificados', value: 5200, icon: UserCheck, color: '#8b5cf6' },
    { label: 'Proposta', value: 1840, icon: MessageCircle, color: '#f59e0b' },
    { label: 'Fechados', value: 720, icon: DollarSign, color: '#10b981' },
  ],
  '30days': [
    { label: 'Leads', value: 32100, icon: Users, color: '#3b82f6' },
    { label: 'Qualificados', value: 19800, icon: UserCheck, color: '#8b5cf6' },
    { label: 'Proposta', value: 6500, icon: MessageCircle, color: '#f59e0b' },
    { label: 'Fechados', value: 2840, icon: DollarSign, color: '#10b981' },
  ]
};

const periodActivities: Record<string, typeof activities> = {
  today: activities,
  yesterday: [
    { user: 'Bia Santos', action: 'concluiu o onboarding de', target: 'Agência X', time: 'Ontem', icon: UserCheck },
    { user: 'Pedro Costa', action: 'agendou demonstração para', target: 'Mário Silva', time: 'Ontem', icon: Clock },
  ],
  '7days': [
    { user: 'Equipe Vendas', action: 'bateu a meta semanal de', target: 'Novos Contratos', time: '2 dias atrás', icon: Award },
    { user: 'Sistema', action: 'processou 5.000 novos leads de', target: 'Facebook Ads', time: '4 dias atrás', icon: ZapIcon },
  ],
  '30days': [
    { user: 'Vórtice Admin', action: 'atualizou os workflows de', target: 'Automação Master', time: '15 dias atrás', icon: Settings },
    { user: 'Performance', action: 'atingiu ROI recorde no período de', target: 'Março 2026', time: '22 dias atrás', icon: TrendingUp },
  ]
};

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<typeof eventsBanners[0] | null>(null);
  const [banners, setBanners] = React.useState(eventsBanners);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  
  // Filter states
  const [currentFilter, setCurrentFilter] = React.useState('today');
  const [kpis, setKpis] = React.useState(initialKpis);
  const [teamStats, setTeamStats] = React.useState(userData);
  const [funnel, setFunnel] = React.useState(funnelData);
  const [recentActivities, setRecentActivities] = React.useState(activities);
  const [isFiltering, setIsFiltering] = React.useState(false);

  // Sync with localStorage to allow admin edits to persist
  React.useEffect(() => {
    const savedBanners = localStorage.getItem('vortice_banners');
    if (savedBanners) setBanners(JSON.parse(savedBanners));
  }, []);

  // Automatic filtration when period changes
  React.useEffect(() => {
    handleFilter();
  }, [currentFilter]);

  const handleFilter = () => {
    setIsFiltering(true);
    // Real-time synchronization of all dashboard modules
    setTimeout(() => {
      setKpis(periodData[currentFilter] || initialKpis);
      setTeamStats(periodTeamData[currentFilter] || userData);
      setFunnel(periodFunnelData[currentFilter] || funnelData);
      setRecentActivities(periodActivities[currentFilter] || activities);
      setIsFiltering(false);
    }, 600);
  };

  const openModal = (event: typeof eventsBanners[0]) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setFormSubmitted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      closeModal();
    }, 2000);
  };

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
              <select 
                className={styles.dateSelect} 
                value={currentFilter}
                onChange={(e) => setCurrentFilter(e.target.value)}
              >
                <option value="today">Hoje</option>
                <option value="yesterday">Ontem</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
              </select>
            </div>
            <button 
              className={styles.filterBtn}
              onClick={handleFilter}
              disabled={isFiltering}
            >
              {isFiltering ? (
                <>
                  <Loader2 size={16} className={styles.spin} />
                  <span>Aplicando...</span>
                </>
              ) : (
                'Filtrar'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Banners de Eventos da Vórtice */}
      <section className={styles.bannersSection}>
        <div className={styles.bannersScroll}>
          {banners.map((banner, idx) => (
            <motion.div 
              key={idx} 
              className={styles.bannerCard}
              style={{ background: banner.color }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              onClick={() => openModal(banner)}
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
                 {/* Safe icon rendering for serialized banners */}
                 {banner.iconName && PRESET_ICONS_MAP[banner.iconName] ? (
                   React.createElement(PRESET_ICONS_MAP[banner.iconName], { size: 110, strokeWidth: 1.5 })
                 ) : (
                    <span style={{ fontSize: '100px', opacity: 0.2 }}>✨</span>
                 )}
              </div>
              <button 
                className={styles.bannerAction}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(banner);
                }}
              >
                Saber mais
              </button>
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
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Conversão do Funil</h3>
            <div className={styles.periodBadge}>
              {currentFilter === 'today' ? 'Hoje' : 
               currentFilter === 'yesterday' ? 'Ontem' : 
               currentFilter === '7days' ? '7 Dias' : '30 Dias'}
            </div>
          </div>
          
          <div className={styles.funnelWrapper}>
            {funnel.map((step, idx) => {
              const conversion = idx > 0 ? ((step.value / funnel[idx-1].value) * 100).toFixed(1) : null;
              const width = 100 - (idx * 15); // Narrows down the funnel

              return (
                <div key={idx} className={styles.funnelStep}>
                  {conversion && (
                    <div className={styles.conversionInfo}>
                      <div className={styles.conversionLine}></div>
                      <span className={styles.conversionValue}>{conversion}%</span>
                    </div>
                  )}
                  
                  <div className={styles.stepVisual}>
                    <div 
                      className={styles.stepBar} 
                      style={{ 
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${step.color}30, ${step.color})`,
                        boxShadow: `0 0 20px ${step.color}20`
                      }}
                    >
                      <div className={styles.stepInfoLeft}>
                        <div className={styles.stepIcon} style={{ background: step.color }}>
                          <step.icon size={14} color="white" />
                        </div>
                        <span className={styles.stepLabel}>{step.label}</span>
                      </div>
                      <div className={styles.stepValue}>{step.value}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.funnelSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Conversão Total</span>
              <span className={styles.summaryValue}>11.3%</span>
            </div>
            <div className={styles.summaryDivider}></div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Ticket Médio</span>
              <span className={styles.summaryValue}>R$ 4.250</span>
            </div>
          </div>
        </section>

        <section className={styles.chartContainer}>
          <h3 className={styles.sectionTitle}>Atividade Recente</h3>
          <div className={styles.activityList}>
            {recentActivities.map((act, index) => (
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
              {teamStats.map((user, index) => (
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
                  <td>{user.activeChats} atendimentos</td>
                  <td>{user.tma || 'N/A'}</td>
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

      {/* Modal de Inscrição */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <motion.div 
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeModal} onClick={closeModal}>
                <X size={24} />
              </button>

              {!formSubmitted ? (
                <>
                  <div className={styles.modalHeader}>
                    <div className={styles.modalIcon} style={{ background: selectedEvent.color }}>
                      {/* Safe icon mapping for serialized/custom banners */}
                      {selectedEvent.iconName && PRESET_ICONS_MAP[selectedEvent.iconName] ? (
                        React.createElement(PRESET_ICONS_MAP[selectedEvent.iconName], { size: 32, color: "white" })
                      ) : typeof selectedEvent.icon === 'function' ? (
                        <selectedEvent.icon size={32} color="white" />
                      ) : (
                        <Calendar size={32} color="white" />
                      )}
                    </div>
                    <div>
                      <span className={styles.modalBadge}>{selectedEvent.type}</span>
                      <h3 className={styles.modalTitle}>Inscrição: {selectedEvent.title}</h3>
                      <p className={styles.modalSubtitle}>Preencha os dados abaixo para garantir sua vaga.</p>
                    </div>
                  </div>

                  <form className={styles.registrationForm} onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                      <label htmlFor="name">Nome Completo</label>
                      <input type="text" id="name" placeholder="Como deseja ser chamado?" required />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="email">E-mail Corporativo</label>
                      <input type="email" id="email" placeholder="seu@email.com" required />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="phone">WhatsApp / Telefone</label>
                      <input type="tel" id="phone" placeholder="(00) 00000-0000" required />
                    </div>
                    
                    <button type="submit" className={styles.submitBtn}>
                      <span>Confirmar minha vaga</span>
                      <Send size={18} />
                    </button>
                  </form>
                </>
              ) : (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>
                    <CheckCircle2 size={64} color="#10b981" />
                  </div>
                  <h3>Inscrição Realizada!</h3>
                  <p>Enviamos os detalhes para o seu e-mail e em breve entraremos em contato via WhatsApp.</p>
                  <div className={styles.successEvent}>
                    <strong>{selectedEvent.title}</strong>
                    <span>{selectedEvent.date}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}
