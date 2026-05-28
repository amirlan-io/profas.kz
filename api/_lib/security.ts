import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_ORIGINS = [
  'https://profas.kz',
  'https://www.profas.kz',
  'https://profas-kz.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const MAX_MESSAGE_LEN = 2000;
const MAX_HISTORY_ITEMS = 10;
const MAX_HISTORY_ITEM_LEN = 4000;

export function getAllowedOrigins(): string[] {
  const extra = process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ?? [];
  return [...new Set([...DEFAULT_ORIGINS, ...extra])];
}

export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  const allowed = getAllowedOrigins();

  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (!origin || allowed.includes(origin)) {
      res.status(204).end();
      return true;
    }
    res.status(403).json({ error: 'Forbidden' });
    return true;
  }

  if (origin && !allowed.includes(origin)) {
    res.status(403).json({ error: 'Forbidden' });
    return true;
  }

  return false;
}

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export function validateTutorPayload(body: unknown): { message: string; history: ChatTurn[] } | null {
  if (!body || typeof body !== 'object') return null;
  const raw = body as { message?: unknown; history?: unknown };

  if (typeof raw.message !== 'string') return null;
  const message = raw.message.trim();
  if (!message || message.length > MAX_MESSAGE_LEN) return null;

  const history: ChatTurn[] = [];
  if (Array.isArray(raw.history)) {
    for (const item of raw.history.slice(-MAX_HISTORY_ITEMS)) {
      if (
        item &&
        typeof item === 'object' &&
        (item as ChatTurn).role &&
        ((item as ChatTurn).role === 'user' || (item as ChatTurn).role === 'assistant') &&
        typeof (item as ChatTurn).content === 'string'
      ) {
        const content = (item as ChatTurn).content.trim().slice(0, MAX_HISTORY_ITEM_LEN);
        if (content) history.push({ role: (item as ChatTurn).role, content });
      }
    }
  }

  return { message, history };
}

export function parseAndValidateBody(req: VercelRequest): { message: string; history: ChatTurn[] } | null {
  let body: unknown;
  try {
    body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body;
  } catch {
    return null;
  }
  return validateTutorPayload(body);
}

export function safeErrorMessage(err: unknown): string {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  if (isProd) return 'Сервис временно недоступен. Попробуйте позже.';
  return err instanceof Error ? err.message : 'Ошибка AI';
}
