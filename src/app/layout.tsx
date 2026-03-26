import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import styles from "./layout.module.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/SidebarProvider";
import HelpFAB from "@/components/HelpFAB";
import { LeadProvider } from "@/context/LeadContext";
import NewLeadModal from "@/components/NewLeadModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vórtice CRM | Plataforma de Vendas Pro",
  description: "CRM avançado para equipes de vendas modernas, inspirado em Kommo e Sellflux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          <SidebarProvider>
            <LeadProvider>
              <div className={styles.layoutContainer}>
                <Sidebar />
                <div className={styles.mainContent}>
                  <Navbar />
                  <main>{children}</main>
                </div>
              </div>
              <HelpFAB />
              <NewLeadModal />
            </LeadProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
