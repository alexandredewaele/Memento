
import React from 'react';
import { JournalEntry } from '../types';

interface HistoryProps {
  entries: JournalEntry[];
}

const History: React.FC<HistoryProps> = ({ entries }) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDay = 12; // Hardcoded for demo parity with mockup

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
          <span className="material-icons-round">chevron_left</span>
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">November 2023</h1>
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
          <span className="material-icons-round">chevron_right</span>
        </button>
      </header>

      {/* Stats Summary */}
      <div className="px-6 pb-2 flex justify-between items-center mb-4">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 flex-1 mr-2 border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Streak</p>
          <div className="flex items-end">
            <span className="text-xl font-bold text-primary mr-1">12</span>
            <span className="text-xs text-slate-400 mb-1">days</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 flex-1 ml-2 border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Learned</p>
          <div className="flex items-end">
            <span className="text-xl font-bold text-emerald-400 mr-1">45</span>
            <span className="text-xs text-slate-400 mb-1">items</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 flex-grow overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {/* Mock days */}
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const isSelected = day === activeDay;
            const hasEntry = [1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 16, 18, 19, 21, 23].includes(day);
            const isToday = day === 24;

            return (
              <button 
                key={day}
                className={`group h-10 w-10 flex flex-col items-center justify-center rounded-lg relative transition-all ${
                  isSelected 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : isToday 
                    ? 'border border-primary text-primary' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
                {hasEntry && !isSelected && (
                  <span className="w-1 h-1 bg-primary rounded-full mt-1"></span>
                )}
                {isSelected && (
                  <span className="w-1 h-1 bg-white rounded-full mt-1 opacity-80"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Preview Card */}
        <div className="mt-8 mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden group transition-all duration-300">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 blur-3xl rounded-full"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Nov 12, 2023</h3>
              <p className="text-sm font-medium text-slate-400">Word of the Day</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <span className="material-icons-round text-base text-slate-500 dark:text-slate-300">bookmark</span>
            </div>
          </div>
          <div className="mt-3 relative z-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Serendipity</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">The occurrence and development of events by chance in a happy or beneficial way.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end relative z-10">
            <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center transition-colors">
              View Full Entry 
              <span className="material-icons-round text-sm ml-1">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="h-20 shrink-0" />
    </div>
  );
};

export default History;
