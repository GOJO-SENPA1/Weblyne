import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import Icon from '../components/Icon.jsx';
import { api, auth } from '../lib/api.js';

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'chart' },
  { id: 'inquiries', label: 'Inquiries', icon: 'mail' },
  { id: 'blog', label: 'Blog', icon: 'code' },
  { id: 'portfolio', label: 'Portfolio', icon: 'briefcase' },
  { id: 'team', label: 'Team', icon: 'globe' },
  { id: 'settings', label: 'Settings', icon: 'wrench' },
];

const STATUS_COLOR = { new: '#185fa5', replied: '#0ea5a4', archived: '#6b7280' };
const STATUS_BG = { new: '#dbeafe', replied: '#ccfbf1', archived: '#e5e7eb' };
const PIE_PALETTE = ['#185fa5', '#0ea5a4', '#f59e0b', '#a855f7', '#ef4444', '#10b981', '#3b82f6', '#ec4899'];

const fmtDate = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return d; }
};
const fmtDateTime = (d) => {
  if (!d) return '';
  try { return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; }
};
const slugify = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = auth.get();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [drawerContact, setDrawerContact] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!token) { navigate('/admin/login', { replace: true }); return; }
    const handle401 = (err) => {
      if (err?.status === 401) { auth.clear(); navigate('/admin/login', { replace: true }); }
    };
    api.adminStats(token).then(setStats).catch(handle401);
    api.adminAnalytics(token, 30).then(setAnalytics).catch(handle401);
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

  const counts = useMemo(() => {
    if (!contacts) return {};
    return contacts.reduce((acc, c) => { acc[c.status || 'new'] = (acc[c.status || 'new'] || 0) + 1; return acc; }, {});
  }, [contacts]);

  const showToast = (msg, kind = 'success') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3000);
  };

  const updateContact = async (id, payload) => {
    try {
      await api.adminContactUpdate(token, id, payload);
      setContacts(cs => cs.map(c => (c.id === id ? { ...c, ...payload } : c)));
      showToast('Updated.');
    } catch (err) { showToast(err?.message || 'Update failed', 'error'); }
  };

  const deleteContact = async (id) => {
    if (!confirm('Delete this enquiry permanently?')) return;
    try {
      await api.adminContactDelete(token, id);
      setContacts(cs => cs.filter(c => c.id !== id));
      setDrawerContact(null);
      showToast('Deleted.');
    } catch (err) { showToast(err?.message || 'Delete failed', 'error'); }
  };

  const logout = () => { auth.clear(); navigate('/admin/login', { replace: true }); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - var(--nav-h))', position: 'relative' }}>
      <style>{adminStyles}</style>

      {/* SIDEBAR */}
      <aside className="wb-admin-sidebar">
        <div style={{ padding: '0 24px', marginBottom: 28 }}>
          <Logo size={18} white />
        </div>
        <div style={{ padding: '0 16px', marginBottom: 20 }}>
          <div className="wb-admin-side-label">WORKSPACE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #185fa5, #0ea5a4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>W</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Weblyne Studio</div>
              <div style={{ fontSize: 11, color: '#9bafcb' }}>Admin</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 16px', flex: 1 }}>
          <div className="wb-admin-side-label">MAIN</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(n => {
              const count = n.id === 'inquiries' ? (contacts?.length ?? 0)
                : n.id === 'portfolio' ? (stats?.portfolio_count ?? 0)
                : n.id === 'blog' ? (stats?.blog_count ?? 0)
                : undefined;
              const active = tab === n.id;
              return (
                <li key={n.id}>
                  <button onClick={() => setTab(n.id)} className={`wb-admin-nav-btn ${active ? 'is-active' : ''}`}>
                    <Icon name={n.icon} size={16} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{n.label}</span>
                    {count !== undefined && <span className="wb-admin-nav-pill">{count}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: 'linear-gradient(135deg, #185fa5, #0ea5a4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>AB</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stats?.admin_email || 'Admin'}</div>
            <button onClick={logout} style={{ background: 'none', border: 'none', padding: 0, color: '#9bafcb', fontSize: 11, cursor: 'pointer' }}>Sign out</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ background: '#f7f9fc', overflow: 'auto' }}>
        <div style={{ background: 'white', borderBottom: '1px solid var(--color-line)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
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

        {/* KPI ROW */}
        <div className="wb-kpi-grid">
          {[
            ['Total inquiries', stats?.contacts_count ?? '—', '#185fa5', 'mail', `${stats?.contacts_30d ?? 0} in 30d`],
            ['New (unread)', counts.new ?? 0, '#0ea5a4', 'check', stats?.contacts_new != null ? `${stats.contacts_new} pending` : ''],
            ['This week', stats?.contacts_7d ?? '—', '#a855f7', 'lightning', 'Last 7 days'],
            ['Blog posts', stats?.blog_count ?? '—', '#f59e0b', 'code', `${stats?.portfolio_count ?? 0} projects`],
          ].map(([k, v, c, icon, sub]) => (
            <div key={k} className="wb-kpi-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{k}</div>
                <div className="wb-kpi-icon" style={{ background: c + '22', color: c }}>
                  <Icon name={icon} size={14} />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--color-ink)', marginTop: 4 }}>{v}</div>
              <div style={{ fontSize: 11, color: c, marginTop: 4, fontWeight: 600 }}>{sub || '\u00a0'}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: 32 }}>
          {tab === 'overview' && <OverviewTab analytics={analytics} stats={stats} onPickContact={setDrawerContact} />}
          {tab === 'inquiries' && (
            <InquiriesTab
              contacts={filteredContacts}
              filter={filter} setFilter={setFilter}
              onUpdate={updateContact} onDelete={deleteContact}
              onPick={setDrawerContact}
            />
          )}
          {tab === 'blog' && <BlogTab token={token} onToast={showToast} onCount={(n) => setStats(s => s ? { ...s, blog_count: n } : s)} />}
          {tab === 'portfolio' && <PortfolioTab token={token} onToast={showToast} onCount={(n) => setStats(s => s ? { ...s, portfolio_count: n } : s)} />}
          {tab === 'team' && <TeamTab token={token} onToast={showToast} currentEmail={stats?.admin_email} />}
          {tab === 'settings' && <SettingsTab stats={stats} />}
        </div>
      </main>

      {drawerContact && (
        <ContactDrawer
          contact={drawerContact}
          onClose={() => setDrawerContact(null)}
          onUpdate={updateContact}
          onDelete={deleteContact}
        />
      )}
      {toast && (
        <div className={`wb-toast ${toast.kind === 'error' ? 'is-error' : ''}`}>{toast.msg}</div>
      )}
    </div>
  );
}

/* ─────────────────────────  OVERVIEW TAB  ───────────────────────── */
function OverviewTab({ analytics, onPickContact }) {
  if (!analytics) {
    return <SkeletonRows count={3} />;
  }
  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
      <Card title="Inquiries — last 30 days" subtitle={`${analytics.series.reduce((s, r) => s + r.count, 0)} total`}>
        <LineChart data={analytics.series} />
      </Card>
      <Card title="By status">
        <DonutChart data={analytics.by_status} />
      </Card>
      <Card title="Top services" subtitle="Last 30 days">
        <BarList data={analytics.by_service} />
      </Card>
      <Card title="Budgets" subtitle="Last 30 days">
        <BarList data={analytics.by_budget} />
      </Card>
      <Card title="Recent inquiries" full>
        {analytics.recent.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)', padding: 24, textAlign: 'center', fontSize: 14 }}>
            No inquiries yet — share your site and they'll start landing here.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {analytics.recent.map(r => (
              <li key={r.id} onClick={() => onPickContact(r)} style={{ padding: '12px 0', borderBottom: '1px solid var(--color-line)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: 999, background: '#dbeafe', color: '#185fa5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                  {(r.name || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>· {r.service || '—'}</span></div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.email}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{fmtDateTime(r.created_at)}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ─────────────────────────  INQUIRIES TAB  ─────────────────────── */
function InquiriesTab({ contacts, filter, setFilter, onUpdate, onDelete, onPick }) {
  return (
    <div className="wb-card">
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>All inquiries</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'New', 'Replied', 'Archived'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '6px 12px', borderRadius: 6, border: '1px solid var(--color-line)',
              background: filter === s ? 'var(--color-bg-soft)' : 'white',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>{s}</button>
          ))}
        </div>
      </div>
      {!contacts && <SkeletonRows count={5} />}
      {contacts && contacts.length === 0 && (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>No inquiries match your filter.</div>
      )}
      {contacts && contacts.length > 0 && (
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
              {contacts.map(q => {
                const s = (q.status || 'new').toLowerCase();
                return (
                  <tr key={q.id} className="wb-row" onClick={() => onPick(q)}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 999, background: '#dbeafe', color: '#185fa5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                          {(q.name || '?').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{q.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{q.email}</td>
                    <td style={{ padding: '14px 16px' }}>{q.service || '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{fmtDate(q.created_at)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, background: STATUS_BG[s], color: STATUS_COLOR[s], fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{s}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={`mailto:${q.email}?subject=Re: your enquiry`} className="wb-btn" style={{ padding: '4px 10px', fontSize: 11, fontWeight: 500 }}>Reply</a>
                        <button onClick={() => onUpdate(q.id, { status: s === 'archived' ? 'new' : 'archived' })} style={btnGhost}>
                          {s === 'archived' ? 'Restore' : 'Archive'}
                        </button>
                        <button onClick={() => onDelete(q.id)} style={{ ...btnGhost, color: '#dc2626' }}>Delete</button>
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
  );
}

/* ─────────────────────────  BLOG TAB  ──────────────────────────── */
const EMPTY_POST = { slug: '', title: '', excerpt: '', body: '', category: '', author: 'Aditya Bhujel', read_time: '', image_url: '', published: true };

function BlogTab({ token, onToast, onCount }) {
  const [list, setList] = useState(null);
  const [editor, setEditor] = useState(null); // null | {…post}

  const load = () => {
    api.adminBlogList(token).then(rows => { setList(rows); onCount?.(rows.length); }).catch(() => setList([]));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const save = async (post) => {
    try {
      const payload = { ...post };
      if (!payload.slug) payload.slug = slugify(payload.title);
      if (!payload.published_at) delete payload.published_at;
      if (!payload.image_url) delete payload.image_url;
      ['excerpt', 'category', 'author', 'read_time'].forEach(k => { if (!payload[k]) delete payload[k]; });
      if (post.id) await api.adminBlogUpdate(token, post.id, payload);
      else await api.adminBlogCreate(token, payload);
      onToast('Post saved.');
      setEditor(null);
      load();
    } catch (err) {
      onToast(err?.data?.error || err?.message || 'Save failed', 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    try { await api.adminBlogDelete(token, id); onToast('Deleted.'); load(); }
    catch (err) { onToast(err?.message || 'Delete failed', 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{list?.length ?? 0} posts</div>
        <button className="wb-btn wb-btn--primary" onClick={() => setEditor({ ...EMPTY_POST })}>
          <Icon name="plus" size={14} /> New post
        </button>
      </div>
      {!list && <SkeletonRows count={3} />}
      {list && list.length === 0 && (
        <div className="wb-card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No posts yet. Hit "New post" to publish your first.
        </div>
      )}
      {list && list.length > 0 && (
        <div className="wb-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-soft)' }}>
                {['Title', 'Slug', 'Category', 'Status', 'Updated', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} className="wb-row" style={{ borderTop: '1px solid var(--color-line)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.title}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>{p.slug}</td>
                  <td style={{ padding: '14px 16px' }}>{p.category || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, background: p.published ? '#ccfbf1' : '#e5e7eb', color: p.published ? '#0ea5a4' : '#6b7280', fontSize: 11, fontWeight: 600 }}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{fmtDate(p.updated_at)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setEditor(p)} style={btnGhost}>Edit</button>
                      <button onClick={() => remove(p.id)} style={{ ...btnGhost, color: '#dc2626' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editor && <BlogEditor token={token} post={editor} onClose={() => setEditor(null)} onSave={save} onToast={onToast} />}
    </div>
  );
}

function BlogEditor({ token, post, onClose, onSave, onToast }) {
  const [draft, setDraft] = useState({ ...post });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const onUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const r = await api.adminUpload(token, file);
      set('image_url', r.url);
      onToast('Image uploaded.');
    } catch (err) { onToast(err?.message || 'Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await onSave(draft);
    setBusy(false);
  };

  return (
    <Modal title={post.id ? 'Edit post' : 'New post'} onClose={onClose} wide>
      <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
        <Field label="Title">
          <input required value={draft.title} onChange={(e) => { set('title', e.target.value); if (!draft.id && !draft.slug) set('slug', slugify(e.target.value)); }} className="wb-input" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Slug" hint="URL-safe, lowercase, dashes">
            <input required value={draft.slug} onChange={(e) => set('slug', slugify(e.target.value))} className="wb-input" />
          </Field>
          <Field label="Category">
            <input value={draft.category || ''} onChange={(e) => set('category', e.target.value)} className="wb-input" placeholder="Strategy, Code, Brand…" />
          </Field>
        </div>
        <Field label="Excerpt" hint="Short preview shown on the blog index">
          <textarea value={draft.excerpt || ''} onChange={(e) => set('excerpt', e.target.value)} className="wb-input" rows={2} />
        </Field>
        <Field label="Body" hint="Markdown or plain text. Min 10 chars.">
          <textarea required value={draft.body} onChange={(e) => set('body', e.target.value)} className="wb-input" rows={12} style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Author">
            <input value={draft.author || ''} onChange={(e) => set('author', e.target.value)} className="wb-input" />
          </Field>
          <Field label="Read time">
            <input value={draft.read_time || ''} onChange={(e) => set('read_time', e.target.value)} className="wb-input" placeholder="5 min" />
          </Field>
        </div>
        <Field label="Cover image" hint="Upload an image (≤ 5 MB) or paste a URL">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} style={{ fontSize: 12 }} />
            <input value={draft.image_url || ''} onChange={(e) => set('image_url', e.target.value)} className="wb-input" placeholder="https://… or /uploads/…" style={{ flex: 1, minWidth: 220 }} />
            {uploading && <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Uploading…</span>}
          </div>
          {draft.image_url && (
            <img src={draft.image_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE?.replace(/\/api$/, '') || ''}${draft.image_url}` : draft.image_url} alt="" style={{ marginTop: 8, maxHeight: 140, borderRadius: 8, border: '1px solid var(--color-line)' }} />
          )}
        </Field>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
          <input type="checkbox" checked={!!draft.published} onChange={(e) => set('published', e.target.checked)} />
          Published (visible on the public blog)
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
          <button type="button" onClick={onClose} className="wb-btn wb-btn--ghost">Cancel</button>
          <button type="submit" disabled={busy} className="wb-btn wb-btn--primary">{busy ? 'Saving…' : 'Save post'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ─────────────────────────  PORTFOLIO TAB  ─────────────────────── */
const EMPTY_PROJECT = { title: '', description: '', category: 'Web', client_name: '', tech_stack: [], image_url: '', live_url: '', challenge: '', approach: '', results: '', featured: false, published: true };

function PortfolioTab({ token, onToast, onCount }) {
  const [list, setList] = useState(null);
  const [editor, setEditor] = useState(null);

  const load = () => {
    api.adminPortfolioList(token).then(rows => { setList(rows); onCount?.(rows.length); }).catch(() => setList([]));
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const save = async (proj) => {
    try {
      const payload = { ...proj };
      ['description', 'client_name', 'image_url', 'live_url', 'challenge', 'approach', 'results']
        .forEach(k => { if (!payload[k]) delete payload[k]; });
      if (proj.id) await api.adminPortfolioUpdate(token, proj.id, payload);
      else await api.adminPortfolioCreate(token, payload);
      onToast('Project saved.');
      setEditor(null);
      load();
    } catch (err) {
      onToast(err?.data?.error || err?.message || 'Save failed', 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.adminPortfolioDelete(token, id); onToast('Deleted.'); load(); }
    catch (err) { onToast(err?.message || 'Delete failed', 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{list?.length ?? 0} projects</div>
        <button className="wb-btn wb-btn--primary" onClick={() => setEditor({ ...EMPTY_PROJECT })}>
          <Icon name="plus" size={14} /> New project
        </button>
      </div>
      {!list && <SkeletonRows count={3} />}
      {list && list.length === 0 && (
        <div className="wb-card" style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No projects yet. Add one to fill the public portfolio.
        </div>
      )}
      {list && list.length > 0 && (
        <div className="wb-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-soft)' }}>
                {['Title', 'Category', 'Client', 'Featured', 'Status', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} className="wb-row" style={{ borderTop: '1px solid var(--color-line)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{p.title}</td>
                  <td style={{ padding: '14px 16px' }}>{p.category}</td>
                  <td style={{ padding: '14px 16px' }}>{p.client_name || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>{p.featured ? '★' : ''}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, background: p.published ? '#ccfbf1' : '#e5e7eb', color: p.published ? '#0ea5a4' : '#6b7280', fontSize: 11, fontWeight: 600 }}>
                      {p.published ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setEditor(p)} style={btnGhost}>Edit</button>
                      <button onClick={() => remove(p.id)} style={{ ...btnGhost, color: '#dc2626' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editor && <ProjectEditor token={token} project={editor} onClose={() => setEditor(null)} onSave={save} onToast={onToast} />}
    </div>
  );
}

function ProjectEditor({ token, project, onClose, onSave, onToast }) {
  const [draft, setDraft] = useState({ ...project, tech_stack: project.tech_stack || [] });
  const [techInput, setTechInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const onUpload = async (file) => {
    if (!file) return;
    try { setUploading(true); const r = await api.adminUpload(token, file); set('image_url', r.url); onToast('Image uploaded.'); }
    catch (err) { onToast(err?.message || 'Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (!t) return;
    if (!draft.tech_stack.includes(t)) set('tech_stack', [...draft.tech_stack, t]);
    setTechInput('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await onSave(draft);
    setBusy(false);
  };

  return (
    <Modal title={project.id ? 'Edit project' : 'New project'} onClose={onClose} wide>
      <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
        <Field label="Title"><input required value={draft.title} onChange={(e) => set('title', e.target.value)} className="wb-input" /></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Category"><input required value={draft.category} onChange={(e) => set('category', e.target.value)} className="wb-input" /></Field>
          <Field label="Client name"><input value={draft.client_name || ''} onChange={(e) => set('client_name', e.target.value)} className="wb-input" /></Field>
        </div>
        <Field label="Short description"><textarea value={draft.description || ''} onChange={(e) => set('description', e.target.value)} className="wb-input" rows={2} /></Field>
        <Field label="Tech stack" hint="Press Enter to add">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', padding: 6, border: '1px solid var(--color-line)', borderRadius: 8, minHeight: 40 }}>
            {draft.tech_stack.map((t, i) => (
              <span key={i} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--color-bg-soft)', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {t} <button type="button" onClick={() => set('tech_stack', draft.tech_stack.filter((_, j) => j !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0 }}>×</button>
              </span>
            ))}
            <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="React, Node, Postgres…" style={{ flex: 1, minWidth: 120, border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit' }} />
          </div>
        </Field>
        <Field label="Cover image">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0])} style={{ fontSize: 12 }} />
            <input value={draft.image_url || ''} onChange={(e) => set('image_url', e.target.value)} className="wb-input" placeholder="https://… or /uploads/…" style={{ flex: 1, minWidth: 220 }} />
            {uploading && <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Uploading…</span>}
          </div>
        </Field>
        <Field label="Live URL"><input value={draft.live_url || ''} onChange={(e) => set('live_url', e.target.value)} className="wb-input" placeholder="https://…" /></Field>
        <Field label="Challenge"><textarea value={draft.challenge || ''} onChange={(e) => set('challenge', e.target.value)} className="wb-input" rows={3} /></Field>
        <Field label="Approach"><textarea value={draft.approach || ''} onChange={(e) => set('approach', e.target.value)} className="wb-input" rows={3} /></Field>
        <Field label="Results"><textarea value={draft.results || ''} onChange={(e) => set('results', e.target.value)} className="wb-input" rows={3} /></Field>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={!!draft.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={!!draft.published} onChange={(e) => set('published', e.target.checked)} /> Published
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
          <button type="button" onClick={onClose} className="wb-btn wb-btn--ghost">Cancel</button>
          <button type="submit" disabled={busy} className="wb-btn wb-btn--primary">{busy ? 'Saving…' : 'Save project'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ─────────────────────────  TEAM TAB  ──────────────────────────── */
function TeamTab({ token, onToast, currentEmail }) {
  const [list, setList] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ email: '', password: '', name: '' });
  const [busy, setBusy] = useState(false);

  const load = () => api.adminAdmins(token).then(setList).catch(() => setList([]));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.adminAdminCreate(token, draft);
      onToast('Admin added.');
      setDraft({ email: '', password: '', name: '' });
      setShowForm(false);
      load();
    } catch (err) { onToast(err?.data?.error || err?.message || 'Could not add admin', 'error'); }
    finally { setBusy(false); }
  };

  const remove = async (a) => {
    if (a.email === currentEmail) return onToast('You cannot remove your own account here.', 'error');
    if (!confirm(`Remove ${a.email}?`)) return;
    try { await api.adminAdminDelete(token, a.id); onToast('Admin removed.'); load(); }
    catch (err) { onToast(err?.data?.error || err?.message || 'Could not remove', 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Admin team</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Anyone here can sign in and gets a copy of every new enquiry.</div>
        </div>
        <button className="wb-btn wb-btn--primary" onClick={() => setShowForm(s => !s)}>
          <Icon name="plus" size={14} /> Add admin
        </button>
      </div>
      {showForm && (
        <form onSubmit={create} className="wb-card" style={{ padding: 16, marginBottom: 16, display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr 1fr auto' }}>
          <input required type="email" placeholder="email" value={draft.email} onChange={(e) => setDraft(d => ({ ...d, email: e.target.value }))} className="wb-input" />
          <input required type="password" placeholder="password (min 8)" minLength={8} value={draft.password} onChange={(e) => setDraft(d => ({ ...d, password: e.target.value }))} className="wb-input" />
          <input placeholder="name (optional)" value={draft.name} onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))} className="wb-input" />
          <button disabled={busy} className="wb-btn wb-btn--primary">{busy ? 'Adding…' : 'Add'}</button>
        </form>
      )}
      {!list && <SkeletonRows count={2} />}
      {list && (
        <div className="wb-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-soft)' }}>
                {['Name', 'Email', 'Joined', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid var(--color-line)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{a.name || '—'} {a.email === currentEmail && <span style={{ fontSize: 10, marginLeft: 6, padding: '2px 6px', borderRadius: 4, background: '#dbeafe', color: '#185fa5' }}>YOU</span>}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{a.email}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{fmtDate(a.created_at)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button disabled={a.email === currentEmail} onClick={() => remove(a)} style={{ ...btnGhost, color: a.email === currentEmail ? 'var(--color-text-faint)' : '#dc2626', cursor: a.email === currentEmail ? 'not-allowed' : 'pointer' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  SETTINGS TAB  ──────────────────────── */
function SettingsTab({ stats }) {
  return (
    <div className="wb-card" style={{ padding: 24 }}>
      <h3 style={{ marginBottom: 8 }}>Workspace</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 16 }}>Account & integration info.</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 13 }}>
        <li><strong>Signed in as:</strong> {stats?.admin_email || '—'}</li>
        <li><strong>API base:</strong> <code>{import.meta.env.VITE_API_BASE || '/api'}</code></li>
        <li><strong>Newsletter subscribers:</strong> {stats?.newsletter_count ?? '—'}</li>
      </ul>
      <h4 style={{ marginTop: 24, marginBottom: 6 }}>How notifications work</h4>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 13, lineHeight: 1.6 }}>
        Whenever a visitor submits the contact form, every email in the <em>Team</em> tab receives a notification, plus any extras configured in the <code>EMAIL_TO_ADMIN</code> environment variable on the backend (comma-separated).
      </p>
    </div>
  );
}

/* ─────────────────────────  CONTACT DRAWER  ────────────────────── */
function ContactDrawer({ contact, onClose, onUpdate, onDelete }) {
  return (
    <>
      <div className="wb-drawer-backdrop" onClick={onClose} />
      <aside className="wb-drawer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--color-line)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Enquiry #{contact.id}</div>
            <h3 style={{ fontSize: 18, marginTop: 4 }}>{contact.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <div style={{ padding: 24, display: 'grid', gap: 16 }}>
          <Field label="Email"><div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}><a href={`mailto:${contact.email}`}>{contact.email}</a></div></Field>
          {contact.phone && <Field label="Phone"><div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{contact.phone}</div></Field>}
          {contact.service && <Field label="Service"><div>{contact.service}</div></Field>}
          {contact.budget && <Field label="Budget"><div>{contact.budget}</div></Field>}
          {contact.description && (
            <Field label="Message">
              <div style={{ whiteSpace: 'pre-wrap', background: 'var(--color-bg-soft)', padding: 12, borderRadius: 8, fontSize: 13, lineHeight: 1.6 }}>{contact.description}</div>
            </Field>
          )}
          <Field label="Received"><div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{fmtDateTime(contact.created_at)}</div></Field>
        </div>
        <div style={{ padding: 20, borderTop: '1px solid var(--color-line)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href={`mailto:${contact.email}?subject=Re: your enquiry`} className="wb-btn wb-btn--primary">Reply</a>
          <button className="wb-btn wb-btn--ghost" onClick={() => onUpdate(contact.id, { status: 'replied' })}>Mark replied</button>
          <button className="wb-btn wb-btn--ghost" onClick={() => onUpdate(contact.id, { status: 'archived' })}>Archive</button>
          <button className="wb-btn wb-btn--ghost" style={{ marginLeft: 'auto', color: '#dc2626' }} onClick={() => onDelete(contact.id)}>Delete</button>
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────  PRIMITIVES  ────────────────────────── */
function Card({ title, subtitle, children, full }) {
  return (
    <div className="wb-card" style={{ padding: 20, gridColumn: full ? '1 / -1' : 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-ink)' }}>{label}</span>
        {hint && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Modal({ title, children, onClose, wide }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="wb-modal-backdrop" onClick={onClose}>
      <div className="wb-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: wide ? 720 : 480 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-line)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted)' }}>×</button>
        </div>
        <div style={{ padding: 20, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}

function SkeletonRows({ count = 3 }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="wb-skel" style={{ height: 64 }} />
      ))}
    </div>
  );
}

/* ─────────────────────────  CHARTS (pure SVG)  ─────────────────── */
function LineChart({ data }) {
  const W = 600, H = 180, P = 24;
  const max = Math.max(1, ...data.map(d => d.count));
  const stepX = (W - P * 2) / Math.max(1, data.length - 1);
  const points = data.map((d, i) => [P + i * stepX, H - P - (d.count / max) * (H - P * 2)]);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${path} L${points[points.length - 1][0]},${H - P} L${P},${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 180 }}>
      <defs>
        <linearGradient id="lc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#185fa5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#185fa5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(t => (
        <line key={t} x1={P} x2={W - P} y1={P + (H - P * 2) * t} y2={P + (H - P * 2) * t} stroke="#e5e7eb" strokeDasharray="3 3" />
      ))}
      <path d={area} fill="url(#lc)" />
      <path d={path} fill="none" stroke="#185fa5" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#185fa5">
          <title>{data[i].date}: {data[i].count}</title>
        </circle>
      ))}
      {data.length > 0 && (
        <>
          <text x={P} y={H - 6} fontSize="10" fill="#6b7280">{data[0].date.slice(5)}</text>
          <text x={W - P} y={H - 6} fontSize="10" fill="#6b7280" textAnchor="end">{data[data.length - 1].date.slice(5)}</text>
        </>
      )}
    </svg>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const R = 56, S = 16;
  let acc = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg viewBox="0 0 140 140" style={{ width: 140, height: 140 }}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="#f1f5f9" strokeWidth={S} />
        {data.map((d, i) => {
          const frac = d.count / total;
          const len = 2 * Math.PI * R;
          const dasharray = `${frac * len} ${len}`;
          const dashoffset = -acc * len;
          acc += frac;
          return (
            <circle key={i} cx="70" cy="70" r={R} fill="none"
              stroke={PIE_PALETTE[i % PIE_PALETTE.length]} strokeWidth={S}
              strokeDasharray={dasharray} strokeDashoffset={dashoffset}
              transform="rotate(-90 70 70)" />
          );
        })}
        <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0b2545">{total}</text>
        <text x="70" y="86" textAnchor="middle" fontSize="10" fill="#6b7280">total</text>
      </svg>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6, flex: 1, fontSize: 12 }}>
        {data.map((d, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_PALETTE[i % PIE_PALETTE.length] }} />
            <span style={{ flex: 1, textTransform: 'capitalize' }}>{d.label}</span>
            <span style={{ fontWeight: 600 }}>{d.count}</span>
          </li>
        ))}
        {data.length === 0 && <li style={{ color: 'var(--color-text-muted)' }}>No data yet.</li>}
      </ul>
    </div>
  );
}

function BarList({ data }) {
  const max = Math.max(1, ...data.map(d => d.count));
  if (data.length === 0) return <div style={{ color: 'var(--color-text-muted)', fontSize: 13, padding: 12 }}>No data yet.</div>;
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
      {data.map((d, i) => (
        <li key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
            <span>{d.label}</span><span style={{ fontWeight: 600 }}>{d.count}</span>
          </div>
          <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(d.count / max) * 100}%`, background: PIE_PALETTE[i % PIE_PALETTE.length], borderRadius: 999, transition: 'width .5s ease' }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const btnGhost = { padding: '4px 10px', border: '1px solid var(--color-line)', borderRadius: 6, background: 'white', fontSize: 11, fontWeight: 500, color: 'var(--color-text-muted)', cursor: 'pointer' };

const adminStyles = `
  .wb-admin-sidebar { background: linear-gradient(180deg, #0b2545 0%, #143562 100%); color: white; padding: 28px 0; display: flex; flex-direction: column; }
  .wb-admin-side-label { font-size: 11px; font-family: var(--font-mono); color: #7a8fa9; letter-spacing: 0.1em; margin-bottom: 12px; padding: 0 8px; }
  .wb-admin-nav-btn { width: 100%; padding: 10px 12px; border-radius: 8px; background: transparent; color: #cfdaeb; border: none; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background .18s ease, transform .18s ease; font-family: inherit; }
  .wb-admin-nav-btn:hover { background: rgba(255,255,255,0.06); }
  .wb-admin-nav-btn.is-active { background: linear-gradient(135deg, #185fa5, #2078cf); color: white; box-shadow: 0 6px 16px -8px rgba(24,95,165,0.7); }
  .wb-admin-nav-pill { font-size: 11px; padding: 2px 7px; border-radius: 999px; background: rgba(255,255,255,0.06); font-family: var(--font-mono); }
  .wb-admin-nav-btn.is-active .wb-admin-nav-pill { background: rgba(255,255,255,0.22); }

  .wb-kpi-grid { padding: 24px 32px 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  @media (max-width: 900px) { .wb-kpi-grid { grid-template-columns: repeat(2, 1fr); } }
  .wb-kpi-card { background: white; border: 1px solid var(--color-line); border-radius: 12px; padding: 16px 18px; transition: transform .18s ease, box-shadow .18s ease; }
  .wb-kpi-card:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -16px rgba(11,37,69,0.18); }
  .wb-kpi-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }

  .wb-card { background: white; border: 1px solid var(--color-line); border-radius: 12px; }
  .wb-row { border-top: 1px solid var(--color-line); cursor: pointer; transition: background .15s ease; }
  .wb-row:hover { background: var(--color-bg-soft); }

  .wb-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--color-line); font-family: inherit; font-size: 13px; outline: none; transition: border-color .15s, box-shadow .15s; background: white; }
  .wb-input:focus { border-color: #185fa5; box-shadow: 0 0 0 3px rgba(24,95,165,0.15); }

  .wb-modal-backdrop { position: fixed; inset: 0; background: rgba(11,37,69,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; animation: wb-fade .18s ease; }
  .wb-modal { background: white; border-radius: 14px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 60px -10px rgba(11,37,69,0.5); animation: wb-pop .22s ease; }

  .wb-drawer-backdrop { position: fixed; inset: 0; background: rgba(11,37,69,0.35); z-index: 90; animation: wb-fade .18s ease; }
  .wb-drawer { position: fixed; right: 0; top: 0; bottom: 0; width: min(440px, 92vw); background: white; z-index: 91; box-shadow: -16px 0 40px -16px rgba(11,37,69,0.3); display: flex; flex-direction: column; overflow-y: auto; animation: wb-slide-in .25s ease; }

  .wb-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 12px 20px; background: #0b2545; color: white; border-radius: 10px; font-size: 13px; box-shadow: 0 12px 30px -10px rgba(0,0,0,0.4); z-index: 200; animation: wb-toast-in .25s ease; }
  .wb-toast.is-error { background: #dc2626; }

  .wb-skel { background: linear-gradient(90deg, #eef2f7 0%, #f7f9fc 50%, #eef2f7 100%); background-size: 200% 100%; animation: wb-shimmer 1.4s ease-in-out infinite; border-radius: 10px; }

  @keyframes wb-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes wb-pop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes wb-slide-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes wb-toast-in { from { transform: translate(-50%, 12px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
  @keyframes wb-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  @media (max-width: 900px) {
    .wb-admin-sidebar { display: none; }
  }
`;
