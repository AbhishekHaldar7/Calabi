
import React from 'react';
import { PersonalityType, ClockFormat, IntensityType } from '../App';
import { Clock } from 'lucide-react';

interface WeeklyViewProps {
  personality: PersonalityType;
  isEmbedded?: boolean;
  clockFormat?: ClockFormat;
  isDarkMode?: boolean;
  intensity?: IntensityType;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({ 
  personality, 
  isEmbedded = false, 
  clockFormat = '12h',
  isDarkMode = false,
  intensity = 'high'
}) => {
  const isPro = personality === 'pro';
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); 
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const formatHour = (h: number) => {
    if (clockFormat === '24h') return h.toString();
    const displayHour = h > 12 ? h - 12 : h;
    return displayHour.toString();
  };

  const mockEvents = [
    { day: 1, start: 9, duration: 1.5, title: isPro ? 'Strategy Sync' : 'Morning Buzz', cat: 'work' },
    { day: 3, start: 12, duration: 1, title: isPro ? 'Lunch / Networking' : 'Nectar Break', cat: 'personal' },
    { day: 4, start: 14, duration: 1, title: isPro ? 'Client Review' : 'Garden Visit', cat: 'work' },
  ];

  const rowHeight = 35;

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      <div className={`flex border-b ml-12 shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
        {days.map((day, i) => (
          <div key={day} className={`flex-1 py-2 text-center border-l first:border-l-0 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{day}</p>
            <p className={`text-sm font-bold ${isPro ? (isDarkMode ? 'text-slate-100' : 'text-slate-900') : (isDarkMode ? 'text-amber-600' : 'text-amber-600')}`}>
              {14 + i}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 relative flex overflow-hidden">
        <div className={`w-12 flex flex-col border-r sticky left-0 z-20 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
          {hours.map(hour => (
            <div key={hour} style={{ height: `${rowHeight}px` }} className="text-[10px] font-bold text-slate-500 flex items-center justify-center shrink-0">
              {formatHour(hour)}
            </div>
          ))}
        </div>

        <div className="flex-1 relative">
          {hours.map(hour => (
            <div key={hour} style={{ height: `${rowHeight}px` }} className={`border-b w-full ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100'}`} />
          ))}
          <div className="absolute inset-0 flex">
            {days.map((_, i) => (
              <div key={i} className={`flex-1 border-r last:border-r-0 ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100'}`} />
            ))}
          </div>

          {mockEvents.map((event, idx) => {
            if (event.start < hours[0] || event.start > hours[hours.length-1]) return null;
            
            return (
              <div
                key={idx}
                className={`absolute m-0.5 rounded-lg p-1 text-[9px] font-bold shadow-sm transition-all cursor-pointer z-10 overflow-hidden ${
                  intensity === 'high' ? 'hover:scale-[1.02] hover:shadow-md' : ''
                } ${
                  isPro 
                    ? (isDarkMode ? 'bg-slate-700 text-white border-l-2 border-slate-400' : 'bg-slate-800 text-white border-l-2 border-slate-400') 
                    : (isDarkMode ? 'bg-amber-900/50 text-amber-100 border-l-2 border-amber-500' : 'bg-amber-100 text-amber-900 border-l-2 border-amber-500')
                }`}
                style={{
                  left: `${(event.day / 7) * 100}%`,
                  top: `${((event.start - hours[0]) * rowHeight)}px`,
                  height: `${event.duration * rowHeight - 4}px`,
                  width: `${(1 / 7) * 100}%`,
                }}
              >
                <p className="leading-tight truncate">{event.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
