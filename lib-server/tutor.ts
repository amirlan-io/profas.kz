export type ChatTurn = { role: 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `Ты — AI-тьютор учебного центра ТОО ProfAs.kz (Казахстан).
Помогаешь с курсами: ПТМ (пожарная безопасность), БиОТ (охрана труда), промышленная безопасность, электробезопасность, ДОПОГ.
Отвечай на русском языке, кратко и по делу (2–4 абзаца максимум).
Если вопрос не по теме обучения — вежливо перенаправь к теме курсов ProfAs.kz.`;

/** Google Gemini — бесплатный тариф: https://aistudio.google.com/apikey */
export async function runTutorChat(
  message: string,
  history: ChatTurn[],
  apiKey: string,
  model = 'gemini-2.0-flash'
): Promise<string> {
  const contents = [
    ...history.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const geminiRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    throw new Error(`Gemini ${geminiRes.status}: ${errText.slice(0, 300)}`);
  }

  const data = (await geminiRes.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) throw new Error('Empty AI response');
  return reply;
}
