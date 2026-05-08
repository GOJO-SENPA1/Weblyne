import nodemailer from 'nodemailer';
import { query } from './db.js';
import { adminNotificationEmail, clientConfirmationEmail } from '../emails/templates.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[mailer] EMAIL_USER / EMAIL_PASS not set — emails will be logged only.');
    return null;
  }
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return transporter;
}

async function send({ to, subject, html, text }) {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM || `Weblyne <${process.env.EMAIL_USER || 'no-reply@weblyne.np'}>`;
  if (!t) {
    console.log(`[mailer:dry-run] -> ${to}: ${subject}`);
    return { dryRun: true };
  }
  return t.sendMail({ from, to, subject, html, text });
}

// Build the full admin recipient list:
// 1) every email in the `admins` table  (so adding admins via the panel auto-CCs them)
// 2) plus EMAIL_TO_ADMIN env (comma-separated allowed) for any non-admin recipient like an alias
async function getAdminRecipients() {
  const set = new Set();
  try {
    const { rows } = await query('SELECT email FROM admins');
    rows.forEach(r => r.email && set.add(r.email.toLowerCase()));
  } catch (err) {
    console.error('[mailer] failed to read admin emails:', err.message);
  }
  const env = process.env.EMAIL_TO_ADMIN || process.env.EMAIL_USER;
  if (env) env.split(',').map(s => s.trim()).filter(Boolean).forEach(e => set.add(e.toLowerCase()));
  return [...set];
}

export async function sendContactNotifications(contact) {
  const adminTos = await getAdminRecipients();
  const tasks = [];
  if (adminTos.length) {
    const { subject, html, text } = adminNotificationEmail(contact);
    // One email, multiple recipients — Gmail handles arrays via comma-join.
    tasks.push(send({ to: adminTos.join(', '), subject, html, text }));
  }
  if (contact.email) {
    const { subject, html, text } = clientConfirmationEmail(contact);
    tasks.push(send({ to: contact.email, subject, html, text }));
  }
  await Promise.allSettled(tasks).then(results => {
    results.forEach(r => { if (r.status === 'rejected') console.error('[mailer]', r.reason); });
  });
}
