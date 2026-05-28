import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

const HERO_GRADIENT = 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65))';
const BG_MOBILE = '/images/hero/bg-mobile.png';
const BG_DESKTOP = '/images/hero/bg-desktop.png';

const benefits = [
  'Официальные удостоверения установленного образца',
  'Онлайн и очное обучение по всему Казахстану',
  'Получение документов в течение 24 часов',
];

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-20 lg:justify-center"
    >
      {/* Mobile background */}
      <div
        className="absolute inset-0 lg:hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `${HERO_GRADIENT}, url(${BG_MOBILE})`,
        }}
        aria-hidden
      />
      {/* Desktop background */}
      <div
        className="absolute inset-0 hidden lg:block bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `${HERO_GRADIENT}, url(${BG_DESKTOP})`,
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center lg:text-center"
        >
          <span className="inline-block mb-5 sm:mb-6 px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase text-orange-400 bg-black/50 border border-[#FF6B00]">
            Аккредитованный учебный центр
          </span>

          <h1 className="font-extrabold leading-[1.15] mb-5 sm:mb-6 text-[clamp(1.625rem,6.5vw,3.75rem)]">
            <span className="block text-white">Системы безопасности и</span>
            <span className="block text-[#FF6B00] mt-1">видеонаблюдение в Алматы</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300/95 font-light leading-relaxed max-w-lg mx-auto mb-8 sm:mb-10 px-1">
            Профильный центр: обучение ПТМ, курсы БиОТ и подготовка специалистов по безопасности
            в Республике Казахстан.
          </p>

          <ul className="flex flex-col items-stretch sm:items-center gap-3 mb-8 sm:mb-10 max-w-md mx-auto lg:max-w-xl">
            {benefits.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start sm:items-center gap-3 text-left sm:text-center text-slate-200"
              >
                <span className="shrink-0 mt-0.5 sm:mt-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B00]/20">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                </span>
                <span className="text-sm sm:text-base font-medium leading-snug">{item}</span>
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 w-full max-w-sm mx-auto sm:max-w-md sm:flex-row sm:justify-center lg:max-w-none mb-12 sm:mb-16">
            <Button
              onClick={() =>
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
              }
              size="lg"
              className="w-full sm:flex-1 sm:max-w-[220px] bg-[#FF6B00] hover:bg-orange-600 text-white border-0"
            >
              Начать обучение
            </Button>
            <Button
              onClick={() =>
                document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })
              }
              variant="outline"
              size="lg"
              className="w-full sm:flex-1 sm:max-w-[220px] text-white border-white/30 bg-black/20 hover:bg-white/10 backdrop-blur-sm"
            >
              Посмотреть курсы
            </Button>
          </div>

          <div className="pt-8 sm:pt-10 border-t border-white/10">
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-6 sm:mb-8">
              Нам доверяют лидеры индустрии Казахстана
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-10 opacity-40 sm:opacity-50">
              {['KAZMUNAYGAS', 'BI GROUP', 'KAZTRANSOIL', 'QAZAQGAZ', 'KAZATOMPROM'].map(
                (name) => (
                  <span
                    key={name}
                    className="text-white font-black text-xs sm:text-base tracking-tight"
                  >
                    {name}
                  </span>
                )
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-6">
              и ещё более <span className="text-slate-300">500 предприятий</span> по всей стране
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-white/5 text-xs sm:text-sm text-slate-400"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
              Соответствие законам РК
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              Официальный сертификат
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FF6B00]/30 flex items-center justify-center text-[10px] font-bold text-[#FF6B00]">
                24
              </span>
              Поддержка экспертов
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
