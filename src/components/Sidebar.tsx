"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft,
  ChevronRight,
  LayoutDashboard, 
  Users, 
  Kanban, 
  MessageSquare, 
  Settings, 
  Zap,
  Blocks,
  LifeBuoy,
  ShieldCheck,
  UserCog,
  BarChart3,
  Briefcase
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { useSidebar } from '@/components/SidebarProvider';


const navItems = [
  { name: 'Início', icon: LayoutDashboard, path: '/' },
  { name: 'Projetos', icon: Briefcase, path: '/projetos' },
  { name: 'Pipeline', icon: Kanban, path: '/pipeline' },
  { name: 'Leads', icon: Users, path: '/leads' },
  { name: 'Relatórios', icon: BarChart3, path: '/relatorios' },
  
  { name: 'Equipe', icon: UserCog, path: '/users' },
  { name: 'Automações', icon: Zap, path: '/automations' },
  { name: 'Integrações', icon: Blocks, path: '/integrations' },
  { name: 'Mensagens', icon: MessageSquare, path: '/messages' },
  { name: 'Central de Ajuda', icon: LifeBuoy, path: '/help' },
  { name: 'Configurações', icon: Settings, path: '/settings' },
];


const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileMenu } = useSidebar();

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      closeMobileMenu();
    }
  };

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isMobileOpen ? styles.backdropVisible : ''}`} 
        onClick={closeMobileMenu}
      />
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.logoArea}>
          {!isCollapsed && (
            <>
              <img src="/logo.png" alt="Vórtice Tecnologia" className={`${styles.imageLogo} ${styles.logoLight}`} />
              <img src="/logo-dark.png" alt="Vórtice Tecnologia" className={`${styles.imageLogo} ${styles.logoDark}`} />
            </>
          )}

          <button 
            onClick={toggleSidebar} 
            className={styles.toggleBtn}
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.navItemActive : ''}`}
              title={isCollapsed ? item.name : ""}
              onClick={handleLinkClick}
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}

          {/* Admin separator */}
          <div className={styles.navSeparator}>{!isCollapsed && <span>Admin</span>}</div>

          <Link
            href="/master"
            className={`${styles.navItem} ${styles.navItemMaster} ${pathname === '/master' ? styles.navItemActive : ''}`}
            title={isCollapsed ? 'Painel Master' : ''}
            onClick={handleLinkClick}
          >
            <ShieldCheck size={20} />
            {!isCollapsed && (
              <span className={styles.masterLabel}>
                Painel Master
                <span className={styles.adminBadge}>ADMIN</span>
              </span>
            )}
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>VT</div>
            {!isCollapsed && (
              <div className={styles.profileInfo}>
                <p>Admin Vórtice</p>
                <span>Super Admin</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};



export default Sidebar;
