import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// 5 contact submissions per IP per hour.
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries from this IP. Please try again in an hour.' },
});

// 10 login attempts per IP per 15 minutes.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
});

// Progressive slowdown layered on top of loginLimiter — after 3 fast attempts,
// add 500ms × (n - 3) delay (capped at 5s) so an attacker can't burn through 10 tries instantly.
export const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: (hits) => (hits - 3) * 500,
  maxDelayMs: 5000,
});

// 30 newsletter signups per IP per hour.
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many subscribe attempts. Try again later.' },
});

// Generic per-IP cap to absorb burst floods at the API edge (300 req / 5 min).
export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — slow down.' },
});
