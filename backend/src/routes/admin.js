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
    const [{ rows: [c] }, { rows: [p] }, { rows: [b] }, { rows: [n] }] = await Promise.all([
      query('SELECT COUNT(*)::int AS n FROM contacts'),
      query('SELECT COUNT(*)::int AS n FROM portfolio'),
      query('SELECT COUNT(*)::int AS n FROM blog'),
      query('SELECT COUNT(*)::int AS n FROM newsletter'),
    ]);
    res.json({
      contacts_count: c.n,
      portfolio_count: p.n,
      blog_count: b.n,
      newsletter_count: n.n,
      admin_email: req.admin.email,
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

// ── Blog ────────────────────────────────────────────────────
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
