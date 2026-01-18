
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Tag, Plus, MoreVertical, Droplets, Play, Search, Edit3, Trash2, CheckCircle, RotateCcw, ListTree } from 'lucide-react';
import { PersonalityType, IntensityType } from '../App';
import { TaskEntryModal } from './TaskEntryModal';

interface TasksViewProps {
  personality: PersonalityType;
  intensity?: IntensityType;
  onStartTimer?: (title: string, duration: number) => void;
}

interface Task {
  id: number;
  title: string;
  details?: string;
  done: boolean;
  importance: number;
  category: string;
  steps?: { id: string; text: string }[];
}

export const TasksView: React.FC<TasksViewProps> = ({ personality, intensity = 'high', onStartTimer }) => {
  const isPro = personality === 'pro';
  const [searchQuery, setSearchQuery] = useState('');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Refine Hive UI components", done: true, importance: 5, category: 'Work', steps: [{id: '1', text: 'Drafting'}, {id: '2', text: 'Review'}] },
    { id: 2, title: "Order nectar for the team sync", done: false, importance: 3, category: 'Personal' },
    { id: 3, title: "Submit status to Queen Bee", done: false, importance: 5, category: 'Work' },
    { id: 4, title: "Plan upcoming garden sprint", done: false, importance: 2, category: 'Hive' },
  ]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    setActiveMenu(null);
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setActiveMenu(null);
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setIsEntryModalOpen(true);
    setActiveMenu(null);
  };

  const handleAddTask = (taskData: any) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...taskData, id: t.id } : t));
      setEditingTask(null);
    } else {
      setTasks(prev => [taskData, ...prev]);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, searchQuery]);

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const done = tasks.filter(t => t.done).length;
    return Math.round((done / tasks.length) * 100);
  }, [tasks]);

  const renderImportance = (val: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Droplets 
          key={i} 
          size={10} 
          className={i < val ? (isPro ? 'text-indigo-400 fill-indigo-400' : 'text-amber-400 fill-amber-400') : 'text-slate-200 dark:text-slate-800'} 
        />
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors ${isPro ? 'dark:bg-slate-950 bg-slate-50' : 'bg-slate-50 dark:bg-slate-950'}`}>
      <header className={`p-6 border-b transition-colors ${isPro ? 'dark:bg-slate-900 border-indigo-500/10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tasks</h2>
            <div className="relative mt-2 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="Search objectives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none outline-none focus:ring-2 ${isPro ? 'focus:ring-indigo-500/50' : 'focus:ring-amber-400/50'}`}
              />
            </div>
          </div>
          <button 
            onClick={() => { setEditingTask(null); setIsEntryModalOpen(true); }}
            className={`${isPro ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-amber-400 text-slate-900'} px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shrink-0`}
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className={`p-6 rounded-2xl border transition-all ${isPro ? 'dark:bg-slate-900 border-indigo-500/10 bg-white shadow-xl shadow-indigo-500/5' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-slate-500'}`}>{isPro ? 'System Load' : 'Hive Progress'}</span>
              <span className={`text-sm font-bold ${isPro ? 'text-indigo-400' : 'text-amber-600'}`}>{progress}% Ready</span>
            </div>
            <div className={`h-3 w-full rounded-full overflow-hidden ${isPro ? 'bg-indigo-950/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <div 
                className={`h-full transition-all duration-1000 ${isPro ? 'bg-gradient-to-r from-indigo-600 to-indigo-400' : 'bg-amber-400'} rounded-full ${intensity === 'high' ? 'animate-pulse' : ''}`} 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <div key={task.id} className={`p-4 rounded-2xl border flex items-center justify-between group transition-all hover:shadow-md relative ${
                isPro ? 'dark:bg-slate-900 bg-white dark:border-indigo-500/5 border-slate-100' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
              }`}>
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`transition-transform active:scale-90 ${task.done ? (isPro ? 'text-indigo-500' : 'text-amber-500') : (isPro ? 'text-indigo-900/40' : 'text-slate-300')}`}
                  >
                    {task.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-bold transition-all ${task.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${isPro ? 'bg-indigo-950/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                        <Tag size={10} className={isPro ? 'text-indigo-400' : 'text-slate-400'} />
                        <span className={`text-[9px] font-black uppercase ${isPro ? 'text-indigo-300' : 'text-slate-500'}`}>{task.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Imp:</span>
                         {renderImportance(task.importance)}
                      </div>
                      {task.steps && task.steps.length > 0 && (
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${isPro ? 'text-indigo-400' : 'text-amber-600'}`}>
                           <ListTree size={10} />
                           <span className="text-[9px] font-bold uppercase">{task.steps.length} Steps</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  {!task.done && onStartTimer && (
                    <button 
                      onClick={() => onStartTimer(task.title, 1500)}
                      className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all active:scale-90 ${
                        isPro ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      }`}
                      title="Start 25m Pomodoro"
                    >
                      <Play size={16} fill="currentColor" />
                    </button>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                      className={`p-2 rounded-lg transition-colors ${activeMenu === task.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-900' : 'text-slate-300 hover:text-slate-500'}`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === task.id && (
                      <div 
                        ref={menuRef}
                        className={`absolute right-0 top-full mt-2 w-48 z-50 rounded-2xl shadow-2xl border p-2 animate-in fade-in slide-in-from-top-2 ${
                          isPro ? 'bg-slate-800 border-indigo-500/20' : 'bg-white border-slate-100'
                        }`}
                      >
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isPro ? 'text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-500'
                          }`}
                        >
                          {task.done ? <RotateCcw size={14} /> : <CheckCircle size={14} />}
                          {task.done ? 'Mark as Pending' : 'Mark as Complete'}
                        </button>
                        
                        <button 
                          onClick={() => startEdit(task)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                            isPro ? 'text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-500'
                          }`}
                        >
                          <Edit3 size={14} /> Edit Objective
                        </button>

                        {!task.done && onStartTimer && (
                          <button 
                            onClick={() => { onStartTimer(task.title, 1500); setActiveMenu(null); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                              isPro ? 'text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-500'
                            }`}
                          >
                            <Play size={14} /> Start Nectar Session
                          </button>
                        )}

                        <div className={`my-1 border-t ${isPro ? 'border-indigo-500/10' : 'border-slate-50'}`} />
                        
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20`}
                        >
                          <Trash2 size={14} /> Delete Forever
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">No objectives found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <TaskEntryModal 
        isOpen={isEntryModalOpen}
        onClose={() => { setIsEntryModalOpen(false); setEditingTask(null); }}
        onSave={handleAddTask}
        personality={personality}
        // Passing initial data for editing
        initialData={editingTask}
      />
    </div>
  );
};
