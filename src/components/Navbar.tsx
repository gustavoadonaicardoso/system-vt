"use client";

import React from 'react';
import { Search, Bell, Plus, HelpCircle, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';
import { useSidebar } from '@/components/SidebarProvider';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';
import { useLeads } from '@/context/LeadContext';

const Navbar = () => {
  const { isMobileOpen, toggleMobileMenu } = useSidebar();
  const { openModal } = useLeads();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const closeNotifications = () => setShowNotifications(false);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button className={styles.hamburger} onClick={toggleMobileMenu}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={styles.searchArea}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Buscar leads, tarefas ou clientes..." />
        </div>
      </div>

      <div className={styles.actionArea}>
        <ThemeToggle />
        <Link href="/help" className={styles.actionButton}>
          <HelpCircle size={22} />
        </Link>

        <button 
          className={`${styles.actionButton} ${styles.notificationBtn}`}
          onClick={toggleNotifications}
        >
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>

        <NotificationDropdown 
          isOpen={showNotifications} 
          onClose={closeNotifications} 
        />

        <button className={styles.newLeadBtn} onClick={openModal}>
          <Plus size={18} />
          <span>Novo Lead</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
