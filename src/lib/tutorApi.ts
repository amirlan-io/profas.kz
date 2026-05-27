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

  const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? 'Не удалось получить ответ от AI');
  }
  if (!data.reply) {
    throw new Error('Пустой ответ от AI');
  }
  return data.reply;
}
