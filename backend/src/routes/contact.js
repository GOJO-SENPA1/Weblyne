import { Router } from 'express';
import { query } from '../lib/db.js';
import { contactSchema, newsletterSchema } from '../lib/validators.js';
import { contactLimiter, newsletterLimiter } from '../middleware/rateLimit.js';
import { sendContactNotifications } from '../lib/mailer.js';

export const router = Router();

router.post('/contact', contactLimiter, async (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);

    // Honeypot — silently 201 if bot filled the trap field, no DB insert, no email.
    if ((data.website && data.website.length) || (data.hp_token && data.hp_token.length)) {
      return res.status(201).json({ id: null, message: 'Thanks — we\'ll be in touch within 24 hours.' });
    }

    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip;
    const { rows } = await query(
      `INSERT INTO contacts (name, email, phone, service, budget, description, ip)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, phone, service, budget, description, status, created_at`,
      [data.name, data.email, data.phone || null, data.service || null, data.budget || null, data.description, ip],
    );
    const contact = rows[0];

    // Fire-and-forget emails — don't block response if SMTP is slow.
    sendContactNotifications(contact).catch(err => console.error('[contact:mail]', err));

    res.status(201).json({ id: contact.id, message: 'Thanks — we\'ll be in touch within 24 hours.' });
  } catch (err) { next(err); }
});

router.post('/newsletter', newsletterLimiter, async (req, res, next) => {
  try {
    const { email } = newsletterSchema.parse(req.body);
    await query(
      `INSERT INTO newsletter (email) VALUES ($1) ON CONFLICT (email) DO NOTHING`,
      [email],
    );
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
});
