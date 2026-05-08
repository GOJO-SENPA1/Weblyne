import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { MockClinic, MockSchool, MockRestaurant } from '../components/Mockups.jsx';
import { useSeo } from '../lib/seo.js';

function Hero() {
  const words = ['Businesses', 'Clinics', 'Schools', 'Restaurants', 'Startups'];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{
      position: 'relative', padding: '72px 0 80px',
      background: 'linear-gradient(180deg, var(--color-blue-tint) 0%, white 70%)',
      overflow: 'hidden',
    }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(4,44,83,0.08) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 100% at 50% 0%, black, transparent 70%)',
        maskImage: 'radial-gradient(ellipse 60% 100% at 50% 0%, black, transparent 70%)',
      }} />
      <div className="wb-container wb-stack-md" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.15fr 1fr', alignItems: 'center', gap: 60 }}>
        <div className="wb-reveal">
          <span className="wb-eyebrow" style={{ marginBottom: 20 }}>Web Studio · Biratnagar 🇳🇵</span>
          <h1 style={{ marginTop: 14, marginBottom: 18 }}>
            We build the web<br />for Biratnagar's<br />
            <span style={{ display: 'inline-block', position: 'relative', background: 'var(--color-blue-light)', borderRadius: 12, padding: '0 14px', overflow: 'hidden', minWidth: 360, lineHeight: 1.05 }}>
              <span style={{ visibility: 'hidden' }}>Restaurants</span>
              <span key={idx} style={{ position: 'absolute', left: 14, top: 0, color: 'var(--color-blue)', animation: 'wb-word-in 2.4s ease' }}>{words[idx]}</span>
            </span>
          </h1>
          <p style={{ fontSize: 19, color: 'var(--color-text-muted)', maxWidth: 540, lineHeight: 1.55, marginBottom: 32 }}>
            Modern websites, web apps and SEO that bring you real clients. Crafted locally, built to global standards.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/contact" className="wb-btn wb-btn--primary wb-btn--lg">Get a Free Quote <Icon name="arrow-right" size={16} /></Link>
            <Link to="/portfolio" className="wb-btn wb-btn--ghost wb-btn--lg">View Our Work</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 36, fontSize: 13, color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(29,158,117,0.1)', color: 'var(--color-teal)', fontWeight: 600, fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-teal)', boxShadow: '0 0 0 4px rgba(29,158,117,0.18)' }} />
              Open for projects
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase' }}>New studio · Founded 2025 · Biratnagar</span>
          </div>
        </div>
        <div className="wb-hide-md" style={{ position: 'relative', height: 520 }}>
          <HeroNetwork />
        </div>
      </div>
    </section>
  );
}

function HeroNetwork() {
  const nodes = [
    { x: 40, y: 60, r: 10, c: 'var(--color-blue)' },
    { x: 90, y: 110, r: 6, c: 'var(--color-blue-600)' },
    { x: 140, y: 250, r: 14, c: 'var(--color-navy)' },
    { x: 220, y: 90, r: 12, c: 'var(--color-blue)' },
    { x: 260, y: 140, r: 7, c: 'var(--color-teal)' },
    { x: 320, y: 280, r: 11, c: 'var(--color-navy)' },
    { x: 400, y: 70, r: 9, c: 'var(--color-blue)' },
    { x: 440, y: 30, r: 5, c: 'var(--color-blue-600)' },
    { x: 80, y: 410, r: 8, c: 'var(--color-blue-600)' },
    { x: 230, y: 460, r: 10, c: 'var(--color-blue)' },
    { x: 380, y: 410, r: 8, c: 'var(--color-blue-600)' },
    { x: 220, y: 380, r: 16, c: 'var(--color-navy)', label: 'W' },
  ];
  const edges = [[0, 1], [1, 2], [2, 4], [4, 3], [3, 5], [5, 6], [6, 7], [4, 11], [2, 11], [5, 11], [11, 8], [11, 9], [11, 10], [8, 9], [9, 10], [0, 8], [10, 6]];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(24,95,165,0.08), transparent 60%)' }} />
      <svg viewBox="0 0 480 520" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#185fa5" stopOpacity="0.7" />
            <stop offset="1" stopColor="#185fa5" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="url(#line-grad)" strokeWidth="1.2" strokeDasharray="3 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-14" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" />
          </line>
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r + 4} fill={n.c} opacity="0.12" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="white" stroke={n.c} strokeWidth="2" />
            {n.label && <text x={n.x} y={n.y + 4} textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="14" fill={n.c}>{n.label}</text>}
            <circle cx={n.x} cy={n.y} r={n.r * 1.4} fill={n.c} opacity="0">
              <animate attributeName="r" from={n.r} to={n.r * 2.2} dur={`${2 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.3" to="0" dur={`${2 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
      <div style={{ position: 'absolute', top: 24, right: 24, background: 'white', borderRadius: 12, padding: '10px 14px', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 600 }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-teal)', boxShadow: '0 0 0 4px rgba(29,158,117,0.2)' }} />
        <span>Now booking</span>
      </div>
      <div style={{ position: 'absolute', bottom: 60, left: 0, background: 'white', borderRadius: 12, padding: '10px 14px', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
        <Icon name="lightning" size={16} color="var(--color-blue)" />
        <span><strong>30 days</strong> avg delivery</span>
      </div>
    </div>
  );
}

function Marquee() {
  const items = ['React', 'Next.js', 'Node.js', 'WordPress', 'Figma', 'Vercel', 'Google Cloud', 'TypeScript', 'Tailwind', 'Stripe', 'Supabase', 'Shopify'];
  return (
    <div style={{ background: 'var(--color-blue-light)', padding: '24px 0', overflow: 'hidden', borderTop: '1px solid rgba(24,95,165,0.1)', borderBottom: '1px solid rgba(24,95,165,0.1)' }}>
      <div style={{ display: 'flex', gap: 64, animation: 'wb-marquee 40s linear infinite', width: 'max-content' }}>
        {[...items, ...items, ...items].map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--color-blue)', whiteSpace: 'nowrap', opacity: 0.7 }}>
            <Icon name="dot" size={6} color="currentColor" />
            {it}
          </div>
        ))}
      </div>
    </div>
  );
}

const SERVICES = [
  { icon: 'globe', name: 'Website Development', tag: 'Most popular', desc: 'Fast, SEO-ready marketing sites that work on every device.' },
  { icon: 'code', name: 'Web Apps', desc: 'Custom dashboards, booking systems, and internal tools built with React.' },
  { icon: 'search', name: 'SEO & Local Search', desc: 'Show up on Google when locals search for your service. Real traffic, real leads.' },
  { icon: 'rocket', name: 'Deployment & DevOps', desc: 'Fast hosting on Vercel, AWS or DigitalOcean with CI/CD set up properly.' },
  { icon: 'megaphone', name: 'Social Media Setup', desc: 'Profile, branding, content templates and a 30-day launch calendar.' },
  { icon: 'wrench', name: 'Maintenance & Support', desc: 'Monthly updates, security patches and uptime monitoring. We pick up the phone.' },
];

function Services() {
  const navigate = useNavigate();
  return (
    <section className="wb-section">
      <div className="wb-container">
        <div className="wb-section__head">
          <div>
            <span className="wb-eyebrow">What we build</span>
            <h2 style={{ marginTop: 12 }}>Everything your business needs<br />to be online — done right.</h2>
          </div>
          <p className="wb-section__lead">From your first landing page to a full custom web app, we cover the full stack. One team. One contract.</p>
        </div>
        <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {SERVICES.map(s => (
            <article key={s.name} className="wb-card wb-card--lift" style={{ padding: 28, position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/services')}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-blue-light)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon name={s.icon} size={22} />
              </div>
              {s.tag && <span className="wb-badge wb-badge--blue" style={{ position: 'absolute', top: 28, right: 28 }}>{s.tag}</span>}
              <h3 style={{ marginBottom: 10, fontSize: 20 }}>{s.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 20 }}>{s.desc}</p>
              <span className="wb-link">Learn more <Icon name="arrow-right" size={14} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedWork() {
  const navigate = useNavigate();
  const previews = [
    { Mock: MockClinic, name: 'Healthcare', desc: 'Clinics, dental, diagnostics — patient-friendly booking flow.', stack: ['Next.js', 'CMS'] },
    { Mock: MockSchool, name: 'Education', desc: 'Schools, colleges, tuition centres — admissions & info.', stack: ['React', 'Headless'] },
    { Mock: MockRestaurant, name: 'Hospitality', desc: 'Restaurants, cafés, hotels — menu, reservations, story.', stack: ['Astro', 'Tina'] },
  ];
  return (
    <section className="wb-section" style={{ background: 'var(--color-bg-soft)' }}>
      <div className="wb-container">
        <div className="wb-section__head">
          <div>
            <span className="wb-eyebrow">What we build</span>
            <h2 style={{ marginTop: 12 }}>Sample directions, not a portfolio.</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 620, marginTop: 12, fontSize: 16, lineHeight: 1.5 }}>
              We're a new studio — these are visual directions for the kinds of projects we build. Real case studies will live here as we ship them. Want to be project #001?
            </p>
          </div>
          <Link to="/contact" className="wb-link">Start your project <Icon name="arrow-right" size={14} /></Link>
        </div>
        <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {previews.map(({ Mock, name, desc, stack }) => (
            <article key={name} className="wb-card wb-card--lift" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => navigate('/contact')}>
              <div style={{ aspectRatio: '4 / 3', background: 'white', borderBottom: '1px solid var(--color-line)', position: 'relative', overflow: 'hidden' }}>
                <Mock />
                <span className="wb-badge" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.95)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.08em' }}>Sample</span>
              </div>
              <div style={{ padding: 22 }}>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>{desc}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {stack.map(s => <span key={s} className="wb-chip">{s}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { n: '< 24h', l: 'Reply time', sub: 'Real human. WhatsApp, email or in person.' },
    { n: '1:1', l: 'Founder access', sub: 'You work directly with the person building it.' },
    { n: 'Local', l: 'Biratnagar based', sub: 'We meet over chiya, not Zoom.' },
  ];
  return (
    <section className="wb-section">
      <div className="wb-container">
        <div className="wb-section__head">
          <div>
            <span className="wb-eyebrow">What you get</span>
            <h2 style={{ marginTop: 12 }}>The promises we can actually keep.</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 580, marginTop: 12, fontSize: 16, lineHeight: 1.5 }}>
              We're new. So instead of inflated numbers, here's what we commit to from day one.
            </p>
          </div>
        </div>
        <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{ padding: 36, background: 'white', border: '1px solid var(--color-line)', borderRadius: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 999, background: 'var(--color-blue-light)', opacity: 0.5 }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-faint)', marginBottom: 12, position: 'relative' }}>0{i + 1}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1, letterSpacing: '-0.04em', position: 'relative' }}>{s.n}</div>
              <div style={{ marginTop: 12, fontSize: 16, fontWeight: 600, color: 'var(--color-ink)', position: 'relative' }}>{s.l}</div>
              <div style={{ marginTop: 4, fontSize: 14, color: 'var(--color-text-muted)', position: 'relative' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PRINCIPLES = [
  { t: 'We show up in person.', d: 'Every project starts with us walking into your shop, clinic or office. No discovery decks. We listen, take notes, then go build.', icon: 'map' },
  { t: 'You own everything.', d: 'Code, hosting, domains, content — all yours, in your accounts, from day one. No lock-in. No hostage situations.', icon: 'shield' },
  { t: 'Honest about being new.', d: "We won't fake testimonials or inflate numbers. We'd rather be your first call than your fifth referral.", icon: 'heart' },
];

function Principles() {
  return (
    <section className="wb-section" style={{ background: 'var(--color-bg-soft)' }}>
      <div className="wb-container">
        <div className="wb-section__head">
          <div>
            <span className="wb-eyebrow">How we work</span>
            <h2 style={{ marginTop: 12 }}>Three commitments,<br />signed in writing.</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 580, marginTop: 12, fontSize: 16, lineHeight: 1.5 }}>
              We don't have client testimonials yet — we'd rather show you what we stand for. Once we ship for you, your story replaces this section.
            </p>
          </div>
        </div>
        <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {PRINCIPLES.map((t, i) => (
            <div key={t.t} className="wb-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-faint)', padding: '20px 24px', letterSpacing: '0.1em' }}>0{i + 1}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-blue-light)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={t.icon} size={20} />
              </div>
              <h3 style={{ fontSize: 22, lineHeight: 1.2, marginTop: 4 }}>{t.t}</h3>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.55, flex: 1, margin: 0 }}>{t.d}</p>
              <div style={{ paddingTop: 16, borderTop: '1px solid var(--color-line)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Written into every Weblyne contract
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const tiers = [
    { name: 'Starter', price: 'Rs 15,000', desc: 'A clean 5-page site to get you online.', items: ['5-page responsive site', 'Contact form & WhatsApp', 'Basic SEO setup'] },
    { name: 'Business', price: 'Rs 35,000', desc: 'For growing businesses that want results.', popular: true, items: ['Up to 12 pages', 'Blog & CMS', 'Advanced SEO & analytics', '3 months free maintenance'] },
    { name: 'Enterprise', price: 'Custom', desc: 'Web apps, integrations, the works.', items: ['Custom web application', 'Database & user accounts', 'API & integrations', 'Dedicated support'] },
  ];
  return (
    <section className="wb-section" style={{ background: 'white' }}>
      <div className="wb-container">
        <div className="wb-section__head">
          <div>
            <span className="wb-eyebrow">Pricing</span>
            <h2 style={{ marginTop: 12 }}>Honest pricing. No surprises.</h2>
          </div>
          <Link to="/pricing" className="wb-link">Full pricing details <Icon name="arrow-right" size={14} /></Link>
        </div>
        <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'stretch' }}>
          {tiers.map(t => (
            <div key={t.name} style={{
              padding: 32,
              background: t.popular ? 'var(--color-navy)' : 'white',
              color: t.popular ? 'white' : 'inherit',
              border: t.popular ? '1px solid var(--color-navy)' : '1px solid var(--color-line)',
              borderRadius: 16, position: 'relative',
              transform: t.popular ? 'translateY(-12px)' : 'none',
              boxShadow: t.popular ? '0 20px 40px rgba(4,44,83,0.18)' : 'none',
            }}>
              {t.popular && <span className="wb-badge" style={{ position: 'absolute', top: -12, left: 32, background: 'var(--color-blue)', color: 'white' }}>Most popular</span>}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, opacity: t.popular ? 0.7 : 0.6, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{t.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, letterSpacing: '-0.03em', marginBottom: 6 }}>{t.price}</div>
              <p style={{ fontSize: 14, opacity: t.popular ? 0.8 : 0.7, marginBottom: 24 }}>{t.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.items.map(it => (
                  <li key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                    <Icon name="check" size={16} color={t.popular ? '#5cd29d' : 'var(--color-teal)'} />
                    {it}
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
  );
}

const FAQS = [
  { q: 'How long does a typical project take?', a: 'Most marketing sites launch in 3–4 weeks. Web apps usually take 6–10 weeks depending on scope. We share a clear timeline before we start.' },
  { q: 'Do you work with businesses outside Biratnagar?', a: 'Yes — we serve clients across Nepal and a few abroad. But we love working face-to-face with local Biratnagar businesses when we can.' },
  { q: 'What does "maintenance" actually include?', a: 'Security updates, plugin updates, content edits (up to 2 hrs/month), uptime monitoring and a monthly performance report. No surprise charges.' },
  { q: 'Will I own the website and code?', a: 'Always. You own everything: domain, hosting account, source code, content. We hand over admin access on day one of launch.' },
  { q: 'Can you redesign my existing website?', a: 'Yes — about 30% of our work is redesigns. We migrate your content, improve speed and SEO, and modernise the look without losing your existing search ranking.' },
  { q: 'Do you do SEO without building a new site?', a: 'Yes. SEO-only engagements start at Rs 18,000/month and include keyword research, on-page fixes, content plan and monthly reporting.' },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="wb-section">
      <div className="wb-container">
        <div className="wb-section__head" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 360px' }}>
            <span className="wb-eyebrow">FAQ</span>
            <h2 style={{ marginTop: 12 }}>Questions, answered.</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 14, fontSize: 16 }}>Can't find what you're looking for? <Link to="/contact" className="wb-link" style={{ display: 'inline' }}>Just ask →</Link></p>
          </div>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 720 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--color-line)' }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{
                  width: '100%', padding: '20px 0', background: 'none', border: 'none', textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                  fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)',
                }}>
                  {f.q}
                  <span style={{
                    flex: '0 0 auto', width: 30, height: 30, borderRadius: 999,
                    background: open === i ? 'var(--color-blue)' : 'var(--color-bg-soft)',
                    color: open === i ? 'white' : 'var(--color-ink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s, color 0.2s, transform 0.2s',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                  }}>
                    <Icon name="plus" size={14} />
                  </span>
                </button>
                <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                  <p style={{ padding: '0 0 20px', color: 'var(--color-text-muted)', fontSize: 15, lineHeight: 1.6, maxWidth: 600 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useSeo({
    title: 'Web Design & Development Studio in Biratnagar',
    description: 'Modern websites, web apps and SEO for Nepali businesses. Crafted locally in Biratnagar, built to global standards. Open for our first clients.',
    path: '/',
  });
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <FeaturedWork />
      <Stats />
      <Principles />
      <PricingTeaser />
      <Faq />
      <CtaBanner />
    </>
  );
}
