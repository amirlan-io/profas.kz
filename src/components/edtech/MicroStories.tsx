import { Play, BookOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type StoryCard = {
  id: string;
  title: string;
  summary: string;
  duration: string;
  tag: string;
  gradient: string;
  type: 'video' | 'text';
};

const DEFAULT_STORIES: StoryCard[] = [
  {
    id: '1',
    title: 'ПТМ за 60 секунд',
    summary: 'Три обязательных действия при пожаре на объекте по нормам РК.',
    duration: '1:00',
    tag: 'ПТМ',
    gradient: 'from-orange-600 to-red-700',
    type: 'video',
  },
  {
    id: '2',
    title: 'БиОТ: СИЗ',
    summary: 'Как выбрать средства индивидуальной защиты для вашей отрасли.',
    duration: '0:45',
    tag: 'БиОТ',
    gradient: 'from-blue-600 to-indigo-800',
    type: 'text',
  },
  {
    id: '3',
    title: 'Промбез на ОПО',
    summary: 'Кто обязан проходить обучение на опасном производстве.',
    duration: '1:15',
    tag: 'Промбез',
    gradient: 'from-purple-600 to-violet-900',
    type: 'video',
  },
  {
    id: '4',
    title: 'Электробезопасность',
    summary: 'Группы допуска и периодичность аттестации персонала.',
    duration: '0:55',
    tag: 'Техника',
    gradient: 'from-amber-500 to-orange-700',
    type: 'text',
  },
  {
    id: '5',
    title: 'ДОПОГ для водителей',
    summary: 'Международные требования к перевозке опасных грузов.',
    duration: '1:20',
    tag: 'ДОПОГ',
    gradient: 'from-emerald-600 to-teal-800',
    type: 'video',
  },
];

type MicroStoriesProps = {
  stories?: StoryCard[];
  onStoryTap?: (story: StoryCard) => void;
};

export function MicroStories({ stories = DEFAULT_STORIES, onStoryTap }: MicroStoriesProps) {
  return (
    <div className="w-full">
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Микро-уроки"
      >
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            role="listitem"
            onClick={() => onStoryTap?.(story)}
            className={cn(
              'snap-center shrink-0 w-[72vw] max-w-[280px] sm:w-[240px]',
              'min-h-[min(420px,70vh)] rounded-3xl p-5 text-left text-white',
              'bg-gradient-to-br shadow-xl border border-white/10',
              'active:scale-[0.97] transition-transform duration-150',
              'flex flex-col justify-between',
              story.gradient
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-full min-h-12 inline-flex items-center">
                {story.tag}
              </span>
              <span className="text-xs font-semibold bg-black/30 px-2 py-1 rounded-lg">
                {story.duration}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center py-6">
              <div className="w-14 h-14 min-w-12 min-h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                {story.type === 'video' ? (
                  <Play className="w-7 h-7 fill-white" />
                ) : (
                  <BookOpen className="w-7 h-7" />
                )}
              </div>
              <h3 className="text-xl font-extrabold leading-tight mb-3">{story.title}</h3>
              <p className="text-sm text-white/90 leading-relaxed line-clamp-4">{story.summary}</p>
            </div>

            <span className="text-sm font-bold bg-white/15 rounded-xl min-h-12 flex items-center justify-center active:scale-95 transition-transform">
              Смотреть микро-урок →
            </span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-2 sm:hidden">Свайпните влево →</p>
    </div>
  );
}
