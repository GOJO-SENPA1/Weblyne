import { Link } from 'react-router-dom';

export default function Logo({ size = 22, color, white }) {
  const c = color || (white ? '#fff' : 'var(--color-navy)');
  return (
    <Link to="/" className="wb-logo" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontFamily: 'var(--font-display)', fontWeight: 800,
      fontSize: size, letterSpacing: '-0.03em',
      color: c, lineHeight: 1,
    }}>
      <svg width={size + 4} height={size + 4} viewBox="0 0 28 28" fill="none">
        <circle cx="6" cy="6" r="3" fill={c} />
        <circle cx="22" cy="6" r="3" fill={c} opacity="0.5" />
        <circle cx="14" cy="22" r="3" fill={c} />
        <line x1="6" y1="6" x2="14" y2="22" stroke={c} strokeWidth="1.6" />
        <line x1="22" y1="6" x2="14" y2="22" stroke={c} strokeWidth="1.6" />
        <line x1="6" y1="6" x2="22" y2="6" stroke={c} strokeWidth="1.6" opacity="0.4" />
      </svg>
      <span>Weblyne</span>
    </Link>
  );
}
