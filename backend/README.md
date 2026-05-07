# Weblyne — Backend API

REST API for the Weblyne marketing site and admin console.
**Node 20+ · Express · Postgres 14+ · JWT · Nodemailer**

## Quick start

```bash
cd backend
cp .env.example .env          # then edit values
npm install
createdb weblyne              # or use any Postgres URL in DATABASE_URL
npm run db:init               # apply schema.sql
npm run db:seed               # seed admin user + sample blog posts
npm run dev                   # http://localhost:4000
```

The frontend (`/frontend`) proxies `/api/*` to `http://localhost:4000` in dev — no extra config needed.

## Environment

See `.env.example`. Required keys:

| Key | Notes |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Long random string |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail SMTP (use an [App Password](https://myaccount.google.com/apppasswords)) |
| `EMAIL_FROM` | `"Weblyne <hello@weblyne.np>"` style |
| `EMAIL_TO_ADMIN` | Where contact-form notifications go |
| `FRONTEND_URL` | Used in email CTA links + CORS |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used by `npm run db:seed` |

If `EMAIL_USER`/`EMAIL_PASS` are missing, the mailer logs to console instead of sending — handy for local dev.

## Routes

### Public
- `GET  /api/health`
- `POST /api/contact` — project enquiry (rate-limited 5/hr/IP)
- `POST /api/newsletter` — `{ email }` (rate-limited 30/hr/IP)
- `GET  /api/portfolio?category=...`
- `GET  /api/portfolio/featured`
- `GET  /api/portfolio/:id`
- `GET  /api/blog?category=...`
- `GET  /api/blog/:slug`

### Admin (Bearer token required)
- `POST   /api/admin/login` — returns `{ token }` (rate-limited 10/15min)
- `GET    /api/admin/me`
- `GET    /api/admin/stats`
- `GET    /api/admin/contacts?status=new`
- `PATCH  /api/admin/contacts/:id` — `{ status }`
- `DELETE /api/admin/contacts/:id`
- `POST   /api/admin/portfolio`
- `PUT    /api/admin/portfolio/:id`
- `DELETE /api/admin/portfolio/:id`
- `POST   /api/admin/blog`
- `PUT    /api/admin/blog/:id`
- `DELETE /api/admin/blog/:id`
- `POST   /api/admin/upload` — multipart, field `file`, returns `{ url }`

## Files

```
backend/
├─ db/
│  ├─ schema.sql        – tables + indexes
│  ├─ init.js           – npm run db:init
│  └─ seed.js           – npm run db:seed
├─ src/
│  ├─ server.js         – entry
│  ├─ lib/
│  │  ├─ db.js          – pg Pool
│  │  ├─ mailer.js      – nodemailer wrapper
│  │  └─ validators.js  – zod schemas
│  ├─ middleware/
│  │  ├─ auth.js        – JWT
│  │  ├─ errors.js      – error / 404 handlers
│  │  ├─ rateLimit.js
│  │  └─ upload.js      – multer (5MB, images only)
│  ├─ routes/
│  │  ├─ contact.js
│  │  ├─ portfolio.js
│  │  ├─ blog.js
│  │  └─ admin.js
│  └─ emails/
│     └─ templates.js   – branded HTML emails
└─ uploads/             – served at /uploads/*
```

## Security

Defence-in-depth layers already wired up:

| Layer | Where |
| --- | --- |
| Strict allow-list CORS | `src/middleware/cors.js` — only `FRONTEND_URL` (+ localhost in dev) is accepted; unknown Origins are rejected by the preflight. Add more via `CORS_ALLOWED_ORIGINS` (comma-separated). |
| Helmet w/ tight CSP | `src/server.js` — `default-src 'none'`, no `frame-ancestors`, `referrer-policy: no-referrer`, HSTS in prod. |
| HPP | Blocks `?status=a&status=b` array-tricks that bypass whitelists. |
| Body size caps | JSON + urlencoded capped at **32 KB**. Uploads capped at **5 MB**, images only (no SVG — XSS vector). |
| Global per-IP limiter | 300 req / 5 min on every `/api/*` route. |
| Contact rate limit | 5 / IP / hour. |
| Newsletter rate limit | 30 / IP / hour. |
| Login rate limit + slow-down | 10 / IP / 15 min, with progressive 500 ms × n delay after 3 failed attempts (caps at 5 s). |
| Honeypot | Hidden `website` field on the contact form — bots that fill it get a fake 201 with no DB write or email. |
| JWT secret validation | `src/lib/secrets.js` — refuses to boot if `JWT_SECRET` is missing, default, or under 32 chars. |
| Generic auth errors | `/admin/login` returns identical `Invalid credentials` for unknown email vs wrong password (no user enumeration). |
| Bcrypt password hashing | 10 rounds, hash stored in `admins.password_hash`. |
| `x-powered-by` disabled | Smaller fingerprint surface. |
| Static `/uploads` hardening | `X-Content-Type-Options: nosniff` + `Content-Security-Policy: sandbox` on every served file. |
| `trust proxy: 1` | Correct client IPs behind nginx/Cloudflare so rate limits aren't bypassed. |

Open follow-ups you should consider before going live:
- Put the API behind HTTPS (nginx/Caddy/Cloudflare). HSTS only kicks in over HTTPS.
- Rotate `JWT_SECRET` periodically; consider short-lived access + refresh tokens for the admin console.
- Move `uploads/` to S3/R2 with signed URLs once you have real client work.
- Add a CAPTCHA (hCaptcha) on `/contact` if the honeypot ever stops being enough.
- Set up a DB backup job (`pg_dump` to off-host storage daily).

## Notes

- Schema is idempotent: re-running `db:init` is safe.
- `db:seed` upserts the admin (so changing `SEED_ADMIN_PASSWORD` and re-running rotates the password).
- No fake portfolio is seeded — Weblyne is brand new and we want the empty-state to be honest.
