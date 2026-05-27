import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          
          {/* Блок 1: О компании */}
          <div className="col-span-1">
            <div className="mb-8 flex items-center">
              <img 
                src="https://ltdfoto.ru/images/2026/03/18/WhatsApp-Image-2026-03-18-at-21.30.25.jpg" 
                alt="ProfAs.kz" 
                /* В футере фон белый, поэтому mix-blend-screen не нужен, 
                   но px-4 оставили для защиты буквы "P" */
                className="h-10 w-auto object-contain px-4 flex-shrink-0" 
              />
            </div>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Ведущий образовательный центр по профессиональной сертификации и безопасности в Казахстане. Работаем по всей территории РК.
            </p>
            <div className="space-y-4">
              <a href="tel:+77007323366" className="flex items-center gap-3 text-slate-900 font-bold hover:text-orange-500 transition-colors">
                <Phone className="w-5 h-5 text-orange-500" /> +7 700 732 3366
              </a>
              <a href="mailto:info@pb24.kz" className="flex items-center gap-3 text-slate-600 hover:text-orange-500 transition-colors">
                <Mail className="w-5 h-5 text-orange-500" /> info@pb24.kz
              </a>
            </div>
          </div>
          
          {/* Блок 2: Курсы */}
          <div>
            <h6 className="font-bold mb-8 text-slate-900 text-lg">Обучение</h6>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#courses" className="hover:text-orange-500 transition-colors">Пожарная безопасность (ПТМ)</a></li>
              <li><a href="#courses" className="hover:text-orange-500 transition-colors">Охрана труда (БиОТ)</a></li>
              <li><a href="#courses" className="hover:text-orange-500 transition-colors">Промышленная безопасность</a></li>
              <li><a href="#courses" className="hover:text-orange-500 transition-colors">Электробезопасность</a></li>
              <li><a href="#courses" className="hover:text-orange-500 transition-colors">Курсы ДОПОГ</a></li>
            </ul>
          </div>
          
          {/* Блок 3: Компания */}
          <div>
            <h6 className="font-bold mb-8 text-slate-900 text-lg">Компания</h6>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-orange-500 transition-colors">О центре</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Аккредитация</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Наши клиенты</a></li>
              <li><a href="#faq" className="hover:text-orange-500 transition-colors">Вопросы и ответы</a></li>
              <li className="pt-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4" /> Работаем по всей РК
              </li>
            </ul>
          </div>
          
          {/* Блок 4: Адрес */}
          <div>
            <h6 className="font-bold mb-8 text-slate-900 text-lg">Наш офис</h6>
            <p className="text-slate-500 mb-6 leading-relaxed flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
              г. Алматы, ул. Камажай, 7, Казахстан
            </p>
            {/* Контейнер с изображением полностью удален */}
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 text-center space-y-2">
          <p className="text-slate-500 text-sm leading-relaxed">
            © 2026 ТОО ProfAs.kz. БИН 130240008315. Деятельность в области систем обеспечения
            безопасности в Республике Казахстан (ОКЭД 80200). Все права защищены.
          </p>
          <Link
            to="/privacy"
            className="inline-block text-slate-500 text-sm hover:text-orange-500 transition-colors"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
};