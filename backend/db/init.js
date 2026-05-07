// Apply schema.sql to the database referenced by DATABASE_URL.
// Usage: npm run db:init
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../src/lib/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('[db] schema applied');
  } catch (err) {
    console.error('[db] init failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
