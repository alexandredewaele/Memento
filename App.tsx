import React, { useState, useEffect, useCallback } from 'react';
import { ScreenType, JournalEntry } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './screens/Home';
import Search from './screens/Search';
import NewEntry from './screens/NewEntry';
import History from './screens/History';
import Login from './screens/Login';
import Navigation from './components/Navigation';
import * as api from './api';

const AppContent: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    setEntriesLoading(true);
    try {
      const res = await api.getEntries({ limit: 100 });
      setEntries(res.entries);
    } catch {
      // token may be expired — logout handled by AuthContext
    } finally {
      setEntriesLoading(false);
    }
  }, []);

  // Fetch entries whenever the user logs in
  useEffect(() => {
    if (user) {
      fetchEntries();
      setCurrentScreen('home');
    } else {
      setEntries([]);
    }
  }, [user, fetchEntries]);

  const handleEntryCreated = (entry: JournalEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setCurrentScreen('home');
  };

  const handleEntryUpdated = (updated: JournalEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleEntryDeleted = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Show nothing while restoring session
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="material-icons-round animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  // Not logged in → show Login
  if (!user) {
    return <Login />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home
            entries={entries}
            loading={entriesLoading}
            onAdd={() => setCurrentScreen('new')}
            onFavoriteToggled={handleEntryUpdated}
          />
        );
      case 'search':
        return (
          <Search
            entries={entries}
            onEntryDeleted={handleEntryDeleted}
            onEntryUpdated={handleEntryUpdated}
          />
        );
      case 'new':
        return (
          <NewEntry
            onSaved={handleEntryCreated}
            onCancel={() => setCurrentScreen('home')}
          />
        );
      case 'history':
        return <History entries={entries} />;
      case 'profile':
        return (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-8">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="material-icons-round text-white text-3xl">person</span>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900 dark:text-white">{user.username}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-800 hover:bg-red-100 transition-colors"
            >
              <span className="material-icons-round">logout</span>
              Sign Out
            </button>
          </div>
        );
      default:
        return <Home entries={entries} loading={entriesLoading} onAdd={() => setCurrentScreen('new')} onFavoriteToggled={handleEntryUpdated} />;
    }
  };

  return (
    <>
      <div className="flex-1 overflow-hidden relative">
        {renderScreen()}
      </div>
      {currentScreen !== 'new' && (
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="flex justify-center min-h-screen md:py-8 font-display">
        <div className="relative w-full max-w-md h-[100dvh] md:h-[844px] bg-background-light dark:bg-background-dark md:rounded-[2.5rem] md:shadow-2xl overflow-hidden flex flex-col md:border-[8px] md:border-gray-800 transition-all duration-500">
          {/* iOS-style Status Bar */}
          <div className="h-10 w-full flex items-center justify-between px-6 pt-2 shrink-0 z-50">
            <span className="text-xs font-semibold opacity-80">9:41</span>
            <div className="flex gap-1 items-center">
              <span className="material-icons-round text-[14px]">signal_cellular_alt</span>
              <span className="material-icons-round text-[14px]">wifi</span>
              <span className="material-icons-round text-[14px]">battery_full</span>
            </div>
          </div>
          <AppContent />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
