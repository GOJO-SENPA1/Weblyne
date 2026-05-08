import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { api } from '../lib/api.js';
import { PortfolioCardSkeleton } from '../components/Skeleton.jsx';

const TABS = ['All', 'website', 'webapp', 'ecommerce', 'seo'];
const TAB_LABEL = { All: 'All', website: 'Websites', webapp: 'Web Apps', ecommerce: 'E-commerce', seo: 'SEO' };

export default function Portfolio() {
  const [tab, setTab] = useState('All');
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    api.portfolio(tab === 'All' ? {} : { category: tab })
      .then(setProjects)
      .catch(() => setProjects([]));
  }, [tab]);

  const isEmpty = projects && projects.length === 0;

  return (
    <>
      <header className="wb-pagehead">
        <div className="wb-container wb-pagehead__inner">
          <span className="wb-eyebrow">Portfolio</span>
          <h1 style={{ marginTop: 14 }}>{isEmpty ? "We're just getting started." : 'Selected work.'}</h1>
          <p>{isEmpty
            ? "Weblyne is a brand-new studio. We don't have shipped projects to show yet — and we'd rather be honest about it than fake a portfolio."
            : "Real projects we've shipped for real clients. Tap any to see the case study."}</p>
        </div>
      </header>

      <section className="wb-section" style={{ paddingTop: 56 }}>
        <div className="wb-container">
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, padding: 6, background: 'var(--color-bg-soft)', borderRadius: 12, width: 'fit-content', marginBottom: 40, opacity: isEmpty ? 0.5 : 1, pointerEvents: isEmpty ? 'none' : 'auto', flexWrap: 'wrap' }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 18px', borderRadius: 8, border: 'none',
                background: tab === t ? 'white' : 'transparent',
                boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                color: tab === t ? 'var(--color-ink)' : 'var(--color-text-muted)',
                fontSize: 14, fontWeight: 600,
              }}>{TAB_LABEL[t]}</button>
            ))}
          </div>

          {!projects && (
            <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[0, 1, 2, 3, 4, 5].map(i => <PortfolioCardSkeleton key={i} />)}
            </div>
          )}

          {isEmpty && <EmptyState />}

          {projects && projects.length > 0 && (
            <div className="wb-grid wb-grid--cols-3 wb-stagger" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {projects.map((p, i) => (
                <Link key={p.id} to={`/portfolio/${p.id}`} className="wb-card wb-card--lift" style={{ padding: 0, overflow: 'hidden', display: 'block', '--i': i }}>
                  <div style={{ aspectRatio: '4 / 3', background: 'var(--color-bg-soft)', overflow: 'hidden', position: 'relative' }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--color-blue-light), white)' }} />}
                    <span className="wb-badge" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.95)', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.08em' }}>{p.category}</span>
                  </div>
                  <div style={{ padding: 22 }}>
                    <h3 style={{ fontSize: 18, marginBottom: 6 }}>{p.title}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>{p.description}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(p.tech_stack || []).map(s => <span key={s} className="wb-chip">{s}</span>)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}

function EmptyState() {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      border: '1.5px dashed var(--color-line-strong)', borderRadius: 24,
      padding: '72px 48px',
      background: 'linear-gradient(180deg, var(--color-blue-tint), white)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(4,44,83,0.08) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 30%, black, transparent 75%)',
        maskImage: 'radial-gradient(ellipse 70% 80% at 50% 30%, black, transparent 75%)',
        opacity: 0.6,
      }} />
      <div className="wb-stack-md" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(29,158,117,0.12)', color: 'var(--color-teal)',
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-teal)', boxShadow: '0 0 0 4px rgba(29,158,117,0.18)' }} />
            Open for our first 5 clients
          </span>
          <h2 style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Be our first client —<br />and our best story.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--color-text)', lineHeight: 1.55, marginBottom: 28, maxWidth: 540 }}>
            Every agency was new once. We're choosing to be honest about it. Work with us in our first season and you get founder-led attention, generous early-bird pricing, and a case study we'll feature for years.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, maxWidth: 480 }}>
            {['Direct line to the founder — no account managers', 'Early-bird pricing on your first project', 'You get featured here, with your story, in your words'].map(it => (
              <div key={it} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, color: 'var(--color-ink)' }}>
                <Icon name="check" size={18} color="var(--color-teal)" />
                <span>{it}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/contact" className="wb-btn wb-btn--primary wb-btn--lg">Start a project <Icon name="arrow-right" size={16} /></Link>
            <Link to="/services" className="wb-btn wb-btn--ghost wb-btn--lg">See what we build</Link>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              aspectRatio: '4 / 3', border: '1px dashed var(--color-line-strong)', borderRadius: 14,
              background: 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-faint)',
              fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.05em',
            }}>
              {i === 0 ? 'project_001' : `project_00${i + 1}?`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
