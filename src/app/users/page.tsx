"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Key,
  ShieldAlert,
  X
} from 'lucide-react';
import styles from './users.module.css';

// Mock data
type Role = 'ADMIN' | 'MANAGER' | 'SELLER';
type Status = 'ACTIVE' | 'INACTIVE';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Gustavo Admin', email: 'gustavo@vortice.tech', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-10-15' },
  { id: '2', name: 'Rafael Silva', email: 'rafael.vendas@vortice.tech', role: 'MANAGER', status: 'ACTIVE', createdAt: '2026-01-10' },
  { id: '3', name: 'Ana Souza', email: 'ana.s@vortice.tech', role: 'SELLER', status: 'ACTIVE', createdAt: '2026-02-05' },
  { id: '4', name: 'Carlos Mendes', email: 'carlos@vortice.tech', role: 'SELLER', status: 'INACTIVE', createdAt: '2026-02-20' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('SELLER');
  const [status, setStatus] = useState<Status>('ACTIVE');

  const openNewUserModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('SELLER');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const saveUser = () => {
    if (!name || !email) return alert('Preencha os campos obrigatórios.');
    
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name, email, role, status } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  const deleteUser = (id: string) => {
    if (confirm('Tem certeza que deseja inativar ou excluir este usuário?')) {
      // Por segurança, apenas inativamos no mock
      setUsers(users.map(u => u.id === id ? { ...u, status: 'INACTIVE' } : u));
    }
  };

  const getRoleBadge = (r: Role) => {
    switch (r) {
      case 'ADMIN': return <span className={`${styles.roleBadge} ${styles.roleAdmin}`}>Administrador</span>;
      case 'MANAGER': return <span className={`${styles.roleBadge} ${styles.roleManager}`}>Gerente</span>;
      case 'SELLER': return <span className={`${styles.roleBadge} ${styles.roleSeller}`}>Vendedor</span>;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerRow}>
        <div className={styles.titleSection}>
          <h2>Equipe e Permissões</h2>
          <p>Cadastre usuários, defina papéis de acesso e gerencie a hierarquia do CRM.</p>
        </div>
        
        <button className={styles.addBtn} onClick={openNewUserModal}>
          <Plus size={18} /> Novo Usuário
        </button>
      </header>

      <div className={styles.tableContainer}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
           <Search size={20} style={{ opacity: 0.5 }} />
           <input 
             type="text" 
             placeholder="Buscar usuário por nome ou email..." 
             style={{ border: 'none', background: 'transparent', color: 'var(--foreground)', outline: 'none', flex: 1 }}
           />
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Acesso (Role)</th>
                <th>Status</th>
                <th>Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0) || ''}
                      </div>
                      <div>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {getRoleBadge(user.role)}
                  </td>
                  <td>
                    <div className={`${styles.statusBadge} ${user.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}`}>
                      <span className={styles.statusDot}></span>
                      {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </div>
                  </td>
                  <td style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.btnEdit}`} onClick={() => openEditModal(user)} title="Editar Usuário">
                        <Edit2 size={16} />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.btnKey}`} title="Redefinir Senha / Permissões">
                        <Key size={16} />
                      </button>
                      {user.id !== '1' && (
                        <button className={`${styles.actionBtn} ${styles.btnDelete}`} onClick={() => deleteUser(user.id)} title="Desativar/Remover">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label>Nome Completo</label>
              <input 
                type="text" 
                className={styles.input} 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Ex: João Silva"
              />
            </div>

            <div className={styles.formGroup}>
              <label>E-mail Corporativo</label>
              <input 
                type="email" 
                className={styles.input} 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="joao@suaempresa.com"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label>Nível de Acesso</label>
                <select className={styles.select} value={role} onChange={e => setRole(e.target.value as Role)}>
                  <option value="SELLER">Vendedor (Básico)</option>
                  <option value="MANAGER">Gerente (Avançado)</option>
                  <option value="ADMIN">Administrador (Total)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Status</label>
                <select className={styles.select} value={status} onChange={e => setStatus(e.target.value as Status)}>
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </div>
            </div>

            {role === 'ADMIN' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', padding: '12px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                <ShieldAlert size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.85rem', color: '#ef4444', margin: 0 }}>
                  Aviso: O administrador tem acesso total a faturamento, exclusão de dados e configurações do sistema. Conceda este papel com cuidado.
                </p>
              </div>
            )}

            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={closeModal}>Cancelar</button>
              <button className={styles.btnSave} onClick={saveUser}>
                {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
