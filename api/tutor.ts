import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runTutorChat, type ChatTurn } from '../lib-server/tutor';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY не настроен. Получите бесплатный ключ: https://aistudio.google.com/apikey',
    });
  }

  const body = req.body as { message?: string; history?: ChatTurn[] };
  const message = body.message?.trim();
  if (!message) return res.status(400).json({ error: 'Сообщение пустое' });

  try {
    const reply = await runTutorChat(
      message,
      body.history ?? [],
      apiKey,
      process.env.GEMINI_MODEL
    );
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Tutor API error:', err);
    return res.status(502).json({ error: 'Ошибка ответа AI-сервиса' });
  }
}
