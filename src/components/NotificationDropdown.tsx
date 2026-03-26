"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, Zap, UserPlus, CheckCircle2, Clock } from 'lucide-react';
import styles from './NotificationDropdown.module.css';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'message', title: 'Nova mensagem', text: 'Mário Lima enviou um áudio no WhatsApp.', time: '2 min atrás', unread: true, icon: MessageSquare, color: '#3b82f6' },
  { id: 2, type: 'automation', title: 'Automação executada', text: 'Lead "Tech Solutions" recebeu fluxo de boas-vindas.', time: '15 min atrás', unread: true, icon: Zap, color: '#f59e0b' },
  { id: 3, type: 'lead', title: 'Novo lead atribuído', text: 'Você recebeu 1 novo lead da campanha Facebook Ads.', time: '1h atrás', unread: false, icon: UserPlus, color: '#10b981' },
  { id: 4, type: 'task', title: 'Tarefa concluída', text: 'A proposta para "Auto Peças" foi enviada.', time: '3h atrás', unread: false, icon: CheckCircle2, color: '#8b5cf6' },
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className={styles.overlay} onClick={onClose} />
          <motion.div 
            className={styles.dropdown}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.header}>
              <h3>Notificações</h3>
              <span className={styles.unreadCount}>2 novas</span>
            </div>
            
            <div className={styles.list}>
              {MOCK_NOTIFICATIONS.map((notif) => (
                <div key={notif.id} className={`${styles.item} ${notif.unread ? styles.unread : ''}`}>
                  <div className={styles.iconWrapper} style={{ backgroundColor: `${notif.color}15`, color: notif.color }}>
                    <notif.icon size={18} />
                  </div>
                  <div className={styles.content}>
                    <div className={styles.itemHeader}>
                      <span className={styles.title}>{notif.title}</span>
                      <span className={styles.time}>{notif.time}</span>
                    </div>
                    <p className={styles.text}>{notif.text}</p>
                  </div>
                  {notif.unread && <div className={styles.unreadDot} />}
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <button className={styles.seeAll}>Ver todas as notificações</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
