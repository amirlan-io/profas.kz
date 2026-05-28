import type { VercelRequest, VercelResponse } from '@vercel/node';

type ChatTurn = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `Ты — AI-тьютор учебного центра ТОО ProfAs.kz (Казахстан).
Помогаешь с курсами: ПТМ (пожарная безопасность), БиОТ (охрана труда), промышленная безопасность, электробезопасность, ДОПОГ.
Отвечай на русском языке, кратко и по делу (2–4 абзаца максимум).
Если вопрос не по теме обучения — вежливо перенаправь к теме курсов ProfAs.kz.`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function isQuotaError(msg: string) {
  return /quota|rate.?limit|429|too many|resource exhausted/i.test(msg);
}

async function callGroq(
  message: string,
  history: ChatTurn[],
  apiKey: string,
  model: string
): Promise<string> {
  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...history.slice(-10).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: message },
  ];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  const raw = await res.text();
  let data: {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new Error(`Groq parse: ${raw.slice(0, 150)}`);
  }

  if (!res.ok) {
    throw new Error(data.error?.message ?? `Groq HTTP ${res.status}`);
  }

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('Пустой ответ от Groq');
  return reply;
}

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

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
    }),
  });

  const raw = await res.text();
  let data: {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new Error(`Gemini parse: ${raw.slice(0, 150)}`);
  }

  if (!res.ok) {
    throw new Error(data.error?.message ?? `Gemini HTTP ${res.status}`);
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error('Пустой ответ от Gemini');
  return reply;
}

async function runTutor(message: string, history: ChatTurn[]): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const groqModel = process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant';
  const geminiModels = [
    process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash-8b',
  ].filter((m, i, a) => a.indexOf(m) === i);

  const errors: string[] = [];

  if (groqKey) {
    try {
      return await callGroq(message, history, groqKey, groqModel);
    } catch (e) {
      errors.push(`Groq: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (geminiKey) {
    for (const model of geminiModels) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          return await callGemini(message, history, geminiKey, model);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          errors.push(`Gemini(${model}): ${msg}`);
          if (isQuotaError(msg) && attempt < 2) {
            await sleep(4000 * (attempt + 1));
            continue;
          }
          if (!isQuotaError(msg)) break;
        }
      }
    }
  }

  if (!groqKey && !geminiKey) {
    throw new Error('AI не настроен. Добавьте GROQ_API_KEY в Vercel.');
  }

  throw new Error(errors[errors.length - 1] ?? 'Не удалось получить ответ от AI');
}

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
    const reply = await runTutor(message, body.history ?? []);
    return res.status(200).json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Ошибка AI';
    console.error('Tutor API:', msg);
    return res.status(502).json({ error: msg });
  }
}
