
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LeftPanel } from './components/LeftPanel';
import { MonthlyView } from './components/MonthlyView';
import { RightPanel } from './components/RightPanel';
import { TasksView } from './components/TasksView';
import { HiveView } from './components/HiveView';
import { TimerHeader } from './components/TimerHeader';

export type PersonalityType = 'cheerful' | 'pro';
export type ClockFormat = '12h' | '24h';
export type IntensityType = 'low' | 'high';

interface ActiveTask {
  title: string;
  duration: number;
}

const App: React.FC = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const [personality, setPersonality] = useState<PersonalityType>('cheerful');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [clockFormat, setClockFormat] = useState<ClockFormat>('12h');
  const [intensity, setIntensity] = useState<IntensityType>('high');
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [isDarkMode]);

  const handleStartTimer = (title: string, duration: number) => {
    setActiveTask({ title, duration });
  };

  const renderCenterContent = () => {
    const props = { 
      personality, 
      setPersonality, 
      isDarkMode, 
      setIsDarkMode, 
      clockFormat, 
      setClockFormat,
      intensity,
      setIntensity
    };
    switch (activeTab) {
      case 'calendar':
        return <MonthlyView {...props} />;
      case 'tasks':
        return <TasksView personality={personality} intensity={intensity} onStartTimer={handleStartTimer} />;
      case 'hive':
        return <HiveView personality={personality} intensity={intensity} />;
      default:
        return <MonthlyView {...props} />;
    }
  };

  const themeClass = `${personality === 'pro' ? 'theme-pro' : 'theme-hive'} ${isDarkMode ? 'dark' : ''}`;

  return (
    <div className={`${themeClass} h-full`}>
      {activeTask && (
        <TimerHeader 
          taskTitle={activeTask.title} 
          duration={activeTask.duration} 
          onComplete={() => setActiveTask(null)}
          onCancel={() => setActiveTask(null)}
          isDarkMode={isDarkMode}
          isPro={personality === 'pro'}
        />
      )}
      <Layout
        isDarkMode={isDarkMode}
        leftCollapsed={leftCollapsed}
        rightCollapsed={rightCollapsed}
        left={
          <LeftPanel 
            isCollapsed={leftCollapsed} 
            onToggle={() => setLeftCollapsed(!leftCollapsed)} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            personality={personality}
          />
        }
        center={renderCenterContent()}
        right={
          <RightPanel 
            isCollapsed={rightCollapsed} 
            onToggle={() => setRightCollapsed(!rightCollapsed)} 
            personality={personality}
            intensity={intensity}
          />
        }
      />
    </div>
  );
};

export default App;
