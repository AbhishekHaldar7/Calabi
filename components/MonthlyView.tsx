
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Calendar as CalendarIcon, 
  Settings, X, Moon, Sun, 
  ChevronLeft, ChevronRight, User, 
  UserRound, Clock, Bell, Shield, 
  LogOut, Mic2, MessageSquareText
} from 'lucide-react';
import { PersonalityType, ClockFormat, IntensityType, VoiceType, VerbosityType } from '../App';
import { WeeklyView } from './WeeklyView';
import { TaskEntryModal } from './TaskEntryModal';

interface CalendarViewProps {
  personality: PersonalityType;
  setPersonality: (p: PersonalityType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  clockFormat: ClockFormat;
  setClockFormat: (v: ClockFormat) => void;
  intensity: IntensityType;
  setIntensity: (v: IntensityType) => void;
  voice: VoiceType;
  setVoice: (v: VoiceType) => void;
  verbosity: VerbosityType;
  setVerbosity: (v: VerbosityType) => void;
}

export const MonthlyView: React.FC<CalendarViewProps> = ({ 
  personality, setPersonality, isDarkMode, setIsDarkMode, clockFormat, setClockFormat, intensity, setIntensity,
  voice, setVoice, verbosity, setVerbosity
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isPro = personality === 'pro';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setShowSettings(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeMonth = (offset: number) => {
    setViewDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + offset); return d; });
  };

  return (
    <div className={`flex flex-col h-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className={`px-6 py-4 border-b flex items-center justify-between shrink-0 z-50 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl transition-colors ${isPro ? 'bg-indigo-500/10' : 'bg-amber-50'}`}>
            <CalendarIcon className={isPro ? 'text-indigo-400' : 'text-amber-500'} size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEntryModalOpen(true)} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center shadow-lg ${isPro ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-amber-400 text-white shadow-amber-200/50'}`}
          >
            <Plus size={16} className="mr-2" /> New Entry
          </button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Settings Toggle */}
          <div className="relative" ref={settingsRef}>
            <button 
              onClick={() => { setShowSettings(!showSettings); setShowProfile(false); }}
              className={`p-2 rounded-xl transition-all ${showSettings ? (isPro ? 'bg-indigo-500 text-white' : 'bg-amber-400 text-white') : (isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100')}`}
            >
              <Settings size={20} />
            </button>

            {showSettings && (
              <div className={`absolute right-0 top-full mt-2 w-80 p-5 rounded-3xl border shadow-2xl z-[100] animate-in fade-in zoom-in-95 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Calabi Tuning</h4>
                  <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                  </button>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase opacity-40">Personality Matrix</span>
                    <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl gap-1">
                      {(['cheerful', 'pro'] as PersonalityType[]).map(p => (
                        <button 
                          key={p} 
                          onClick={() => setPersonality(p)}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${personality === p ? (isPro ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-white') : 'text-slate-400'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase opacity-40 flex items-center gap-1">
                      <Mic2 size={10} /> Vocal Profile
                    </span>
                    <div className="grid grid-cols-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl gap-1">
                      {(['Zephyr', 'Kore', 'Puck', 'Fenrir'] as VoiceType[]).map(v => (
                        <button 
                          key={v} 
                          onClick={() => setVoice(v)}
                          className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${voice === v ? (isPro ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-white') : 'text-slate-400'}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase opacity-40 flex items-center gap-1">
                      <MessageSquareText size={10} /> Response Depth
                    </span>
                    <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl gap-1">
                      {(['blunt', 'detailed'] as VerbosityType[]).map(v => (
                        <button 
                          key={v} 
                          onClick={() => setVerbosity(v)}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${verbosity === v ? (isPro ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-white') : 'text-slate-400'}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase opacity-40">Time Protocol</span>
                    <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl gap-1">
                      {(['12h', '24h'] as ClockFormat[]).map(f => (
                        <button 
                          key={f} 
                          onClick={() => setClockFormat(f)}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${clockFormat === f ? (isPro ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-white') : 'text-slate-400'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Toggle */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => { setShowProfile(!showProfile); setShowSettings(false); }}
              className={`flex items-center gap-2 p-1 pr-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isPro ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-amber-400 text-white shadow-amber-200/50'}`}>
                {isPro ? <UserRound size={16} /> : <User size={16} />}
              </div>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Queen Bee</span>
            </button>

            {showProfile && (
              <div className={`absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl border shadow-2xl z-[100] animate-in slide-in-from-top-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="p-3 border-b border-slate-700/50 mb-2">
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-50">Account Status</p>
                  <p className="text-xs font-bold">Queen Administrator</p>
                </div>
                <button className={`w-full flex items-center gap-3 p-2 rounded-xl text-xs transition-all ${isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Bell size={14} /> Alerts
                </button>
                <button className={`w-full flex items-center gap-3 p-2 rounded-xl text-xs transition-all ${isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Shield size={14} /> Security
                </button>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1 mx-2" />
                <button className="w-full flex items-center gap-3 p-2 rounded-xl text-xs text-red-500 hover:bg-red-500/10 transition-all">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar">
        <section className={`rounded-3xl border overflow-hidden transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
           <div className={`p-4 border-b flex justify-between items-center transition-colors ${isDarkMode ? 'bg-slate-800/40' : 'bg-slate-50/50'}`}>
             <h3 className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-amber-600'}`}>Weekly Horizon</h3>
             <div className="flex gap-2">
                <button onClick={() => changeMonth(-1)} className={`p-1.5 rounded-lg border transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`}><ChevronLeft size={16}/></button>
                <button onClick={() => changeMonth(1)} className={`p-1.5 rounded-lg border transition-colors ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`}><ChevronRight size={16}/></button>
             </div>
           </div>
           <div className="h-[400px]">
             <WeeklyView personality={personality} isDarkMode={isDarkMode} clockFormat={clockFormat} intensity={intensity} />
           </div>
        </section>

        <section className="grid grid-cols-7 gap-2 pb-10">
           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
             <div key={d} className="pb-2 text-center text-[10px] font-black uppercase tracking-widest opacity-40">{d}</div>
           ))}
           {Array.from({length: 31}).map((_, i) => (
             <div key={i} className={`min-h-[100px] p-3 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-50 hover:border-amber-200 shadow-sm'}`}>
                <span className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>{i + 1}</span>
             </div>
           ))}
        </section>
      </div>

      <TaskEntryModal isOpen={isEntryModalOpen} onClose={() => setIsEntryModalOpen(false)} onSave={(t) => console.log(t)} personality={personality} />
    </div>
  );
};
