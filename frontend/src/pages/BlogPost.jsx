import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { api } from '../lib/api.js';
import { BlogPostSkeleton } from '../components/Skeleton.jsx';

function formatDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return d; }
}

// Very small markdown-ish renderer: paragraphs, # headings, ``` fenced code, - lists.
function renderBody(body) {
  if (!body) return null;
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('```')) {
      const code = trimmed.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
      return <pre key={i} style={{ background: '#0b1020', color: '#cfdaeb', padding: 20, borderRadius: 12, fontSize: 14, overflow: 'auto', marginBottom: 24, fontFamily: 'var(--font-mono)' }}>{code}</pre>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} style={{ fontSize: 28, marginTop: 40, marginBottom: 16 }}>{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('# ')) {
      return <h2 key={i} style={{ fontSize: 32, marginTop: 40, marginBottom: 16 }}>{trimmed.slice(2)}</h2>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').map(l => l.replace(/^[-*]\s+/, ''));
      return (
        <ul key={i} style={{ paddingLeft: 24, marginBottom: 18 }}>
          {items.map((it, j) => <li key={j} style={{ marginBottom: 8 }}>{it}</li>)}
        </ul>
      );
    }
    return <p key={i} style={{ marginBottom: 18 }}>{trimmed}</p>;
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    api.blogOne(slug).then(setPost).catch(setError);
  }, [slug]);

  useEffect(() => {
    const handler = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop || document.body.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  if (error) return (
    <section className="wb-section">
      <div className="wb-container" style={{ padding: 48, textAlign: 'center' }}>
        <h2>Article not found</h2>
        <Link to="/blog" className="wb-link" style={{ marginTop: 16 }}>← Back to blog</Link>
      </div>
    </section>
  );
  if (!post) return <BlogPostSkeleton />;

  return (
    <>
      <div style={{ position: 'sticky', top: 'var(--nav-h)', zIndex: 40, height: 3, background: 'var(--color-line)' }}>
        <div style={{ height: '100%', background: 'var(--color-blue)', width: `${progress}%`, transition: 'width 0.1s' }} />
      </div>

      <header style={{ padding: '60px 0 40px', background: 'linear-gradient(180deg, var(--color-blue-tint), white)' }}>
        <div className="wb-container">
          <Link to="/blog" className="wb-link" style={{ marginBottom: 24, display: 'inline-flex' }}>← All articles</Link>
          <div style={{ marginTop: 24, maxWidth: 800 }}>
            <span className="wb-badge wb-badge--blue" style={{ marginBottom: 16 }}>{post.category}</span>
            <h1 style={{ fontSize: 'clamp(36px, 4.4vw, 56px)', marginBottom: 24 }}>{post.title}</h1>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 14, color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--color-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  {(post.author || 'AB').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>{post.author || 'Aditya Bhujel'}</span>
              </div>
              <span>·</span>
              <span>{formatDate(post.published_at || post.created_at)}</span>
              {post.read_time && <><span>·</span><span>{post.read_time} read</span></>}
            </div>
          </div>
        </div>
      </header>

      {post.image_url && (
        <div className="wb-container" style={{ marginTop: 32 }}>
          <div style={{ aspectRatio: '16 / 7', borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg, #185fa5, #042c53)' }}>
            <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      )}

      <section className="wb-section" style={{ paddingTop: 56 }}>
        <div className="wb-container">
          <article style={{ maxWidth: 720, margin: '0 auto', fontSize: 17, lineHeight: 1.7, color: 'var(--color-ink-2)' }}>
            {post.excerpt && (
              <p style={{ fontSize: 20, color: 'var(--color-text-muted)', marginBottom: 28, fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                {post.excerpt}
              </p>
            )}
            {renderBody(post.body || post.content)}
            <div style={{ marginTop: 48, padding: 24, borderRadius: 14, background: 'var(--color-blue-tint)', border: '1px solid rgba(24,95,165,0.15)' }}>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>Want help with something like this?</h3>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginBottom: 16 }}>Tell us about your project. We'll send a clear plan and a price within 24 hours.</p>
              <Link to="/contact" className="wb-btn wb-btn--primary">Start a project <Icon name="arrow-right" size={14} /></Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
