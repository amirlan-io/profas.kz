import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navLinks = [
  { name: 'Главная', href: '#' },
  { name: 'Курсы', href: '#courses' },
  { name: 'Для кого', href: '#audience' },
  { name: 'Преимущества', href: '#why-us' },
  { name: 'Вопросы', href: '#faq' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map((link) => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-4 lg:py-5'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 lg:gap-4">
        <a href="#" className="flex shrink-0 items-center">
          <img
            src="https://image2url.com/r2/default/images/1773946600039-e944154d-8c91-4f2c-9380-ea4f1ae95cf5.png"
            alt="ProfAs.kz"
            className="h-9 sm:h-10 xl:h-12 w-auto max-w-[7.5rem] sm:max-w-[8.5rem] object-contain mix-blend-screen brightness-125"
          />
        </a>

        {/* Desktop nav — только от xl (≥1280px), на ноутбуке — бургер */}
        <div className="hidden xl:flex flex-1 justify-center items-center gap-1 2xl:gap-2 min-w-0 px-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                'whitespace-nowrap px-2 2xl:px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-orange-500 hover:bg-white/5',
                activeSection === link.href ? 'text-orange-500' : 'text-slate-300'
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
          <a
            href="https://wa.me/77007323366"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 lg:px-4 py-2.5 rounded-full text-xs lg:text-sm font-semibold transition-all whitespace-nowrap"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline xl:hidden">WhatsApp</span>
            <span className="hidden xl:inline">WhatsApp поддержка</span>
            <span className="lg:hidden">WA</span>
          </a>
          <button
            type="button"
            className="xl:hidden text-white p-2 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120] h-[100dvh] bg-slate-900 xl:hidden overflow-hidden"
          >
            <div className="h-[100dvh] grid grid-rows-[auto,1fr,auto]">
              <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
                <a href="#" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <img
                    src="https://image2url.com/r2/default/images/1773946600039-e944154d-8c91-4f2c-9380-ea4f1ae95cf5.png"
                    alt="ProfAs.kz"
                    className="h-10 w-auto object-contain mix-blend-screen brightness-125"
                  />
                </a>
                <button
                  type="button"
                  className="text-white p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Закрыть"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="min-h-0 overflow-y-auto px-6 py-6 space-y-1">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="block py-3 text-2xl sm:text-3xl font-bold text-white hover:text-orange-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="p-6 border-t border-white/10">
                <a
                  href="https://wa.me/77007323366"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-orange-500 text-white py-4 rounded-2xl font-bold"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp поддержка
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
