
import React, { useState, useMemo } from 'react';
import { Users, Search, Radio, MessageSquare, Zap, Briefcase } from 'lucide-react';
import { PersonalityType, IntensityType } from '../App';

interface HiveViewProps {
  personality: PersonalityType;
  intensity?: IntensityType;
  isDarkMode: boolean;
}

export const HiveView: React.FC<HiveViewProps> = ({ personality, intensity = 'high', isDarkMode }) => {
  const isPro = personality === 'pro';
  const [searchQuery, setSearchQuery] = useState('');
  
  const colony = [
    { name: "Buzz Aldrin", role: "Queen Bee", status: "Active", img: "https://picsum.photos/40/40?seed=1" },
    { name: "Maya Bee", role: "Worker", status: "Focus Mode", img: "https://picsum.photos/40/40?seed=2" },
    { name: "Joe Drone", role: "Researcher", status: "Idle", img: "https://picsum.photos/40/40?seed=3" },
    { name: "Sarah Sting", role: "Logistics", status: "Active", img: "https://picsum.photos/40/40?seed=4" },
    { name: "Bill Bumble", role: "Developer", status: "Focus Mode", img: "https://picsum.photos/40/40?seed=5" },
  ];

  const filteredColony = useMemo(() => {
    return colony.filter(bee => 
      bee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bee.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const bgColor = isDarkMode ? 'bg-slate-950' : 'bg-white';
  const headerBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-300 ${bgColor} ${textColor}`}>
      <header className={`px-6 py-4 border-b flex items-center justify-between shrink-0 z-40 ${headerBg}`}>
        <div className="flex-1 max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">{isPro ? 'Team Directory' : 'The Colony'}</h2>
            <div className="relative mt-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isPro ? "Search members..." : "Search bees..."}
                className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs outline-none transition-all ${isDarkMode ? 'bg-slate-800 text-white focus:ring-1 focus:ring-indigo-500' : 'bg-slate-100 text-slate-900 focus:ring-1 focus:ring-amber-400'}`}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          {/* Sync Header */}
          <div className={`p-6 rounded-3xl transition-all shadow-lg flex items-center justify-between ${isPro ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-amber-400 text-white shadow-amber-200/50'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-white/20 rounded-2xl ${intensity === 'high' ? 'animate-pulse' : ''}`}>
                <Radio size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest opacity-80">Live Now</h4>
                <p className="font-bold text-lg leading-tight">{isPro ? 'Corporate Briefing' : 'Morning Buzz Sync'}</p>
              </div>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 text-xs font-bold rounded-xl transition-all active:scale-95">
              Join
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredColony.map((bee, i) => (
              <div key={i} className={`p-5 rounded-3xl border flex flex-col items-center text-center transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/30' : 'bg-white border-slate-100 shadow-sm hover:border-amber-400'
              }`}>
                <div className="relative mb-3">
                  <img src={bee.img} className="w-16 h-16 rounded-full border-2 border-white/10" alt={bee.name} />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 ${isDarkMode ? 'border-slate-900' : 'border-white'} rounded-full ${bee.status === 'Active' ? 'bg-green-500' : bee.status === 'Focus Mode' ? 'bg-indigo-400' : 'bg-slate-300'}`} />
                </div>
                <h5 className="font-bold text-sm">{bee.name}</h5>
                <p className={`text-[10px] uppercase font-black tracking-widest mt-1 ${isPro ? 'text-indigo-400' : 'text-amber-500'}`}>{bee.role}</p>
                <div className="flex gap-2 w-full mt-5">
                  <button className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-white/10' : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                  }`}>
                    Message
                  </button>
                  <button className={`p-2 rounded-xl transition-all ${
                    isDarkMode ? 'bg-slate-800 text-slate-500 hover:text-amber-500' : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-500'
                  }`}>
                    <Zap size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
