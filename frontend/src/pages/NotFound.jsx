import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { useSeo } from '../lib/seo.js';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: '404 — the page you were looking for has moved or never existed.', noindex: true });
  return (
    <section className="wb-section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="wb-container" style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-text-faint)', letterSpacing: '0.1em' }}>ERROR · 404</div>
        <h1 style={{ marginTop: 16, marginBottom: 16 }}>Page not found.</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 17, maxWidth: 440, margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or moved. Let's get you back somewhere useful.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="wb-btn wb-btn--primary">Back to home <Icon name="arrow-right" size={14} /></Link>
          <Link to="/contact" className="wb-btn wb-btn--ghost">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
