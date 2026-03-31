import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Audience } from './components/Audience';
import { Courses } from './components/Courses';
import { ConsultationCTA } from './components/ConsultationCTA';
import { Benefits } from './components/Benefits';
import { Process } from './components/Process';
import { Accreditation } from './components/Accreditation';
import { FAQ } from './components/FAQ';
import { Reviews } from './components/Reviews';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { SuperadminUsersPanel } from './components/SuperadminUsersPanel';
import { ContentAdminPanel } from './components/ContentAdminPanel';
import { ContentProvider, useContentReload } from './context/ContentContext';
import { authApi } from './lib/api';

type AuthUser = {
  id: string;
  email: string;
  role: 'superadmin' | 'admin';
  mustChangePassword?: boolean;
};

const ADMIN_STORAGE_KEY = 'profas.adminUser';

function SiteContent() {
  useContentReload();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <Audience />
      <Courses />
      <ConsultationCTA />
      <Benefits />
      <Process />
      <Accreditation />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

function AdminPage() {
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) {
      setIsCheckingSession(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as AuthUser;
      void authApi.me()
        .then(() => {
          setAdminUser(parsed);
        })
        .catch(() => {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        })
        .finally(() => setIsCheckingSession(false));
    } catch {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      setIsCheckingSession(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await authApi.login(login, password);
      const user = (res as { user?: AuthUser }).user;
      if (!user) throw new Error('Не удалось войти');
      setAdminUser(user);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
      setPassword('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка входа';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore server logout errors and clear local session anyway.
    } finally {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      setAdminUser(null);
      setLogin('');
      setPassword('');
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-600 shadow-sm">Проверяем сессию администратора...</div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-xl border border-slate-200">
          <div className="mb-6">
            <Link to="/" className="text-sm text-orange-500 hover:text-orange-600 transition">← На сайт</Link>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Панель Администратора</h1>
            <p className="text-slate-500 mt-2">Введите логин и пароль для входа.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Логин</span>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500"
                placeholder="admin@profas.kz"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Пароль</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500"
                placeholder="Введите пароль"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Входим…' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-slate-950 text-white px-4 md:px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-black text-lg">A</div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-widest">CMS</div>
            <div className="font-bold leading-tight">{adminUser.email}</div>
          </div>
          <span className="ml-2 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1">{adminUser.role}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-semibold transition">
            На сайт
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 px-4 py-2 text-sm font-semibold transition"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6">
        {adminUser.role === 'superadmin' ? <SuperadminUsersPanel /> : <ContentAdminPanel />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <Routes>
        <Route path="/" element={<SiteContent />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ContentProvider>
  );
}
