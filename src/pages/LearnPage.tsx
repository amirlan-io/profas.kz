import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MicroStories } from '../components/edtech/MicroStories';
import { MicroQuiz } from '../components/edtech/MicroQuiz';
import { DailyStreak } from '../components/edtech/DailyStreak';
import { AiTutor } from '../components/edtech/AiTutor';
import { CourseCardSkeleton } from '../components/ui/Skeleton';
import { recordLearningActivity } from '@/src/lib/streak';

const LEARN_TITLE =
  'Онлайн обучение Казахстан | Интерактивные курсы — ProfAs.kz';

export function LearnPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = LEARN_TITLE;
    recordLearningActivity();
    const t = setTimeout(() => setLoading(false), 480);
    return () => {
      clearTimeout(t);
      document.title =
        'Установка Видеонаблюдения в Алматы под ключ | ТОО ProfAs.kz';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between min-h-14">
          <Link
            to="/"
            className="min-h-12 inline-flex items-center px-2 text-sm font-semibold text-orange-500 active:scale-95 transition-transform"
          >
            ← Главная
          </Link>
          <span className="text-sm font-bold text-slate-900">Кабинет обучения</span>
          <span className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">
            Интерактивные курсы
          </h1>
          <p className="text-slate-500 text-sm">
            Онлайн платформа образования ProfAs.kz · Алматы и весь Казахстан
          </p>
        </div>

        <DailyStreak />

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Лента микро-уроков</h2>
          <MicroStories onStoryTap={() => recordLearningActivity()} />
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Ваши курсы</h2>
          {loading ? (
            <div className="grid gap-6">
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </div>
          ) : (
            <div className="grid gap-4">
              {[
                { title: 'ПТМ — микромодуль 1', progress: 40 },
                { title: 'БиОТ — основы', progress: 10 },
              ].map((c) => (
                <article
                  key={c.title}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm min-h-[100px]"
                >
                  <h3 className="font-bold text-slate-900 mb-3">{c.title}</h3>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{c.progress}% завершено</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Микро-квиз</h2>
          <MicroQuiz />
        </section>
      </main>

      <AiTutor />
    </div>
  );
}
