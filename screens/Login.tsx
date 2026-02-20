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
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-primary to-blue-700 p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-12 left-12 w-48 h-48 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-12 right-12 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/30">
            <span className="material-icons-round text-white text-4xl">auto_stories</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Memento</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Your daily learning journal. Capture facts, words, insights, and quotes — one entry at a time.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            {[
              { icon: 'lightbulb', label: 'Facts', desc: 'Remember what matters' },
              { icon: 'spellcheck', label: 'Words', desc: 'Expand your vocabulary' },
              { icon: 'visibility', label: 'Insights', desc: 'Capture clarity' },
              { icon: 'format_quote', label: 'Quotes', desc: 'Inspiring words' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <span className="material-icons-round text-blue-200 text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-blue-200">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 max-w-lg mx-auto lg:mx-0">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-3">
            <span className="material-icons-round text-white text-2xl">auto_stories</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Memento</h1>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            {tab === 'login' ? 'Sign in to your journal' : 'Start your learning journey today'}
          </p>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-primary hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
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
      </div>
    </div>
  );
};

export default Login;
