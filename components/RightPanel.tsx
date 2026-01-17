
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ChevronRight, Briefcase } from 'lucide-react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';
import { PersonalityType, IntensityType } from '../App';

interface RightPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  personality: PersonalityType;
  intensity?: IntensityType;
}

export const RightPanel: React.FC<RightPanelProps> = ({ isCollapsed, onToggle, personality, intensity = 'high' }) => {
  const isPro = personality === 'pro';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: isPro 
        ? "Systems online. How can I assist with your schedule today?" 
        : "Buzz buzz! I'm Calabi. Ready to help you organize your hive!",
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
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

    const responseText = await geminiService.sendMessage(userMessage.content, history, personality);

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      content: responseText,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }]);
    setIsLoading(false);
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 h-full transition-colors bg-white dark:bg-[#0f172a]">
        <button onClick={onToggle} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 mb-6 transition-colors">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div className="flex-1 flex flex-col gap-4 w-full items-center">
          <button className={`w-10 h-10 ${isPro ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-600'} rounded-xl flex items-center justify-center transition-all shadow-sm`}>
            {isPro ? <Briefcase size={20} /> : <Bot size={20} />}
          </button>
        </div>
        <div className="mt-auto pb-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${isPro ? 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700' : 'bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800'}`}>
              <User size={18} className={isPro ? "text-slate-400" : "text-amber-600"} />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative transition-colors bg-white dark:bg-[#0f172a]">
      {/* Fixed Header: Pure White in Light Mode */}
      <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${isPro ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-600 shadow-sm shadow-amber-200/50'} rounded-full flex items-center justify-center`}>
            {isPro ? <Briefcase className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {isPro ? 'Task Intelligence' : 'Calabi Assistant'}
          </h3>
        </div>
        <button onClick={onToggle} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <ChevronRight size={18} />
        </button>
      </header>

      {/* Messages: White or Soft Grey BG */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 bg-slate-50/20 dark:bg-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'bot' ? (isPro ? 'bg-slate-900 text-white' : 'bg-amber-400 text-white') : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
              {msg.sender === 'bot' ? (isPro ? 'AI' : <Bot size={16}/>) : <User size={16}/>}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm transition-transform ${intensity === 'high' ? 'hover:scale-[1.01]' : ''} ${
              msg.sender === 'bot' 
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700' 
                : (isPro ? 'bg-slate-800 text-white' : 'bg-amber-500 text-white')
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 animate-pulse">
            <div className={`w-8 h-8 ${isPro ? 'bg-slate-100 dark:bg-slate-800' : 'bg-amber-100 text-amber-600'} rounded-full flex items-center justify-center`}>
              <Loader2 size={16} className="animate-spin"/>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700">
              <Loader2 size={16} className="animate-spin text-slate-300"/>
            </div>
          </div>
        )}
      </div>

      {/* Footer Area: Fixed Background and Button Colors */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800 backdrop-blur-md transition-colors">
        <div className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl p-2 border shadow-inner transition-all ${
          isPro ? 'focus-within:border-slate-400 dark:focus-within:border-slate-500' : 'focus-within:border-amber-400'
        }`}>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            placeholder={isPro ? "Input command..." : "Ask Calabi something..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 px-2 resize-none outline-none dark:text-slate-100 text-slate-900"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md ${
              isPro ? 'bg-slate-900 text-white' : 'bg-amber-400 text-slate-900'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
