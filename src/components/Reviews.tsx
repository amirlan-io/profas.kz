import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const reviews = [
  {
    name: 'Арман Ибраев',
    position: 'Директор ТОО «StroyTech»',
    text: 'Работаем с ProfAs уже второй год. Обучили более 50 сотрудников по ПТМ и БиОТ. Очень удобно, что менеджеры сами следят за сроками и напоминают о продлении. Юридическая чистота документов на высшем уровне.',
    avatar: 'https://picsum.photos/seed/review1/100/100',
  },
  {
    name: 'Елена Кузнецова',
    position: 'Инженер по охране труда',
    text: 'Платформа для онлайн-обучения просто спасение. Сотрудники проходят тесты в свободное время, а я получаю готовые протоколы и удостоверения на следующий день. Никакой бумажной волокиты.',
    avatar: 'https://picsum.photos/seed/review2/100/100',
  },
  {
    name: 'Марат Сафин',
    position: 'HR-менеджер логистической компании',
    text: 'Лучшее соотношение цены и качества в Казахстане. Программы всегда актуальные, лекторы — практики с огромным опытом. Получили сертификаты ISO 45001 благодаря их консультациям.',
    avatar: 'https://picsum.photos/seed/review3/100/100',
  },
];

export const Reviews = () => {
  return (
    <section className="py-24 bg-slate-50" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-slate-900"
          >
            Отзывы наших клиентов
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto"
          >
            Нам доверяют профессионалы со всего Казахстана. Вот что они говорят о сотрудничестве с нами.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col relative"
            >
              <div className="absolute top-8 right-8 text-orange-500/10">
                <Quote className="w-12 h-12 fill-current" />
              </div>
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-orange-400 fill-current" />
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed mb-8 flex-grow italic">
                «{review.text}»
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-500/20"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-slate-900">{review.name}</div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {review.position}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
