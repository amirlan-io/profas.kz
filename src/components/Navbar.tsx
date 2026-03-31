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

type NavbarProps = {
  adminHref?: string;
};

export const Navbar = ({ adminHref = '/admin' }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navLinks.map(link => link.href.substring(1));
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
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 py-4' 
          : 'bg-transparent py-6'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="flex items-center ml-4">
          <img 
            src="https://image2url.com/r2/default/images/1773946600039-e944154d-8c91-4f2c-9380-ea4f1ae95cf5.png" 
            alt="ProfAs.kz" 
            /* 
               h-10 md:h-12 — оптимальный размер.
               mix-blend-screen — убирает черный фон.
               brightness-125 — делает цвета ярче на темном фоне.
            */
            className="h-10 md:h-12 w-auto object-contain mix-blend-screen brightness-125 transition-transform hover:scale-105" 
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                'transition-colors hover:text-orange-500',
                activeSection === link.href ? 'text-orange-500' : 'text-slate-300'
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/77007323366"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
          >
            <Phone className="w-4 h-4" />
            WhatsApp поддержка
          </a>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120] h-[100dvh] bg-slate-900 md:hidden overflow-hidden"
          >
            <div className="h-[100dvh] grid grid-rows-[80px,1fr,auto]">
              <div className="flex items-center justify-between px-4 h-20 border-b border-white/5 bg-slate-800/50">
                <a href="#" className="flex items-center ml-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <img 
                    src="https://image2url.com/r2/default/images/1773946600039-e944154d-8c91-4f2c-9380-ea4f1ae95cf5.png" 
                    alt="ProfAs.kz" 
                    className="h-10 md:h-12 w-auto object-contain mix-blend-screen brightness-125 transition-transform hover:scale-105" 
                  />
                </a>
                <button
                  className="text-white p-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              
              <div className="min-h-0 overflow-y-auto px-8 py-8 space-y-8 bg-slate-900">
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="block text-4xl font-bold text-white hover:text-orange-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  href={adminHref}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="block w-full text-4xl font-bold text-white hover:text-orange-500 transition-colors text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Панель Администратора
                </motion.a>
              </div>
  
              <div className="p-8 border-t border-white/10 bg-slate-900">
                <a
                  href="https://wa.me/77007323366"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-orange-500 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20"
                >
                  <Phone className="w-6 h-6" />
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