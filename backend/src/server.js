import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';

import { assertSecrets } from './lib/secrets.js';
import { corsMiddleware } from './middleware/cors.js';
import { globalLimiter } from './middleware/rateLimit.js';

import { router as contactRouter } from './routes/contact.js';
import { router as portfolioRouter } from './routes/portfolio.js';
import { router as blogRouter } from './routes/blog.js';
import { router as adminRouter } from './routes/admin.js';
import { notFound, errorHandler } from './middleware/errors.js';

assertSecrets();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const isProd = process.env.NODE_ENV === 'production';

// Trust the first proxy hop (so req.ip + rate-limit work behind nginx/Cloudflare).
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ─── Security headers ──────────────────────────────────────────────
app.use(helmet({
  // Browser-side defence-in-depth. The SPA isn't served by this API,
  // so the CSP here only governs JSON/API + /uploads/*.
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'none'"],
      'img-src': ["'self'", 'data:'],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'none'"],
      'form-action': ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  referrerPolicy: { policy: 'no-referrer' },
  hsts: isProd ? { maxAge: 15552000, includeSubDomains: true, preload: false } : false,
}));

// Strict CORS allow-list (see middleware/cors.js)
app.use(corsMiddleware);

// Strict JSON/body parsing — small caps everywhere, larger only where needed.
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

// HPP: prevent ?status=a&status=b from bypassing whitelist filters.
app.use(hpp());

// Per-IP burst limiter on every API call.
app.use('/api', globalLimiter);

if (!isProd) app.use(morgan('dev'));
else app.use(morgan('combined'));

// ─── Static uploads ────────────────────────────────────────────────
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
  maxAge: '7d',
  fallthrough: false,
  // Force download semantics on anything that ever sneaks past the upload filter.
  setHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self' data:; sandbox");
  },
}));

// ─── Health ────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ─── API routes ────────────────────────────────────────────────────
app.use('/api', contactRouter);
app.use('/api', portfolioRouter);
app.use('/api', blogRouter);
app.use('/api', adminRouter);

// ─── 404 + errors ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[weblyne-api] listening on http://localhost:${PORT}  (env: ${process.env.NODE_ENV || 'development'})`);
});

// Clean shutdown
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    console.log(`[weblyne-api] ${sig} received, closing…`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
