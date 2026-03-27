"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Key,
  ShieldAlert,
  X,
  User,
  LayoutDashboard,
  Kanban,
  Users,
  MessageSquare,
  Zap,
  Blocks,
  UserCog
} from 'lucide-react';
import styles from './users.module.css';

// Mock data
type Role = 'ADMIN' | 'MANAGER' | 'SELLER';
type Status = 'ACTIVE' | 'INACTIVE';

interface Permissions {
  dashboard: { view: boolean; kpis: boolean; funnel: boolean; activities: boolean };
  pipeline: { view: boolean; move: boolean; edit: boolean; manageStages: boolean };
  leads: { view: boolean; edit: boolean; delete: boolean; tags: boolean; export: boolean };
  messages: { view: boolean; send: boolean; start: boolean };
  automations: { view: boolean; manage: boolean };
  integrations: { view: boolean; manage: boolean };
  team: { view: boolean; manage: boolean };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
  permissions: Permissions;
}

const DEFAULT_PERMISSIONS: Permissions = {
  dashboard: { view: true, kpis: true, funnel: true, activities: true },
  pipeline: { view: true, move: true, edit: true, manageStages: true },
  leads: { view: true, edit: true, delete: true, tags: true, export: true },
  messages: { view: true, send: true, start: true },
  automations: { view: true, manage: true },
  integrations: { view: true, manage: true },
  team: { view: true, manage: true },
};

const SELLER_PERMISSIONS: Permissions = {
  dashboard: { view: true, kpis: true, funnel: false, activities: false },
  pipeline: { view: true, move: true, edit: true, manageStages: false },
  leads: { view: true, edit: true, delete: false, tags: true, export: false },
  messages: { view: true, send: true, start: true },
  automations: { view: false, manage: false },
  integrations: { view: false, manage: false },
  team: { view: false, manage: false },
};

const MOCK_USERS: User[] = [
  { id: '1', name: 'Gustavo Admin', email: 'gustavo@vortice.tech', role: 'ADMIN', status: 'ACTIVE', createdAt: '2025-10-15', permissions: DEFAULT_PERMISSIONS },
  { id: '2', name: 'Rafael Silva', email: 'rafael.vendas@vortice.tech', role: 'MANAGER', status: 'ACTIVE', createdAt: '2026-01-10', permissions: DEFAULT_PERMISSIONS },
  { id: '3', name: 'Ana Souza', email: 'ana.s@vortice.tech', role: 'SELLER', status: 'ACTIVE', createdAt: '2026-02-05', permissions: SELLER_PERMISSIONS },
  { id: '4', name: 'Carlos Mendes', email: 'carlos@vortice.tech', role: 'SELLER', status: 'INACTIVE', createdAt: '2026-02-20', permissions: SELLER_PERMISSIONS },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0].id);
  const [activeTab, setActiveTab] = useState<'info' | 'permissions'>('permissions');
  const [isEditing, setIsEditing] = useState(false);

  // Derive selection
  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  // Local form states
  const [name, setName] = useState(selectedUser.name);
  const [email, setEmail] = useState(selectedUser.email);
  const [role, setRole] = useState<Role>(selectedUser.role);
  const [status, setStatus] = useState<Status>(selectedUser.status);
  const [userPermissions, setUserPermissions] = useState<Permissions>(selectedUser.permissions);

  // Effect to sync local state with selection
  React.useEffect(() => {
    setName(selectedUser.name);
    setEmail(selectedUser.email);
    setRole(selectedUser.role);
    setStatus(selectedUser.status);
    setUserPermissions(selectedUser.permissions);
  }, [selectedUserId]);

  const togglePermission = (category: keyof Permissions, field: string) => {
    setUserPermissions(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [field]: !(prev[category] as any)[field]
      }
    }));
    setIsEditing(true);
  };

  const saveChanges = () => {
    if (!name || !email) return alert('Preencha os campos obrigatórios.');
    setUsers(users.map(u => u.id === selectedUserId ? { ...u, name, email, role, status, permissions: userPermissions } : u));
    setIsEditing(false);
  };

  const createNewMember = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: 'Novo Colaborador',
      email: 'novo@vortice.tech',
      role: 'SELLER',
      status: 'ACTIVE',
      permissions: SELLER_PERMISSIONS,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setSelectedUserId(newUser.id);
    setIsEditing(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerRow}>
        <div className={styles.titleSection}>
          <h2>Equipe e Permissões</h2>
          <p>Selecione um membro para gerenciar seus acessos e informações.</p>
        </div>
        
        <button className={styles.addBtn} onClick={createNewMember}>
          <Plus size={18} /> Novo Membro
        </button>
      </header>

      <div className={styles.splitLayout}>
        <aside className={styles.sidebarSection}>
          <div className={styles.searchBlock}>
            <Search size={16} />
            <input type="text" placeholder="Filtrar equipe..." />
          </div>
          
          <div className={styles.userList}>
            {users.map(u => (
              <div 
                key={u.id} 
                className={`${styles.userCard} ${selectedUserId === u.id ? styles.userCardActive : ''}`}
                onClick={() => setSelectedUserId(u.id)}
              >
                <div className={styles.userAvatarSmall}>
                  {u.name.charAt(0)}{u.name.split(' ')[1]?.charAt(0) || ''}
                </div>
                <div className={styles.userMetaCompact}>
                  <div className={styles.userNameSmall}>{u.name}</div>
                  <div className={styles.userRoleSmall}>{u.role}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className={styles.mainEditorSection}>
          {selectedUser && (
            <div className={styles.editorContainer}>
              <div className={styles.editorProfileHeader}>
                <div className={styles.profileMain}>
                  <div className={styles.profileAvatarLarge}>
                    {selectedUser.name.charAt(0)}{selectedUser.name.split(' ')[1]?.charAt(0) || ''}
                  </div>
                  <div className={styles.profileTexts}>
                    <h3>{selectedUser.name}</h3>
                    <p>{selectedUser.email}</p>
                  </div>
                </div>
                
                {isEditing && (
                  <button className={styles.saveAlertBtn} onClick={saveChanges}>
                    <Plus size={16} /> Salvar Alterações
                  </button>
                )}
              </div>

              <div className={styles.tabSwitcher}>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'info' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Informações
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'permissions' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('permissions')}
                >
                  Permissões de Acesso
                </button>
              </div>

              <div className={styles.editorScroller}>
                {activeTab === 'info' ? (
                  <div className={styles.infoFormGrid}>
                    <div className={styles.formGroup}>
                      <label>Nome Completo</label>
                      <input 
                        className={styles.input} 
                        value={name} 
                        onChange={e => { setName(e.target.value); setIsEditing(true); }} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>E-mail Corporativo</label>
                      <input 
                        className={styles.input} 
                        value={email} 
                        onChange={e => { setEmail(e.target.value); setIsEditing(true); }} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Papel no Sistema</label>
                      <select 
                        className={styles.select} 
                        value={role} 
                        onChange={e => { 
                          const newRole = e.target.value as Role;
                          setRole(newRole);
                          setIsEditing(true);
                          if (newRole === 'ADMIN') setUserPermissions(DEFAULT_PERMISSIONS);
                          else if (newRole === 'SELLER') setUserPermissions(SELLER_PERMISSIONS);
                        }}
                      >
                        <option value="ADMIN">Administrador</option>
                        <option value="MANAGER">Gerente</option>
                        <option value="SELLER">Vendedor</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Status</label>
                      <select 
                        className={styles.select} 
                        value={status} 
                        onChange={e => { setStatus(e.target.value as Status); setIsEditing(true); }}
                      >
                        <option value="ACTIVE">Ativo</option>
                        <option value="INACTIVE">Inativo</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className={styles.permissionsLayoutGrid}>
                    {Object.entries(userPermissions).map(([category, items]) => {
                       const categoryMap: any = {
                        dashboard: { name: 'Dashboard / Painel', icon: LayoutDashboard, color: '#3b82f6' },
                        pipeline: { name: 'Funil de Vendas', icon: Kanban, color: '#8b5cf6' },
                        leads: { name: 'Gestão de Leads', icon: Users, color: '#10b981' },
                        messages: { name: 'Mensagens / Chat', icon: MessageSquare, color: '#f59e0b' },
                        automations: { name: 'Automações', icon: Zap, color: '#ef4444' },
                        integrations: { name: 'Integrações', icon: Blocks, color: '#3b82f6' },
                        team: { name: 'Equipe / Membros', icon: UserCog, color: '#10b981' }
                      };

                      const fieldMap: any = {
                        view: 'Visualizar Módulo',
                        kpis: 'Ver Indicadores (KPIs)',
                        funnel: 'Ver Relatório de Funil',
                        activities: 'Ver Logs de Atividade',
                        move: 'Mover Cards no Funil',
                        edit: 'Editar Informações',
                        manageStages: 'Gerenciar Etapas',
                        delete: 'Excluir Registros',
                        tags: 'Gerenciar Etiquetas',
                        export: 'Exportar Dados (.csv)',
                        send: 'Enviar Mensagens',
                        start: 'Iniciar Novos Chats',
                        manage: 'Configuração Total'
                      };

                      const cat = categoryMap[category] || { name: category, icon: ShieldAlert, color: '#ccc' };

                      return (
                        <div key={category} className={styles.permissionCardSection}>
                          <div className={styles.cardHeaderSmall}>
                            <cat.icon size={14} color={cat.color} />
                            <h4>{cat.name}</h4>
                          </div>
                          <div className={styles.permissionSwitchList}>
                            {Object.entries(items).map(([field, value]) => (
                               <div key={field} className={styles.switchRow}>
                                 <label className={styles.cyberLabel}>
                                   <span>{fieldMap[field] || field}</span>
                                   <div className={styles.cyberSwitch}>
                                      <input 
                                        type="checkbox" 
                                        checked={value as boolean}
                                        onChange={() => togglePermission(category as keyof Permissions, field)}
                                      />
                                      <span className={styles.cyberSlider}></span>
                                   </div>
                                 </label>
                               </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
