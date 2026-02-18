import React, { useState } from 'react';
import { EntryCategory, JournalEntry } from '../types';
import * as api from '../api';

interface NewEntryProps {
  onSaved: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const NewEntry: React.FC<NewEntryProps> = ({ onSaved, onCancel }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EntryCategory>(EntryCategory.FACT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { type: EntryCategory.FACT, icon: 'lightbulb' },
    { type: EntryCategory.WORD, icon: 'spellcheck' },
    { type: EntryCategory.INSIGHT, icon: 'visibility' },
    { type: EntryCategory.QUOTE, icon: 'format_quote' },
  ];

  const handleSave = async () => {
    if (!content.trim()) return;
    const entryTitle = title.trim() || content.split(' ').slice(0, 3).join(' ') + '...';
    setLoading(true);
    setError('');
    try {
      const entry = await api.createEntry({ title: entryTitle, content, category });
      onSaved(entry);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save entry.');
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div>
          <p className="text-primary font-medium text-sm tracking-wide uppercase">New Entry</p>
          <h1 className="text-2xl font-bold mt-0.5 text-gray-900 dark:text-white">{today}</h1>
        </div>
        <button
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="material-icons-round text-xl">close</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 py-2 overflow-y-auto no-scrollbar">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full bg-transparent border-none text-xl font-bold placeholder:text-gray-300 dark:placeholder:text-gray-700 focus:ring-0 p-0 mb-3 text-gray-900 dark:text-white"
        />

        {/* Content */}
        <div className="flex-1 relative mb-4">
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent border-none resize-none text-lg leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-0 p-0 caret-primary text-gray-900 dark:text-white"
            placeholder="What did you learn today? Capture a fact, a word, or a moment of clarity..."
          />
        </div>

        {/* Categories */}
        <div className="mt-4 mb-6 shrink-0">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Category</label>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const isActive = category === cat.type;
              return (
                <button
                  key={cat.type}
                  onClick={() => setCategory(cat.type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                  }`}
                >
                  <span className="material-icons-round text-base">{cat.icon}</span>
                  {cat.type}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 pt-2 bg-background-light dark:bg-background-dark shrink-0 z-20">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-3">
            <span className="material-icons-round text-red-500 text-base">error_outline</span>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex gap-4 text-gray-400 dark:text-gray-600">
            <button className="hover:text-primary transition-colors"><span className="material-icons-round text-xl">image</span></button>
            <button className="hover:text-primary transition-colors"><span className="material-icons-round text-xl">mic</span></button>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">{content.length}/5000</span>
        </div>
        <button
          onClick={handleSave}
          disabled={!content.trim() || loading}
          className="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 active:scale-[0.98] text-white font-semibold text-lg py-4 rounded-xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="material-icons-round animate-spin text-xl">refresh</span>
          ) : (
            <>Save to Journal <span className="material-icons-round">arrow_forward</span></>
          )}
        </button>
        <div className="flex justify-center pt-6 pb-2 md:pb-0">
          <div className="w-32 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full opacity-50" />
        </div>
      </footer>
    </div>
  );
};

export default NewEntry;
