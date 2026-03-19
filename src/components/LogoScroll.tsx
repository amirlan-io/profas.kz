import React from 'react';
import { motion } from 'motion/react';

const logos = [
  'https://picsum.photos/seed/logo1/200/100',
  'https://picsum.photos/seed/logo2/200/100',
  'https://picsum.photos/seed/logo3/200/100',
  'https://picsum.photos/seed/logo4/200/100',
  'https://picsum.photos/seed/logo5/200/100',
];

export const LogoScroll = () => {
  return (
    <div className="py-16 bg-white border-y border-slate-100 overflow-hidden">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-20 items-center"
        >
          {[...logos, ...logos, ...logos].map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt="Partner Logo"
              className="h-12 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
              referrerPolicy="no-referrer"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
