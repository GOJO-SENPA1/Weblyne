import cors from 'cors';

// Strict allow-list. In dev, default to allowing the Vite origin.
function buildAllowList() {
  const list = new Set();
  const isProd = process.env.NODE_ENV === 'production';
  if (process.env.FRONTEND_URL) list.add(process.env.FRONTEND_URL);
  if (process.env.CORS_ALLOWED_ORIGINS) {
    process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean).forEach(o => list.add(o));
  }
  if (!isProd) {
    list.add('http://localhost:5173');
    list.add('http://localhost:4173');
    list.add('http://127.0.0.1:5173');
  }
  return list;
}

const ALLOWED = buildAllowList();

export const corsMiddleware = cors({
  origin(origin, cb) {
    // Allow same-origin / curl / server-to-server (no Origin header)
    if (!origin) return cb(null, true);
    if (ALLOWED.has(origin)) return cb(null, true);
    return cb(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
});
