
import React, { useState } from 'react';
import { 
  Plus, Calendar as CalendarIcon, 
  Settings, X, Zap, Moon, Sun, Clock as ClockIcon
} from 'lucide-react';
import { PersonalityType, ClockFormat, IntensityType } from '../App';
import { WeeklyView } from './WeeklyView';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

interface CalendarViewProps {
  personality: PersonalityType;
  setPersonality: (p: PersonalityType) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  clockFormat: ClockFormat;
  setClockFormat: (v: ClockFormat) => void;
  intensity: IntensityType;
  setIntensity: (v: IntensityType) => void;
}

export const MonthlyView: React.FC<CalendarViewProps> = ({ 
  personality, 
  setPersonality,
  isDarkMode,
  setIsDarkMode,
  clockFormat,
  setClockFormat,
  intensity,
  setIntensity
}) => {
  const [currentDate] = useState(new Date());
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const isPro = personality === 'pro';
  const primaryColor = isPro ? 'bg-slate-800' : 'bg-amber-400';

  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      <header className={`p-4 border-b flex items-center justify-between shrink-0 z-10 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <CalendarIcon className={isPro ? (isDarkMode ? 'text-slate-100' : 'text-slate-800') : 'text-amber-500'} size={20} />
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {monthName} {year}
          </h2>
        </div>

        <div className="flex items-center gap-3">
           <div className={`flex items-center gap-2 border-l pl-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
             <button 
               className={`${primaryColor} ${isPro ? 'text-white shadow-slate-900/20' : 'text-slate-900 shadow-amber-500/20'} px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all shadow-md active:scale-95`}
             >
               <Plus size={16}/> New Event
             </button>
             <button onClick={() => setIsSettingsModalOpen(true)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
               <Settings size={18} />
             </button>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-12">
        <section className={`border-b shrink-0 transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`px-6 py-3 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800 bg-slate-800/20' : 'border-slate-100 bg-slate-50/50'}`}>
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Week Schedule</h3>
            <span className={`text-[10px] font-bold ${isPro ? (isDarkMode ? 'text-slate-500' : 'text-slate-400') : 'text-amber-600 opacity-60'}`}>Week 42 • Today</span>
          </div>
          <div className="h-[420px] overflow-hidden">
            <WeeklyView 
              personality={personality} 
              isEmbedded={true} 
              clockFormat={clockFormat}
              isDarkMode={isDarkMode}
              intensity={intensity}
            />
          </div>
        </section>

        <section className={`p-6 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50/30'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Monthly Planner</h3>
            </div>
            <div className={`p-6 rounded-3xl border shadow-sm transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className={`grid grid-cols-7 gap-px border rounded-2xl overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-800' : 'bg-slate-200 border-slate-200 shadow-inner'}`}>
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                   <div key={d} className={`py-3 text-center text-[10px] font-black uppercase border-b transition-colors ${isDarkMode ? 'bg-slate-800/50 text-slate-500 border-slate-800' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                     {d}
                   </div>
                 ))}
                 {Array.from({ length: 31 }, (_, i) => (
                    <div key={i} className={`min-h-[160px] p-3 group relative transition-colors cursor-pointer border-r border-b ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800' : 'bg-white hover:bg-slate-50 border-slate-100'} last:border-r-0`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold ${i+1 === 14 ? (isPro ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white') + ' w-6 h-6 flex items-center justify-center rounded-full' : 'text-amber-600') : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                          {i + 1}
                        </span>
                      </div>
                    </div>
                 ))}
                 {Array.from({ length: 4 }, (_, i) => (
                   <div key={`empty-${i}`} className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'} min-h-[160px]`}></div>
                 ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title={isPro ? "System Configuration" : "Hive Settings"}>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Personality</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setPersonality('cheerful')} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${personality === 'cheerful' ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                <span className="text-lg">🐝</span>
                <div className="text-left"><p className="text-xs font-bold text-slate-800 dark:text-slate-100">Cheerful</p><p className="text-[9px] text-slate-500 italic">Sweet & punny</p></div>
              </button>
              <button onClick={() => setPersonality('pro')} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${personality === 'pro' ? 'border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100' : 'border-slate-100 dark:border-slate-800'}`}>
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px]">💼</div>
                <div className="text-left"><p className="text-xs font-bold dark:text-slate-100">Worker Bee</p><p className="text-[9px] text-slate-500 italic">Direct & Pro</p></div>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Appearance & Time</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isDarkMode ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-800 shadow-sm'}`}>
                <span className="text-xs font-bold">{isDarkMode ? 'Dark' : 'Light'}</span>
                {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button onClick={() => setClockFormat(clockFormat === '12h' ? '24h' : '12h')} className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm`}>
                <span className="text-xs font-bold">{clockFormat.toUpperCase()}</span>
                <ClockIcon size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hive Optimisation</label>
            <button 
              onClick={() => setIntensity(intensity === 'high' ? 'low' : 'high')}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border-2 ${intensity === 'high' ? (isPro ? 'border-slate-800 bg-slate-800 text-white' : 'border-amber-400 bg-amber-400 text-slate-900') : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <Zap size={18} className={intensity === 'high' ? 'animate-pulse' : ''} />
                <div className="text-left">
                  <p className="text-sm font-bold">{isPro ? 'System Efficiency' : 'Buzz Intensity'}</p>
                  <p className={`text-[10px] ${intensity === 'high' ? 'opacity-80' : 'text-slate-400'}`}>{intensity === 'high' ? 'Animations Active' : 'Low Power Mode'}</p>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${intensity === 'high' ? 'bg-white/30' : 'bg-slate-200'}`}>
                 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${intensity === 'high' ? 'right-1' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
