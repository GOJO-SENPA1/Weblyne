import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 'var(--nav-h)',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? 'transparent' : 'var(--color-line)'}`,
        boxShadow: scrolled ? '0 4px 20px rgba(4,44,83,0.06)' : 'none',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}>
        <div className="wb-container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size={20} />
          <ul className="wb-nav-links" style={{ display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} style={({ isActive }) => ({
                  display: 'inline-block',
                  padding: '8px 14px',
                  fontSize: 14, fontWeight: 500,
                  color: isActive ? 'var(--color-blue)' : 'var(--color-ink-2)',
                  background: isActive ? 'var(--color-blue-light)' : 'transparent',
                  borderRadius: 8,
                  transition: 'background 0.15s, color 0.15s',
                })}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/contact" className="wb-btn wb-btn--primary wb-btn--sm wb-nav-cta">
              Get a Quote <Icon name="arrow-right" size={14} />
            </Link>
            <button className="wb-nav-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{
              display: 'none', background: 'none', border: '1px solid var(--color-line)',
              width: 40, height: 40, borderRadius: 8,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(4,44,83,0.4)' }} onClick={() => setMobileOpen(false)}>
          <aside onClick={(e) => e.stopPropagation()} style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: 320, background: 'white', padding: 24,
            display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'wb-slide-in 0.25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Logo size={20} />
              <button onClick={() => setMobileOpen(false)} style={{
                background: 'var(--color-bg-soft)', border: 'none',
                width: 36, height: 36, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="x" size={18} />
              </button>
            </div>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} style={({ isActive }) => ({
                padding: '14px 12px', fontSize: 16, fontWeight: 500,
                borderRadius: 10,
                color: isActive ? 'var(--color-blue)' : 'var(--color-ink)',
                background: isActive ? 'var(--color-blue-light)' : 'transparent',
              })}>{l.label}</NavLink>
            ))}
            <div style={{ marginTop: 'auto' }}>
              <Link to="/contact" className="wb-btn wb-btn--primary" style={{ width: '100%' }}>
                Get a Quote <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
