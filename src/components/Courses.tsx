import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Shield, Zap, ArrowRight } from 'lucide-react';
import { HardHat } from 'lucide-react';
import { Button } from './ui/Button';
import { useSection } from '../context/ContentContext';
import { CourseCardSkeleton } from './ui/Skeleton';

const ICONS = [Flame, Shield, HardHat, Zap];
const COLORS = ['bg-orange-50 text-orange-600', 'bg-blue-50 text-blue-600', 'bg-purple-50 text-purple-600', 'bg-yellow-50 text-yellow-600'];
const FALLBACK_COURSES = [
  { id: 1, title: 'Обучение ПТМ (Пожарно-технический минимум)', description: 'Обучение руководителей и ответственных лиц по пожарной безопасности.', image: 'https://i.ibb.co.com/vvzKxkLc/ptm.jpg', category: 'Обязательный' },
  { id: 2, title: 'Курсы БиОТ (Безопасность и охрана труда)', description: 'Обязательное обучение по безопасности и охране труда для сотрудников всех организаций РК.', image: 'https://i.ibb.co.com/rKc5ztKG/biot.jpg', category: 'Обязательный' },
  { id: 3, title: 'Обучение промышленная безопасность (Промбез)', description: 'Обучение специалистов, работающих на опасных производственных объектах.', image: 'https://i.ibb.co.com/KjYMJq3c/prombez.jpg', category: 'Промышленный' },
  { id: 4, title: 'Электробезопасность', description: 'Аттестация персонала, работающего с электроустановками.', image: 'https://i.ibb.co/vCzhMzxk/electro.jpg', category: 'Технический' },
];

export const Courses = () => {
  const cms = useSection('courses', {} as Record<string, unknown>);
  const heading = (cms.heading as string) ?? 'Каталог курсов';
  const subheading = (cms.subheading as string) ?? '';
  const ctaLabel = (cms.ctaLabel as string) ?? 'Записаться на обучение';
  const courses = ((cms.items as typeof FALLBACK_COURSES) ?? FALLBACK_COURSES).map((c, i) => ({
    ...c, icon: ICONS[i] ?? Flame, color: COLORS[i] ?? COLORS[0],
  }));

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-24 bg-slate-50" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto"
          >
            {subheading}
          </motion.p>
          <div className="h-1.5 w-20 bg-orange-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[420px]">
          {!ready
            ? FALLBACK_COURSES.map((c) => <CourseCardSkeleton key={c.id} />)
            : courses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[2.5rem] p-8 border border-slate-200 hover:border-orange-500/50 transition-all group flex flex-col h-full min-h-[420px] shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
                >
                  <div className="flex justify-end items-start mb-6">
                    <span className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-widest">
                      {course.category}
                    </span>
                  </div>

                  <div className="mb-6 overflow-hidden rounded-2xl h-48 bg-slate-100 shrink-0">
                    <img
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={192}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="mb-8 flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{course.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{course.description}</p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <Button
                      onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                      variant="secondary"
                      className="w-full text-base font-bold group/btn shadow-sm hover:shadow-md"
                    >
                      {ctaLabel}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
