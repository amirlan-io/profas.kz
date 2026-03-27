import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useSection } from '../context/ContentContext';

const FALLBACK_FAQS = [
  { question: 'Обязательно ли обучение ПТМ для руководителей?', answer: 'Да, согласно законодательству РК, руководители организаций и ответственные лица обязаны проходить обучение по ПТМ каждые 3 года.' },
  { question: 'Можно ли обучить сразу группу сотрудников?', answer: 'Да, мы специализируемся на B2B-обучении.' },
  { question: 'Какой срок действия удостоверения?', answer: 'По ПТМ — 3 года, по БиОТ — 1 год.' },
  { question: 'Доступно ли обучение в онлайн-формате?', answer: 'Да, наша LMS-платформа доступна 24/7.' },
  { question: 'Вносятся ли сертификаты в государственную базу?', answer: 'Безусловно. Все удостоверения вносятся в реестр.' },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const cms = useSection('faq', {} as Record<string, unknown>);
  const heading = (cms.heading as string) ?? 'Часто задаваемые вопросы';
  const faqs = (cms.items as typeof FALLBACK_FAQS) ?? FALLBACK_FAQS;

  return (
    <section className="py-24 bg-slate-50" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-slate-900 text-center mb-16"
        >
          {heading}
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