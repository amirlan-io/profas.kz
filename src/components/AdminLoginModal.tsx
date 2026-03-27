import React, { useState } from 'react';
import { authApi } from '@/src/lib/api';

type AuthUser = {
  id: string;
  email: string;
  role: 'superadmin' | 'admin';
  mustChangePassword?: boolean;
};

type AdminLoginModalProps = {
  open: boolean;
  onClose: () => void;
  onLoggedIn: (user: AuthUser) => void;
};

export const AdminLoginModal = ({ open, onClose, onLoggedIn }: AdminLoginModalProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await authApi.login(login, password);
      const user = (res as any).user as AuthUser | undefined;
      if (!user) throw new Error('Не удалось войти');
      onLoggedIn(user);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Ошибка входа');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Закрыть окно входа"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Панель Администратора</h3>
        <p className="text-slate-500 mb-6">Введите логин и пароль для входа.</p>

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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Входим…' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
