import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';

const linkCols = [
  { title: 'Solutions', items: [['Services', '/services'], ['Portfolio', '/portfolio'], ['Pricing', '/pricing']] },
  { title: 'Company', items: [['About', '/about'], ['Blog', '/blog'], ['Contact', '/contact']] },
  { title: 'Legal', items: [['Privacy', '/'], ['Terms', '/'], ['Cookies', '/']] },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-navy)', color: '#cfdaeb', padding: '80px 0 32px', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />
      <div className="wb-container" style={{ position: 'relative' }}>
        <div className="wb-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          <div>
            <Logo size={22} white />
            <p style={{ marginTop: 16, color: '#9bafcb', fontSize: 14, maxWidth: 280, lineHeight: 1.6 }}>
              Building Biratnagar's Digital Future. Modern websites, web apps & SEO for local businesses.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              {['instagram', 'facebook', 'linkedin'].map(i => (
                <a key={i} href="#" style={{
                  width: 38, height: 38, borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#cfdaeb', transition: 'background 0.15s, color 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-blue)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cfdaeb'; }}>
                  <Icon name={i} size={16} />
                </a>
              ))}
            </div>
          </div>
          {linkCols.map(col => (
            <div key={col.title}>
              <h4 style={{ color: 'white', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.items.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} style={{ color: '#9bafcb', fontSize: 14 }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12, fontSize: 13, color: '#7a8fa9',
        }}>
          <span>© 2025 Weblyne · Biratnagar, Nepal</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>Crafted in Province 1 · Nepal</span>
        </div>
      </div>
    </footer>
  );
}
