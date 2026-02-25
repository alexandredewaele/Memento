import React, { useState, useEffect, useCallback } from 'react'
import { ScreenType, JournalEntry } from './types'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './screens/Home'
import Search from './screens/Search'
import NewEntry from './screens/NewEntry'
import History from './screens/History'
import Login from './screens/Login'
import Navigation from './components/Navigation'
import * as api from './api'

const AppContent: React.FC = () => {
  const { user, isLoading, logout } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [entriesLoading, setEntriesLoading] = useState(false)

  const fetchEntries = useCallback(async () => {
    setEntriesLoading(true)
    try {
      const res = await api.getEntries({ limit: 100 })
      setEntries(res.entries)
    } catch {
      // token may be expired — logout handled by AuthContext
    } finally {
      setEntriesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchEntries()
      setCurrentScreen('home')
    } else {
      setEntries([])
    }
  }, [user, fetchEntries])

  const handleEntryCreated = (entry: JournalEntry) => {
    setEntries((prev) => [entry, ...prev])
    setCurrentScreen('home')
  }

  const handleEntryUpdated = (updated: JournalEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
  }

  const handleEntryDeleted = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="material-icons-round animate-spin text-primary text-4xl">
          refresh
        </span>
      </div>
    )
  }

  if (!user) {
    return <Login />
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
        )
      case 'search':
        return (
          <Search
            entries={entries}
            onEntryDeleted={handleEntryDeleted}
            onEntryUpdated={handleEntryUpdated}
          />
        )
      case 'new':
        return (
          <NewEntry
            onSaved={handleEntryCreated}
            onCancel={() => setCurrentScreen('home')}
          />
        )
      case 'history':
        return <History entries={entries} />
      case 'profile':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-icons-round text-white text-4xl">
                person
              </span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.username}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {user.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <span className="material-icons-round">logout</span>
              Sign Out
            </button>
          </div>
        )
      default:
        return (
          <Home
            entries={entries}
            loading={entriesLoading}
            onAdd={() => setCurrentScreen('new')}
            onFavoriteToggled={handleEntryUpdated}
          />
        )
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display">
      {/* Sidebar Navigation */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        username={user.username}
        onLogout={logout}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderScreen()}
      </main>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
