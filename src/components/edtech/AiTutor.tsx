import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const QUICK_PROMPTS = [
  { id: 'simple', label: 'Explain this simpler', labelRu: 'Объясни проще' },
  { id: 'example', label: 'Give me an example', labelRu: 'Приведи пример' },
  { id: 'test', label: 'Test my knowledge', labelRu: 'Проверь мои знания' },
] as const;

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Привет! Я AI-помощник ProfAs.kz. Готов помочь с курсами ПТМ, БиОТ и промбезопасности. Выберите быстрый вопрос или напишите свой.',
};

type AiTutorProps = {
  onSendMessage?: (message: string, history: ChatMessage[]) => Promise<string>;
  /** Controlled open state */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide built-in FAB — use with FloatingActions */
  hideFab?: boolean;
};

export function AiTutor({
  onSendMessage,
  open: controlledOpen,
  onOpenChange,
  hideFab = false,
}: AiTutorProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const appendMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };
    appendMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      if (!onSendMessage) {
        throw new Error('AI не настроен');
      }
      const reply = await onSendMessage(trimmed, [...messages, userMsg]);
      appendMessage({
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось получить ответ';
      appendMessage({
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${msg}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-slate-950/50 backdrop-blur-sm md:bg-slate-950/30"
              aria-label="Закрыть чат"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={cn(
                'fixed z-[210] inset-x-0 bottom-0 md:inset-auto md:right-6',
                'md:bottom-[8.5rem] md:w-[400px] md:max-h-[min(560px,80vh)] md:rounded-3xl',
                'bg-white rounded-t-3xl shadow-2xl border border-slate-200',
                'flex flex-col max-h-[min(85vh,640px)]'
              )}
              role="dialog"
              aria-label="AI помощник"
            >
              <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3 min-h-12">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">AI помощник</p>
                    <p className="text-xs text-slate-500">ProfAs.kz · beta</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-12 min-w-12 flex items-center justify-center rounded-xl hover:bg-slate-100 active:scale-95 transition-transform"
                  aria-label="Закрыть"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </header>

              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px]"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      'max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'ml-auto bg-orange-500 text-white'
                        : 'mr-auto bg-slate-100 text-slate-800'
                    )}
                  >
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div className="mr-auto bg-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-500">
                    Печатает…
                  </div>
                )}
              </div>

              <div className="px-3 pb-3 pt-2 border-t border-slate-100 shrink-0 safe-pb">
                <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => void send(p.labelRu)}
                      className="shrink-0 min-h-12 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-orange-50 hover:text-orange-700 active:scale-95 transition-transform"
                    >
                      {p.labelRu}
                    </button>
                  ))}
                </div>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send(input);
                  }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Спросите AI-помощника…"
                    className="flex-1 min-h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="min-h-12 min-w-12 flex items-center justify-center rounded-xl bg-orange-500 text-white disabled:opacity-50 active:scale-95 transition-transform"
                    aria-label="Отправить"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!hideFab && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'fixed z-[190] bottom-4 right-4 md:bottom-6 md:right-6',
            'min-h-12 min-w-12 p-4 rounded-full',
            'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30',
            'flex items-center justify-center',
            'active:scale-95 transition-transform'
          )}
          aria-label="Открыть AI помощник"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        </motion.button>
      )}
    </>
  );
}
