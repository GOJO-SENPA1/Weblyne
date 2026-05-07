import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { api } from '../lib/api.js';

const SERVICES = ['Website Development', 'Web App', 'SEO & Local Search', 'Maintenance & Support', 'Social Media Setup', 'Other / Not sure'];
const BUDGETS = ['Rs 10K – 30K', 'Rs 30K – 80K', 'Rs 80K+', 'Not sure yet'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', budget: '', desc: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('');

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await api.contact(form);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.message || 'Something went wrong. Please try again or use WhatsApp.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setForm({ name: '', email: '', phone: '', service: '', budget: '', desc: '', website: '' });
  };

  return (
    <>
      <header className="wb-pagehead" style={{ paddingBottom: 48 }}>
        <div className="wb-container wb-pagehead__inner">
          <span className="wb-eyebrow">Get in touch</span>
          <h1 style={{ marginTop: 14 }}>Let's build something.</h1>
          <p>Tell us about your project below. We respond to every inquiry within 24 hours — usually faster.</p>
        </div>
      </header>

      <section className="wb-section" style={{ paddingTop: 56 }}>
        <div className="wb-container">
          <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56, alignItems: 'flex-start' }}>
            <div className="wb-card" style={{ padding: 40 }}>
              {status === 'done' ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--color-teal-soft)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <Icon name="check" size={32} stroke={3} />
                  </div>
                  <h2 style={{ marginBottom: 12 }}>Got it, {form.name || 'friend'}.</h2>
                  <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto 24px', fontSize: 16 }}>
                    Thanks for reaching out. We'll review and reply to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <button onClick={reset} className="wb-btn wb-btn--ghost">Send another</button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  {/* Honeypot — hidden from real users, bots fill it. */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                    <label>Website (leave empty)
                      <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                    </label>
                  </div>
                  <h2 style={{ fontSize: 24, marginBottom: 4 }}>Project enquiry</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 28 }}>All fields are required unless marked optional.</p>
                  <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 18 }}>
                    <div>
                      <label className="wb-label">Full name</label>
                      <input className="wb-input" required value={form.name} onChange={update('name')} placeholder="Anjana Karki" />
                    </div>
                    <div>
                      <label className="wb-label">Email</label>
                      <input className="wb-input" type="email" required value={form.email} onChange={update('email')} placeholder="you@business.com" />
                    </div>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label className="wb-label">Phone <span style={{ color: 'var(--color-text-faint)', fontWeight: 400 }}>(WhatsApp preferred)</span></label>
                    <input className="wb-input" required value={form.phone} onChange={update('phone')} placeholder="+977 98··· ····" />
                  </div>
                  <div className="wb-stack-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 18 }}>
                    <div>
                      <label className="wb-label">Service</label>
                      <select className="wb-select" required value={form.service} onChange={update('service')}>
                        <option value="">Select a service…</option>
                        {SERVICES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="wb-label">Budget range</label>
                      <select className="wb-select" required value={form.budget} onChange={update('budget')}>
                        <option value="">Select budget…</option>
                        {BUDGETS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label className="wb-label">Tell us about your project</label>
                    <textarea className="wb-textarea" required rows={5} value={form.desc} onChange={update('desc')} placeholder="What does your business do? What do you need? Any deadlines?" />
                  </div>
                  {status === 'error' && (
                    <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: '#fde8e8', color: '#9b2226', fontSize: 13 }}>
                      {errorMsg}
                    </div>
                  )}
                  <button type="submit" disabled={status === 'sending'} className="wb-btn wb-btn--primary wb-btn--lg" style={{ width: '100%' }}>
                    {status === 'sending' ? 'Sending…' : <>Send enquiry <Icon name="arrow-right" size={14} /></>}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 16, textAlign: 'center' }}>
                    By submitting, you agree to be contacted by Weblyne. We never share your details.
                  </p>
                </form>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <a href="https://wa.me/9779815864822" target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: 20, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="whatsapp" size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Chat on WhatsApp</div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>+977 9815 864 822 · Tap to chat</div>
                </div>
              </a>

              <div className="wb-card" style={{ padding: 24 }}>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Other ways</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { icon: 'mail', label: 'Email', val: 'adityabhujel999@gmail.com' },
                    { icon: 'phone', label: 'Phone', val: '+977 9815 864 822' },
                    { icon: 'map', label: 'Office', val: 'Biratnagar, Nepal' },
                  ].map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--color-blue-light)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={c.icon} size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{c.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--color-bg-soft)', padding: 24, borderRadius: 14 }}>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Office hours</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sun – Fri</span><strong>10:00 – 18:00</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}><span>Saturday</span><span>By appointment</span></div>
                </div>
                <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--color-teal-soft)', color: 'var(--color-teal)', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--color-teal)' }} />
                  We reply within 24 hours
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 64, height: 360, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid var(--color-line)' }}>
            <div style={{
              position: 'absolute', inset: 0, background: '#e8eef5',
              backgroundImage: `
                linear-gradient(0deg, rgba(24,95,165,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(24,95,165,0.05) 1px, transparent 1px),
                radial-gradient(circle at 30% 50%, rgba(29,158,117,0.15), transparent 30%),
                radial-gradient(circle at 70% 60%, rgba(24,95,165,0.1), transparent 40%)
              `,
              backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%',
            }} />
            <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 800 360" preserveAspectRatio="none">
              <path d="M0 180 Q200 150 400 180 T800 200" stroke="white" strokeWidth="4" fill="none" />
              <path d="M400 0 L420 360" stroke="white" strokeWidth="3" fill="none" />
              <path d="M0 80 L800 100" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M0 280 L800 260" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -100%)' }}>
              <div style={{ background: 'var(--color-blue)', color: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: 'var(--shadow-lg)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                <Icon name="dot" size={8} /> Weblyne · Main Road
              </div>
              <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid var(--color-blue)', margin: '0 auto' }} />
              <div style={{ width: 12, height: 12, borderRadius: 999, background: 'var(--color-blue)', margin: '4px auto 0', boxShadow: '0 0 0 6px rgba(24,95,165,0.2)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'white', padding: '8px 12px', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-muted)' }}>
              26.4525° N, 87.2718° E
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
