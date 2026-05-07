import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import Icon from '../components/Icon.jsx';
import { api, auth } from '../lib/api.js';

const NAV = [
  { id: 'inquiries', label: 'Inquiries', icon: 'mail' },
  { id: 'portfolio', label: 'Portfolio', icon: 'briefcase' },
  { id: 'blog', label: 'Blog', icon: 'code' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'settings', label: 'Settings', icon: 'wrench' },
];

const STATUS_COLOR = { new: 'var(--color-blue)', replied: 'var(--color-teal)', archived: 'var(--color-text-faint)' };
const STATUS_BG = { new: 'var(--color-blue-light)', replied: 'var(--color-teal-soft)', archived: 'var(--color-bg-soft)' };

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return d; }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = auth.get();
  const [tab, setTab] = useState('inquiries');
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    api.adminStats(token).then(setStats).catch(err => {
      if (err?.status === 401) {
        auth.clear();
        navigate('/admin/login', { replace: true });
      }
    });
    api.adminContacts(token).then(setContacts).catch(() => setContacts([]));
  }, [token, navigate]);

  const filteredContacts = useMemo(() => {
    if (!contacts) return null;
    let list = contacts;
    if (filter !== 'All') list = list.filter(c => (c.status || 'new').toLowerCase() === filter.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.service || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [contacts, filter, search]);

  const updateContact = async (id, payload) => {
    try {
      await api.adminContactUpdate(token, id, payload);
      setContacts(cs => cs.map(c => (c.id === id ? { ...c, ...payload } : c)));
    } catch (err) {
      alert(err?.message || 'Update failed');
    }
  };

  const logout = () => {
    auth.clear();
    navigate('/admin/login', { replace: true });
  };

  const counts = useMemo(() => {
    if (!contacts) return {};
    return contacts.reduce((acc, c) => { acc[c.status || 'new'] = (acc[c.status || 'new'] || 0) + 1; return acc; }, {});
  }, [contacts]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - var(--nav-h))' }}>
      <aside style={{ background: 'var(--color-navy)', color: 'white', padding: '28px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', marginBottom: 28 }}>
          <Logo size={18} white />
        </div>
        <div style={{ padding: '0 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#7a8fa9', letterSpacing: '0.1em', marginBottom: 12, padding: '0 8px' }}>WORKSPACE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>W</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Weblyne Studio</div>
              <div style={{ fontSize: 11, color: '#9bafcb' }}>Admin</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 16px', flex: 1 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#7a8fa9', letterSpacing: '0.1em', marginBottom: 12, padding: '0 8px' }}>MAIN</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(n => {
              const count = n.id === 'inquiries' ? (contacts?.length ?? 0)
                : n.id === 'portfolio' ? (stats?.portfolio_count ?? 0)
                : n.id === 'blog' ? (stats?.blog_count ?? 0)
                : undefined;
              return (
                <li key={n.id}>
                  <button onClick={() => setTab(n.id)} style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    background: tab === n.id ? 'var(--color-blue)' : 'transparent',
                    color: tab === n.id ? 'white' : '#cfdaeb',
                    border: 'none', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  }}>
                    <Icon name={n.icon} size={16} />
                    <span style={{ flex: 1 }}>{n.label}</span>
                    {count !== undefined && <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 999, background: tab === n.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)' }}>{count}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>AB</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{stats?.admin_email || 'Admin'}</div>
            <button onClick={logout} style={{ background: 'none', border: 'none', padding: 0, color: '#9bafcb', fontSize: 11, cursor: 'pointer' }}>Sign out</button>
          </div>
        </div>
      </aside>

      <main style={{ background: '#f7f9fc', overflow: 'auto' }}>
        <div style={{ background: 'white', borderBottom: '1px solid var(--color-line)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Dashboard / {NAV.find(n => n.id === tab)?.label}</div>
            <h2 style={{ fontSize: 22, marginTop: 2 }}>{NAV.find(n => n.id === tab)?.label}</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" style={{ width: 240, height: 38, padding: '0 14px 0 36px', borderRadius: 8, border: '1px solid var(--color-line)', fontSize: 13, fontFamily: 'inherit' }} />
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="search" size={14} color="var(--color-text-faint)" /></span>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            ['Total inquiries', stats?.contacts_count ?? '—', 'var(--color-blue)'],
            ['New (unread)', counts.new ?? 0, 'var(--color-teal)'],
            ['Portfolio projects', stats?.portfolio_count ?? '—', 'var(--color-navy)'],
            ['Blog posts', stats?.blog_count ?? '—', 'var(--color-blue)'],
          ].map(([k, v, c]) => (
            <div key={k} style={{ background: 'white', border: '1px solid var(--color-line)', borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>{k}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--color-ink)' }}>{v}</div>
              <div style={{ fontSize: 11, color: c, marginTop: 4, fontWeight: 600 }}>&nbsp;</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 32 }}>
          {tab === 'inquiries' && (
            <div style={{ background: 'white', border: '1px solid var(--color-line)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Recent inquiries</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['All', 'New', 'Replied', 'Archived'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                      padding: '6px 12px', borderRadius: 6,
                      border: '1px solid var(--color-line)',
                      background: filter === s ? 'var(--color-bg-soft)' : 'white',
                      fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              {!filteredContacts && <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>}
              {filteredContacts && filteredContacts.length === 0 && (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>No inquiries match your filter.</div>
              )}
              {filteredContacts && filteredContacts.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: 'var(--color-bg-soft)' }}>
                        {['Name', 'Email', 'Service', 'Date', 'Status', ''].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((q) => {
                        const s = (q.status || 'new').toLowerCase();
                        return (
                          <tr key={q.id} style={{ borderTop: '1px solid var(--color-line)' }}>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--color-blue-light)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                                  {(q.name || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{q.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{q.email}</td>
                            <td style={{ padding: '14px 16px' }}>{q.service}</td>
                            <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{formatDate(q.created_at)}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 999, background: STATUS_BG[s] || STATUS_BG.new, color: STATUS_COLOR[s] || STATUS_COLOR.new, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{s}</span>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <a href={`mailto:${q.email}?subject=Re: your enquiry`} className="wb-btn" style={{ padding: '4px 10px', fontSize: 11, fontWeight: 500 }}>Reply</a>
                                <button onClick={() => updateContact(q.id, { status: s === 'archived' ? 'new' : 'archived' })} style={{ padding: '4px 10px', border: '1px solid var(--color-line)', borderRadius: 6, background: 'white', fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                  {s === 'archived' ? 'Restore' : 'Archive'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'portfolio' && (
            <div style={{ background: 'white', border: '1px solid var(--color-line)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Icon name="briefcase" size={32} color="var(--color-text-faint)" />
              <h3 style={{ marginTop: 16, marginBottom: 8 }}>{stats?.portfolio_count ?? 0} projects</h3>
              <p>Manage projects via the API. A full editor lands soon.</p>
              <Link to="/portfolio" className="wb-btn wb-btn--ghost" style={{ marginTop: 16, display: 'inline-flex' }}>View public portfolio</Link>
            </div>
          )}
          {tab === 'blog' && (
            <div style={{ background: 'white', border: '1px solid var(--color-line)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Icon name="code" size={32} color="var(--color-text-faint)" />
              <h3 style={{ marginTop: 16, marginBottom: 8 }}>{stats?.blog_count ?? 0} blog posts</h3>
              <p>Manage posts via the API. A full editor lands soon.</p>
              <Link to="/blog" className="wb-btn wb-btn--ghost" style={{ marginTop: 16, display: 'inline-flex' }}>View public blog</Link>
            </div>
          )}
          {tab === 'analytics' && (
            <div style={{ background: 'white', border: '1px solid var(--color-line)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Inquiries — last 30 days</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Plug analytics in once you have data flowing. The endpoint <code>/api/admin/stats</code> already returns totals.</p>
            </div>
          )}
          {tab === 'settings' && (
            <div style={{ background: 'white', border: '1px solid var(--color-line)', borderRadius: 12, padding: 40, color: 'var(--color-text-muted)' }}>
              Workspace, team, billing &amp; integrations. Coming soon.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
