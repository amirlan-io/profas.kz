import React from 'react';
import { motion } from 'motion/react';
import { Users, Zap, ShieldCheck, Globe } from 'lucide-react';
import { useSection } from '../context/ContentContext';

const ICONS = [Users, Zap, ShieldCheck, Globe];

const FALLBACK = {
  heading: 'Почему компании выбирают нас',
  items: [
    { title: 'Менеджер для корпоративных клиентов', description: 'Ведем реестр ваших сотрудников и заранее напоминаем о необходимости продления удостоверений.' },
    { title: 'Удостоверения за 24 часа', description: 'Выдача документов установленного образца в течение суток после успешного прохождения обучения.' },
    { title: 'Официальные документы', description: 'Программы обучения полностью соответствуют требованиям МЧС и Минтруда Республики Казахстан.' },
    { title: 'Онлайн и офлайн обучение', description: 'Дистанционный формат в нашей LMS-системе или выезд преподавателя на ваше предприятие.' },
  ],
};

export const Benefits = () => {
  const cms = useSection('benefits', {} as Record<string, unknown>);
  const heading = (cms.heading as string) ?? FALLBACK.heading;
  const benefits = ((cms.items as typeof FALLBACK.items) ?? FALLBACK.items).map((b, i) => ({
    ...b, icon: ICONS[i] ?? Users,
  }));
  return (
    <section className="py-24 bg-white border-y border-slate-100" id="why-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Добавлен заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
            {heading}
          </h2>
          <div className="h-1.5 w-20 bg-orange-500 mx-auto rounded-full" />
        </div>

        {/* Сетка переделана на 4 колонки (lg:grid-cols-4) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ scale: 1.02, backgroundColor: '#f8fafc' }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className={`p-10 flex flex-col items-start transition-all duration-300 ${
                idx !== benefits.length - 1 ? 'border-b md:border-b-0 md:border-r border-slate-100' : ''
              }`}
            >
              <div className="w-12 h-12 bg-white shadow-sm flex items-center justify-center rounded-xl mb-6 text-orange-500 border border-slate-50">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 leading-tight">
                {benefit.title}
              </h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};