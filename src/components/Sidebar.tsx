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
  Briefcase,
  Calendar
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { useSidebar } from '@/components/SidebarProvider';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';


const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileMenu } = useSidebar();
  const { user, logout } = useAuth();
  const { config } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = React.useMemo(() => [
    { name: 'Início', icon: LayoutDashboard, path: '/' },
    { name: 'Projetos', icon: Briefcase, path: '/projetos' },
    { name: 'Mensagens', icon: MessageSquare, path: '/messages' },
    { name: 'Pipeline', icon: Kanban, path: '/pipeline' },
    { name: 'Leads', icon: Users, path: '/leads' },
    { name: 'Relatórios', icon: BarChart3, path: '/relatorios' },
    { name: 'Agendamento', icon: Calendar, path: '/scheduling' },
    
    { name: 'Equipe', icon: UserCog, path: '/users' },
    { name: 'Automações', icon: Zap, path: '/automations' },
    { name: 'Integrações', icon: Blocks, path: '/integrations' },
    { name: 'Central de Ajuda', icon: LifeBuoy, path: '/help' },
    { name: 'Configurações', icon: Settings, path: '/settings' },
  ], []);

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
            <div className={styles.logoContainer}>
              {config.logo_url ? (
                <img src={config.logo_url} alt={config.app_name} className={styles.imageLogo} />
              ) : (
                <>
                  <img src="/logo.png" alt="Vórtice Tecnologia" className={`${styles.imageLogo} ${styles.logoLight}`} />
                  <img src="/logo-dark.png" alt="Vórtice Tecnologia" className={`${styles.imageLogo} ${styles.logoDark}`} />
                </>
              )}
            </div>
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
          {mounted && navItems.map((item) => (
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

          {mounted && (
            <>
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
            </>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <button 
            className={styles.profileCard} 
            onClick={(e) => {
              e.preventDefault();
              logout();
            }} 
            title="Clique para sair"
          >
             <div className={styles.avatar}>
               {user?.name?.charAt(0) || 'U'}
               {user?.name?.split(' ')[1]?.charAt(0) || ''}
             </div>
            {!isCollapsed && (
              <div className={styles.profileInfo}>
                <p>{user?.name || 'Carregando...'}</p>
                <span>{user?.role || 'Acessando...'}</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};



export default Sidebar;
