import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import Icon from '../components/Icon.jsx';
import { api, auth } from '../lib/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await api.adminLogin(form.email, form.password);
      const token = res?.token;
      if (!token) throw new Error('No token returned');
      auth.set(token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setStatus('idle');
      setError(err?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-h))', background: 'linear-gradient(180deg, #0a1f3a, #042c53)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <svg viewBox="0 0 600 600" style={{ position: 'absolute', top: -100, right: -100, width: 600, opacity: 0.15 }}>
        <circle cx="300" cy="300" r="100" stroke="white" strokeWidth="1" fill="none" />
        <circle cx="300" cy="300" r="200" stroke="white" strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="1" fill="none" />
      </svg>

      <div style={{ width: 440, maxWidth: '100%', background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 30px 80px rgba(0,0,0,0.4)', position: 'relative' }}>
        <div style={{ marginBottom: 32 }}>
          <Logo size={20} />
        </div>
        <span className="wb-eyebrow" style={{ marginBottom: 12 }}>Admin Console</span>
        <h2 style={{ fontSize: 28, marginTop: 8, marginBottom: 10 }}>Sign in</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 28 }}>Welcome back. Sign in to manage Weblyne.</p>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 16 }}>
            <label className="wb-label">Email address</label>
            <input className="wb-input" type="email" required value={form.email} onChange={update('email')} placeholder="you@weblyne.np" autoComplete="username" />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label className="wb-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
            </label>
            <input className="wb-input" type="password" required value={form.password} onChange={update('password')} autoComplete="current-password" />
          </div>
          {error && (
            <div style={{ margin: '14px 0', padding: 12, borderRadius: 10, background: '#fde8e8', color: '#9b2226', fontSize: 13 }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={status === 'sending'} className="wb-btn wb-btn--navy wb-btn--lg" style={{ width: '100%', marginTop: 16 }}>
            {status === 'sending' ? 'Signing in…' : <>Sign in <Icon name="arrow-right" size={14} /></>}
          </button>
        </form>
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--color-line)', textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)' }}>
          Need access? <Link to="/contact" className="wb-link" style={{ display: 'inline' }}>Contact your admin</Link>
        </div>
      </div>
    </div>
  );
}
