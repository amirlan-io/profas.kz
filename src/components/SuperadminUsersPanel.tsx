import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/src/lib/api';

type UserRole = 'superadmin' | 'admin';

type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt?: string;
};

export const SuperadminUsersPanel = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('admin');

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => (a.email > b.email ? 1 : -1));
  }, [users]);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<{ users: AdminUser[] }>('/admin/users');
      setUsers(res.users ?? []);
    } catch (err: any) {
      setError(err?.message ?? 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/admin/users', { email: newEmail, password: newPassword, role: newRole });
      setNewEmail('');
      setNewPassword('');
      setNewRole('admin');
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Не удалось создать пользователя');
    }
  };

  const setStatus = async (id: string, isActive: boolean) => {
    setError(null);
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive });
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Не удалось обновить статус');
    }
  };

  const setRole = async (id: string, role: UserRole) => {
    setError(null);
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Не удалось обновить роль');
    }
  };

  const resetPassword = async (id: string) => {
    const pwd = prompt('Новый временный пароль');
    if (!pwd) return;
    setError(null);
    try {
      await api.post(`/admin/users/${id}/reset-password`, { password: pwd });
      await load();
    } catch (err: any) {
      setError(err?.message ?? 'Не удалось сбросить пароль');
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Управление администраторами</h3>
          <p className="text-slate-500">Создание, блокировка, смена ролей и сброс паролей.</p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          Обновить
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={createUser} className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
          required
        />
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="временный пароль"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
          required
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as UserRole)}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
        >
          <option value="admin">admin</option>
          <option value="superadmin">superadmin</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 transition"
        >
          Создать
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left font-bold px-4 py-3">Email</th>
              <th className="text-left font-bold px-4 py-3">Роль</th>
              <th className="text-left font-bold px-4 py-3">Статус</th>
              <th className="text-left font-bold px-4 py-3">Пароль</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={4}>
                  Загрузка…
                </td>
              </tr>
            ) : (
              sortedUsers.map((u) => (
                <tr key={u.id} className="bg-white">
                  <td className="px-4 py-4 font-semibold text-slate-900">{u.email}</td>
                  <td className="px-4 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => void setRole(u.id, e.target.value as UserRole)}
                      className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-orange-500"
                    >
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => void setStatus(u.id, !u.isActive)}
                      className={`rounded-lg px-3 py-2 font-semibold transition ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {u.isActive ? 'Активен' : 'Выключен'}
                    </button>
                    {u.mustChangePassword && (
                      <div className="mt-1 text-xs font-semibold text-orange-600">требует смены пароля</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => void resetPassword(u.id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Сбросить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

