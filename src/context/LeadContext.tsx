"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type Lead = {
  id: string;
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  tags: string[];
  pipelineStage: string;
  entryDate: string;
  status: string;
  color: string;
  channels: string[];
  lastMsg: string;
  value?: string;
  days?: number;
};

export type PipelineStage = {
  id: string;
  name: string;
  color: string;
  leads: string[]; 
};

const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'novo', name: 'Novos Leads', color: '#3b82f6', leads: ['lead-1', 'lead-2'] },
  { id: 'contato', name: 'Primeiro Contato', color: '#8b5cf6', leads: ['lead-3'] },
  { id: 'negociacao', name: 'Negociação', color: '#f59e0b', leads: ['lead-4'] },
  { id: 'proposta', name: 'Proposta Enviada', color: '#8b5cf6', leads: ['lead-6'] },
  { id: 'ganho', name: 'Ganhos', color: '#10b981', leads: ['lead-5'] }
];

const INITIAL_LEADS: Lead[] = [
  { id: 'lead-1', name: 'Mário Lima', cpfCnpj: '', email: 'mario@terra.com', phone: '(11) 99876-5432', tags: ['Quente', 'SSD'], pipelineStage: 'novo', entryDate: '26/03/2026', lastMsg: '2 min atrás', status: 'Ativo', color: '#3b82f6', channels: ['whatsapp', 'instagram'], value: 'R$ 15.000', days: 2 },
  { id: 'lead-2', name: 'Ana Souza', cpfCnpj: '', email: 'ana@gmail.com', phone: '(21) 98765-4321', tags: ['Frio'], pipelineStage: 'novo', entryDate: '25/03/2026', lastMsg: '1h atrás', status: 'Ativo', color: '#10b981', channels: ['whatsapp'], value: 'R$ 8.500', days: 1 },
  { id: 'lead-3', name: 'Roberto Carlos', cpfCnpj: '', email: 'roberto@globo.com', phone: '(31) 97654-3210', tags: ['Inativa'], pipelineStage: 'contato', entryDate: '24/03/2026', lastMsg: '1 dia atrás', status: 'Bloqueado', color: '#ef4444', channels: ['facebook'], value: 'R$ 25.000', days: 4 },
  { id: 'lead-4', name: 'Juliana Paes', cpfCnpj: '', email: 'juh@gmail.com', phone: '(11) 91234-5678', tags: ['VIP', 'SSD'], pipelineStage: 'negociacao', entryDate: '23/03/2026', lastMsg: '5 min atrás', status: 'Ativo', color: '#8b5cf6', channels: ['instagram', 'site'], value: 'R$ 45.000', days: 12 },
  { id: 'lead-5', name: 'Fabio T.', cpfCnpj: '', email: 'fabio@techhub.io', phone: '(41) 92345-6789', tags: ['Ganhos'], pipelineStage: 'ganho', entryDate: '22/03/2026', lastMsg: '3h atrás', status: 'Ativo', color: '#f59e0b', channels: ['whatsapp'], value: 'R$ 12.000', days: 20 },
  { id: 'lead-6', name: 'Daniel K.', cpfCnpj: '', email: 'daniel@solucaotech.com', phone: '(51) 99888-7777', tags: ['Proposta'], pipelineStage: 'proposta', entryDate: '20/03/2026', lastMsg: '2 dias atrás', status: 'Ativo', color: '#3b82f6', channels: ['whatsapp', 'email'], value: 'R$ 30.000', days: 3 }
];

type LeadContextType = {
  leads: Lead[];
  pipelineStages: PipelineStage[];
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  addLead: (leadData: Omit<Lead, 'id' | 'entryDate' | 'status' | 'color' | 'channels' | 'lastMsg'>) => void;
  updatePipelineStages: (newStages: PipelineStage[]) => void;
  dbStatus: boolean;
};

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLeads must be used within a LeadProvider");
  return context;
};

export const LeadProvider = ({ children }: { children: ReactNode }) => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(INITIAL_PIPELINE_STAGES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState(false);

  useEffect(() => {
    const fetchDatabase = async () => {
      // Se supabase=null (não achou chaves no .env), aborta silenciosamente e roda na memória usando os Iniciais.
      if (!supabase) return;

      try {
        const { data: dbStages, error: stagesError } = await supabase.from('pipeline_stages').select('*').order('position');
        const { data: dbLeads, error: leadsError } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

        if (!stagesError && !leadsError && dbStages && dbLeads) {
          setDbStatus(true);
          
          const mappedLeads = dbLeads.map(l => ({
            id: l.id,
            name: l.name,
            email: l.email || '',
            phone: l.phone || '',
            cpfCnpj: l.cpf_cnpj || '',
            value: `R$ ${(l.value || 0).toLocaleString('pt-BR')}`,
            pipelineStage: l.stage_id,
            tags: ['Banco Dados'],
            channels: ['whatsapp'],
            status: 'Ativo',
            color: '#3b82f6',
            lastMsg: 'Hoje',
            entryDate: new Date(l.created_at).toLocaleDateString('pt-BR')
          }));

          setLeads(mappedLeads);
          
          if (dbStages.length > 0) {
            const mappedStages = dbStages.map(s => ({
              id: s.id,
              name: s.name,
              color: s.color,
              leads: mappedLeads.filter((l:any) => l.pipelineStage === s.id).map((l:any) => l.id)
            }));
            setPipelineStages(mappedStages);
          }
        }
      } catch (err) {
        console.error('Falha de conexão:', err);
      }
    };
    
    fetchDatabase();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addLead = async (leadData: Omit<Lead, 'id' | 'entryDate' | 'status' | 'color' | 'channels' | 'lastMsg'>) => {
    // Tentar mandar direto pro Database Nuvem
    if (supabase && dbStatus) {
      const numericVal = parseFloat((leadData.value || '0').replace(/[^0-9,-]+/g,"").replace(",",".") || "0");
      const { data, error } = await supabase.from('leads').insert([{
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        cpf_cnpj: leadData.cpfCnpj,
        value: numericVal,
        stage_id: leadData.pipelineStage
      }]).select();

      if (data && data.length > 0) {
        const l = data[0];
        const newLead: Lead = {
          ...leadData,
          id: l.id,
          entryDate: new Date(l.created_at).toLocaleDateString('pt-BR'),
          status: 'Ativo', color: '#10b981', channels: ['whatsapp'], lastMsg: 'Agora mesmo'
        };
        setLeads(prev => [newLead, ...prev]);
        setPipelineStages(prev => prev.map(s => s.id === newLead.pipelineStage ? { ...s, leads: [newLead.id, ...s.leads] } : s));
        return;
      }
    }

    // Se falhar ou estiver deslogado, vai salvar no Front-End Offline local!
    const newLeadId = `lead-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('pt-BR');
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newLead: Lead = {
      ...leadData,
      id: newLeadId,
      entryDate: dateStr,
      status: 'Ativo',
      color: randomColor,
      channels: ['whatsapp'], 
      lastMsg: 'Agora mesmo'
    };

    setLeads(prev => [newLead, ...prev]);
    setPipelineStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id === leadData.pipelineStage) return { ...stage, leads: [newLeadId, ...stage.leads] };
        return stage;
      })
    );
  };

  const updatePipelineStages = async (newStages: PipelineStage[]) => {
    if (supabase && dbStatus) {
      let movedLeadId = null;
      let newStageId = null;

      for (const newStage of newStages) {
        const oldStage = pipelineStages.find(s => s.id === newStage.id);
        if (oldStage) {
          const addedLeads = newStage.leads.filter(id => !oldStage.leads.includes(id));
          if (addedLeads.length > 0) {
            movedLeadId = addedLeads[0];
            newStageId = newStage.id;
            break;
          }
        }
      }

      if (movedLeadId && newStageId && !movedLeadId.startsWith('lead-')) {
        await supabase.from('leads').update({ stage_id: newStageId }).eq('id', movedLeadId);
      }
    }
    
    setPipelineStages(newStages);
  };

  return (
    <LeadContext.Provider value={{
      leads,
      pipelineStages,
      isModalOpen,
      openModal,
      closeModal,
      addLead,
      updatePipelineStages,
      dbStatus
    }}>
      {children}
    </LeadContext.Provider>
  );
};
