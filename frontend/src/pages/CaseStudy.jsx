import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import CtaBanner from '../components/CtaBanner.jsx';
import { api } from '../lib/api.js';

export default function CaseStudy() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.portfolioOne(id).then(setProject).catch(setError);
  }, [id]);

  if (error) return (
    <section className="wb-section">
      <div className="wb-container" style={{ padding: 48, textAlign: 'center' }}>
        <h2>Project not found</h2>
        <Link to="/portfolio" className="wb-link" style={{ marginTop: 16 }}>← Back to portfolio</Link>
      </div>
    </section>
  );
  if (!project) return <div className="wb-container" style={{ padding: 96, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>;

  return (
    <>
      <header style={{ background: 'linear-gradient(180deg, var(--color-blue-tint), white)', borderBottom: '1px solid var(--color-line)' }}>
        <div className="wb-container" style={{ padding: '40px 32px 0' }}>
          <Link to="/portfolio" className="wb-link" style={{ marginBottom: 24, display: 'inline-flex' }}>← Back to portfolio</Link>
          <div style={{ marginTop: 24, marginBottom: 40 }}>
            <span className="wb-badge wb-badge--blue" style={{ marginBottom: 16 }}>{project.category}</span>
            <h1 style={{ maxWidth: 780, marginBottom: 16 }}>{project.title}</h1>
            <p style={{ fontSize: 19, color: 'var(--color-text-muted)', maxWidth: 640 }}>{project.description}</p>
          </div>
          {project.image_url && (
            <div style={{ aspectRatio: '16 / 7', borderRadius: '16px 16px 0 0', overflow: 'hidden', border: '1px solid var(--color-line)', borderBottom: 'none' }}>
              <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </header>

      <section className="wb-section">
        <div className="wb-container">
          <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 80, alignItems: 'flex-start' }}>
            <div style={{ maxWidth: 640 }}>
              {project.challenge && (<>
                <h2 style={{ fontSize: 30, marginBottom: 16 }}>The challenge</h2>
                <p style={{ marginBottom: 32, fontSize: 16, color: 'var(--color-text)', whiteSpace: 'pre-line' }}>{project.challenge}</p>
              </>)}
              {project.approach && (<>
                <h2 style={{ fontSize: 30, marginBottom: 16, marginTop: 40 }}>Our approach</h2>
                <p style={{ marginBottom: 32, fontSize: 16, whiteSpace: 'pre-line' }}>{project.approach}</p>
              </>)}
              {project.results && (<>
                <h2 style={{ fontSize: 30, marginBottom: 16, marginTop: 40 }}>Results</h2>
                <p style={{ marginBottom: 32, fontSize: 16, whiteSpace: 'pre-line' }}>{project.results}</p>
              </>)}
            </div>

            <aside style={{ position: 'sticky', top: 96, background: 'white', border: '1px solid var(--color-line)', borderRadius: 16, padding: 28 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Project details</div>
              {[
                ['Client', project.client_name || '—'],
                ['Category', project.category],
                ['Tech', (project.tech_stack || []).join(' · ') || '—'],
                ['Live link', project.live_url ? <a href={project.live_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-blue)' }}>Visit ↗</a> : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '14px 0', borderBottom: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{k}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-ink)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
              <Link to="/contact" className="wb-btn wb-btn--primary" style={{ width: '100%', marginTop: 20 }}>
                Start a similar project <Icon name="arrow-right" size={14} />
              </Link>
            </aside>
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
