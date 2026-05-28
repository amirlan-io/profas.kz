export type ChatTurn = { role: 'user' | 'assistant'; content: string };

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
    data = JSON.parse(raw);
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
    data = JSON.parse(raw);
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

export type TutorEnv = {
  groqApiKey?: string;
  geminiApiKey?: string;
  groqModel?: string;
  geminiModel?: string;
};

/** Groq first (stable free tier), then Gemini with retries */
export async function runTutor(message: string, history: ChatTurn[], env: TutorEnv): Promise<string> {
  const groqKey = env.groqApiKey?.trim();
  const geminiKey = env.geminiApiKey?.trim();
  const groqModel = env.groqModel?.trim() || 'llama-3.1-8b-instant';
  const geminiModels = [
    env.geminiModel?.trim() || 'gemini-2.0-flash-lite',
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
    throw new Error(
      'AI не настроен. Добавьте GROQ_API_KEY (бесплатно: console.groq.com/keys) в Vercel → Environment Variables.'
    );
  }

  if (!groqKey && geminiKey && errors.every((e) => isQuotaError(e))) {
    throw new Error(
      'Лимит Gemini исчерпан. Добавьте бесплатный GROQ_API_KEY: console.groq.com/keys → Vercel → Redeploy (надёжнее для сайта).'
    );
  }

  throw new Error(errors[errors.length - 1] ?? 'Не удалось получить ответ от AI');
}
