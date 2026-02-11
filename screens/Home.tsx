
import React from 'react';
import { JournalEntry } from '../types';

interface HomeProps {
  entries: JournalEntry[];
  onAdd: () => void;
}

const Home: React.FC<HomeProps> = ({ entries, onAdd }) => {
  const todayEntry = entries.find(e => {
    const today = new Date();
    return e.date.getDate() === today.getDate() && 
           e.date.getMonth() === today.getMonth() && 
           e.date.getFullYear() === today.getFullYear();
  }) || entries[1]; // Fallback to Petrichor for demo

  return (
    <div className="h-full flex flex-col">
      {/* Top Header */}
      <header class="w-full px-6 py-4 flex justify-between items-center z-10">
        <button class="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span class="material-icons-round text-slate-500 dark:text-slate-400">settings</span>
        </button>
        <div class="flex flex-col items-center">
          <span class="text-xs uppercase tracking-widest text-primary font-semibold">Streak</span>
          <div class="flex items-center gap-1">
            <span class="material-icons-round text-orange-400 text-sm">local_fire_department</span>
            <span class="text-lg font-bold text-slate-900 dark:text-white">24 Days</span>
          </div>
        </div>
        <button class="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span class="material-icons-round text-slate-500 dark:text-slate-400">calendar_today</span>
        </button>
      </header>

      {/* Carousel */}
      <main class="flex-1 relative flex flex-col justify-center items-center w-full overflow-hidden">
        {/* Background Decoration */}
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div class="relative w-full h-[75%] flex items-center overflow-x-auto snap-x snap-mandatory no-scrollbar px-8 gap-4">
          {/* Previous Card (Peek) */}
          <div class="snap-center shrink-0 w-[85%] h-full flex items-center justify-center opacity-40 scale-90 transition-all duration-300">
            <div class="w-full h-[90%] bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700/50 flex flex-col relative overflow-hidden">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Wed, Oct 23</span>
              <div class="flex-1 flex flex-col justify-center">
                <h2 class="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Photosynthesis</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">The process by which green plants and some other organisms use sunlight to synthesize foods...</p>
              </div>
            </div>
          </div>

          {/* Active Card */}
          <div class="snap-center shrink-0 w-[85%] h-full flex items-center justify-center z-10 transition-all duration-300">
            <div class="w-full h-full bg-white dark:bg-[#1a232e] rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700/50 flex flex-col relative overflow-hidden group">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
              
              <div class="flex justify-between items-start mb-8 relative z-10 shrink-0">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-primary uppercase tracking-widest mb-1">Today</span>
                  <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Thu, Oct 24</span>
                </div>
                <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {todayEntry.category}
                </span>
              </div>

              {/* Title - Always Visible */}
              <div class="relative z-10 shrink-0 mb-4">
                <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  {todayEntry.title}
                </h1>
              </div>

              {/* Scrollable Content Area */}
              <div class="flex-1 flex flex-col items-start relative z-10 overflow-y-auto no-scrollbar min-h-0">
                {todayEntry.phonetic && (
                  <div class="flex items-center gap-2 mb-6 text-slate-400 italic">
                    <span class="font-serif text-lg">{todayEntry.phonetic}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-500"></span>
                    <span class="text-sm font-medium not-italic bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-tighter">noun</span>
                  </div>
                )}
                <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                  {todayEntry.content}
                </p>
                {todayEntry.example && (
                  <div class="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-primary w-full">
                    <p class="text-sm text-slate-500 dark:text-slate-400 italic">"{todayEntry.example}"</p>
                  </div>
                )}
              </div>

              <div class="mt-auto pt-6 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 relative z-10 shrink-0">
                <button class="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
                  <span class="material-icons-round text-xl">favorite_border</span>
                </button>
                <div class="flex gap-3">
                  <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                    <span class="material-icons-round text-xl">volume_up</span>
                  </button>
                  <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                    <span class="material-icons-round text-xl">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Next Card */}
          <div class="snap-center shrink-0 w-[85%] h-full flex items-center justify-center opacity-40 scale-90 transition-all duration-300">
            <div class="w-full h-[90%] bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700/50 flex flex-col justify-center items-center relative overflow-hidden border-dashed border-2">
              <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                  <span class="material-icons-round text-2xl">add</span>
                </div>
                <span class="text-sm font-medium">Tomorrow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div class="flex justify-center gap-2 mt-6">
          <div class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div class="w-6 h-1.5 rounded-full bg-primary"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
      </main>

      <div className="h-20 shrink-0" /> {/* Spacer for bottom nav */}
    </div>
  );
};

export default Home;
