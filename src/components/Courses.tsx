import React from 'react';
import { motion } from 'motion/react';
import { Flame, Shield, Zap, ArrowRight } from 'lucide-react';
import { HardHat } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/src/lib/utils';
import { useSection } from '../context/ContentContext';

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
  return (
    <section className="py-24 bg-slate-50" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Теперь заголовок и подзаголовок выровнены по центру через text-center */}
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
          {/* Декоративная линия под заголовком для стиля */}
          <div className="h-1.5 w-20 bg-orange-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Теперь выводим все курсы напрямую из массива courses */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-200 hover:border-orange-500/50 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-orange-500/5"
            >
              {/* Теперь только бейдж категории, прижатый к правому краю */}
              <div className="flex justify-end items-start mb-6">
                <span className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-widest">
                  {course.category}
                </span>
              </div>

              {/* 1. Картинка теперь сверху вместо заголовка */}
              <div className="mb-6 overflow-hidden rounded-2xl h-48 bg-slate-100">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* 2. Заголовок и подзаголовок теперь здесь (ниже картинки) */}
              <div className="mb-8 flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{course.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{course.description}</p>
              </div>

              {/* 3. Только кнопка (без цены, программы и длительности) */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                <Button 
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="secondary" 
                  className="w-full py-4 text-base font-bold group/btn shadow-sm hover:shadow-md"
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