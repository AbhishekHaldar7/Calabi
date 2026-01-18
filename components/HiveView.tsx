
import React, { useState, useMemo } from 'react';
import { Users, Search, Radio, MessageSquare, Zap, Briefcase } from 'lucide-react';
import { PersonalityType, IntensityType } from '../App';

interface HiveViewProps {
  personality: PersonalityType;
  intensity?: IntensityType;
}

export const HiveView: React.FC<HiveViewProps> = ({ personality, intensity = 'high' }) => {
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

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors ${isPro ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <header className={`p-6 bg-white dark:bg-slate-900 border-b ${isPro ? 'border-indigo-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${isPro ? 'text-indigo-100' : 'text-slate-900 dark:text-slate-100'}`}>
              {isPro ? 'Team Directory' : 'The Colony'}
            </h2>
            <p className="text-sm text-slate-500">{isPro ? 'Enterprise collaboration' : 'Collaborative buzz and status'}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isPro ? "Search members..." : "Search bees..."}
              className={`pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 ${isPro ? 'focus:ring-indigo-500/50' : 'focus:ring-amber-400'} w-full md:w-64 dark:text-slate-100`}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Active Sync Session */}
          <div className={`${isPro ? 'bg-gradient-to-br from-indigo-700 to-violet-800 text-white shadow-indigo-500/20' : 'bg-amber-400 text-slate-900 shadow-amber-200/50'} p-6 rounded-2xl shadow-lg flex items-center justify-between transition-all hover:scale-[1.01]`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 ${isPro ? 'bg-white/10' : 'bg-white/20'} rounded-full ${intensity === 'high' ? 'animate-pulse' : ''}`}>
                <Radio size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest opacity-80">Live Now</h4>
                <p className="font-bold text-lg leading-tight">{isPro ? 'Corporate Briefing' : 'Morning Buzz Sync'}</p>
              </div>
            </div>
            <button className={`${isPro ? 'bg-white text-slate-800 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'} px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95`}>
              Join Sync
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredColony.map((bee, i) => (
              <div key={i} className={`p-4 rounded-2xl border flex flex-col items-center text-center group transition-all cursor-pointer ${
                isPro 
                  ? 'bg-slate-900 border-indigo-500/10 hover:border-indigo-500/40 text-slate-100' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}>
                <div className="relative mb-3">
                  <img src={bee.img} className={`w-16 h-16 rounded-full border-2 transition-all ${isPro ? 'border-indigo-500/20' : 'border-slate-100'}`} alt={bee.name} />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-slate-900 rounded-full ${bee.status === 'Active' ? 'bg-green-500' : bee.status === 'Focus Mode' ? 'bg-indigo-400' : 'bg-slate-300'}`} />
                </div>
                <h5 className="font-bold">{bee.name}</h5>
                <p className={`text-[10px] uppercase font-bold tracking-tight mb-3 ${isPro ? 'text-indigo-400' : 'text-slate-400'}`}>{bee.role}</p>
                <div className="flex gap-2 w-full">
                  <button className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isPro 
                      ? 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                  }`}>
                    <MessageSquare size={12} className="inline mr-1" /> Message
                  </button>
                  <button className={`p-1.5 rounded-lg transition-all ${
                    isPro 
                      ? 'bg-slate-800 text-slate-500 hover:bg-amber-500 hover:text-white' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-amber-50 hover:text-amber-400'
                  }`}>
                    <Zap size={14} />
                  </button>
                </div>
              </div>
            ))}
            {filteredColony.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                No team members found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
