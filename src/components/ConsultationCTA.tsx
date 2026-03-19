import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

export const ConsultationCTA = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-orange-500 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-orange-500/20 relative overflow-hidden"
        >
          {/* Декор на фоне */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="hidden md:flex w-16 h-16 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-md">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                  Не знаете, какой курс обязателен для вашей компании?
                </h3>
                <p className="text-white/80 text-lg">
                  Получите бесплатную консультацию специалиста по подбору обучения ПТМ, БиОТ и Промбезопасности.
                </p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-white text-orange-500 hover:bg-slate-50 whitespace-nowrap px-10 py-5 text-xl shadow-xl shadow-black/5"
              onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Подобрать обучение
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};