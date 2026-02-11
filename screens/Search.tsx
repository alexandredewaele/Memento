
import React, { useState } from 'react';
import { EntryCategory, JournalEntry } from '../types';

interface SearchProps {
  entries: JournalEntry[];
}

const Search: React.FC<SearchProps> = ({ entries }) => {
  const [searchTerm, setSearchTerm] = useState('Epistemology');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Object.values(EntryCategory)];

  // Mock results for UI parity
  const results = [
    {
      id: 'res-1',
      category: EntryCategory.WORD,
      title: 'Epistemology',
      content: 'The theory of knowledge, especially with regard to its methods, validity, and scope. Epistemology is the investigation of what distinguishes justified belief from opinion.',
      date: 'Oct 12, 2023',
      colorClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    },
    {
      id: 'res-2',
      category: EntryCategory.FACT,
      title: "Plato's Influence",
      content: 'Much of modern epistemology can be traced back to Plato, particularly his dialogue Theaetetus, where Socrates attempts to define knowledge.',
      date: 'Oct 08, 2023',
      colorClass: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'res-3',
      category: EntryCategory.INSIGHT,
      title: 'Learning Models',
      content: 'Applying epistemological frameworks to my daily coding practice helps in debugging - separating assumptions from verified bugs.',
      date: 'Oct 02, 2023',
      colorClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar">
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 pb-24 flex flex-col gap-6">
        {/* Search Header */}
        <header className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Journal</h1>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons-round text-gray-400 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary shadow-sm transition-all" 
              placeholder="Search facts, words, insights..." 
              type="text" 
            />
            <div 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              <span className="material-icons-round text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">close</span>
            </div>
          </div>
        </header>

        {/* Filters Section */}
        <section className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</h2>
              <button 
                onClick={() => setSelectedCategory('All')}
                className="text-primary text-sm font-medium hover:text-blue-400 transition-colors"
              >
                Clear All
              </button>
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
          </div>

          {/* Date Filter */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Date Range</h2>
            <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <span className="material-icons-round text-gray-400 text-sm group-hover:text-primary">calendar_today</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Oct 1, 2023</span>
              </button>
              <span className="text-gray-400 font-light">→</span>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                <span className="material-icons-round text-gray-400 text-sm group-hover:text-primary">event</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Oct 31, 2023</span>
              </button>
            </div>
          </div>
        </section>

        {/* Results Info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-500">3 results found</span>
          <span className="text-xs text-primary cursor-pointer hover:underline">Sort by: Newest</span>
        </div>

        {/* Results List */}
        <section className="space-y-4">
          {results.map((item) => (
            <article key={item.id} className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${item.colorClass}`}>
                  {item.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">{item.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {/* Highlight mock logic */}
                {searchTerm && item.title.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                  <span className="bg-primary/20 text-primary dark:text-blue-300 px-0.5 rounded">{item.title}</span>
                ) : item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {item.content}
              </p>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-icons-round text-gray-400">chevron_right</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Search;
