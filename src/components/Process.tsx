import React from 'react';
import { motion } from 'motion/react';

const steps = [
  { id: 1, title: 'Заявка', description: 'Оставьте запрос на сайте или свяжитесь с нами для первичной консультации.', color: 'bg-slate-900' },
  { id: 2, title: 'Консультация', description: 'Анализируем ваши потребности и определяем список обязательных курсов по закону.', color: 'bg-orange-500' },
  { id: 3, title: 'Обучение', description: 'Доступ к современной онлайн-платформе или проведение выездных лекций.', color: 'bg-slate-900' },
  { id: 4, title: 'Сертификат', description: 'Получение официального аккредитованного документа, внесенного в реестр.', color: 'bg-green-500' },
];

export const Process = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-slate-900"
          >
            Как мы работаем
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto"
          >
            Работаем по всей территории Казахстана. Прозрачный и эффективный путь к получению официальных удостоверений.
          </motion.p>
        </div>

        <div className="relative grid md:grid-cols-4 gap-12">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-0" />
          
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative z-10 text-center flex flex-col items-center"
            >
              <div className={`w-24 h-24 rounded-full ${step.color} text-white flex items-center justify-center text-3xl font-bold mb-8 ring-[12px] ring-slate-50 shadow-xl`}>
                {step.id}
              </div>
              <h5 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h5>
              <p className="text-slate-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="mt-20 h-1.5 bg-orange-500 rounded-full"
        />
      </div>
    </section>
  );
};