// Lightweight API client. Vite proxies /api → http://localhost:4000 in dev.

const BASE = import.meta.env.VITE_API_BASE || '/api';

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // public
  contact: (payload) => request('/contact', { method: 'POST', body: payload }),
  newsletter: (email) => request('/newsletter', { method: 'POST', body: { email } }),
  portfolio: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/portfolio${q ? `?${q}` : ''}`);
  },
  portfolioFeatured: () => request('/portfolio/featured'),
  portfolioOne: (id) => request(`/portfolio/${id}`),
  blog: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/blog${q ? `?${q}` : ''}`);
  },
  blogOne: (slug) => request(`/blog/${slug}`),
  // admin
  adminLogin: (email, password) => request('/admin/login', { method: 'POST', body: { email, password } }),
  adminContacts: (token, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/contacts${q ? `?${q}` : ''}`, { token });
  },
  adminContactUpdate: (token, id, payload) => request(`/admin/contacts/${id}`, { method: 'PATCH', token, body: payload }),
  adminContactDelete: (token, id) => request(`/admin/contacts/${id}`, { method: 'DELETE', token }),
  adminStats: (token) => request('/admin/stats', { token }),
  adminAnalytics: (token, days = 30) => request(`/admin/analytics?days=${days}`, { token }),
  adminBlogList: (token) => request('/admin/blog', { token }),
  adminBlogCreate: (token, payload) => request('/admin/blog', { method: 'POST', token, body: payload }),
  adminBlogUpdate: (token, id, payload) => request(`/admin/blog/${id}`, { method: 'PUT', token, body: payload }),
  adminBlogDelete: (token, id) => request(`/admin/blog/${id}`, { method: 'DELETE', token }),
  adminPortfolioList: (token) => request('/admin/portfolio', { token }),
  adminPortfolioCreate: (token, payload) => request('/admin/portfolio', { method: 'POST', token, body: payload }),
  adminPortfolioUpdate: (token, id, payload) => request(`/admin/portfolio/${id}`, { method: 'PUT', token, body: payload }),
  adminPortfolioDelete: (token, id) => request(`/admin/portfolio/${id}`, { method: 'DELETE', token }),
  adminAdmins: (token) => request('/admin/admins', { token }),
  adminAdminCreate: (token, payload) => request('/admin/admins', { method: 'POST', token, body: payload }),
  adminAdminDelete: (token, id) => request(`/admin/admins/${id}`, { method: 'DELETE', token }),
  adminUpload: async (token, file) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${BASE}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = new Error(data?.error || `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  },
};

const TOKEN_KEY = 'weblyne-admin-token';
export const auth = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch {} },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY); } catch {} },
};
