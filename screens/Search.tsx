import React, { useState } from 'react';
import { EntryCategory, JournalEntry } from '../types';
import * as api from '../api';

interface SearchProps {
  entries: JournalEntry[];
  onEntryDeleted: (id: string) => void;
  onEntryUpdated: (entry: JournalEntry) => void;
}

const categoryColors: Record<EntryCategory, string> = {
  [EntryCategory.FACT]: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  [EntryCategory.WORD]: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  [EntryCategory.INSIGHT]: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  [EntryCategory.QUOTE]: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
};

const Search: React.FC<SearchProps> = ({ entries, onEntryDeleted, onEntryUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const categories = ['All', ...Object.values(EntryCategory)];

  const results = entries.filter((e) => {
    const matchCat = selectedCategory === 'All' || e.category === selectedCategory;
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || e.title.toLowerCase().includes(term) || e.content.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    setDeletingId(id);
    try {
      await api.deleteEntry(id);
      onEntryDeleted(id);
    } catch { /* ignore */ } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = async (entry: JournalEntry) => {
    if (togglingId) return;
    setTogglingId(entry.id);
    try {
      const updated = await api.toggleFavorite(entry.id);
      onEntryUpdated(updated);
    } catch { /* ignore */ } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar">
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 pb-24 flex flex-col gap-6">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Journal</h1>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-round text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm transition-all"
              placeholder="Search facts, words, insights..."
              type="text"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="material-icons-round text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">close</span>
              </button>
            )}
          </div>
        </header>

        {/* Category filters */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</h2>
            <button onClick={() => setSelectedCategory('All')} className="text-primary text-sm font-medium">Clear</button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-none px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/20 border border-primary'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Results count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-500">{results.length} result{results.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Results */}
        <section className="space-y-4">
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center gap-3">
              <span className="material-icons-round text-4xl text-slate-300 dark:text-slate-600">search_off</span>
              <p className="text-slate-500 dark:text-slate-400 text-sm">No entries match your search.</p>
            </div>
          ) : (
            results.map((item) => (
              <article key={item.id} className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${categoryColors[item.category]}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{formatDate(item.created_at)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {searchTerm && item.title.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <span className="bg-primary/20 text-primary dark:text-blue-300 px-0.5 rounded">{item.title}</span>
                  ) : item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{item.content}</p>

                {/* Actions row */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handleToggleFavorite(item)}
                    disabled={togglingId === item.id}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <span className={`material-icons-round text-base ${item.is_favorite ? 'text-red-400' : ''}`}>
                      {item.is_favorite ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-icons-round text-base">
                      {deletingId === item.id ? 'hourglass_empty' : 'delete_outline'}
                    </span>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default Search;
