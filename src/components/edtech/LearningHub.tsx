import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { MicroStories } from './MicroStories';
import { MicroQuiz } from './MicroQuiz';
import { DailyStreak } from './DailyStreak';
import { recordLearningActivity } from '@/src/lib/streak';

export function LearningHub() {
  return (
    <section
      id="learn"
      className="py-16 md:py-24 bg-gradient-to-b from-slate-100 to-slate-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-3"
            >
              <Sparkles className="w-4 h-4" />
              Микрообучение
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Онлайн-платформа нового поколения
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl">
              Интерактивные курсы Алматы и онлайн обучение Казахстан — в формате stories и
              мини-квизов с телефона.
            </p>
          </div>
          <Link
            to="/learn"
            className="inline-flex min-h-12 items-center gap-2 self-start md:self-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm active:scale-95 transition-transform"
          >
            Открыть кабинет
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mb-8">
          <DailyStreak />
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Микро-уроки</h3>
          <MicroStories
            onStoryTap={() => {
              recordLearningActivity();
            }}
          />
        </div>

        <div className="max-w-xl mx-auto md:max-w-2xl">
          <h3 className="text-lg font-bold text-slate-900 mb-4 text-center md:text-left">
            Быстрый квиз
          </h3>
          <MicroQuiz />
        </div>
      </div>
    </section>
  );
}
