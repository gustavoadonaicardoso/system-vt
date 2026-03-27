"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';
import styles from './login.module.css';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication with specific credentials
    setTimeout(() => {
      if (email === 'gustavoadonai@admin.com' && password === 'd*b234Wt2gFFRk') {
        login('root_auth_token_vortice_2026');
      } else {
        setError('Credenciais incorretas. Verifique seu e-mail e senha.');
        setIsLoading(false);
      }
    }, 1800);
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.gridOverlay}></div>
      <div className={styles.backgroundBlobs}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

      <motion.div 
        className={styles.loginCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.logoSection}>
          <div className={styles.vortexLogo}>
            <div className={styles.vortexInner}></div>
            <Zap size={24} className={styles.vortexIcon} />
          </div>
          <h1>VÓRTICE</h1>
          <p>Sua central de comando comercial</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label>E-mail</label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.fieldIcon} />
              <input 
                type="email" 
                placeholder="nome@vortice.tech" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.fieldIcon} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>
          </div>

          <button 
            type="submit" 
            className={styles.loginBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className={styles.loader}></div>
            ) : (
              <>
                Acessar CRM <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footerInfo}>
          <div className={styles.infoItem}>
            <ShieldCheck size={14} />
            <span>Acesso Seguro SSL</span>
          </div>
          <div className={styles.infoItem}>
            <Globe size={14} />
            <span>Multi-Plataforma</span>
          </div>
        </div>
      </motion.div>

      <div className={styles.loginBranding}>
        <p>© 2026 Vórtice Tecnologia. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
