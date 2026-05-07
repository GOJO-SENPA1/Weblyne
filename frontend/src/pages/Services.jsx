import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import CtaBanner from '../components/CtaBanner.jsx';

const SERVICES = [
  { icon: 'globe', name: 'Website Development', from: 'Rs 15,000', desc: 'Fast, responsive marketing sites that convert visitors into customers. Built on modern stacks (Next.js, Astro, or WordPress) with content you can update yourself.', includes: ['Up to 12 pages', 'Mobile-first responsive design', 'CMS so you can edit', 'On-page SEO setup', 'Contact + WhatsApp integration', 'SSL & domain configuration'] },
  { icon: 'code', name: 'Web Applications', from: 'Rs 80,000', desc: 'Custom dashboards, booking platforms, and internal tools. Real software, not just a website — with user accounts, databases, and APIs.', includes: ['React + Node.js stack', 'User authentication', 'Database (Postgres / Supabase)', 'Admin panel', 'API integrations', 'Cloud deployment'] },
  { icon: 'search', name: 'SEO & Local Search', from: 'Rs 18,000/mo', desc: 'Get found by people in Biratnagar searching for what you do. Real keyword research, technical fixes, content strategy.', includes: ['Keyword research (Nepali + English)', 'Google Business Profile optimisation', 'Technical SEO audit & fixes', 'Monthly content plan', 'Backlink outreach', 'Monthly performance reports'] },
  { icon: 'rocket', name: 'Deployment & DevOps', from: 'Rs 8,000', desc: 'Move from a slow shared host to a modern stack. We set up Vercel, Cloudflare, and CI/CD so deploys are one-click.', includes: ['Vercel / AWS / DigitalOcean setup', 'GitHub Actions CI/CD', 'CDN + caching layer', 'Monitoring & alerts', 'SSL & DNS migration', 'Backup automation'] },
  { icon: 'megaphone', name: 'Social Media Setup', from: 'Rs 12,000', desc: 'Profile, branding, and a 30-day content calendar to start strong. Templates so your team can keep posting after we leave.', includes: ['Instagram + Facebook setup', 'Brand kit (colours, fonts, logo)', 'Bio & profile copy', '30 ready-to-post templates', '30-day content calendar', '1-hour training session'] },
  { icon: 'wrench', name: 'Maintenance & Support', from: 'Rs 4,500/mo', desc: 'Monthly care so your site stays fast, safe, and current. We pick up the phone when something breaks.', includes: ['Security & plugin updates', '2 hours of edits per month', 'Uptime monitoring', 'Weekly backups', 'Monthly performance report', 'WhatsApp support'] },
];

export default function Services() {
  return (
    <>
      <header className="wb-pagehead">
        <div className="wb-container wb-pagehead__inner">
          <span className="wb-eyebrow">Our services</span>
          <h1 style={{ marginTop: 14 }}>What we build.</h1>
          <p>From a 5-page site to a custom web app, we cover everything a Biratnagar business needs to be online. One team. One contract. Honest pricing.</p>
        </div>
      </header>

      {SERVICES.map((s, i) => (
        <section key={s.name} className="wb-section" style={{ background: i % 2 === 0 ? 'white' : 'var(--color-bg-soft)', padding: '80px 0' }}>
          <div className="wb-container">
            <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--color-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={s.icon} size={26} />
                  </div>
                  <span className="wb-eyebrow" style={{ marginBottom: 0 }}>0{i + 1} · Service</span>
                </div>
                <h2 style={{ marginBottom: 16 }}>{s.name}</h2>
                <p style={{ fontSize: 17, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>{s.desc}</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link to="/contact" className="wb-btn wb-btn--primary">Request this service <Icon name="arrow-right" size={14} /></Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-faint)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Starting from</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--color-navy)' }}>{s.from}</span>
                  </div>
                </div>
              </div>
              <div style={{ background: 'white', border: '1px solid var(--color-line)', borderRadius: 16, padding: 32 }}>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>What's included</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {s.includes.map(it => (
                    <li key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: 'var(--color-ink-2)' }}>
                      <div style={{ flex: '0 0 auto', width: 22, height: 22, borderRadius: 999, background: 'var(--color-teal-soft)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                        <Icon name="check" size={12} stroke={2.5} />
                      </div>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Process */}
      <section className="wb-section" style={{ background: 'var(--color-navy)', color: 'white', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="wb-container" style={{ position: 'relative' }}>
          <div className="wb-section__head">
            <div>
              <span className="wb-eyebrow" style={{ color: '#7c9eff' }}>How we work</span>
              <h2 style={{ color: 'white', marginTop: 12 }}>A simple, transparent process.</h2>
            </div>
            <p className="wb-section__lead" style={{ color: '#9bafcb' }}>From first call to launch, four clear stages. No mystery, no surprises.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 32, left: '8%', right: '8%', height: 2,
              background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0 8px, transparent 8px 16px)',
              animation: 'wb-dash 1s linear infinite',
            }} />
            <div className="wb-grid--cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, position: 'relative' }}>
              {[
                { n: '01', t: 'Consult', d: 'A 45-min call. We understand your business, goals, and budget.' },
                { n: '02', t: 'Design', d: 'Wireframes then a real Figma mockup you can click through.' },
                { n: '03', t: 'Build', d: 'We code, you watch progress on a staging site. Weekly demos.' },
                { n: '04', t: 'Launch', d: 'We deploy, train your team, and stay on call for 30 days.' },
              ].map(s => (
                <div key={s.n} style={{ textAlign: 'center', position: 'relative' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 999, margin: '0 auto 24px',
                    background: 'var(--color-blue)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
                    border: '4px solid var(--color-navy)',
                    boxShadow: '0 0 0 2px rgba(255,255,255,0.15)',
                  }}>{s.n}</div>
                  <h3 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>{s.t}</h3>
                  <p style={{ color: '#9bafcb', fontSize: 14, maxWidth: 220, margin: '0 auto' }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="wb-section">
        <div className="wb-container">
          <div className="wb-section__head">
            <div>
              <span className="wb-eyebrow">Tech we love</span>
              <h2 style={{ marginTop: 12 }}>Modern stack, proven tools.</h2>
            </div>
            <p className="wb-section__lead">We use battle-tested technology so your site stays fast and easy to maintain for years.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
            {['React', 'Next.js', 'Node.js', 'TypeScript', 'WordPress', 'Astro', 'Tailwind', 'Figma', 'Vercel', 'Supabase', 'Stripe', 'GitHub'].map(t => (
              <div key={t} style={{
                aspectRatio: '1', border: '1px solid var(--color-line)', borderRadius: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'white',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{t[0]}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
