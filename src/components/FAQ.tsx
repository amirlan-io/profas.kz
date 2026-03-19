import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Обязательно ли обучение ПТМ для руководителей?',
    answer: 'Да, согласно законодательству РК, руководители организаций и ответственные лица обязаны проходить обучение по ПТМ каждые 3 года. Отсутствие сертификата является серьезным нарушением и влечет крупные штрафы при проверках МЧС.',
  },
  {
    question: 'Можно ли обучить сразу группу сотрудников?',
    answer: 'Да, мы специализируемся на B2B-обучении. Мы можем организовать выездные занятия на вашей территории, провести обучение онлайн для всей группы или подготовить индивидуальный график под ваш график работы.',
  },
  {
    question: 'Какой срок действия удостоверения?',
    answer: 'Стандартный срок: по ПТМ — 3 года, по БиОТ (Охрана труда) — 1 год. Мы берем на себя контроль ваших документов и автоматически уведомляем за месяц до истечения срока, чтобы вы всегда были готовы к аудитам.',
  },
  {
    question: 'Доступно ли обучение в онлайн-формате?',
    answer: 'Да, наша современная LMS-платформа доступна 24/7. Сотрудники могут проходить теорию и сдавать тесты в удобное время со смартфона или компьютера без остановки рабочих процессов.',
  },
  {
    question: 'Вносятся ли сертификаты в государственную базу?',
    answer: 'Безусловно. Все выдаваемые нами удостоверения легитимны, имеют уникальный номер и заносятся в реестр учебного центра согласно требованиям Министерства труда и МЧС РК.',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-slate-900 text-center mb-16"
        >
          Часто задаваемые вопросы
        </motion.h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex items-center justify-between w-full p-8 text-left transition-colors hover:bg-slate-50"
              >
                <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-orange-500 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-slate-500 leading-relaxed text-lg">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};