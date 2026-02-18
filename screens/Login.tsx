import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(email, username, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
            <span className="material-icons-round text-white text-3xl">auto_stories</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Memento</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your daily learning journal</p>
        </div>

        {/* Tab switcher */}
        <div className="w-full flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <span className="material-icons-round text-red-500 text-base">error_outline</span>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="material-icons-round animate-spin text-xl">refresh</span>
            ) : (
              <>
                {tab === 'login' ? 'Sign In' : 'Create Account'}
                <span className="material-icons-round text-xl">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* iOS home indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full opacity-50" />
      </div>
    </div>
  );
};

export default Login;
