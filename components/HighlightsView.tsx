
import React from 'react';
import { Star, Award, Trophy, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { PersonalityType } from '../App';

interface HighlightsViewProps {
  personality: PersonalityType;
}

export const HighlightsView: React.FC<HighlightsViewProps> = ({ personality }) => {
  const isPro = personality === 'pro';
  const streaks = [
    { label: isPro ? "Efficiency Metrics" : "Productivity Streak", value: "12 Days", icon: <TrendingUp size={16} /> },
    { label: isPro ? "Team Performance" : "Hive Contribution", value: "Top 5%", icon: <Award size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <header className="p-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">{isPro ? 'Performance Analytics' : 'Sweet Success'}</h2>
          <p className="text-sm text-slate-500">{isPro ? 'KPI and achievement tracking' : 'Your highlights and achievements'}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {streaks.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{s.label}</p>
                  <p className="text-2xl font-black text-slate-900">{s.value}</p>
                </div>
                <div className={`p-3 ${isPro ? 'bg-slate-100 text-slate-800' : 'bg-amber-100 text-amber-600'} rounded-2xl`}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Major Accomplishment */}
          <div className="relative group">
            <div className={`absolute -inset-0.5 ${isPro ? 'bg-slate-800' : 'bg-gradient-to-r from-amber-400 to-yellow-500'} rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-500`}></div>
            <div className="relative bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-6">
              <div className={`w-16 h-16 ${isPro ? 'bg-slate-50 text-slate-800' : 'bg-amber-50 text-amber-500'} rounded-2xl flex items-center justify-center`}>
                <Trophy size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase ${isPro ? 'text-slate-800 bg-slate-100' : 'text-amber-600 bg-amber-50'} px-2 py-0.5 rounded`}>Achievement Unlocked</span>
                  <span className="text-slate-300 text-[10px]">• 2 days ago</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">{isPro ? 'Operational Excellence' : 'Master Scheduler'}</h4>
                <p className="text-sm text-slate-500">{isPro ? 'Maintained zero-conflict schedule for 50+ entries.' : 'Organized 50+ events this month without a single clash. Sweet!'}</p>
              </div>
              <Sparkles className={`${isPro ? 'text-slate-400' : 'text-amber-400'} animate-bounce`} size={24} />
            </div>
          </div>

          {/* Past Highlights */}
          <div className="space-y-4">
            <h5 className="text-xs font-black uppercase text-slate-400 tracking-widest">{isPro ? 'Historical Records' : 'Recent Sweet Moments'}</h5>
            <div className="space-y-3">
              {[
                { title: isPro ? "Q3 Planning Finalized" : "Finished Garden Sprint", date: "Oct 24", icon: <Star /> },
                { title: isPro ? "Enterprise Migration" : "Launched Hive Community", date: "Oct 20", icon: <Calendar /> },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer">
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
