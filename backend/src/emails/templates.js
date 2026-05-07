// Branded HTML email templates for Weblyne.
// Inline styles only — most clients strip <style>.

const BRAND = {
  blue: '#185fa5',
  navy: '#042c53',
  ink: '#0f1c33',
  muted: '#5b6b85',
  bg: '#f6f8fb',
  line: '#e2e8f1',
};

function escape(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shell({ heading, intro, bodyHtml, ctaLabel, ctaUrl, footerNote }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${escape(heading)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:white;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.line};">
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.blue},${BRAND.navy});padding:24px 32px;color:white;">
            <div style="font-weight:800;font-size:18px;letter-spacing:-0.01em;">Weblyne</div>
            <div style="font-size:12px;opacity:0.8;margin-top:2px;">A studio in Biratnagar, Nepal</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;color:${BRAND.ink};">${escape(heading)}</h1>
            ${intro ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${BRAND.muted};">${intro}</p>` : ''}
            ${bodyHtml || ''}
            ${ctaLabel && ctaUrl ? `
              <div style="margin:28px 0 8px;">
                <a href="${escape(ctaUrl)}" style="display:inline-block;background:${BRAND.blue};color:white;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;">${escape(ctaLabel)}</a>
              </div>
            ` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:${BRAND.bg};font-size:12px;color:${BRAND.muted};border-top:1px solid ${BRAND.line};">
            ${footerNote || 'Weblyne · Main Road, Biratnagar · hello@weblyne.np'}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function adminNotificationEmail(c) {
  const rows = [
    ['Name', c.name],
    ['Email', c.email],
    ['Phone', c.phone || '—'],
    ['Service', c.service || '—'],
    ['Budget', c.budget || '—'],
  ].map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:${BRAND.muted};border-bottom:1px solid ${BRAND.line};">${escape(k)}</td>
      <td style="padding:8px 12px;font-size:14px;color:${BRAND.ink};font-weight:600;border-bottom:1px solid ${BRAND.line};">${escape(v || '')}</td>
    </tr>`).join('');

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.line};border-radius:12px;overflow:hidden;margin-bottom:20px;">
      ${rows}
    </table>
    <div style="font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Project description</div>
    <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:${BRAND.ink};background:${BRAND.bg};padding:16px;border-radius:10px;border:1px solid ${BRAND.line};">${escape(c.description || '')}</div>
  `;

  const subject = `New enquiry: ${c.name} — ${c.service || 'general'}`;
  const text = [
    `New enquiry on weblyne.np`,
    `Name: ${c.name}`,
    `Email: ${c.email}`,
    `Phone: ${c.phone || '—'}`,
    `Service: ${c.service || '—'}`,
    `Budget: ${c.budget || '—'}`,
    '',
    c.description || '',
  ].join('\n');

  const html = shell({
    heading: 'New project enquiry',
    intro: 'A new enquiry just came through your website.',
    bodyHtml,
    ctaLabel: 'Open admin dashboard',
    ctaUrl: `${process.env.FRONTEND_URL || ''}/admin`,
  });

  return { subject, html, text };
}

export function clientConfirmationEmail(c) {
  const subject = `We got your enquiry, ${c.name?.split(' ')[0] || 'there'} — Weblyne`;
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
      Thanks for reaching out about <strong>${escape(c.service || 'your project')}</strong>.
      We've received your message and a real human will reply within 24 hours — usually a lot sooner.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
      In the meantime, if anything is urgent, you can ping us on WhatsApp at <strong>+977 9815 864 822</strong>.
    </p>
    <div style="margin-top:20px;padding:14px 16px;background:${BRAND.bg};border-radius:10px;border:1px solid ${BRAND.line};font-size:13px;color:${BRAND.muted};">
      <strong style="color:${BRAND.ink};">Your enquiry summary</strong><br/>
      ${escape(c.description || '').slice(0, 400)}
    </div>
  `;
  const text = `Hi ${c.name},\n\nThanks for reaching out about ${c.service || 'your project'}. We'll reply within 24 hours.\n\n— Weblyne\nhello@weblyne.np`;
  const html = shell({
    heading: `Thanks, ${escape((c.name || 'there').split(' ')[0])}.`,
    intro: 'We received your project enquiry. Here\'s what happens next.',
    bodyHtml,
    ctaLabel: 'Visit weblyne.np',
    ctaUrl: process.env.FRONTEND_URL || 'https://weblyne.np',
    footerNote: 'You\'re receiving this because you submitted an enquiry on weblyne.np.',
  });
  return { subject, html, text };
}
