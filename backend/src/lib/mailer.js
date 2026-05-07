import nodemailer from 'nodemailer';
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

export async function sendContactNotifications(contact) {
  const adminTo = process.env.EMAIL_TO_ADMIN || process.env.EMAIL_USER;
  const tasks = [];
  if (adminTo) {
    const { subject, html, text } = adminNotificationEmail(contact);
    tasks.push(send({ to: adminTo, subject, html, text }));
  }
  if (contact.email) {
    const { subject, html, text } = clientConfirmationEmail(contact);
    tasks.push(send({ to: contact.email, subject, html, text }));
  }
  // Don't fail the request if email sending fails — just log.
  await Promise.allSettled(tasks).then(results => {
    results.forEach(r => { if (r.status === 'rejected') console.error('[mailer]', r.reason); });
  });
}
