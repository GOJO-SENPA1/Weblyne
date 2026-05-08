import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { api } from '../lib/api.js';
import { BlogCardSkeleton, BlogFeaturedSkeleton } from '../components/Skeleton.jsx';

const COLOR_BY_CAT = {
  Strategy: 'var(--color-blue)',
  'Case Study': 'var(--color-teal)',
  Tech: 'var(--color-navy)',
  Design: 'var(--color-blue)',
  SEO: 'var(--color-teal)',
};

const CATS = ['All', 'Strategy', 'Tech', 'Design', 'SEO', 'Case Study'];

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return d; }
}

export default function Blog() {
  const [filter, setFilter] = useState('All');
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    api.blog().then(setPosts).catch(() => setPosts([]));
  }, []);

  const filtered = useMemo(() => {
    if (!posts) return null;
    if (filter === 'All') return posts;
    return posts.filter(p => (p.category || p.cat) === filter);
  }, [posts, filter]);

  const featured = filtered && filtered[0];
  const rest = filtered ? filtered.slice(1) : [];

  return (
    <>
      <header className="wb-pagehead">
        <div className="wb-container wb-pagehead__inner">
          <span className="wb-eyebrow">Field notes</span>
          <h1 style={{ marginTop: 14 }}>Stories from the studio.</h1>
          <p>Practical writing on building for the web — local Nepal context, honest case studies, and tools we actually use.</p>
        </div>
      </header>

      <section className="wb-section" style={{ paddingTop: 48 }}>
        <div className="wb-container">
          {!posts && (
            <>
              <BlogFeaturedSkeleton />
              <div className="wb-grid wb-grid--cols-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
                {[0, 1, 2].map(i => <BlogCardSkeleton key={i} />)}
              </div>
            </>
          )}

          {posts && posts.length === 0 && (
            <div style={{ padding: '64px 32px', textAlign: 'center', border: '1.5px dashed var(--color-line-strong)', borderRadius: 24, background: 'var(--color-blue-tint)' }}>
              <h2 style={{ fontSize: 32, marginBottom: 12 }}>Posts are coming soon.</h2>
              <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 480, margin: '0 auto 24px' }}>We're writing our first set of articles right now. Check back next week, or get them in your inbox.</p>
              <Link to="/contact" className="wb-btn wb-btn--primary">Get in touch <Icon name="arrow-right" size={14} /></Link>
            </div>
          )}

          {featured && (
            <Link to={`/blog/${featured.slug}`} className="wb-card wb-card--lift" style={{ padding: 0, overflow: 'hidden', marginBottom: 64, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ aspectRatio: '4 / 3', background: 'linear-gradient(135deg, #185fa5, #042c53)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(124,158,255,0.4), transparent 60%)' }} />
                {featured.image_url && <img src={featured.image_url} alt={featured.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <span className="wb-badge" style={{ position: 'absolute', top: 24, left: 24, background: 'white', color: 'var(--color-blue)' }}>Featured</span>
              </div>
              <div style={{ padding: '48px 48px 48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 14, letterSpacing: '0.05em' }}>
                  <span style={{ color: 'var(--color-blue)', fontWeight: 600 }}>{featured.category}</span>
                  <span>·</span>
                  <span>{formatDate(featured.published_at || featured.created_at)}</span>
                  {featured.read_time && <><span>·</span><span>{featured.read_time} read</span></>}
                </div>
                <h2 style={{ fontSize: 32, marginBottom: 14, lineHeight: 1.15 }}>{featured.title}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>{featured.excerpt}</p>
                <span className="wb-link">Read article <Icon name="arrow-right" size={14} /></span>
              </div>
            </Link>
          )}

          {posts && posts.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{
                  padding: '8px 16px', borderRadius: 999,
                  border: filter === c ? '1px solid var(--color-blue)' : '1px solid var(--color-line)',
                  background: filter === c ? 'var(--color-blue)' : 'white',
                  color: filter === c ? 'white' : 'var(--color-text)',
                  fontSize: 13, fontWeight: 600,
                }}>{c}</button>
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div className="wb-grid wb-grid--cols-3 wb-stagger" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {rest.map((p, i) => {
                const color = COLOR_BY_CAT[p.category] || 'var(--color-blue)';
                return (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="wb-card wb-card--lift" style={{ padding: 0, overflow: 'hidden', display: 'block', '--i': i }}>
                    <div style={{ aspectRatio: '16 / 10', background: color, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15), transparent 60%)' }} />
                      {p.image_url && <img src={p.image_url} alt={p.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                      <span className="wb-badge" style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.95)', color: 'var(--color-navy)' }}>{p.category}</span>
                    </div>
                    <div style={{ padding: 22 }}>
                      <h3 style={{ fontSize: 18, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h3>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 14, lineHeight: 1.5 }}>{p.excerpt}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)' }}>
                        <span>{formatDate(p.published_at || p.created_at)}</span>
                        {p.read_time && <span>{p.read_time} read</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
