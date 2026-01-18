
import React, { useState, useEffect } from 'react';
import { X, Droplets, Sparkles, Tag, ChevronRight, ChevronDown, ListTree, Plus, Trash2, AlignLeft } from 'lucide-react';
import { PersonalityType } from '../App';

interface TaskEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  personality: PersonalityType;
  initialData?: any;
}

export const TaskEntryModal: React.FC<TaskEntryModalProps> = ({ isOpen, onClose, onSave, personality, initialData }) => {
  const isPro = personality === 'pro';
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [importance, setImportance] = useState(3);
  const [category, setCategory] = useState('Work');
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [steps, setSteps] = useState<{ id: string; text: string }[]>([]);

  // Reset or load initial data when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDetails(initialData.details || '');
        setImportance(initialData.importance || 3);
        setCategory(initialData.category || 'Work');
        setSteps(initialData.steps || []);
      } else {
        setTitle('');
        setDetails('');
        setImportance(3);
        setCategory('Work');
        setSteps([]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const categories = ['Work', 'Personal', 'Urgent', 'Social', 'Study', 'Nectar'];

  const addStep = () => {
    setSteps([...steps, { id: Math.random().toString(), text: '' }]);
  };

  const updateStep = (id: string, text: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, text } : s));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title,
      details,
      importance,
      category,
      steps,
      done: initialData?.done || false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className={`w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border ${
          isPro ? 'bg-slate-900 border-indigo-500/20' : 'bg-white border-amber-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isPro ? 'bg-indigo-950/30 border-indigo-500/10' : 'bg-amber-50/50 border-amber-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isPro ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-white'}`}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isPro ? 'text-indigo-100' : 'text-slate-800'}`}>
                {initialData ? (isPro ? 'Modify Objective' : 'Edit Sweet Task') : (isPro ? 'Initialize Objective' : 'New Sweet Task')}
              </h3>
              <p className={`text-[10px] uppercase font-black tracking-widest ${isPro ? 'text-indigo-400' : 'text-amber-600/60'}`}>
                {isPro ? 'System Input v2.4' : 'Add to the hive'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Title Input */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-slate-500'}`}>
              Title
            </label>
            <input 
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isPro ? "Enter objective parameters..." : "What's buzzing?"}
              className={`w-full p-4 rounded-2xl text-sm outline-none border-2 transition-all ${
                isPro 
                  ? 'bg-slate-800 border-indigo-500/10 focus:border-indigo-500 text-indigo-100' 
                  : 'bg-slate-50 border-slate-100 focus:border-amber-400 text-slate-800'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Custom Dropdown Category */}
            <div className="space-y-2 relative">
              <label className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-slate-500'}`}>
                Category
              </label>
              <button 
                onClick={() => setIsCatOpen(!isCatOpen)}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between border-2 transition-all ${
                  isPro 
                    ? 'bg-slate-800 border-indigo-500/10 text-indigo-100 hover:border-indigo-500/30' 
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag size={14} className={isPro ? 'text-indigo-400' : 'text-amber-500'} />
                  {category}
                </div>
                <ChevronDown size={14} className={`transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCatOpen && (
                <div className={`absolute top-full left-0 right-0 mt-2 z-[110] p-2 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-top-2 ${
                  isPro ? 'bg-slate-800 border-indigo-500/20' : 'bg-white border-slate-100'
                }`}>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => { setCategory(cat); setIsCatOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        category === cat 
                          ? (isPro ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-white')
                          : (isPro ? 'text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-300' : 'text-slate-600 hover:bg-amber-50')
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Importance */}
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-slate-500'}`}>
                Nectar Rating
              </label>
              <div className="flex items-center gap-1.5 h-11">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button 
                    key={val}
                    onClick={() => setImportance(val)}
                    className={`transition-all ${val <= importance ? (isPro ? 'text-indigo-500 scale-110' : 'text-amber-500 scale-110') : 'text-slate-200 dark:text-slate-700'}`}
                  >
                    <Droplets size={22} fill={val <= importance ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details Box */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-slate-500'}`}>
              Details & Constraints
            </label>
            <div className="relative">
              <AlignLeft size={16} className="absolute left-4 top-4 text-slate-400 pointer-events-none" />
              <textarea 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder={isPro ? "Detailed specifications..." : "Describe the buzz..."}
                className={`w-full pl-11 pr-4 py-4 rounded-2xl text-sm outline-none border-2 transition-all resize-none ${
                  isPro 
                    ? 'bg-slate-800 border-indigo-500/10 focus:border-indigo-500 text-indigo-100' 
                    : 'bg-slate-50 border-slate-100 focus:border-amber-400 text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Flowchart Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-[10px] font-black uppercase tracking-widest ${isPro ? 'text-indigo-400' : 'text-slate-500'}`}>
                Objective Flowchart
              </label>
              <button 
                onClick={addStep}
                className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-all ${isPro ? 'text-indigo-400 hover:text-indigo-300' : 'text-amber-600 hover:text-amber-700'}`}
              >
                <Plus size={14} /> Add Step
              </button>
            </div>
            
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="relative flex items-center gap-3 animate-in slide-in-from-left-2">
                  {/* Visual Flow Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute left-[13px] top-8 w-0.5 h-6 ${isPro ? 'bg-indigo-500/20' : 'bg-amber-100'}`} />
                  )}
                  
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isPro ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-500/20' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <input 
                    value={step.text}
                    onChange={(e) => updateStep(step.id, e.target.value)}
                    placeholder={`Step ${index + 1}...`}
                    className={`flex-1 p-2.5 rounded-xl text-xs outline-none border transition-all ${
                      isPro 
                        ? 'bg-slate-800/50 border-indigo-500/10 text-indigo-100 focus:border-indigo-500' 
                        : 'bg-white border-slate-100 text-slate-700 focus:border-amber-400'
                    }`}
                  />
                  
                  <button 
                    onClick={() => removeStep(step.id)}
                    className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {steps.length === 0 && (
                <div className={`p-4 rounded-2xl border-2 border-dashed text-center ${
                  isPro ? 'border-indigo-500/10 text-indigo-500/30' : 'border-slate-100 text-slate-400'
                }`}>
                  <ListTree size={20} className="mx-auto mb-1 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Break down complex tasks into steps</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end gap-3 ${isPro ? 'bg-slate-800/50 border-indigo-500/10' : 'bg-slate-50/50 border-amber-50'}`}>
          <button 
            onClick={onClose}
            className={`px-6 py-3 text-xs font-bold rounded-2xl transition-all ${
              isPro ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title.trim()}
            className={`px-8 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center gap-2 active:scale-95 disabled:opacity-50 ${
              isPro 
                ? 'bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-500' 
                : 'bg-amber-400 text-slate-900 shadow-amber-200/50 hover:bg-amber-500'
            }`}
          >
            {initialData ? 'Update Objective' : 'Confirm Objective'} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
