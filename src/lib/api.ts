const rawBase = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const BASE_URL = rawBase.replace(/\/+$/, '');

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: 'include',          // отправляем и принимаем httpOnly куки
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const errObj = err as { message?: string; error?: string };
    const message =
      (typeof errObj.message === 'string' && errObj.message) ||
      (typeof errObj.error === 'string' && errObj.error) ||
      res.statusText;
    throw Object.assign(new Error(message || 'Request failed'), { status: res.status });
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                  => request<T>('GET',    path),
  post:   <T>(path: string, body?: unknown)  => request<T>('POST',   path, body),
  patch:  <T>(path: string, body?: unknown)  => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                  => request<T>('DELETE', path),
};

// ─── Готовые методы ───────────────────────────────────────────────────────────

export const authApi = {
  login:   (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout:  ()                                => api.post('/auth/logout'),
  refresh: ()                                => api.post('/auth/refresh'),
  me:      ()                                => api.get('/auth/me'),
};

export const contentApi = {
  getPage: (slug: string) => api.get(`/content/${slug}`),
  listPages: ()           => api.get('/content'),
};
