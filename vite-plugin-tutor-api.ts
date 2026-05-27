import type { Plugin } from 'vite';
import { config as loadEnv } from 'dotenv';
import { runTutorChat, type ChatTurn } from './lib-server/tutor';

/** Dev-only proxy for /api/tutor (production uses Vercel serverless) */
export function tutorDevApiPlugin(): Plugin {
  return {
    name: 'tutor-dev-api',
    configureServer(server) {
      loadEnv({ path: '.env.local' });
      loadEnv();

      server.middlewares.use('/api/tutor', (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== 'POST') {
          next();
          return;
        }

        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', () => {
          void (async () => {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'OPENAI_API_KEY не задан в .env.local' }));
              return;
            }

            try {
              const body = JSON.parse(raw || '{}') as {
                message?: string;
                history?: ChatTurn[];
              };
              const message = body.message?.trim();
              if (!message) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Сообщение пустое' }));
                return;
              }

              const reply = await runTutorChat(
                message,
                body.history ?? [],
                apiKey,
                process.env.OPENAI_MODEL
              );
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply }));
            } catch (err) {
              console.error('[tutor-dev-api]', err);
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Ошибка ответа AI-сервиса' }));
            }
          })();
        });
      });
    },
  };
}
