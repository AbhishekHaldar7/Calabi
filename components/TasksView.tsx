
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Tag, Plus, MoreVertical, Droplets, Play, Search, Edit3, Trash2, CheckCircle, RotateCcw, ListTree } from 'lucide-react';
import { PersonalityType, IntensityType } from '../App';
import { TaskEntryModal } from './TaskEntryModal';

interface TasksViewProps {
  personality: PersonalityType;
  intensity?: IntensityType;
  isDarkMode: boolean;
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

export const TasksView: React.FC<TasksViewProps> = ({ personality, intensity = 'high', isDarkMode, onStartTimer }) => {
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
      const newTask = { ...taskData, id: Date.now() };
      setTasks(prev => [newTask, ...prev]);
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
          className={i < val ? (isPro ? 'text-indigo-400 fill-indigo-400' : 'text-amber-500 fill-amber-500') : 'text-slate-200 dark:text-slate-800'} 
        />
      ))}
    </div>
  );

  const bgColor = isDarkMode ? 'bg-slate-950' : 'bg-white';
  const headerBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-300 ${bgColor} ${textColor}`}>
      <header className={`px-6 py-4 border-b flex items-center justify-between shrink-0 z-40 ${headerBg}`}>
        <div className="flex-1 max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Tasks</h2>
            <div className="relative mt-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="Search objectives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs outline-none transition-all ${isDarkMode ? 'bg-slate-800 text-white focus:ring-1 focus:ring-indigo-500' : 'bg-slate-100 text-slate-900 focus:ring-1 focus:ring-amber-400'}`}
              />
            </div>
          </div>
          <button 
            onClick={() => { setEditingTask(null); setIsEntryModalOpen(true); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center shadow-lg ${isPro ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-amber-400 text-white shadow-amber-200/50'}`}
          >
            <Plus size={16} className="mr-2" /> New Task
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Card */}
          <div className={`p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-amber-600'}`}>
                {isPro ? 'System Load' : 'Hive Progress'}
              </span>
              <span className={`text-sm font-bold ${isPro ? 'text-indigo-400' : 'text-amber-600'}`}>{progress}%</span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div 
                className={`h-full transition-all duration-1000 ${isPro ? 'bg-indigo-500' : 'bg-amber-400'} rounded-full`} 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3 pb-10">
            {filteredTasks.length > 0 ? filteredTasks.map(task => (
              <div key={task.id} className={`p-4 rounded-2xl border flex items-center justify-between group transition-all hover:shadow-md ${
                isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/30' : 'bg-white border-slate-50 shadow-sm'
              }`}>
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`transition-all active:scale-90 ${task.done ? (isPro ? 'text-indigo-500' : 'text-amber-500') : (isDarkMode ? 'text-slate-700' : 'text-slate-200')}`}
                  >
                    {task.done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-bold transition-all ${task.done ? 'text-slate-500 line-through' : (isDarkMode ? 'text-slate-200' : 'text-slate-800')}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <Tag size={10} className={isPro ? 'text-indigo-400' : 'text-amber-500'} />
                        <span className="text-[9px] font-black uppercase text-slate-500">{task.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         {renderImportance(task.importance)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!task.done && onStartTimer && (
                    <button 
                      onClick={() => onStartTimer(task.title, 1500)}
                      className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${isPro ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-amber-500 hover:bg-amber-50'}`}
                    >
                      <Play size={16} fill="currentColor" />
                    </button>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                      className={`p-2 rounded-lg transition-colors ${activeMenu === task.id ? (isDarkMode ? 'bg-slate-800' : 'bg-slate-100') : 'text-slate-400'}`}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === task.id && (
                      <div 
                        ref={menuRef}
                        className={`absolute right-0 top-full mt-1 w-44 z-[60] rounded-2xl shadow-2xl border p-2 animate-in fade-in zoom-in-95 ${
                          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                        }`}
                      >
                        <button 
                          onClick={() => startEdit(task)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 opacity-30">
                <p className="text-sm font-bold">No tasks found</p>
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
        initialData={editingTask}
      />
    </div>
  );
};
