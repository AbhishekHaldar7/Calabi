
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ChevronRight, Mic, UserRound, Volume2, Square, AlertCircle } from 'lucide-react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';
import { PersonalityType, IntensityType, VoiceType, VerbosityType } from '../App';
import { SuitSilhouette, BeeLogo } from './LeftPanel';

interface RightPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  personality: PersonalityType;
  intensity?: IntensityType;
  voice: VoiceType;
  verbosity: VerbosityType;
  isDarkMode: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({ 
  isCollapsed, onToggle, personality, intensity = 'high', voice, verbosity, isDarkMode 
}) => {
  const isPro = personality === 'pro';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: isPro 
        ? "Systems optimized. I am Calabi. How shall we refine your schedule today?" 
        : "Buzz buzz! I'm Calabi. Ready to help you organize your hive!",
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const hasApiKey = !!process.env.API_KEY;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string = input, shouldSpeak: boolean = false) => {
    const messageContent = text.trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    let location;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => 
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
      );
      location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch (e) {}

    const responseText = await geminiService.sendMessage(userMessage.content, history, personality, verbosity, location);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: responseText,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
    
    if (shouldSpeak && !responseText.includes("Authentication Error")) {
      playTTS(botMessage.content);
    }
  };

  const playTTS = async (text: string) => {
    const cleanText = text.split("**Sources:**")[0]; // Don't read out the URLs
    const base64Audio = await geminiService.generateSpeech(cleanText, personality, voice);
    if (!base64Audio) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          setIsLoading(true);
          const transcription = await geminiService.transcribeAudio(base64);
          if (transcription) {
            handleSendMessage(transcription, true);
          } else {
            setIsLoading(false);
          }
        };
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  if (isCollapsed) {
    return (
      <div className={`flex flex-col items-center py-4 h-full border-l transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <button onClick={onToggle} className="p-2 text-slate-500 mb-6 hover:text-indigo-500 transition-colors">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <button className={`w-10 h-10 ${isPro ? 'bg-indigo-600 text-white shadow-indigo-500/20 shadow-lg' : 'bg-white border border-slate-100 shadow-sm'} rounded-xl flex items-center justify-center active:scale-90 transition-all`}>
          {isPro ? <SuitSilhouette className="w-6 h-6 text-white" /> : <BeeLogo className="w-8 h-8" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
      <header className={`px-4 py-5 border-b flex items-center justify-between shrink-0 transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-white/80'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isPro ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 shadow-sm'} rounded-xl flex items-center justify-center`}>
            {isPro ? <SuitSilhouette className="h-7 w-7 text-white" /> : <BeeLogo className="h-9 w-9" />}
          </div>
          <h3 className={`text-sm font-bold leading-none ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Calabi
          </h3>
        </div>
        <button onClick={onToggle} className={`p-1.5 rounded-lg text-slate-400 transition-all ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
          <ChevronRight size={18} />
        </button>
      </header>

      {!hasApiKey && (
        <div className="m-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-bold text-red-500">API Key Required</p>
            <p className="text-[10px] text-red-400/80 mt-1">Please configure your Gemini API Key in the project environment to enable AI capabilities.</p>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-48 scroll-smooth custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-colors ${
              msg.sender === 'bot' 
                ? (isPro ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100') 
                : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')
            }`}>
              {msg.sender === 'bot' ? (isPro ? <SuitSilhouette className="w-5 h-5 text-white" /> : <BeeLogo className="w-7 h-7"/>) : <User size={16}/>}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm relative group transition-colors shadow-sm whitespace-pre-wrap ${
              msg.sender === 'bot' 
                ? (isDarkMode 
                    ? 'bg-slate-800 text-slate-200 border border-slate-700/50' 
                    : 'bg-slate-50 text-slate-800 border border-slate-200')
                : (isPro 
                    ? 'bg-indigo-600 text-white shadow-indigo-500/20' 
                    : 'bg-amber-500 text-white shadow-amber-200/50')
            }`}>
              {msg.sender === 'bot' && !msg.content.includes("Authentication Error") && (
                <button 
                  onClick={() => playTTS(msg.content)}
                  className={`absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-amber-500`}
                >
                  <Volume2 size={14} />
                </button>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 animate-pulse">
            <div className={`w-8 h-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white border border-slate-100'} rounded-lg flex items-center justify-center`}>
              {isPro ? <SuitSilhouette className="w-5 h-5 text-indigo-400 animate-pulse" /> : <BeeLogo className="w-6 h-6 animate-bounce opacity-50" />}
            </div>
            <div className={`rounded-2xl p-3 border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} style={{animationDelay: '0ms'}} />
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} style={{animationDelay: '150ms'}} />
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`} style={{animationDelay: '300ms'}} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 p-4 backdrop-blur-md border-t z-10 space-y-3 transition-colors ${
        isDarkMode ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]'
      }`}>
        <div className={`flex items-center gap-2 rounded-2xl p-1.5 border shadow-sm transition-all ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800 focus-within:border-indigo-500/50' 
            : 'bg-slate-50 border-amber-100 focus-within:border-amber-400/50'
        }`}>
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
          >
            {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage(input, false))}
            placeholder={isPro ? "Enter command..." : "Ask Calabi..."}
            className={`flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 resize-none outline-none placeholder-slate-400 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}
          />
          <button 
            onClick={() => handleSendMessage(input, false)}
            disabled={!input.trim() || isLoading || !hasApiKey}
            className={`p-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 ${
              isPro ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-amber-400 text-slate-900 hover:bg-amber-500'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
