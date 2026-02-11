
import React from 'react';
import { ScreenType } from '../types';

interface NavigationProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const tabs: { type: ScreenType; icon: string; label: string }[] = [
    { type: 'home', icon: 'home', label: 'Home' },
    { type: 'search', icon: 'search', label: 'Search' },
    { type: 'history', icon: 'calendar_today', label: 'History' },
    { type: 'stats', icon: 'analytics', label: 'Stats' },
    { type: 'profile', icon: 'person', label: 'Profile' }
  ];

  return (
    <nav className="h-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around pb-4 px-2 shrink-0 z-50 relative">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.type;
        return (
          <button
            key={tab.type}
            onClick={() => onNavigate(tab.type)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
              isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'
            }`}
          >
            <span className="material-icons-round text-2xl mb-1">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}

      {/* Floating Action Button logic if needed - currently integrated in Home/History */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none">
        <button
          onClick={() => onNavigate('new')}
          className="pointer-events-auto h-14 w-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="material-icons-round text-3xl">add</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
