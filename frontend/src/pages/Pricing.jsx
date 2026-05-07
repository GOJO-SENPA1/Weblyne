import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Faq } from './Home.jsx';

const TIERS = [
  { name: 'Starter', price: 'Rs 15,000', desc: 'Perfect for new businesses getting online for the first time.', items: ['Up to 5 pages', 'Mobile-responsive design', 'Contact form & WhatsApp', 'Basic SEO setup', 'SSL & free domain (1 yr)', 'WhatsApp support (30 days)'], notIncluded: ['Custom CMS', 'E-commerce', 'Multi-language'] },
  { name: 'Business', price: 'Rs 35,000', desc: 'For growing businesses that want serious results.', popular: true, items: ['Up to 12 pages', 'Custom design & illustration', 'Blog & full CMS', 'Advanced SEO + analytics', 'Bilingual (Nepali + English)', 'Newsletter signup', '3 months free maintenance'], notIncluded: ['Custom web app', 'User accounts'] },
  { name: 'Enterprise', price: 'Custom', desc: 'Web apps, integrations, and custom systems.', items: ['Custom web application', 'Database & user accounts', 'API & 3rd-party integrations', 'Payment integration (eSewa/Khalti)', 'Admin dashboard', 'Dedicated 6-month support', 'SLA & uptime guarantee'], notIncluded: [] },
];

const ADDONS = [
  { icon: 'search', name: 'SEO Retainer', price: 'Rs 18,000/mo', d: 'Monthly keyword work, content, reporting.' },
  { icon: 'wrench', name: 'Maintenance', price: 'Rs 4,500/mo', d: 'Updates, backups, edits, monitoring.' },
  { icon: 'rocket', name: 'Hosting', price: 'Rs 1,800/mo', d: 'Vercel + Cloudflare, fully managed.' },
  { icon: 'megaphone', name: 'Social Media', price: 'Rs 12,000', d: 'Setup + 30-day calendar + templates.' },
];

const COMPARISON = [
  ['Pages', '5', '12', 'Unlimited'],
  ['Mobile responsive', true, true, true],
  ['Custom design', false, true, true],
  ['CMS / Blog', false, true, true],
  ['SEO setup', 'Basic', 'Advanced', 'Advanced+'],
  ['Bilingual support', false, true, true],
  ['User accounts & auth', false, false, true],
  ['Custom integrations', false, false, true],
  ['Payment gateway', false, false, true],
  ['Maintenance included', '—', '3 months', '6 months'],
  ['Support response', '24h', '8h', '2h SLA'],
];

export default function Pricing() {
  return (
    <>
      <header className="wb-pagehead">
        <div className="wb-container wb-pagehead__inner">
          <span className="wb-eyebrow">Pricing</span>
          <h1 style={{ marginTop: 14 }}>Honest pricing.<br />No surprises.</h1>
          <p>Three packages that cover most needs. Pick a starting point — we'll quote anything custom in 24 hours.</p>
        </div>
      </header>

      <section className="wb-section" style={{ paddingTop: 56 }}>
        <div className="wb-container">
          <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'stretch', gap: 24 }}>
            {TIERS.map(t => (
              <div key={t.name} style={{
                padding: 36,
                background: t.popular ? 'var(--color-navy)' : 'white',
                color: t.popular ? 'white' : 'inherit',
                border: t.popular ? '2px solid var(--color-blue)' : '1px solid var(--color-line)',
                borderRadius: 20, position: 'relative',
                transform: t.popular ? 'translateY(-12px)' : 'none',
                boxShadow: t.popular ? '0 20px 50px rgba(4,44,83,0.2)' : 'none',
              }}>
                {t.popular && <span style={{ position: 'absolute', top: -14, left: 36, background: 'var(--color-blue)', color: 'white', padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.02em' }}>Most popular</span>}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: t.popular ? 0.7 : 0.6, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{t.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.03em', marginBottom: 8 }}>{t.price}</div>
                <p style={{ fontSize: 14, opacity: t.popular ? 0.8 : 0.7, marginBottom: 28, lineHeight: 1.5 }}>{t.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {t.items.map(it => (
                    <li key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                      <Icon name="check" size={16} color={t.popular ? '#5cd29d' : 'var(--color-teal)'} />
                      {it}
                    </li>
                  ))}
                  {t.notIncluded.map(it => (
                    <li key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, opacity: 0.5, textDecoration: 'line-through' }}>
                      <Icon name="x" size={16} /> {it}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`wb-btn ${t.popular ? 'wb-btn--primary' : 'wb-btn--ghost'}`} style={{ width: '100%' }}>
                  Get started <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wb-section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="wb-container">
          <div className="wb-section__head">
            <div>
              <span className="wb-eyebrow">Add-ons</span>
              <h2 style={{ marginTop: 12 }}>Bolt on extra capability.</h2>
            </div>
            <p className="wb-section__lead">Mix and match — most clients pair a Business package with a Maintenance + SEO add-on.</p>
          </div>
          <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {ADDONS.map(a => (
              <div key={a.name} className="wb-card" style={{ padding: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-blue-light)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon name={a.icon} size={18} />
                </div>
                <h3 style={{ fontSize: 17, marginBottom: 6 }}>{a.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>{a.d}</p>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--color-navy)' }}>{a.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wb-section">
        <div className="wb-container">
          <div className="wb-section__head">
            <div>
              <span className="wb-eyebrow">Compare</span>
              <h2 style={{ marginTop: 12 }}>Full feature comparison.</h2>
            </div>
          </div>
          <div style={{ border: '1px solid var(--color-line)', borderRadius: 16, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-soft)' }}>
                  <th style={{ textAlign: 'left', padding: '20px 24px', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '20px 24px', fontWeight: 700, color: 'var(--color-ink)' }}>Starter</th>
                  <th style={{ textAlign: 'center', padding: '20px 24px', fontWeight: 700, color: 'var(--color-blue)', background: 'var(--color-blue-light)' }}>Business</th>
                  <th style={{ textAlign: 'center', padding: '20px 24px', fontWeight: 700, color: 'var(--color-ink)' }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{row[0]}</td>
                    {row.slice(1).map((cell, j) => (
                      <td key={j} style={{ padding: '16px 24px', textAlign: 'center', background: j === 1 ? 'rgba(230,241,251,0.4)' : 'transparent' }}>
                        {cell === true ? <Icon name="check" size={18} color="var(--color-teal)" /> :
                          cell === false ? <span style={{ color: 'var(--color-text-faint)' }}>—</span> :
                            <span>{cell}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Faq />

      <section style={{ padding: '0 32px 80px' }}>
        <div className="wb-container" style={{ padding: 0 }}>
          <div style={{ background: 'var(--color-blue-light)', borderRadius: 24, padding: '48px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap', border: '1px solid rgba(24,95,165,0.15)' }}>
            <div>
              <h3 style={{ fontSize: 28, marginBottom: 8 }}>Need something custom?</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>Tell us about your project. We'll send a tailored quote in 24 hours.</p>
            </div>
            <Link to="/contact" className="wb-btn wb-btn--primary wb-btn--lg">
              Request a custom quote <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
