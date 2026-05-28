import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runTutor, type ChatTurn } from '../lib-server/tutor-engine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body =
    typeof req.body === 'string'
      ? (JSON.parse(req.body) as { message?: string; history?: ChatTurn[] })
      : (req.body as { message?: string; history?: ChatTurn[] });

  const message = body.message?.trim();
  if (!message) return res.status(400).json({ error: 'Сообщение пустое' });

  try {
    const reply = await runTutor(message, body.history ?? [], {
      groqApiKey: process.env.GROQ_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
      groqModel: process.env.GROQ_MODEL,
      geminiModel: process.env.GEMINI_MODEL,
    });
    return res.status(200).json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ошибка AI';
    console.error('Tutor API:', msg);
    return res.status(502).json({ error: msg });
  }
}
