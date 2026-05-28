import { Bot } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { FloatingWhatsAppButton } from './FloatingWhatsApp';

type AiTutorFabProps = {
  onClick: () => void;
  className?: string;
};

export function AiTutorFab({ onClick, className }: AiTutorFabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative min-h-14 min-w-14 p-3.5 rounded-full',
        'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
        'shadow-xl shadow-orange-500/30 flex items-center justify-center',
        'active:scale-95 transition-transform hover:scale-105',
        className
      )}
      aria-label="Открыть AI помощник"
    >
      <Bot className="w-7 h-7" />
      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
    </button>
  );
}

export function FloatingActions({ onAiClick }: { onAiClick: () => void }) {
  return (
    <div
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[180] flex flex-col-reverse items-center gap-3"
      aria-label="Быстрые действия"
    >
      <FloatingWhatsAppButton />
      <AiTutorFab onClick={onAiClick} />
    </div>
  );
}
