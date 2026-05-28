import type { VercelRequest, VercelResponse } from '@vercel/node';

type ChatTurn = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `Ты — AI-тьютор учебного центра ТОО ProfAs.kz (Казахстан).
Помогаешь с курсами: ПТМ (пожарная безопасность), БиОТ (охрана труда), промышленная безопасность, электробезопасность, ДОПОГ.
Отвечай на русском языке, кратко и по делу (2–4 абзаца максимум).
Если вопрос не по теме обучения — вежливо перенаправь к теме курсов ProfAs.kz.`;

async function callGemini(
  message: string,
  history: ChatTurn[],
  apiKey: string,
  model: string
): Promise<string> {
  const contents = [
    ...history.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const geminiRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
    }),
  });

  const raw = await geminiRes.text();
  let data: {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };

  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new Error(`Gemini parse error: ${raw.slice(0, 200)}`);
  }

  if (!geminiRes.ok) {
    throw new Error(data.error?.message ?? `Gemini HTTP ${geminiRes.status}`);
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error('Пустой ответ от Gemini');
  return reply;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY не настроен в Vercel → Settings → Environment Variables',
    });
  }

  const body =
    typeof req.body === 'string'
      ? (JSON.parse(req.body) as { message?: string; history?: ChatTurn[] })
      : (req.body as { message?: string; history?: ChatTurn[] });

  const message = body.message?.trim();
  if (!message) return res.status(400).json({ error: 'Сообщение пустое' });

  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-1.5-flash';

  try {
    const reply = await callGemini(message, body.history ?? [], apiKey, model);
    return res.status(200).json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Tutor API:', msg);
    return res.status(502).json({ error: msg });
  }
}
