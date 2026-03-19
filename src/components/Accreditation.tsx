import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const Accreditation = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Убрали grid и добавили центрирование через max-w и mx-auto */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
              Юридическая чистота и официальные лицензии
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed mx-auto max-w-2xl">
              Ваши документы будут легитимны при любых проверках. Наш центр обладает полным пакетом разрешительных документов для ведения образовательной деятельности на территории РК:
            </p>

            {/* Список преимуществ теперь тоже центрирован */}
            <div className="space-y-4 mb-12 inline-block text-left">
              {[
                "Аккредитация МЧС РК в области пожарной безопасности",
                "Лицензия Министерства труда и соцзащиты населения РК",
                "Собственные учебные программы, согласованные в госорганах",
                "Внесение выданных документов в единую базу данных (реестр)"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-base">{item}</span>
                </div>
              ))}
            </div>
            
            {/* Логотипы МЧС и ISO под текстом */}
            <div className="grid grid-cols-2 gap-6 mt-10 max-w-2xl mx-auto">
              {/* Логотип МЧС РК */}
              <div className="p-8 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all border border-transparent hover:border-slate-200 group">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHyyhRLvZSj10QCOzJs7iwacC15OFbpD-oNA&s"
                  alt="МЧС РК"
                  className="h-20 mb-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-center font-bold uppercase text-slate-400 tracking-widest">Министерство по ЧС РК</span>
              </div>

              {/* Логотип ISO 45001 */}
              <div className="p-8 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all border border-transparent hover:border-slate-200 group">
                <img
                  src="https://qdt.com.au/wp-content/uploads/2019/05/ISO-45001-logo.png"
                  alt="ISO 45001"
                  className="h-20 mb-6 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-center font-bold uppercase text-slate-400 tracking-widest">Сертификат ISO 45001</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};