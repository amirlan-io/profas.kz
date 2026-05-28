import type { ChatMessage } from '@/src/components/edtech/AiTutor';

export async function sendTutorMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const res = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  let data: { reply?: string; error?: string } = {};
  const text = await res.text();
  try {
    data = JSON.parse(text) as typeof data;
  } catch {
    if (!res.ok) {
      throw new Error(text.slice(0, 120) || `Ошибка сервера (${res.status})`);
    }
  }
  if (!res.ok) {
    throw new Error(data.error ?? `Ошибка сервера (${res.status})`);
  }
  if (!data.reply) {
    throw new Error('Пустой ответ от AI');
  }
  return data.reply;
}
