"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  Phone,
  Video,
  Info,
  ChevronLeft,
  X,
  Play,
  Pause
} from 'lucide-react';
import { useLeads } from '@/context/LeadContext';
import styles from './messages.module.css';

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

const FALLBACK_MESSAGES = [
  { id: 1, type: 'text', text: 'Olá! Como posso ajudar?', sent: true, time: '09:00' }
];

function MessagesContent() {
  const { leads } = useLeads();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get('chatId');

  const [activeTab, setActiveTab] = useState('Minhas Conversas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set initial selected chat ID from the query param
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId);
  const [inputText, setInputText] = useState('');
  
  const [chatHistories, setChatHistories] = useState(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Estados e Refs de Áudio e Canvas
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

  // Convert global leads into a friendly format for chat
  const MOCK_CHATS = leads.map((lead, i) => {
    // Distribute randomly or logic-based to tabs for UI effect
    const assignedTab = i % 3 === 0 ? 'Aguardando' : (i % 5 === 0 ? 'Grupos' : 'Minhas Conversas');
    
    return {
      id: lead.id,
      name: lead.name,
      text: lead.lastMsg || 'Iniciar conversa...', // fallback preview if missing
      time: lead.entryDate,
      unread: i % 4 === 0 ? 1 : 0,
      type: assignedTab,
      color: lead.color || '#3b82f6',
      avatar: lead.name.slice(0, 2).toUpperCase()
    };
  });

  const filteredChats = MOCK_CHATS.filter(chat => 
    (chat.type === activeTab || selectedChatId === chat.id) && 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChat = MOCK_CHATS.find(c => c.id === selectedChatId);

  // Sync initialChat from url
  useEffect(() => {
    if (initialChatId) {
      setSelectedChatId(initialChatId);
      // Auto-switch tab if the requested chat is in a different tab
      const chatTarget = MOCK_CHATS.find(c => c.id === initialChatId);
      if (chatTarget && chatTarget.type !== activeTab) {
        setActiveTab(chatTarget.type);
      }
    }
  }, [initialChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistories, selectedChatId, isRecording]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;

    const newMessage = {
      id: Date.now(),
      type: 'text',
      text: inputText,
      sent: true,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistories(prev => {
      const currentMessages = prev[selectedChatId] || []; // default to empty if new
      return {
        ...prev,
        [selectedChatId]: [...currentMessages, newMessage]
      };
    });

    setInputText('');
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
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth - 2, barHeight, 2);
        } else {
          ctx.rect(x, y, barWidth - 2, barHeight);
        }
        ctx.fill();

        x += barWidth;
      }
    };

    draw();
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
            id: Date.now(),
            type: 'audio',
            audioUrl: audioUrl,
            sent: true,
            duration: recordingTime,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };

          setChatHistories(prev => {
            const currentMessages = prev[selectedChatId] || []; // default to empty if new
            return {
              ...prev,
              [selectedChatId]: [...currentMessages, newAudioMessage]
            };
          });
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      setTimeout(() => drawWaveform(), 50);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Erro ao acessar o microfone", err);
      alert("Permissão para o microfone foi negada ou o dispositivo não foi encontrado.");
    }
  };

  const stopRecording = (cancel = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close().catch(() => {});

    if (mediaRecorderRef.current && isRecording) {
      if (cancel) {
        (mediaRecorderRef.current as any).hasCanceled = true; 
      }
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeMessages = selectedChatId ? (chatHistories[selectedChatId] || []) : [];

  return (
    <div className={styles.container}>
      {/* SIDEBAR DE CONVERSAS */}
      <div className={`${styles.sidebar} ${selectedChatId ? styles.hiddenOnMobile : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.searchBar}>
            <Search size={18} style={{ opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Pesquisar conversa ou contato..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button 
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chatList}>
          {filteredChats.map(chat => {
            const msgs = chatHistories[chat.id];
            const hasMessages = msgs && msgs.length > 0;
            const lastMsgText = hasMessages
              ? (msgs[msgs.length - 1].type === 'audio' ? '🎵 Mensagem de Áudio' : msgs[msgs.length - 1].text)
              : chat.text;
            const lastMsgTime = hasMessages ? msgs[msgs.length - 1].time : chat.time;

            return (
              <div 
                key={chat.id} 
                className={`${styles.chatItem} ${selectedChatId === chat.id ? styles.activeChat : ''}`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <div className={styles.avatar} style={{ background: chat.color }}>
                  {chat.avatar}
                </div>
                <div className={styles.chatInfo}>
                  <div className={styles.chatHeader}>
                    <span className={styles.chatName}>{chat.name}</span>
                    <span className={styles.chatTime}>{lastMsgTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.chatPreview}>{lastMsgText}</span>
                    {chat.unread > 0 && (
                      <span style={{ background: '#25D366', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredChats.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>
              Nenhuma conversa encontrada.
            </div>
          )}
        </div>
      </div>

      {/* PAINEL PRINCIPAL DE CONVERSA */}
      <div className={`${styles.mainChat} ${!selectedChatId ? styles.hiddenOnMobile : ''}`}>
        {selectedChatId && selectedChat ? (
          <>
            <div className={styles.chatHeaderMain}>
              <div className={styles.chatHeaderUser}>
                <button 
                  className="sm:hidden" 
                  style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', display: 'flex' }}
                  onClick={() => setSelectedChatId(null)}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className={styles.avatar} style={{ background: selectedChat.color, width: 40, height: 40, fontSize: '1rem' }}>
                  {selectedChat.avatar}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{selectedChat.name}</h3>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Online agora</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', color: 'var(--foreground)', opacity: 0.7 }}>
                <Phone size={20} style={{ cursor: 'pointer' }} />
                <Video size={20} style={{ cursor: 'pointer' }} />
                <Info size={20} style={{ cursor: 'pointer' }} />
                <MoreVertical size={20} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            <div className={styles.messagesArea}>
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <span style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--foreground)' }}>
                  A conversa com {selectedChat.name} foi iniciada.
                </span>
              </div>
              {activeMessages.map(msg => (
                <div key={msg.id} className={`${styles.message} ${msg.sent ? styles.sent : styles.received}`}>
                  {msg.type === 'text' && <span>{msg.text}</span>}
                  
                  {msg.type === 'audio' && (
                     <audio controls src={msg.audioUrl} className={styles.nativeAudio} />
                  )}
                  
                  <span className={styles.msgTime} style={{ color: msg.sent ? 'rgba(255,255,255,0.8)' : '' }}>
                    {msg.time}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} style={{ height: 1 }} />
            </div>

            <div className={styles.inputArea}>
              {isRecording ? (
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 8px', gap: '8px' }}>
                  <div className={styles.recordingPulse}></div>
                  <span style={{ color: '#ef4444', fontWeight: 600, fontVariantNumeric: 'tabular-nums', width: '40px' }}>
                    {formatTime(recordingTime)}
                  </span>
                  
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <canvas ref={canvasRef} width={150} height={36} style={{ 
                      borderRadius: '18px', 
                      background: 'rgba(239, 68, 68, 0.05)',
                      padding: '0 8px' 
                    }} />
                  </div>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                    <button className={styles.attachBtn} onClick={() => stopRecording(true)} title="Cancelar Áudio">
                      <X size={24} />
                    </button>
                    <button className={styles.sendBtn} onClick={() => stopRecording(false)} title="Enviar Áudio">
                      <Send size={18} style={{ transform: 'translateX(2px)' }} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button className={styles.emojiBtn}><Smile size={24} /></button>
                  <button className={styles.attachBtn}><Paperclip size={24} /></button>
                  <div className={styles.inputWrapper}>
                    <input 
                      type="text" 
                      placeholder="Digite uma mensagem..." 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  {inputText.trim() ? (
                    <button className={styles.sendBtn} onClick={handleSendMessage} title="Enviar Mensagem">
                      <Send size={18} style={{ transform: 'translateX(2px)' }} />
                    </button>
                  ) : (
                    <button className={styles.micBtn} onClick={startRecording} title="Gravar Áudio">
                      <Mic size={24} color="#3b82f6" />
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '24px', borderRadius: '50%' }}>
              <MessageSquare size={64} color="#3b82f6" />
            </div>
            <h2>Nenhuma conversa selecionada</h2>
            <p>Selecione um lead na barra lateral para abrir o chat completo.</p>
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
