import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp = () => {
  const whatsappNumber = '77007323366'; // Replace with actual number
  const message = encodeURIComponent('Здравствуйте! Хочу проконсультироваться по поводу обучения.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 left-4 md:left-auto md:right-6 md:bottom-6 z-[180] min-h-12 min-w-12 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl flex items-center justify-center group active:scale-95 transition-transform"
      aria-label="Связаться в WhatsApp"
    >
      <div className="absolute right-full mr-4 bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
        Напишите нам в WhatsApp
      </div>
      <MessageCircle className="w-6 h-6 md:w-8 md:h-8 fill-current" />
      
      {/* Анимированный пульсирующий эффект */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
    </motion.a>
  );
};