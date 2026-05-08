import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../lib/db.js';
import { authenticateAdmin, signAdminToken } from '../middleware/auth.js';
import { loginLimiter, loginSlowDown } from '../middleware/rateLimit.js';
import { upload } from '../middleware/upload.js';
import {
  loginSchema,
  portfolioSchema,
  blogSchema,
  contactPatchSchema,
  adminCreateSchema,
} from '../lib/validators.js';

export const router = Router();

// POST /api/admin/login
router.post('/admin/login', loginLimiter, loginSlowDown, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { rows } = await query('SELECT id, email, password_hash, name FROM admins WHERE email = $1', [email]);
    const admin = rows[0];
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signAdminToken(admin);
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) { next(err); }
});

// All routes below require auth.
router.use(authenticateAdmin);

// GET /api/admin/me
router.get('/admin/me', (req, res) => res.json({ admin: req.admin }));

// GET /api/admin/stats
router.get('/admin/stats', async (req, res, next) => {
  try {
    const [
      { rows: [c] },
      { rows: [p] },
      { rows: [b] },
      { rows: [n] },
      { rows: [cNew] },
      { rows: [c30] },
      { rows: [c7] },
    ] = await Promise.all([
      query('SELECT COUNT(*)::int AS n FROM contacts'),
      query('SELECT COUNT(*)::int AS n FROM portfolio'),
      query('SELECT COUNT(*)::int AS n FROM blog'),
      query('SELECT COUNT(*)::int AS n FROM newsletter'),
      query("SELECT COUNT(*)::int AS n FROM contacts WHERE status = 'new'"),
      query("SELECT COUNT(*)::int AS n FROM contacts WHERE created_at >= now() - interval '30 days'"),
      query("SELECT COUNT(*)::int AS n FROM contacts WHERE created_at >= now() - interval '7 days'"),
    ]);
    res.json({
      contacts_count: c.n,
      portfolio_count: p.n,
      blog_count: b.n,
      newsletter_count: n.n,
      contacts_new: cNew.n,
      contacts_30d: c30.n,
      contacts_7d: c7.n,
      admin_email: req.admin.email,
    });
  } catch (err) { next(err); }
});

// GET /api/admin/analytics — time-series + breakdowns for charts
router.get('/admin/analytics', async (req, res, next) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 30, 7), 90);
    const [series, byService, byStatus, byBudget, recent] = await Promise.all([
      query(
        `SELECT to_char(d::date, 'YYYY-MM-DD') AS date,
                COALESCE(c.n, 0)::int AS count
         FROM generate_series(now()::date - ($1::int - 1) * interval '1 day', now()::date, interval '1 day') AS d
         LEFT JOIN (
           SELECT created_at::date AS day, COUNT(*) AS n
           FROM contacts
           WHERE created_at >= now()::date - ($1::int - 1) * interval '1 day'
           GROUP BY created_at::date
         ) c ON c.day = d::date
         ORDER BY d`,
        [days],
      ),
      query(
        `SELECT COALESCE(service, 'Unspecified') AS label, COUNT(*)::int AS count
         FROM contacts
         WHERE created_at >= now() - ($1::int * interval '1 day')
         GROUP BY label ORDER BY count DESC LIMIT 10`,
        [days],
      ),
      query(
        `SELECT status AS label, COUNT(*)::int AS count
         FROM contacts GROUP BY status ORDER BY count DESC`,
      ),
      query(
        `SELECT COALESCE(budget, 'Unspecified') AS label, COUNT(*)::int AS count
         FROM contacts
         WHERE created_at >= now() - ($1::int * interval '1 day')
         GROUP BY label ORDER BY count DESC LIMIT 10`,
        [days],
      ),
      query(
        `SELECT id, name, email, service, status, created_at
         FROM contacts ORDER BY created_at DESC LIMIT 5`,
      ),
    ]);
    res.json({
      days,
      series: series.rows,
      by_service: byService.rows,
      by_status: byStatus.rows,
      by_budget: byBudget.rows,
      recent: recent.rows,
    });
  } catch (err) { next(err); }
});

// ── Contacts ────────────────────────────────────────────────
router.get('/admin/contacts', async (req, res, next) => {
  try {
    const { status } = req.query;
    const params = [];
    let where = '';
    if (status) { params.push(status); where = `WHERE status = $${params.length}`; }
    const { rows } = await query(
      `SELECT id, name, email, phone, service, budget, description, status, created_at
       FROM contacts ${where}
       ORDER BY created_at DESC
       LIMIT 500`,
      params,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.patch('/admin/contacts/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const { status } = contactPatchSchema.parse(req.body);
    if (!status) return res.status(400).json({ error: 'Nothing to update' });
    const { rows } = await query(
      `UPDATE contacts SET status = $1 WHERE id = $2
       RETURNING id, name, email, status`,
      [status, id],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/admin/contacts/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    await query('DELETE FROM contacts WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) { next(err); }
});

// ── Portfolio ───────────────────────────────────────────────
router.post('/admin/portfolio', async (req, res, next) => {
  try {
    const d = portfolioSchema.parse(req.body);
    const { rows } = await query(
      `INSERT INTO portfolio (title, description, category, client_name, tech_stack,
        image_url, live_url, challenge, approach, results, featured, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,COALESCE($11,false),COALESCE($12,true))
       RETURNING *`,
      [d.title, d.description, d.category, d.client_name, d.tech_stack,
       d.image_url, d.live_url, d.challenge, d.approach, d.results, d.featured, d.published],
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put('/admin/portfolio/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const d = portfolioSchema.parse(req.body);
    const { rows } = await query(
      `UPDATE portfolio SET
         title = $1, description = $2, category = $3, client_name = $4, tech_stack = $5,
         image_url = $6, live_url = $7, challenge = $8, approach = $9, results = $10,
         featured = COALESCE($11, featured), published = COALESCE($12, published),
         updated_at = now()
       WHERE id = $13
       RETURNING *`,
      [d.title, d.description, d.category, d.client_name, d.tech_stack,
       d.image_url, d.live_url, d.challenge, d.approach, d.results, d.featured, d.published, id],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/admin/portfolio/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    await query('DELETE FROM portfolio WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) { next(err); }
});

router.get('/admin/portfolio', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, title, description, category, client_name, tech_stack,
              image_url, live_url, featured, published, created_at, updated_at
       FROM portfolio ORDER BY updated_at DESC`,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// ── Blog ────────────────────────────────────────────────────
router.get('/admin/blog', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, slug, title, excerpt, body, category, author, read_time,
              image_url, published, published_at, created_at, updated_at
       FROM blog ORDER BY updated_at DESC`,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/admin/blog', async (req, res, next) => {
  try {
    const d = blogSchema.parse(req.body);
    const { rows } = await query(
      `INSERT INTO blog (slug, title, excerpt, body, category, author, read_time,
         image_url, published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,true),COALESCE($10::timestamptz, now()))
       RETURNING *`,
      [d.slug, d.title, d.excerpt, d.body, d.category, d.author, d.read_time,
       d.image_url, d.published, d.published_at],
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.put('/admin/blog/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const d = blogSchema.parse(req.body);
    const { rows } = await query(
      `UPDATE blog SET
         slug = $1, title = $2, excerpt = $3, body = $4, category = $5,
         author = $6, read_time = $7, image_url = $8,
         published = COALESCE($9, published),
         published_at = COALESCE($10::timestamptz, published_at),
         updated_at = now()
       WHERE id = $11
       RETURNING *`,
      [d.slug, d.title, d.excerpt, d.body, d.category, d.author, d.read_time,
       d.image_url, d.published, d.published_at, id],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/admin/blog/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    await query('DELETE FROM blog WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) { next(err); }
});

// ── Uploads ─────────────────────────────────────────────────
router.post('/admin/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename, size: req.file.size, mime: req.file.mimetype });
});

// ── Admin team (any logged-in admin can manage other admins) ─
router.get('/admin/admins', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, email, name, created_at FROM admins ORDER BY created_at ASC`,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

router.post('/admin/admins', async (req, res, next) => {
  try {
    const d = adminCreateSchema.parse(req.body);
    const hash = await bcrypt.hash(d.password, 12);
    const { rows } = await query(
      `INSERT INTO admins (email, password_hash, name) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email, name, created_at`,
      [d.email.toLowerCase(), hash, d.name || null],
    );
    if (!rows[0]) return res.status(409).json({ error: 'An admin with that email already exists.' });
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

router.delete('/admin/admins/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    if (id === req.admin.id) return res.status(400).json({ error: 'You cannot remove yourself.' });
    const { rows: [count] } = await query('SELECT COUNT(*)::int AS n FROM admins');
    if (count.n <= 1) return res.status(400).json({ error: 'At least one admin must remain.' });
    await query('DELETE FROM admins WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) { next(err); }
});
