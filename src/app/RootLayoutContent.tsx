"use client";

import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import styles from "./layout.module.css";
import HelpFAB from "@/components/HelpFAB";
import NewLeadModal from "@/components/NewLeadModal";
import { AuthProvider } from '@/context/AuthContext';
import { LeadProvider } from "@/context/LeadContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/SidebarProvider";

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <LeadProvider>
            {isLoginPage ? (
              <main>{children}</main>
            ) : (
              <div className={styles.layoutContainer}>
                <Sidebar />
                <div className={styles.mainContent}>
                  <Navbar />
                  <main>{children}</main>
                </div>
                <HelpFAB />
                <NewLeadModal />
              </div>
            )}
          </LeadProvider>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
