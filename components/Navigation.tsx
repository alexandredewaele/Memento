import React from 'react'
import { ScreenType } from '../types'

interface NavigationProps {
  currentScreen: ScreenType
  onNavigate: (screen: ScreenType) => void
  username: string
  onLogout: () => void
}

const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onNavigate,
  username,
  onLogout,
}) => {
  const tabs: { type: ScreenType; icon: string; label: string }[] = [
    { type: 'home', icon: 'home', label: 'Home' },
    { type: 'search', icon: 'search', label: 'Search' },
    { type: 'history', icon: 'calendar_today', label: 'History' },
    { type: 'profile', icon: 'person', label: 'Profile' },
  ]

  return (
    <aside className="w-64 shrink-0 h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
          <span className="material-icons-round text-white text-xl">
            auto_stories
          </span>
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Memento
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.type
          return (
            <button
              key={tab.type}
              onClick={() => onNavigate(tab.type)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-icons-round text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}

        {/* New Entry button */}
        <button
          onClick={() => onNavigate('new')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-2 ${
            currentScreen === 'new'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-primary text-white shadow-md shadow-primary/20 hover:bg-blue-600'
          }`}
        >
          <span className="material-icons-round text-xl">add</span>
          New Entry
        </button>
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-icons-round text-primary text-base">
              person
            </span>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate flex-1">
            {username}
          </span>
          <button
            onClick={onLogout}
            title="Sign out"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
          >
            <span className="material-icons-round text-base">logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Navigation
