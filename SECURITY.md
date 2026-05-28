# Безопасность ProfAs.kz

## Секреты и ключи API

- **Никогда** не коммитьте `.env.local`, реальные `GROQ_API_KEY` / `GEMINI_API_KEY`.
- Ключи AI хранятся только в **Vercel → Environment Variables** (и локально в `.env.local`).
- Клиентский код обращается к `/api/tutor` — ключи не попадают в браузер.
- Если ключ попал в чат, git или скриншот — **сразу отзовите** в [Groq Console](https://console.groq.com/keys) / [Google AI Studio](https://aistudio.google.com/apikey) и создайте новый.

## Что уже настроено

| Мера | Где |
|------|-----|
| CORS только для своих доменов | `api/_lib/security.ts`, `api/tutor.ts` |
| Лимит длины сообщений и истории чата | `api/_lib/security.ts` |
| Без утечки внутренних ошибок AI в production | `safeErrorMessage()` |
| Заголовки CSP, HSTS, X-Frame-Options | `vercel.json` |
| Скрытие `/admin` от индексации | `public/robots.txt` |
| Админ-сессия UI в `sessionStorage` (не localStorage) | `src/App.tsx` |
| Аутентификация админки через httpOnly cookies | бэкенд `profas-back` |

## Дополнительно (по желанию)

- Подключить домен `profas.kz` в Vercel и обновить `ALLOWED_ORIGINS` при превью-деплоях.
- Rate limiting через [Vercel Firewall](https://vercel.com/docs/security/firewall) или Upstash Redis для `/api/tutor`.
- WAF / Cloudflare перед сайтом при росте трафика.

## Проверка перед релизом

```bash
npm run build
npm audit
git grep -i "gsk_\|AIzaSy" -- ':!*.example' ':!.env.example'
```
