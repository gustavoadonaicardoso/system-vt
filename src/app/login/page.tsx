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
import { logAudit } from '@/lib/audit';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Erro de configuração do sistema.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('status', 'ACTIVE')
        .single();

      if (queryError || !data) {
        setError('E-mail ou senha incorretos, ou conta desativada.');
        setIsLoading(false);
        return;
      }

      // Log successful login
      await logAudit(
        { id: data.id, name: data.name },
        'LOGIN',
        `Usuário ${data.name} (${data.role}) fez login no sistema.`
      );

      login(data);
    } catch (err) {
      console.error('Login error:', err);
      setError('Falha na autenticação. Tente novamente.');
      setIsLoading(false);
    }
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
