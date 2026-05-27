import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { recordLearningActivity } from '@/src/lib/streak';

export type QuizOption = { id: string; label: string };
export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
};

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Как часто руководители проходят обучение ПТМ в РК?',
    options: [
      { id: 'a', label: 'Раз в 5 лет' },
      { id: 'b', label: 'Раз в 3 года' },
      { id: 'c', label: 'Только при приёме на работу' },
    ],
    correctId: 'b',
    explanation: 'По законодательству РК обучение ПТМ для руководителей проводится каждые 3 года.',
  },
  {
    id: 'q2',
    prompt: 'Что относится к обязательному обучению БиОТ?',
    options: [
      { id: 'a', label: 'Только офисные работники' },
      { id: 'b', label: 'Все сотрудники организации' },
      { id: 'c', label: 'Только руководство' },
    ],
    correctId: 'b',
    explanation: 'БиОТ обязателен для всех работников без исключения.',
  },
  {
    id: 'q3',
    prompt: 'Промышленная безопасность обязательна для:',
    options: [
      { id: 'a', label: 'ОПО и связанных специалистов' },
      { id: 'b', label: 'Только IT-компаний' },
      { id: 'c', label: 'ИП без сотрудников' },
    ],
    correctId: 'a',
    explanation: 'Промбез требуется на опасных производственных объектах.',
  },
];

type MicroQuizProps = {
  questions?: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
};

export function MicroQuiz({ questions = DEFAULT_QUESTIONS, onComplete }: MicroQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const progress = finished ? 100 : ((index + (revealed ? 1 : 0)) / questions.length) * 100;

  const handleSelect = useCallback(
    (optionId: string) => {
      if (revealed || finished) return;
      setSelected(optionId);
      setRevealed(true);
      const correct = optionId === question.correctId;
      if (correct) setScore((s) => s + 1);
      recordLearningActivity();
    },
    [revealed, finished, question.correctId]
  );

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setFinished(true);
      onComplete?.(score, questions.length);
    }
  };

  if (finished) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 text-center shadow-sm">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <p className="text-4xl mb-2">🎉</p>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Квиз завершён!</h3>
          <p className="text-slate-500 mb-6">
            Результат: {score} из {questions.length}
          </p>
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setRevealed(false);
              setScore(0);
              setFinished(false);
            }}
            className="min-h-12 px-8 py-3 rounded-xl bg-orange-500 text-white font-bold active:scale-95 transition-transform"
          >
            Пройти снова
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      <div className="h-1.5 bg-slate-100">
        <motion.div
          className="h-full bg-orange-500 rounded-r-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      <div className="p-5 md:p-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          Вопрос {index + 1} / {questions.length}
        </p>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 leading-snug">
          {question.prompt}
        </h3>

        <div className="space-y-3" role="group" aria-label="Варианты ответа">
          {question.options.map((opt) => {
            const isSelected = selected === opt.id;
            const isCorrect = opt.id === question.correctId;
            const showResult = revealed && isSelected;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={revealed}
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  'w-full min-h-12 p-4 rounded-2xl border-2 text-left font-semibold text-base',
                  'active:scale-[0.98] transition-all duration-200',
                  'flex items-center justify-between gap-3',
                  !revealed &&
                    'border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/50',
                  revealed &&
                    isCorrect &&
                    'border-green-500 bg-green-50 text-green-900',
                  revealed &&
                    showResult &&
                    !isCorrect &&
                    'border-red-500 bg-red-50 text-red-900 animate-shake',
                  revealed &&
                    !isSelected &&
                    !isCorrect &&
                    'border-slate-100 opacity-50'
                )}
              >
                <span>{opt.label}</span>
                {revealed && isCorrect && <Check className="w-6 h-6 shrink-0 text-green-600" />}
                {revealed && showResult && !isCorrect && (
                  <X className="w-6 h-6 shrink-0 text-red-600" />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {revealed && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border border-slate-100"
            >
              {question.explanation}
            </motion.p>
          )}
        </AnimatePresence>

        {revealed && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-6 w-full min-h-12 py-3 rounded-xl bg-slate-900 text-white font-bold active:scale-95 transition-transform"
          >
            {index < questions.length - 1 ? 'Следующий вопрос' : 'Завершить'}
          </button>
        )}
      </div>
    </div>
  );
}
