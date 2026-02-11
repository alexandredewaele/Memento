
import React, { useState, useEffect } from 'react';
import { ScreenType, JournalEntry, EntryCategory } from './types';
import Home from './screens/Home';
import Search from './screens/Search';
import NewEntry from './screens/NewEntry';
import History from './screens/History';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(2023, 9, 23),
      title: 'Photosynthesis',
      content: 'The process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.',
      category: EntryCategory.FACT,
    },
    {
      id: '2',
      date: new Date(2023, 9, 24),
      title: 'Petrichor',
      content: 'A pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather.',
      category: EntryCategory.WORD,
      phonetic: '/ˈpeˌtrīkôr/',
      example: 'He paused to inhale the petrichor rising from the damp pavement.',
      isFavorite: true
    },
    {
      id: '3',
      date: new Date(2023, 10, 12),
      title: 'Serendipity',
      content: 'The occurrence and development of events by chance in a happy or beneficial way.',
      category: EntryCategory.WORD,
      isFavorite: true
    }
  ]);

  const handleAddEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setEntries([newEntry, ...entries]);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home entries={entries} onAdd={() => setCurrentScreen('new')} />;
      case 'search':
        return <Search entries={entries} />;
      case 'new':
        return <NewEntry onSave={handleAddEntry} onCancel={() => setCurrentScreen('home')} />;
      case 'history':
        return <History entries={entries} />;
      default:
        return <Home entries={entries} onAdd={() => setCurrentScreen('new')} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen md:py-8 font-display">
      <div className="relative w-full max-w-md h-[100dvh] md:h-[844px] bg-background-light dark:bg-background-dark md:rounded-[2.5rem] md:shadow-2xl overflow-hidden flex flex-col md:border-[8px] md:border-gray-800 transition-all duration-500">
        {/* iOS-style Status Bar Area */}
        <div className="h-10 w-full flex items-center justify-between px-6 pt-2 shrink-0 z-50">
          <span className="text-xs font-semibold opacity-80">9:41</span>
          <div className="flex gap-1 items-center">
            <span className="material-icons-round text-[14px]">signal_cellular_alt</span>
            <span className="material-icons-round text-[14px]">wifi</span>
            <span className="material-icons-round text-[14px]">battery_full</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {renderScreen()}
        </div>

        {/* Navigation - Always Visible except on New Entry */}
        {currentScreen !== 'new' && (
          <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
};

export default App;
