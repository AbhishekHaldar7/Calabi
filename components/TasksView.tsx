
import React from 'react';
import { CheckCircle2, Circle, Clock, Tag, Plus, MoreVertical, Droplets, Play } from 'lucide-react';
import { PersonalityType, IntensityType } from '../App';

interface TasksViewProps {
  personality: PersonalityType;
  intensity?: IntensityType;
  onStartTimer?: (title: string, duration: number) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ personality, intensity = 'high', onStartTimer }) => {
  const isPro = personality === 'pro';
  const tasks = [
    { id: 1, title: "Refine Hive UI components", done: true, importance: 5, category: 'Work' },
    { id: 2, title: "Order nectar for the team sync", done: false, importance: 3, category: 'Personal' },
    { id: 3, title: "Submit status to Queen Bee", done: false, importance: 5, category: 'Work' },
    { id: 4, title: "Plan upcoming garden sprint", done: false, importance: 2, category: 'Hive' },
  ];

  const renderImportance = (val: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Droplets 
          key={i} 
          size={10} 
          className={i < val ? (isPro ? 'text-slate-400 fill-slate-400' : 'text-amber-400 fill-amber-400') : 'text-slate-200 dark:text-slate-800'} 
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      <header className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tasks</h2>
            <p className="text-sm text-slate-500">{isPro ? 'Systematic task tracking' : 'Keep the productivity buzzing'}</p>
          </div>
          <button className={`${isPro ? 'bg-slate-900 text-white' : 'bg-amber-400 text-slate-900'} px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95`}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isPro ? 'System Load' : 'Hive Progress'}</span>
              <span className={`text-sm font-bold ${isPro ? 'text-slate-800 dark:text-slate-200' : 'text-amber-600'}`}>25% Ready</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${isPro ? 'bg-slate-800' : 'bg-amber-400'} w-1/4 rounded-full ${intensity === 'high' ? 'animate-pulse' : ''}`} />
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all hover:shadow-md">
                <div className="flex items-center gap-4 flex-1">
                  <button className={`${task.done ? (isPro ? 'text-slate-400' : 'text-amber-500') : 'text-slate-300'}`}>
                    {task.done ? <CheckCircle2 size={22} /> : <Circle size={22} className="dark:text-slate-700" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800">
                        <Tag size={10} className="text-slate-400" />
                        <span className="text-[9px] font-black uppercase text-slate-500">{task.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Imp:</span>
                         {renderImportance(task.importance)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!task.done && onStartTimer && (
                    <button 
                      onClick={() => onStartTimer(task.title, 1500)}
                      className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                        isPro ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      }`}
                      title="Start 25m Pomodoro"
                    >
                      <Play size={16} fill="currentColor" />
                    </button>
                  )}
                  <button className="p-2 text-slate-300 hover:text-slate-500">
                    <MoreVertical size={16} />
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
