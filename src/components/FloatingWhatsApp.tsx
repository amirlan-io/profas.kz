import React from 'react';
import { motion } from 'motion/react';

const whatsappNumber = '77713025797';
const message = encodeURIComponent('Здравствуйте! Хочу проконсультироваться по поводу обучения.');
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

export function FloatingWhatsAppButton() {
  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative min-h-14 min-w-14 rounded-full shadow-2xl flex items-center justify-center group active:scale-95 transition-transform"
      aria-label="Связаться в WhatsApp"
    >
      <div className="absolute right-full mr-3 bg-white text-slate-900 px-3 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100 hidden md:block">
        Напишите в WhatsApp
      </div>
      <img
        src="/whatsapp-icon.png"
        alt="WhatsApp"
        width={56}
        height={56}
        className="w-14 h-14 rounded-full object-cover"
      />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
    </motion.a>
  );
}

/** @deprecated Use FloatingActions instead */
export const FloatingWhatsApp = FloatingWhatsAppButton;
