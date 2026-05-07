import { Router } from 'express';
import { query } from '../lib/db.js';

export const router = Router();

// GET /api/portfolio?category=website
router.get('/portfolio', async (req, res, next) => {
  try {
    const { category } = req.query;
    const params = [];
    let where = 'WHERE published = true';
    if (category) { params.push(category); where += ` AND category = $${params.length}`; }
    const { rows } = await query(
      `SELECT id, title, description, category, client_name, tech_stack, image_url, live_url, featured, created_at
       FROM portfolio ${where}
       ORDER BY featured DESC, created_at DESC`,
      params,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/portfolio/featured
router.get('/portfolio/featured', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT id, title, description, category, client_name, tech_stack, image_url, live_url, created_at
       FROM portfolio
       WHERE published = true AND featured = true
       ORDER BY created_at DESC
       LIMIT 6`,
    );
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/portfolio/:id
router.get('/portfolio/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const { rows } = await query(
      `SELECT id, title, description, category, client_name, tech_stack, image_url, live_url,
              challenge, approach, results, featured, created_at
       FROM portfolio
       WHERE id = $1 AND published = true`,
      [id],
    );
    if (!rows[0]) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});
