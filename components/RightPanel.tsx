
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ChevronRight, Briefcase, Mic, Sparkles } from 'lucide-react';
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
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Limited to 2 primary suggestions as requested
  const buzzSuggestions = isPro 
    ? ["Resolve calendar conflicts", "Analyze performance"]
    : ["What's buzzing today?", "Set nectar importance"];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string = input) => {
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

    const responseText = await geminiService.sendMessage(userMessage.content, history, personality);

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      content: responseText,
      sender: 'bot',
      timestamp: new Date().toISOString(),
    }]);
    setIsLoading(false);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage("Schedule a nectar break for 3 PM");
      }, 3000);
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 h-full transition-colors bg-white dark:bg-[#0f172a] border-l border-slate-100 dark:border-slate-800">
        <button onClick={onToggle} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500 mb-6 transition-colors">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <div className="flex-1 flex flex-col gap-4 w-full items-center">
          <button className={`w-10 h-10 ${isPro ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-600'} rounded-xl flex items-center justify-center transition-all shadow-sm`}>
            {isPro ? <Briefcase size={20} /> : <Bot size={20} />}
          </button>
        </div>
        <div className="mt-auto pb-4">
           <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700`}>
              <User size={18} className={isPro ? "text-slate-400" : "text-amber-500"} />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative transition-colors bg-white dark:bg-[#0f172a]">
      <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 z-10">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${isPro ? 'bg-slate-900 text-white' : 'bg-amber-100 text-amber-600 shadow-sm shadow-amber-200/50'} rounded-full flex items-center justify-center`}>
            {isPro ? <Briefcase className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
              {isPro ? 'Task Intelligence' : 'Calabi'}
            </h3>
          </div>
        </div>
        <button onClick={onToggle} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <ChevronRight size={18} />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-48 bg-white dark:bg-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'bot' ? (isPro ? 'bg-slate-900 text-white' : 'bg-amber-400 text-white') : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              {msg.sender === 'bot' ? (isPro ? 'AI' : <Bot size={16}/>) : <User size={16}/>}
            </div>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm transition-transform ${intensity === 'high' ? 'hover:scale-[1.01]' : ''} ${
              msg.sender === 'bot' 
                ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700' 
                : (isPro ? 'bg-slate-800 text-white' : 'bg-amber-500 text-white shadow-md shadow-amber-200/20')
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
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
              <Loader2 size={16} className="animate-spin text-slate-300"/>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-10 space-y-3">
        <div className="flex flex-col gap-2">
          {buzzSuggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => handleSendMessage(s)}
              className="w-full text-left px-3 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2 group"
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center ${isPro ? 'bg-slate-200 dark:bg-slate-700' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                <Sparkles size={10} className={isPro ? 'text-slate-500' : 'text-amber-500'} />
              </div>
              <span className="flex-1">{s}</span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-400" />
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-2 rounded-xl p-1.5 border shadow-sm transition-all bg-slate-50 dark:bg-slate-800 ${
          isPro ? 'border-slate-200 focus-within:border-slate-400' : 'border-amber-100 focus-within:border-amber-400'
        }`}>
          <button 
            onClick={toggleVoice}
            className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            <Mic size={18} />
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            placeholder={isPro ? "Command..." : "Ask Calabi..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 px-2 resize-none outline-none dark:text-slate-100 text-slate-900 placeholder-slate-400"
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md ${
              isPro ? 'bg-slate-900 text-white' : 'bg-amber-400 text-white hover:bg-amber-500'
            }`}
          >
            <Send size={18} className={isPro ? "text-white" : "text-slate-900"} />
          </button>
        </div>
      </div>
    </div>
  );
};
