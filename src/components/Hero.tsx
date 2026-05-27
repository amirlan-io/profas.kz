import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-950 overflow-hidden relative min-h-screen flex items-center">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
      
      {/* Дополнительные декоративные элементы для премиальности */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold tracking-widest uppercase mb-8 border border-orange-500/20">
              Аккредитованный учебный центр
            </span>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Системы безопасности и <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">видеонаблюдение в Алматы</span>
            </h1>
            
            {/* SEO-оптимизированное описание с ключевыми словами */}
            <p className="text-xl lg:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto mb-10">
              Профильный центр, где доступно профессиональное обучение ПТМ, специализированные курсы БиОТ и полная подготовка специалистов по безопасности в РК.
            </p>
            
            {/* Блок преимуществ сразу после текста */}
            <div className="flex flex-col items-center gap-4 mb-12">
              {[
                "Официальные удостоверения установленного образца",
                "Онлайн и очное обучение по всему Казахстану",
                "Получение документов в течение 24 часов"
              ].map((item) => (
                <motion.div 
                  key={item} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + 0.1 * item.length }}
                  className="flex items-center gap-3 text-slate-200"
                >
                  <div className="bg-orange-500/20 p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-lg lg:text-xl font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Кнопки с обработчиками прокрутки */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg" 
                className="px-10 py-5 text-xl bg-orange-500 hover:bg-orange-600 text-white"
              >
                Начать обучение
              </Button>
              <Button 
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline" 
                size="lg" 
                className="px-10 py-5 text-xl text-white border-white/20 hover:bg-white/10"
              >
                Посмотреть курсы
              </Button>
            </div>

            {/* Социальное доказательство - ОБНОВЛЕННАЯ СЕКЦИЯ */}
            <div className="mt-20 pt-10 border-t border-white/5 w-full">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] text-center mb-10">
                Нам доверяют лидеры индустрии Казахстана
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 ease-in-out">
                {/* Логотипы в виде стилизованного текста (вместо картинок для чистоты кода) */}
                <span className="text-white font-black text-xl tracking-tighter">KAZMUNAYGAS</span>
                <span className="text-white font-black text-xl tracking-tighter">BI GROUP</span>
                <span className="text-white font-black text-xl tracking-tighter">KAZTRANSOIL</span>
                <span className="text-white font-black text-xl tracking-tighter">QAZAQGAZ</span>
                <span className="text-white font-black text-xl tracking-tighter">KAZATOMPROM</span>
              </div>
              <p className="text-slate-600 text-sm text-center mt-10 font-medium">
                и еще более <span className="text-slate-400">500 предприятий</span> по всей стране
              </p>
            </div>

            {/* Дополнительные бейджи с преимуществами */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-8 border-t border-white/5"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Соответствие законам РК
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Официальный сертификат
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold">24/7</span>
                Поддержка экспертов
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};