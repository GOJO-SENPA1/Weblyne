import { Link } from 'react-router-dom';

export default function AdminTopbar() {
  return (
    <div style={{
      height: 48, background: 'var(--color-ink)', color: '#cfdaeb',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', fontSize: 12, fontFamily: 'var(--font-mono)',
    }}>
      <Link to="/" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>← Back to site</Link>
      <span>Weblyne Admin Console</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: '#5cd29d' }} />
        All systems operational
      </span>
    </div>
  );
}
