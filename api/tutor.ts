import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors, parseAndValidateBody, safeErrorMessage, type ChatTurn } from './_lib/security';

const SYSTEM_PROMPT = `Ты — AI-помощник учебного центра ТОО ProfAs.kz (Казахстан).
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
    ...history.map((m) => ({
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
    throw new Error('Groq response parse error');
  }

  if (!res.ok) {
    throw new Error(data.error?.message ?? `Groq HTTP ${res.status}`);
  }

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('Empty Groq response');
  return reply;
}

async function callGemini(
  message: string,
  history: ChatTurn[],
  apiKey: string,
  model: string
): Promise<string> {
  const contents = [
    ...history.map((m) => ({
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
    throw new Error('Gemini response parse error');
  }

  if (!res.ok) {
    throw new Error(data.error?.message ?? `Gemini HTTP ${res.status}`);
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error('Empty Gemini response');
  return reply;
}

async function runTutor(message: string, history: ChatTurn[]): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const groqModel = process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant';
  const geminiModels = [
    process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
  ].filter((m, i, a) => a.indexOf(m) === i);

  const errors: string[] = [];

  if (groqKey) {
    try {
      return await callGroq(message, history, groqKey, groqModel);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }

  if (geminiKey) {
    for (const model of geminiModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await callGemini(message, history, geminiKey, model);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          errors.push(msg);
          if (isQuotaError(msg) && attempt < 1) {
            await sleep(3000);
            continue;
          }
          if (!isQuotaError(msg)) break;
        }
      }
    }
  }

  if (!groqKey && !geminiKey) {
    throw new Error('AI keys not configured');
  }

  throw new Error(errors[errors.length - 1] ?? 'AI unavailable');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = parseAndValidateBody(req);
  if (!parsed) {
    return res.status(400).json({ error: 'Некорректный запрос' });
  }

  try {
    const reply = await runTutor(parsed.message, parsed.history);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Tutor API:', err instanceof Error ? err.message : err);
    return res.status(502).json({ error: safeErrorMessage(err) });
  }
}
