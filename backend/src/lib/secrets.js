// Validate critical secrets on boot so we fail fast in misconfigured environments.

const WEAK_JWT_DEFAULTS = new Set([
  '',
  'change-me-to-a-long-random-string',
  'secret',
  'changeme',
  'jwt-secret',
]);

export function assertSecrets() {
  const errors = [];
  const isProd = process.env.NODE_ENV === 'production';

  const jwt = process.env.JWT_SECRET || '';
  if (!jwt) errors.push('JWT_SECRET is required.');
  else if (WEAK_JWT_DEFAULTS.has(jwt)) errors.push('JWT_SECRET is using a default/weak value — change it.');
  else if (jwt.length < 32) errors.push('JWT_SECRET should be at least 32 characters.');

  if (!process.env.DATABASE_URL) errors.push('DATABASE_URL is required.');

  if (isProd) {
    if (!process.env.FRONTEND_URL) errors.push('FRONTEND_URL is required in production (used for strict CORS).');
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[secrets] EMAIL_USER/EMAIL_PASS missing — contact emails will not send.');
    }
  }

  if (errors.length) {
    console.error('\n[secrets] Refusing to start. Fix:');
    for (const e of errors) console.error('  - ' + e);
    console.error('');
    process.exit(1);
  }
}
