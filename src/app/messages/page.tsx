"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  MoreVertical, 
  MessageSquare, 
  Image as ImageIcon,
  Paperclip,
  Smile,
  Mic,
  Send,
  Info,
  ChevronLeft,
  X,
  Play,
  Pause,
  Pencil,
  FileText,
  BookOpen,
  History,
  Trash2,
  UserRound,
  Mail,
  Camera,
  MessageCircle,
  Share2,
  Hash
} from 'lucide-react';
import { useLeads } from '@/context/LeadContext';
import { useAuth } from '@/context/AuthContext';
import styles from './messages.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { sendWhatsApp } from '@/lib/zapi';

// Mock Lists
const QUICK_MESSAGES = [
  "Olá! Como posso te ajudar hoje?",
  "Um momento, estou verificando seu pedido.",
  "Proposta enviada! Por favor, dê uma olhada no seu e-mail.",
  "Pode me confirmar o seu CPF para continuarmos?",
  "Obrigado por aguardar! O processo foi finalizado.",
];

const META_TEMPLATES = [
  { id: 'welcome', name: "Boas-vindas (Official)", text: "Olá {{1}}, bem-vindo à Vórtice! Em que podemos ajudar hoje?" },
  { id: 'followup', name: "Follow-up", text: "Oi {{1}}, notamos seu interesse. Tem alguma dúvida pendente?" },
  { id: 'confirm', name: "Confirmação de Agendamento", text: "Seu agendamento para {{1}} está confirmado!" },
];

const EMOJIS = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];

const INITIAL_MESSAGES: Record<string, any[]> = {
  'lead-1': [
    { id: 1, type: 'text', text: 'Olá Mário! Já avaliou a proposta?', sent: true, time: '14:15' },
    { id: 2, type: 'text', text: 'Oi! Estou vendo agora.', sent: false, time: '14:18' },
    { id: 3, type: 'text', text: 'Ok, fechado! Mandarei os dados.', sent: false, time: '14:20' }
  ],
  'lead-2': [
    { id: 1, type: 'text', text: 'Pode me explicar como funciona a escala?', sent: false, time: '13:05' }
  ]
};

const AudioPlayer = ({ url, duration }: { url: string; duration?: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.whatsappAudio}>
      <audio ref={audioRef} src={url} />
      <div className={styles.audioRow}>
        <div className={styles.audioControls}>
          <button className={styles.playBtn} onClick={togglePlay}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <div className={styles.audioTrack}>
            <div className={styles.audioProgress} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <MoreVertical size={16} opacity={0.5} />
      </div>
      <span style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: '8px' }}>
        {isPlaying ? `0:${Math.floor(audioRef.current?.currentTime || 0).toString().padStart(2, '0')}` : '0:00'} / 
        {`0:${(duration || 5).toString().padStart(2, '0')}`}
      </span>
    </div>
  );
};

function MessagesContent() {
  const { leads, updateLead, pipelineStages } = useLeads();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId');

  const [activeTab, setActiveTab] = useState('Minhas Conversas');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId);
  const [inputText, setInputText] = useState('');
  
  const [chatHistories, setChatHistories] = useState(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Popover States
  const [showEmoji, setShowEmoji] = useState(false);
  const [showQuickMsgs, setShowQuickMsgs] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [useSignature, setUseSignature] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('WhatsApp');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', email: '', phone: '', value: '0.00', stage: '' 
  });


  // Audio States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const TABS = ['Minhas Conversas', 'Aguardando', 'Grupos'];

  const MOCK_CHATS = useMemo(() => {
    return leads.map((lead, i) => {
      const assignedTab = i % 3 === 0 ? 'Aguardando' : (i % 5 === 0 ? 'Grupos' : 'Minhas Conversas');
      return {
        id: lead.id,
        name: lead.name,
        text: lead.lastMsg || 'Iniciar conversa...',
        time: lead.entryDate,
        unread: i % 4 === 0 ? 1 : 0,
        type: assignedTab,
        color: lead.color || '#3b82f6',
        avatar: lead.name.slice(0, 2).toUpperCase()
      };
    });
  }, [leads]);

  const filteredChats = useMemo(() => {
    return MOCK_CHATS.filter(chat => 
      (chat.type === activeTab || selectedChatId === chat.id) && 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [MOCK_CHATS, activeTab, selectedChatId, searchQuery]);

  const selectedChat = useMemo(() => {
    return MOCK_CHATS.find(c => c.id === selectedChatId);
  }, [MOCK_CHATS, selectedChatId]);

  // Update edit form when chat changes or info opens
  useEffect(() => {
    const leadData = leads.find(l => l.id === selectedChatId);
    if (leadData) {
      setEditForm({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        value: leadData.value?.replace('R$ ', '') || '0,00',
        stage: leadData.pipelineStage
      });
    }
  }, [selectedChatId, leads, showInfo]);

  const currentStageName = pipelineStages.find(s => s.id === editForm.stage)?.name || 'Sem Estágio';

  useEffect(() => {
    if (initialChatId) {
      setSelectedChatId(initialChatId);
      const chatTarget = MOCK_CHATS.find(c => c.id === initialChatId);
      if (chatTarget && chatTarget.type !== activeTab) {
        setActiveTab(chatTarget.type);
      }
    }
  }, [initialChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, selectedChatId, isRecording]);

  const handleSendMessage = (textToOverride?: string) => {
    let finalMsg = textToOverride || inputText;
    if (!finalMsg.trim() || !selectedChatId) return;

    // Append Signature if enabled and not already present
    if (useSignature && user) {
      const signature = `\n- ${user.name}`;
      if (!finalMsg.includes(signature)) {
        finalMsg = finalMsg.trim() + signature;
      }
    }

    const newMessage = {
      id: Date.now(),
      type: 'text',
      text: finalMsg,
      sent: true,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistories(prev => {
      const currentMessages = prev[selectedChatId] || [];
      return { ...prev, [selectedChatId]: [...currentMessages, newMessage] };
    });

    const targetLead = leads.find(l => l.id === selectedChatId);
    if (targetLead && targetLead.phone) {
       sendWhatsApp(targetLead.phone, finalMsg).then(res => {
         if (!res?.success) {
           console.error('Falha ao enviar via Z-API:', res?.error);
         }
       });
    }

    setInputText('');
    setShowEmoji(false);
    setShowQuickMsgs(false);
    setShowTemplates(false);
  };

  const toggleSignature = () => {
    setUseSignature(!useSignature);
  };

  const insertEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  const useQuickMsg = (msg: string) => {
    setInputText(msg);
    setShowQuickMsgs(false);
  };

  const useTemplate = (tpl: any) => {
    // Basic placeholder replacement for demo
    const parsedText = tpl.text.replace('{{1}}', selectedChat?.name || 'Cliente');
    setInputText(parsedText);
    setShowTemplates(false);
  };

  const startRecording = async () => {
    if (!selectedChatId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        if (!(mediaRecorderRef.current as any)?.hasCanceled) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const newAudioMessage = {
            id: Date.now(), type: 'audio', audioUrl: audioUrl, sent: true, duration: recordingTime,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };
          setChatHistories(prev => {
            const currentMessages = prev[selectedChatId] || [];
            return { ...prev, [selectedChatId]: [...currentMessages, newAudioMessage] };
          });
        }
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setTimeout(() => drawWaveform(), 50);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      alert("Erro ao acessar o microfone.");
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = Math.ceil((canvas.width / bufferLength) * 2.5);
      let barHeight;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * (canvas.height - 4) + 3;
        ctx.fillStyle = i < (bufferLength / 2) ? '#ef4444' : '#f87171';
        const y = (canvas.height - barHeight) / 2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, barWidth - 2, barHeight, 2);
        else ctx.rect(x, y, barWidth - 2, barHeight);
        ctx.fill();
        x += barWidth;
      }
    };
    draw();
  };

  const stopRecording = (cancel = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    if (mediaRecorderRef.current && isRecording) {
      if (cancel) (mediaRecorderRef.current as any).hasCanceled = true; 
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeMessages = selectedChatId ? (chatHistories[selectedChatId] || []) : [];

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={`${styles.sidebar} ${selectedChatId ? styles.hiddenOnMobile : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.searchBar}>
            <Search size={18} style={{ opacity: 0.5 }} />
            <input type="text" placeholder="Pesquisar conversa ou contato..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button key={tab} className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </div>
        </div>
        <div className={styles.chatList}>
          {filteredChats.map(chat => {
            const msgs = chatHistories[chat.id];
            const hasMessages = msgs && msgs.length > 0;
            const lastMsgText = hasMessages ? (msgs[msgs.length - 1].type === 'audio' ? '🎵 Áudio' : msgs[msgs.length - 1].text) : chat.text;
            return (
              <div key={chat.id} className={`${styles.chatItem} ${selectedChatId === chat.id ? styles.activeChat : ''}`} onClick={() => setSelectedChatId(chat.id)}>
                <div className={styles.avatar} style={{ background: chat.color }}>{chat.avatar}</div>
                <div className={styles.chatInfo}>
                  <div className={styles.chatHeader}><span className={styles.chatName}>{chat.name}</span><span className={styles.chatTime}>{hasMessages ? msgs[msgs.length - 1].time : chat.time}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className={styles.chatPreview}>{lastMsgText}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAT PANEL */}
      <div className={`${styles.mainChat} ${!selectedChatId ? styles.hiddenOnMobile : ''}`}>
        {selectedChatId && selectedChat ? (
          <>
            <div className={styles.chatHeaderMain}>
              <div className={styles.chatHeaderUser}>
                <button className="sm:hidden" style={{ background: 'none', border: 'none', color: 'var(--foreground)' }} onClick={() => setSelectedChatId(null)}><ChevronLeft size={24} /></button>
                <div className={styles.avatar} style={{ background: selectedChat.color, width: 40, height: 40, fontSize: '1rem' }}>{selectedChat.avatar}</div>
                <div><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{selectedChat.name}</h3><span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Online agora</span></div>
              </div>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--foreground)', opacity: 0.7 }}>
                <button className={styles.actionBtn} onClick={() => setShowInfo(!showInfo)}><Info size={20} /></button>
              </div>
            </div>

            <div className={styles.messagesArea}>
               {activeMessages.map(msg => (
                <div key={msg.id} className={`${styles.message} ${msg.sent ? styles.sent : styles.received}`}>
                  {msg.type === 'text' && <span>{msg.text}</span>}
                  {msg.type === 'audio' && <AudioPlayer url={msg.audioUrl} duration={msg.duration} />}
                  <div className={styles.msgFooter}>
                    <span className={styles.msgTime}>{msg.time}</span>
                    {msg.sent && (
                      <div className={styles.checks}>
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 1L5.375 10L1 5.90909" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11 1L5.375 6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} style={{ height: 1 }} />
            </div>

            {/* BARRA DE MENSAGENS PREMIUM */}
            <div className={styles.premiumInputArea}>
              <div className={styles.inputContainer}>
                {isRecording ? (
                  <div className={styles.recordingOverlay}>
                    <div className={styles.recordingPulse}></div>
                    <span className={styles.timeLabel}>{recordingTime}s</span>
                    <canvas ref={canvasRef} width={120} height={30} />
                    <button className={styles.cancelRecBtn} onClick={() => stopRecording(true)}><Trash2 size={20} /></button>
                    <button className={styles.confirmRecBtn} onClick={() => stopRecording(false)}><Send size={18} /></button>
                  </div>
                ) : (
                  <>
                    <button className={styles.actionBtn} title="Anexar Arquivo"><Paperclip size={22} /></button>
                    
                    <div className={styles.textareaWrapper}>
                      <textarea 
                        rows={1}
                        placeholder="Digite sua mensagem..." 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={styles.pInput}
                      />
                    </div>

                    <div className={styles.tools}>
                      {/* Emoji Popover */}
                      <div className={styles.popoverWrapper}>
                        <button className={styles.actionBtn} onClick={() => setShowEmoji(!showEmoji)} title="Emojis"><Smile size={22} /></button>
                        <AnimatePresence>
                          {showEmoji && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={styles.popover}>
                              <div className={styles.emojiGrid}>
                                {EMOJIS.slice(0, 32).map(e => <button key={e} onClick={() => insertEmoji(e)}>{e}</button>)}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button className={`${styles.actionBtn} ${useSignature ? styles.activeTool : ''}`} onClick={toggleSignature} title="Ativar/Desativar Assinatura"><Pencil size={22} /></button>
                      
                      {/* Quick Messages Popover */}
                      <div className={styles.popoverWrapper}>
                        <button className={styles.actionBtn} onClick={() => setShowQuickMsgs(!showQuickMsgs)} title="Mensagens Rápidas"><FileText size={22} /></button>
                        <AnimatePresence>
                          {showQuickMsgs && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={styles.popoverList}>
                              <h4>Mensagens Rápidas</h4>
                              {QUICK_MESSAGES.map(m => <button key={m} onClick={() => useQuickMsg(m)}>{m}</button>)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Meta Templates Popover */}
                      <div className={styles.popoverWrapper}>
                        <button className={styles.actionBtn} onClick={() => setShowTemplates(!showTemplates)} title="Templates Meta Business"><BookOpen size={22} /></button>
                        <AnimatePresence>
                          {showTemplates && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={styles.popoverList}>
                              <h4>Templates Meta (Oficial)</h4>
                              {META_TEMPLATES.map(t => <button key={t.id} onClick={() => useTemplate(t)}><strong>{t.name}</strong><span>{t.text.slice(0, 30)}...</span></button>)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button 
                        className={inputText.trim() ? styles.sendBtnMain : styles.micBtnMain}
                        onClick={inputText.trim() ? () => handleSendMessage() : startRecording}
                      >
                        {inputText.trim() ? <Send size={20} /> : <Mic size={22} />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* INFO DRAWER */}
            <AnimatePresence>
              {showInfo && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.drawerOverlay}
                    onClick={() => setShowInfo(false)}
                  />
                  <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={styles.infoDrawer}
                  >
                    <div className={styles.drawerHeader}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{isEditing ? 'Editar Lead' : 'Dados do Lead'}</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!isEditing && (
                          <button className={styles.actionBtn} onClick={() => setIsEditing(true)} title="Editar dados"><Pencil size={18} /></button>
                        )}
                        <button className={styles.actionBtn} onClick={() => { setShowInfo(false); setIsEditing(false); }}><X size={20} /></button>
                      </div>
                    </div>

                    <div className={styles.drawerContent}>
                      <div className={styles.profileSection}>
                        <div className={styles.avatar} style={{ background: selectedChat.color, width: 80, height: 80, fontSize: '2rem' }}>
                          {selectedChat.avatar}
                        </div>
                        {isEditing ? (
                          <div style={{ width: '100%', marginTop: '12px' }}>
                            <input 
                              className={styles.infoInput} 
                              value={editForm.name} 
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              placeholder="Nome do Lead"
                            />
                          </div>
                        ) : (
                          <>
                            <h2 style={{ margin: '8px 0 4px 0', fontSize: '1.4rem' }}>{selectedChat.name}</h2>
                            <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 500 }}>Status: Ativo</span>
                          </>
                        )}
                        
                        {!isEditing && (
                          <div className={styles.profileStats}>
                            <div className={styles.statItem}>
                              <span className={styles.statLabel}>Mensagens</span>
                              <span className={styles.statValue}>142</span>
                            </div>
                            <div className={styles.statItem}>
                              <span className={styles.statLabel}>Desde</span>
                              <span className={styles.statValue}>12/03</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.section}>
                        <h4>Contato Principal</h4>
                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldLabel}><Mail size={12} style={{ marginRight: 4 }} /> E-mail</span>
                          {isEditing ? (
                            <input 
                              className={styles.infoInput} 
                              value={editForm.email} 
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              placeholder="email@exemplo.com"
                            />
                          ) : (
                            <span className={styles.fieldValue}>{editForm.email}</span>
                          )}
                        </div>
                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldLabel}><MessageCircle size={12} style={{ marginRight: 4 }} /> Telefone / WhatsApp</span>
                          {isEditing ? (
                            <input 
                              className={styles.infoInput} 
                              value={editForm.phone} 
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              placeholder="(00) 00000-0000"
                            />
                          ) : (
                            <span className={styles.fieldValue}>{editForm.phone}</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.section}>
                        <h4>Dados Comerciais</h4>
                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldLabel}><Hash size={12} style={{ marginRight: 4 }} /> Valor do Lead</span>
                          {isEditing ? (
                            <div style={{ position: 'relative' }}>
                              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.6 }}>R$</span>
                              <input 
                                className={styles.infoInput} 
                                style={{ paddingLeft: '32px' }}
                                value={editForm.value} 
                                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                placeholder="0,00"
                              />
                            </div>
                          ) : (
                            <span className={styles.fieldValue} style={{ color: '#059669', fontWeight: 600 }}>R$ {editForm.value}</span>
                          )}
                        </div>
                        <div className={styles.fieldGroup}>
                          <span className={styles.fieldLabel}><Share2 size={12} style={{ marginRight: 4 }} /> Estágio Kanban</span>
                          {isEditing ? (
                            <select 
                              className={styles.infoInput}
                              value={editForm.stage}
                              onChange={(e) => setEditForm({ ...editForm, stage: e.target.value })}
                            >
                              {pipelineStages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          ) : (
                            <span className={styles.fieldValue}>{currentStageName}</span>
                          )}
                        </div>
                      </div>

                      {!isEditing && (
                        <div className={styles.section}>
                          <h4>Canal de Atendimento</h4>
                          <div className={styles.channelSelector}>
                            {['WhatsApp', 'Instagram', 'Messenger', 'E-mail'].map(channel => (
                              <button 
                                key={channel} 
                                className={`${styles.channelBtn} ${selectedChannel === channel ? styles.active : ''}`}
                                onClick={() => setSelectedChannel(channel)}
                              >
                                {channel === 'WhatsApp' && <MessageCircle size={18} />}
                                {channel === 'Instagram' && <Camera size={18} />}
                                {channel === 'Messenger' && <MessageSquare size={18} />}
                                {channel === 'E-mail' && <Mail size={18} />}
                                <span>{channel}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={styles.actionPanel}>
                      {isEditing ? (
                        <>
                          <button className={styles.transferBtn} onClick={() => { 
                            if (selectedChatId) {
                              updateLead(selectedChatId, {
                                name: editForm.name,
                                email: editForm.email,
                                phone: editForm.phone,
                                value: editForm.value,
                                pipelineStage: editForm.stage
                              });
                            }
                            setIsEditing(false); 
                          }}>
                            Salvar Alterações
                          </button>
                          <button className={styles.secondaryBtn} onClick={() => setIsEditing(false)}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button className={styles.transferBtn} onClick={() => alert('Abrindo lista de atendentes...')}>
                          <Share2 size={18} />
                          Transferir Atendimento
                        </button>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '24px', borderRadius: '50%' }}><MessageSquare size={64} color="#3b82f6" /></div>
            <h2>Nenhuma conversa selecionada</h2>
            <p>Selecione um lead na barra lateral para abrir o chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Carregando mensagens...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
