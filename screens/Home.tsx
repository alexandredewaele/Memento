import React, { useState } from 'react';
import { JournalEntry } from '../types';
import * as api from '../api';

interface HomeProps {
  entries: JournalEntry[];
  loading: boolean;
  onAdd: () => void;
  onFavoriteToggled: (entry: JournalEntry) => void;
}

const Home: React.FC<HomeProps> = ({ entries, loading, onAdd, onFavoriteToggled }) => {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleFavorite = async (entry: JournalEntry) => {
    if (togglingId) return;
    setTogglingId(entry.id);
    try {
      const updated = await api.toggleFavorite(entry.id);
      onFavoriteToggled(updated);
    } catch { /* ignore */ } finally {
      setTogglingId(null);
    }
  };

  // Most recent entry is "today's"
  const todayEntry = entries[0] ?? null;
  const prevEntry = entries[1] ?? null;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="material-icons-round animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  if (!todayEntry) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="material-icons-round text-primary text-3xl">auto_stories</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No entries yet</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Tap the + button to capture your first learning.</p>
        <button
          onClick={onAdd}
          className="mt-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors"
        >
          Add First Entry
        </button>
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="h-full flex flex-col">
      {/* Top Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center z-10">
        <button className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-icons-round text-slate-500 dark:text-slate-400">settings</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Journal</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">{entries.length} Entries</span>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-icons-round text-slate-500 dark:text-slate-400">calendar_today</span>
        </button>
      </header>

      {/* Carousel */}
      <main className="flex-1 relative flex flex-col justify-center items-center w-full overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full h-[75%] flex items-center overflow-x-auto snap-x snap-mandatory no-scrollbar px-8 gap-4">
          {/* Previous card peek */}
          {prevEntry && (
            <div className="snap-center shrink-0 w-[85%] h-full flex items-center justify-center opacity-40 scale-90 transition-all duration-300">
              <div className="w-full h-[90%] bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700/50 flex flex-col relative overflow-hidden">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{formatDate(prevEntry.created_at)}</span>
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">{prevEntry.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{prevEntry.content}</p>
                </div>
              </div>
            </div>
          )}

          {/* Active card */}
          <div className="snap-center shrink-0 w-[85%] h-full flex items-center justify-center z-10 transition-all duration-300">
            <div className="w-full h-full bg-white dark:bg-[#1a232e] rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-700/50 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full -mr-8 -mt-8" />

              <div className="flex justify-between items-start mb-8 relative z-10 shrink-0">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Latest</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(todayEntry.created_at)}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {todayEntry.category}
                </span>
              </div>

              <div className="relative z-10 shrink-0 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  {todayEntry.title}
                </h1>
              </div>

              <div className="flex-1 flex flex-col items-start relative z-10 overflow-y-auto no-scrollbar min-h-0">
                {todayEntry.phonetic && (
                  <div className="flex items-center gap-2 mb-6 text-slate-400 italic">
                    <span className="font-serif text-lg">{todayEntry.phonetic}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    <span className="text-sm font-medium not-italic bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-tighter">noun</span>
                  </div>
                )}
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                  {todayEntry.content}
                </p>
                {todayEntry.example && (
                  <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-4 border-primary w-full">
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{todayEntry.example}"</p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 relative z-10 shrink-0">
                <button
                  onClick={() => handleToggleFavorite(todayEntry)}
                  disabled={togglingId === todayEntry.id}
                  className="flex items-center gap-2 transition-colors"
                >
                  <span className={`material-icons-round text-xl ${todayEntry.is_favorite ? 'text-red-400' : 'text-slate-400 hover:text-red-400'}`}>
                    {todayEntry.is_favorite ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
                <div className="flex gap-3">
                  <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-icons-round text-xl">volume_up</span>
                  </button>
                  <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-icons-round text-xl">share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add new card */}
          <div className="snap-center shrink-0 w-[85%] h-full flex items-center justify-center opacity-40 scale-90 transition-all duration-300">
            <button
              onClick={onAdd}
              className="w-full h-[90%] bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <span className="material-icons-round text-2xl text-slate-500">add</span>
              </div>
              <span className="text-sm font-medium text-slate-500">New Entry</span>
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {prevEntry && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />}
          <div className="w-6 h-1.5 rounded-full bg-primary" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
      </main>

      <div className="h-20 shrink-0" />
    </div>
  );
};

export default Home;
