import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface HistoryProps {
  entries: JournalEntry[];
}

const History: React.FC<HistoryProps> = ({ entries }) => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Days in month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // What weekday does the 1st fall on? (0=Sun → shift to Mon-first)
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  // Build set of days that have entries this month
  const entryDays = new Set(
    entries
      .filter((e) => {
        const d = new Date(e.created_at);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
      })
      .map((e) => new Date(e.created_at).getDate())
  );

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  // Entry for selected day
  const selectedEntry = selectedDay
    ? entries.find((e) => {
        const d = new Date(e.created_at);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === selectedDay;
      })
    : null;

  const totalEntries = entries.length;
  // Simple streak: count consecutive days from today backwards
  const streak = (() => {
    let count = 0;
    const check = new Date();
    check.setHours(0, 0, 0, 0);
    const daySet = new Set(entries.map((e) => {
      const d = new Date(e.created_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }));
    while (daySet.has(check.getTime())) {
      count++;
      check.setDate(check.getDate() - 1);
    }
    return count;
  })();

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
          <span className="material-icons-round">chevron_left</span>
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{monthName}</h1>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
          <span className="material-icons-round">chevron_right</span>
        </button>
      </header>

      {/* Stats */}
      <div className="px-6 pb-2 flex justify-between items-center mb-4">
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 flex-1 mr-2 border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Streak</p>
          <div className="flex items-end">
            <span className="text-xl font-bold text-primary mr-1">{streak}</span>
            <span className="text-xs text-slate-400 mb-1">days</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-3 flex-1 ml-2 border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Learned</p>
          <div className="flex items-end">
            <span className="text-xl font-bold text-emerald-400 mr-1">{totalEntries}</span>
            <span className="text-xs text-slate-400 mb-1">items</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-4 flex-grow overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d, i) => (
            <div key={i} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`empty-${i}`} />)}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isSelected = day === selectedDay;
            const hasEntry = entryDays.has(day);
            const isToday = day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-10 w-10 flex flex-col items-center justify-center rounded-lg relative transition-all mx-auto ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : isToday
                      ? 'border border-primary text-primary'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{day}</span>
                {hasEntry && !isSelected && <span className="w-1 h-1 bg-primary rounded-full mt-0.5" />}
                {hasEntry && isSelected && <span className="w-1 h-1 bg-white rounded-full mt-0.5 opacity-80" />}
              </button>
            );
          })}
        </div>

        {/* Selected day preview */}
        {selectedDay && (
          <div className="mt-8 mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />
            {selectedEntry ? (
              <>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </h3>
                    <p className="text-sm font-medium text-slate-400">{selectedEntry.category}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <span className={`material-icons-round text-base ${selectedEntry.is_favorite ? 'text-red-400' : 'text-slate-500 dark:text-slate-300'}`}>
                      {selectedEntry.is_favorite ? 'favorite' : 'bookmark'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 relative z-10">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedEntry.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{selectedEntry.content}</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 text-center relative z-10">
                <span className="material-icons-round text-3xl text-slate-300 dark:text-slate-600 mb-2">event_busy</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">No entry for this day.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-20 shrink-0" />
    </div>
  );
};

export default History;
