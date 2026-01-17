
import React from 'react';
import { CheckCircle2, Circle, Clock, Tag, Plus, MoreVertical } from 'lucide-react';
import { PersonalityType, IntensityType } from '../App';

interface TasksViewProps {
  personality: PersonalityType;
  intensity?: IntensityType;
}

export const TasksView: React.FC<TasksViewProps> = ({ personality, intensity = 'high' }) => {
  const isPro = personality === 'pro';
  const tasks = [
    { id: 1, title: "Refine Hive UI components", done: true, priority: 'high', category: 'Work' },
    { id: 2, title: "Order nectar for the team sync", done: false, priority: 'medium', category: 'Personal' },
    { id: 3, title: "Submit project status to Queen Bee", done: false, priority: 'high', category: 'Work' },
    { id: 4, title: "Plan upcoming garden sprint", done: false, priority: 'low', category: 'Hive' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      <header className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tasks</h2>
            <p className="text-sm text-slate-500">{isPro ? 'Systematic task tracking' : 'Keep the productivity buzzing'}</p>
          </div>
          <button className={`${isPro ? 'bg-slate-800 text-white' : 'bg-amber-400 text-slate-900'} px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95`}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Progress Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{isPro ? 'Completion Rate' : 'Honey Progress'}</span>
              <span className={`text-sm font-bold ${isPro ? 'text-slate-800 dark:text-slate-200' : 'text-amber-600'}`}>25% Done</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${isPro ? 'bg-slate-800 dark:bg-slate-400' : 'bg-amber-400'} w-1/4 rounded-full shadow-inner ${intensity === 'high' ? 'animate-pulse' : ''}`} />
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className={`bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all cursor-pointer ${intensity === 'high' ? (isPro ? 'hover:border-slate-400' : 'hover:border-amber-200') : ''}`}>
                <div className="flex items-center gap-4">
                  <button className={`${task.done ? (isPro ? 'text-slate-800 dark:text-slate-400' : 'text-amber-50') : 'text-slate-300'}`}>
                    {task.done ? <CheckCircle2 size={22} className={isPro ? 'text-slate-800 dark:text-slate-400' : 'text-amber-500'} /> : <Circle size={22} className="dark:text-slate-700" />}
                  </button>
                  <div>
                    <p className={`text-sm font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                      {task.title}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        <Tag size={10} /> {task.category}
                      </span>
                      {task.priority === 'high' && (
                        <span className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded uppercase">Urgent</span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-opacity">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
