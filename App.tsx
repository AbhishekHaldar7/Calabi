
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LeftPanel } from './components/LeftPanel';
import { MonthlyView } from './components/MonthlyView';
import { RightPanel } from './components/RightPanel';
import { TasksView } from './components/TasksView';
import { HiveView } from './components/HiveView';

export type PersonalityType = 'cheerful' | 'pro';
export type ClockFormat = '12h' | '24h';
export type IntensityType = 'low' | 'high';

const App: React.FC = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const [personality, setPersonality] = useState<PersonalityType>('cheerful');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [clockFormat, setClockFormat] = useState<ClockFormat>('12h');
  const [intensity, setIntensity] = useState<IntensityType>('high');

  // Sync dark mode with body class for global tailwind styles
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [isDarkMode]);

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
        return <TasksView personality={personality} intensity={intensity} />;
      case 'hive':
        return <HiveView personality={personality} intensity={intensity} />;
      default:
        return <MonthlyView {...props} />;
    }
  };

  const themeClass = `${personality === 'pro' ? 'theme-pro' : 'theme-hive'} ${isDarkMode ? 'dark' : ''}`;

  return (
    <div className={`${themeClass} h-full`}>
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
