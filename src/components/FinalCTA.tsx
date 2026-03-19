import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

export const FinalCTA = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Состояние загрузки

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mjgajyzp", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      } else {
        alert("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
      }
    } catch (error) {
      alert("Ошибка сети. Проверьте интернет-соединение.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="py-24 px-4">
      <div className="max-w-7xl mx-auto bg-slate-950 rounded-[4rem] overflow-hidden relative p-8 lg:p-24 text-center lg:text-left shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/10 blur-[120px]" />
        
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-extrabold text-white mb-8 leading-tight"
            >
              Готовы обезопасить ваш бизнес?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-400 mb-12 max-w-lg leading-relaxed"
            >
              Получите бесплатный аудит обязательных требований по безопасности для вашей отрасли.
            </motion.p>
            
            {/* Блок с кнопками удален для минимализма и фокуса на форме */}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[3rem] shadow-xl"
          >
            {isSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка отправлена!</h3>
                <p className="text-slate-500">Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Имя"
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 px-6 focus:ring-orange-500 focus:border-orange-500 text-slate-900 transition-all"
                />
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="Телефон"
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 px-6 focus:ring-orange-500 focus:border-orange-500 text-slate-900 transition-all"
                />
                <input
                  required
                  name="company"
                  type="text"
                  placeholder="Название компании"
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 px-6 focus:ring-orange-500 focus:border-orange-500 text-slate-900 transition-all"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-3 md:py-5 text-base md:text-lg font-bold shadow-xl shadow-orange-500/20 active:scale-[0.98] leading-tight"
                >
                  {isSubmitting ? "Отправка..." : "Получить бесплатный аудит"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};