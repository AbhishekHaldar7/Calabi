
import React from 'react';
import { Users, Search, Radio, MessageSquare, Zap, Briefcase } from 'lucide-react';
import { PersonalityType, IntensityType } from '../App';

interface HiveViewProps {
  personality: PersonalityType;
  intensity?: IntensityType;
}

export const HiveView: React.FC<HiveViewProps> = ({ personality, intensity = 'high' }) => {
  const isPro = personality === 'pro';
  const colony = [
    { name: "Buzz Aldrin", role: "Queen Bee", status: "Active", img: "https://picsum.photos/40/40?seed=1" },
    { name: "Maya Bee", role: "Worker", status: "Focus Mode", img: "https://picsum.photos/40/40?seed=2" },
    { name: "Joe Drone", role: "Researcher", status: "Idle", img: "https://picsum.photos/40/40?seed=3" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <header className="p-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{isPro ? 'Team Directory' : 'The Colony'}</h2>
            <p className="text-sm text-slate-500">{isPro ? 'Enterprise collaboration' : 'Collaborative buzz and status'}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={isPro ? "Search members..." : "Search bees..."}
              className={`pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 ${isPro ? 'focus:ring-slate-800' : 'focus:ring-amber-400'} w-full md:w-64`}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Active Sync Session */}
          <div className={`${isPro ? 'bg-slate-800 text-white' : 'bg-amber-400 text-slate-900'} p-6 rounded-2xl shadow-lg flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 ${isPro ? 'bg-white/10' : 'bg-white/20'} rounded-full ${intensity === 'high' ? 'animate-pulse' : ''}`}>
                <Radio size={24} />
              </div>
              <div>
                <h4 className="font-black uppercase text-xs tracking-widest opacity-80">Live Now</h4>
                <p className="font-bold text-lg">{isPro ? 'Corporate Briefing' : 'Productivity Sync: Morning Buzz'}</p>
              </div>
            </div>
            <button className={`${isPro ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'} px-4 py-2 text-xs font-bold rounded-xl hover:opacity-90 transition-colors`}>
              Join Sync
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colony.map((bee, i) => (
              <div key={i} className={`bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center group hover:border-${isPro ? 'slate-800' : 'amber-400'} transition-all cursor-pointer`}>
                <div className="relative mb-3">
                  <img src={bee.img} className="w-16 h-16 rounded-full border-2 border-slate-100 transition-all" alt={bee.name} />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${bee.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                </div>
                <h5 className="font-bold text-slate-800">{bee.name}</h5>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-3">{bee.role}</p>
                <div className="flex gap-2 w-full">
                  <button className={`flex-1 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold hover:bg-${isPro ? 'slate-100' : 'amber-50'} hover:text-${isPro ? 'slate-900' : 'amber-600'}`}>
                    <MessageSquare size={12} className="inline mr-1" /> Message
                  </button>
                  <button className={`p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-${isPro ? 'slate-100' : 'amber-50'} hover:text-${isPro ? 'slate-900' : 'amber-400'}`}>
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
