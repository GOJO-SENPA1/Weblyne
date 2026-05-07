import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { api } from '../lib/api.js';

export default function CtaBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return navigate('/contact');
    setStatus('sending');
    try {
      await api.newsletter(email);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="wb-cta-section" style={{ padding: '24px 32px 80px' }}>
      <div className="wb-container" style={{ padding: 0 }}>
        <div className="wb-cta-banner" style={{
          background: 'linear-gradient(135deg, var(--color-blue) 0%, var(--color-navy) 100%)',
          borderRadius: 24, padding: '64px 56px', color: 'white',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg viewBox="0 0 200 200" style={{ position: 'absolute', top: -20, right: -20, width: 320, opacity: 0.18 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={100 + Math.cos(i * 0.785) * 70} cy={100 + Math.sin(i * 0.785) * 70} r="6" fill="white" />
            ))}
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1" fill="none" strokeDasharray="2 4" />
            <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="100" cy="100" r="14" fill="white" />
          </svg>
          <div className="wb-cta-grid wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center', position: 'relative' }}>
            <div>
              <span className="wb-badge wb-badge--ghost" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>Ready to launch?</span>
              <h2 className="wb-cta-title" style={{ color: 'white', fontSize: 44, marginTop: 16, marginBottom: 12 }}>Ready to go online?</h2>
              <p style={{ color: '#cfdaeb', fontSize: 16, maxWidth: 460 }}>Tell us a little about your project. We'll get back within 24 hours with a clear plan and a price.</p>
            </div>
            <form onSubmit={submit} className="wb-cta-form" style={{ display: 'flex', gap: 8, padding: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)' }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbusiness.com" style={{
                flex: 1, minWidth: 0, height: 50, padding: '0 16px',
                background: 'transparent', border: 'none', color: 'white', fontSize: 15, outline: 'none',
              }} />
              <button className="wb-btn wb-cta-form__btn" style={{ background: 'white', color: 'var(--color-navy)', height: 50, whiteSpace: 'nowrap' }} disabled={status === 'sending'}>
                {status === 'done' ? 'Subscribed ✓' : status === 'sending' ? 'Sending…' : <>Get my quote <Icon name="arrow-right" size={14} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
