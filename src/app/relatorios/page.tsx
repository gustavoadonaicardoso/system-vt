"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Zap,
  Briefcase
} from 'lucide-react';
import styles from './relatorios.module.css';

// Mock Data
const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Fev', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Abr', value: 61000 },
  { name: 'Mai', value: 59000 },
  { name: 'Jun', value: 75000 },
  { name: 'Jul', value: 82000 },
  { name: 'Ago', value: 95000 },
  { name: 'Set', value: 105000 },
];

const conversionData = [
  { name: 'Visitantes', value: 15400 },
  { name: 'Leads', value: 4200 },
  { name: 'Qualificados', value: 1850 },
  { name: 'Negociações', value: 890 },
  { name: 'Ganhos', value: 320 },
];

const sourceData = [
  { name: 'Instagram', value: 45 },
  { name: 'Google Ads', value: 30 },
  { name: 'Orgânico', value: 15 },
  { name: 'Referência', value: 10 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.customTooltipLabel}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className={styles.customTooltipItem} style={{ color: entry.color || '#fff' }}>
            {entry.name}: {entry.name === 'value' || entry.name === 'Receita' 
              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [period, setPeriod] = useState('Mensal');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Relatórios Executivos</h1>
          <p className={styles.subtitle}>Visão analítica e métricas de alta performance</p>
        </div>
        
        <div className={styles.periodSelector}>
          {['Semanal', 'Mensal', 'Trimestral', 'Anual'].map((p) => (
            <button
              key={p}
              className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        className={styles.kpiGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.kpiCard} variants={itemVariants}>
          <div className={styles.kpiHeader}>
            <p className={styles.kpiTitle}>Receita Total</p>
            <div className={styles.kpiIcon}><DollarSign size={20} /></div>
          </div>
          <div>
            <h3 className={styles.kpiValue}>R$ 621.000</h3>
            <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
              <ArrowUpRight size={14} /> +24% que mês anterior
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.kpiCard} variants={itemVariants}>
          <div className={styles.kpiHeader}>
            <p className={styles.kpiTitle}>Novos Leads</p>
            <div className={styles.kpiIcon}><Users size={20} /></div>
          </div>
          <div>
            <h3 className={styles.kpiValue}>4.200</h3>
            <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
              <ArrowUpRight size={14} /> +12% que mês anterior
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.kpiCard} variants={itemVariants}>
          <div className={styles.kpiHeader}>
            <p className={styles.kpiTitle}>Taxa de Conversão</p>
            <div className={styles.kpiIcon}><Target size={20} /></div>
          </div>
          <div>
            <h3 className={styles.kpiValue}>7.6%</h3>
            <div className={`${styles.kpiTrend} ${styles.trendNegative}`}>
              <ArrowDownRight size={14} /> -1.2% que mês anterior
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.kpiCard} variants={itemVariants}>
          <div className={styles.kpiHeader}>
            <p className={styles.kpiTitle}>Tempo de Ciclo (Dias)</p>
            <div className={styles.kpiIcon}><Zap size={20} /></div>
          </div>
          <div>
            <h3 className={styles.kpiValue}>14.5</h3>
            <div className={`${styles.kpiTrend} ${styles.trendPositive}`}>
              <ArrowDownRight size={14} /> -2.4 dias que mês anterior
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className={styles.chartsGrid}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Evolução de Receita</h2>
            <p className={styles.chartSubtitle}>Crescimento financeiro ao longo do período selecionado</p>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="Receita" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className={styles.secondaryChartsGrid}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Funil de Vendas</h2>
            <p className={styles.chartSubtitle}>Taxa de retenção etapa por etapa</p>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Origem de Aquisição</h2>
            <p className={styles.chartSubtitle}>Distribuição de canais de captação de leads</p>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
