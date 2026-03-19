import React from 'react';
import { motion } from 'motion/react';
import { Flame, ShieldCheck, Building2, HardHat, Truck } from 'lucide-react';

const audiences = [
  {
    title: 'Ответственным за пожарную безопасность',
    description: 'Обязательное обучение по пожарно-техническому минимуму (ПТМ) для лиц, назначенных приказом руководителя.',
    icon: Flame,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Специалистам по охране труда (БиОТ)',
    description: 'Повышение квалификации и обязательное обучение по безопасности и охране труда для инженеров.',
    icon: ShieldCheck,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Руководителям организаций',
    description: 'Обучение руководителей требованиям пожарной, промышленной безопасности и охраны труда.',
    icon: Building2,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Работникам опасных объектов (ОПО)',
    description: 'Обязательное обучение промышленной безопасности для специалистов и персонала на опасных объектах.',
    icon: HardHat,
    color: 'bg-slate-50 text-slate-600',
  },
  {
    title: 'Водителям опасных грузов (ДОПОГ)',
    description: 'Специализированное обучение водителей требованиям международной перевозки опасных грузов.',
    icon: Truck,
    color: 'bg-amber-50 text-amber-600',
  },
];

export const Audience = () => {
  return (
    <section className="py-24 bg-white" id="audience">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Новый надзаголовок над основным заголовком */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
          >
            Обязательное обучение по законодательству Республики Казахстан
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Кому необходимо пройти обучение?
          </h2>
        </div>

        {/* 2. Обновленный рендер карточки с уменьшенной иконкой и hover-эффектом */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {audiences.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                y: -12, 
                boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)",
                borderColor: "rgba(249, 115, 22, 0.3)" 
              }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-[2.5rem] border border-slate-100 bg-white transition-all duration-300 flex flex-col items-start"
            >
              {/* Унифицированная иконка: меньше размер (w-12 h-12) и больше отступ (mb-8) */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-12 h-12 flex items-center justify-center rounded-xl mb-8 transition-colors ${item.color}`}
              >
                <item.icon size={24} strokeWidth={1.5} />
              </motion.div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              {/* Метка "ПО ЗАКОНУ" внизу для веса */}
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Обязательно по закону РК
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};