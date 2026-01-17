
import React from 'react';
import { Calendar, Inbox, Menu, ChevronLeft, LayoutGrid, Briefcase, User } from 'lucide-react';
import { PersonalityType } from '../App';

interface LeftPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  personality: PersonalityType;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ isCollapsed, onToggle, activeTab, setActiveTab, personality }) => {
  const isPro = personality === 'pro';

  const navItems = [
    { id: 'calendar', icon: <Calendar size={18} />, label: 'Calendar' },
    { id: 'tasks', icon: <Inbox size={18} />, label: 'Tasks' },
    { id: 'hive', icon: isPro ? <Briefcase size={18} /> : <LayoutGrid size={18} />, label: isPro ? 'Team' : 'Hive' },
  ];

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden bg-white dark:bg-transparent transition-colors">
      <div className={`flex items-center gap-2 mb-8 ${isCollapsed ? 'flex-col gap-4' : 'justify-between px-2'}`}>
        <button 
          onClick={onToggle}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors order-2 lg:order-none"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
        
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">{isPro ? '📊' : '🐝'}</span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Calabi</h1>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id 
                ? (isPro ? 'bg-slate-900 text-white shadow-md' : 'bg-amber-100 text-amber-900 border border-amber-200/50')
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={`pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4 ${isCollapsed ? 'px-0' : 'px-2'}`}>
        <button className={`flex items-center gap-3 w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
            isPro 
              ? 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700' 
              : 'bg-amber-50 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800'
          }`}>
            <User size={18} className={isPro ? "text-slate-600 dark:text-slate-300" : "text-amber-600 dark:text-amber-400"} />
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Queen Bee</p>
              <p className="text-[10px] text-slate-500 truncate">Settings</p>
            </div>
          )}
        </button>
        
        {!isCollapsed && (
          <p className="text-[10px] text-center text-slate-300 dark:text-slate-600 font-medium uppercase tracking-widest pb-2">
            {isPro ? 'Enterprise v1.2' : 'Hive OS v1.2'}
          </p>
        )}
      </div>
    </div>
  );
};
