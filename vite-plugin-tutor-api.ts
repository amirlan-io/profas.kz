import type { Plugin } from 'vite';
import { config as loadEnv } from 'dotenv';
import { validateTutorPayload } from './api/_lib/security';
import { runTutor } from './lib-server/tutor-engine';

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
            try {
              const body = JSON.parse(raw || '{}') as unknown;
              const parsed = validateTutorPayload(body);
              if (!parsed) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Некорректный запрос' }));
                return;
              }

              const reply = await runTutor(parsed.message, parsed.history, {
                groqApiKey: process.env.GROQ_API_KEY,
                geminiApiKey: process.env.GEMINI_API_KEY,
                groqModel: process.env.GROQ_MODEL,
                geminiModel: process.env.GEMINI_MODEL,
              });
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ reply }));
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Ошибка AI';
              console.error('[tutor-dev-api]', msg);
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: msg }));
            }
          })();
        });
      });
    },
  };
}
