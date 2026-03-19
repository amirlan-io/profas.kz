import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Award, Globe } from 'lucide-react';

const stats = [
  {
    label: 'Обученных специалистов',
    value: '1500+',
    icon: Users,
    description: 'Профессиональная подготовка кадров по всем направлениям безопасности.'
  },
  {
    label: 'Компаний-клиентов',
    value: '500+',
    icon: Building2,
    description: 'Нам доверяют как малый бизнес, так и крупнейшие холдинги страны.'
  },
  {
    label: 'Лет опыта',
    value: '10+',
    icon: Award,
    description: 'Десятилетие безупречной работы на рынке образовательных услуг РК.'
  },
  {
    label: 'Работаем по всей РК',
    value: '100%',
    icon: Globe,
    description: 'Дистанционное и выездное обучение в любом городе Казахстана.'
  },
];

export const Stats = () => {
  return (
    <section className="py-24 bg-white" id="stats">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-slate-900"
          >
            Почему компании выбирают нас
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            className="h-1.5 bg-orange-500 mx-auto mt-6 rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-orange-500/30 hover:bg-white hover:shadow-xl transition-all duration-500 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors duration-500">
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-lg font-bold text-slate-800 mb-2">
                {stat.label}
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
