import React, { useState } from 'react'
import { JournalEntry } from '../types'

interface HistoryProps {
  entries: JournalEntry[]
}

const History: React.FC<HistoryProps> = ({ entries }) => {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate())

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    'en-US',
    { month: 'long', year: 'numeric' },
  )
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7

  const entryDays = new Set(
    entries
      .filter((e) => {
        const d = new Date(e.created_at)
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth
      })
      .map((e) => new Date(e.created_at).getDate()),
  )

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else setViewMonth((m) => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else setViewMonth((m) => m + 1)
    setSelectedDay(null)
  }

  const selectedEntry = selectedDay
    ? entries.find((e) => {
        const d = new Date(e.created_at)
        return (
          d.getFullYear() === viewYear &&
          d.getMonth() === viewMonth &&
          d.getDate() === selectedDay
        )
      })
    : null

  const totalEntries = entries.length
  const streak = (() => {
    let count = 0
    const check = new Date()
    check.setHours(0, 0, 0, 0)
    const daySet = new Set(
      entries.map((e) => {
        const d = new Date(e.created_at)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      }),
    )
    while (daySet.has(check.getTime())) {
      count++
      check.setDate(check.getDate() - 1)
    }
    return count
  })()

  return (
    <div className="flex h-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Left: Calendar panel */}
      <div className="w-96 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-y-auto">
        {/* Stats */}
        <div className="px-6 pt-8 pb-4 grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Streak
            </p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-primary">{streak}</span>
              <span className="text-sm text-slate-400 mb-0.5">days</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Total
            </p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-emerald-400">
                {totalEntries}
              </span>
              <span className="text-sm text-slate-400 mb-0.5">items</span>
            </div>
          </div>
        </div>

        {/* Month navigation */}
        <div className="px-6 py-3 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
          >
            <span className="material-icons-round">chevron_left</span>
          </button>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {monthName}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
          >
            <span className="material-icons-round">chevron_right</span>
          </button>
        </div>

        {/* Calendar */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-slate-400 py-2"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1 gap-x-0">
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const isSelected = day === selectedDay
              const hasEntry = entryDays.has(day)
              const isToday =
                day === now.getDate() &&
                viewMonth === now.getMonth() &&
                viewYear === now.getFullYear()

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-10 w-full flex flex-col items-center justify-center rounded-xl relative transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : isToday
                        ? 'border border-primary text-primary'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{day}</span>
                  {hasEntry && !isSelected && (
                    <span className="w-1 h-1 bg-primary rounded-full mt-0.5" />
                  )}
                  {hasEntry && isSelected && (
                    <span className="w-1 h-1 bg-white rounded-full mt-0.5 opacity-80" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: Day detail */}
      <div className="flex-1 overflow-y-auto p-10">
        {selectedDay ? (
          <>
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
              {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString(
                'en-US',
                {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                },
              )}
            </h2>
            {selectedEntry ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 max-w-2xl">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {selectedEntry.category}
                  </span>
                  <span
                    className={`material-icons-round text-xl ${selectedEntry.is_favorite ? 'text-red-400' : 'text-slate-300 dark:text-slate-600'}`}
                  >
                    {selectedEntry.is_favorite ? 'favorite' : 'favorite_border'}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {selectedEntry.title}
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedEntry.content}
                </p>
                {selectedEntry.example && (
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-l-4 border-primary">
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                      &quot;{selectedEntry.example}&quot;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-24 text-center gap-3">
                <span className="material-icons-round text-5xl text-slate-300 dark:text-slate-600">
                  event_busy
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  No entry recorded for this day.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-600">
            <span className="material-icons-round text-6xl mb-4 opacity-30">
              calendar_today
            </span>
            <p className="text-sm">Select a day to see your entry</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default History
