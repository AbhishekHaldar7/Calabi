
import React from 'react';

interface LayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  isDarkMode?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ left, center, right, leftCollapsed, rightCollapsed, isDarkMode }) => {
  // Hardcoded hex values to guarantee color regardless of tailwind config state
  const sideBg = isDarkMode ? '#0f172a' : '#ffffff';
  const centerBg = isDarkMode ? '#020617' : '#ffffff';
  const borderColor = isDarkMode ? '#1e293b' : '#f1f5f9';

  return (
    <div 
      className={`grid h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out overflow-hidden ${
        leftCollapsed && rightCollapsed 
          ? 'grid-cols-[60px_1fr_60px]' 
          : leftCollapsed 
            ? 'grid-cols-[60px_1fr_350px]' 
            : rightCollapsed 
              ? 'grid-cols-[250px_1fr_60px]' 
              : 'grid-cols-[250px_1fr_350px]'
      }`}
      style={{ backgroundColor: centerBg }}
    >
      {/* Left Sidebar */}
      <aside 
        className="flex flex-col border-r transition-colors z-20 overflow-hidden relative"
        style={{ backgroundColor: sideBg, borderColor: borderColor }}
      >
        {left}
      </aside>

      {/* Main Content */}
      <main 
        className="flex flex-col h-full relative overflow-hidden transition-colors z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.015)]"
        style={{ backgroundColor: centerBg }}
      >
        <div className="absolute inset-0 flex flex-col min-w-[600px] w-full h-full">
          {center}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside 
        className="flex flex-col border-l transition-colors z-20 overflow-hidden relative"
        style={{ backgroundColor: sideBg, borderColor: borderColor }}
      >
        {right}
      </aside>
    </div>
  );
};
