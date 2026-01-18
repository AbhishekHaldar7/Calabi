
import React, { useState, useEffect } from 'react';
import { Timer, X, CheckCircle } from 'lucide-react';

interface TimerHeaderProps {
  taskTitle: string;
  duration: number; // in seconds
  onComplete: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
  isPro: boolean;
}

export const TimerHeader: React.FC<TimerHeaderProps> = ({ taskTitle, duration, onComplete, onCancel, isDarkMode, isPro }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transform transition-all duration-500 animate-in slide-in-from-top ${
      isPro ? 'bg-slate-900 text-white' : 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-200/50'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className={`p-2 rounded-lg ${isPro ? 'bg-white/10' : 'bg-white/30'}`}>
            <Timer className={timeLeft < 10 ? 'animate-ping' : ''} size={24} />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Focusing on</p>
            <h2 className="text-xl font-bold truncate leading-tight">{taskTitle}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-3xl font-black font-mono">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <button onClick={onCancel} className={`p-2 rounded-full hover:bg-black/10 transition-colors`}>
            <X size={20} />
          </button>
        </div>
      </div>
      <div className="h-1 bg-black/10 w-full">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-linear" 
          style={{ width: `${(timeLeft / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};
