import { Router } from 'express';
import { query } from '../lib/db.js';

export const router = Router();

// GET /api/blog?category=Strategy
router.get('/blog', async (req, res, next) => {
  try {
    const { category } = req.query;
    const params = [];
    let where = 'WHERE published = true';
    if (category) { params.push(category); where += ` AND category = $${params.length}`; }
    const { rows } = await query(
      `SELECT id, slug, title, excerpt, category, author, read_time, image_url, published_at, created_at
       FROM blog ${where}
       ORDER BY COALESCE(published_at, created_at) DESC`,
      params,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/blog/:slug
router.get('/blog/:slug', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, slug, title, excerpt, body, category, author, read_time, image_url, published_at, created_at
       FROM blog
       WHERE slug = $1 AND published = true`,
      [req.params.slug],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});
