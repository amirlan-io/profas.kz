import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPage() {
  useEffect(() => {
    document.title = 'Политика конфиденциальности | ТОО ProfAs.kz';
    return () => {
      document.title =
        'Установка Видеонаблюдения в Алматы под ключ | ТОО ProfAs.kz';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 antialiased text-slate-900">
      <header className="border-b border-slate-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <Link
            to="/"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            ← На главную
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Политика конфиденциальности
        </h1>
        <p className="text-slate-500 text-sm mb-10">
          ТОО ProfAs.kz, БИН 130240008315. В соответствии с Законом Республики Казахстан от 21 мая
          2013 года № 94-V «О персональных данных и их защите».
        </p>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Общие положения</h2>
            <p>
              Настоящая Политика определяет порядок сбора, обработки, хранения и защиты персональных
              данных пользователей сайта profas-kz.vercel.app (далее — Сайт), принадлежащего ТОО
              ProfAs.kz (далее — Оператор).
            </p>
            <p className="mt-3">
              Используя Сайт и отправляя формы обратной связи, вы соглашаетесь на обработку
              персональных данных в объёме, необходимом для оказания услуг и консультаций.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Собираемые данные</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>ФИО и контактный телефон;</li>
              <li>Адрес электронной почты (при указании);</li>
              <li>Сведения, указанные в обращениях и заявках;</li>
              <li>Технические данные: IP-адрес, cookies, параметры браузера.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Цели обработки</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Обратная связь и подготовка коммерческих предложений;</li>
              <li>Заключение и исполнение договоров;</li>
              <li>Информирование о статусе заявки;</li>
              <li>Улучшение работы Сайта и аналитика посещаемости.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Правовые основания</h2>
            <p>
              Обработка осуществляется на основании согласия субъекта персональных данных, договора,
              законных интересов Оператора, а также требований законодательства Республики
              Казахстан.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Передача третьим лицам</h2>
            <p>
              Оператор не передаёт персональные данные третьим лицам, за исключением случаев,
              предусмотренных законом, либо при наличии отдельного согласия (хостинг, аналитика,
              сервисы связи по заявке).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Хранение и защита</h2>
            <p>
              Данные хранятся не дольше срока, необходимого для целей обработки. Оператор применяет
              организационные и технические меры защиты, включая использование защищённых каналов
              связи (HTTPS).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Права субъекта данных</h2>
            <p>
              Вы вправе запрашивать сведения об обработке, требовать уточнения, блокирования или
              уничтожения данных, отозвать согласие и обжаловать действия Оператора в
              уполномоченный орган по защите прав субъектов персональных данных.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Cookies</h2>
            <p>
              Сайт может использовать файлы cookie. Отключение cookies в браузере может ограничить
              функциональность Сайта.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Контакты оператора</h2>
            <p>
              ТОО ProfAs.kz, БИН 130240008315. Деятельность в области систем обеспечения
              безопасности (ОКЭД 80200). г. Алматы, ул. Камажай, 7, Казахстан.
            </p>
          </section>

          <p className="text-sm text-slate-400 pt-4 border-t border-slate-200">
            Последнее обновление: 2026 г.
          </p>
        </div>
      </main>
    </div>
  );
}
