import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { getStreakCount, getLast7Days, recordLearningActivity } from '@/src/lib/streak';
import { cn } from '@/src/lib/utils';

export function DailyStreak() {
  const [streak, setStreak] = useState(0);
  const [week, setWeek] = useState<ReturnType<typeof getLast7Days>>([]);

  useEffect(() => {
    recordLearningActivity();
    setStreak(getStreakCount());
    setWeek(getLast7Days());
  }, []);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 md:p-6 shadow-lg border border-white/5">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">
            Серия обучения
          </p>
          <p className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            {streak}-day learning streak
            <Flame className="w-7 h-7 text-orange-500 fill-orange-500" aria-hidden />
          </p>
          <p className="text-slate-400 text-sm mt-1">Продолжайте — не прерывайте цепочку!</p>
        </div>
      </div>

      <div className="flex justify-between gap-2" aria-label="Календарь за 7 дней">
        {week.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{day.label}</span>
            <div
              className={cn(
                'w-10 h-10 min-w-12 min-h-12 max-w-12 rounded-xl flex items-center justify-center text-sm font-bold transition-colors',
                day.active
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/10 text-slate-500'
              )}
            >
              {day.active ? '✓' : '·'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
