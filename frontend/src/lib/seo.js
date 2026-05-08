import { useEffect } from 'react';

export const SITE_URL = 'https://weblyne.vercel.app';
export const SITE_NAME = 'Weblyne';
export const DEFAULT_OG = `${SITE_URL}/og-image.png`;

function setMeta(selector, attr, value) {
  if (value == null) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [, key] = selector.match(/\[([^=]+)="([^"]+)"\]/) || [];
    if (key) {
      const prop = selector.startsWith('meta[property')
        ? 'property'
        : 'name';
      const name = selector.match(/="([^"]+)"\]/)?.[1];
      el.setAttribute(prop, name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (data == null) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Set per-page SEO. Pass title, description, path (e.g. "/about"),
 * optional image, optional jsonLd object (for BlogPosting etc.)
 */
export function useSeo({ title, description, path = '', image, jsonLd, jsonLdId = 'page-jsonld', noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Web Design & Development Studio in Biratnagar, Nepal`;
    const url = `${SITE_URL}${path || '/'}`;
    const desc = description || 'Modern websites, web apps and SEO for Nepali businesses. Built from Biratnagar.';
    const img = image || DEFAULT_OG;

    document.title = fullTitle;

    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setLink('canonical', url);

    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', img);

    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', img);

    if (jsonLd) setJsonLd(jsonLdId, jsonLd);
    return () => { if (jsonLd) setJsonLd(jsonLdId, null); };
  }, [title, description, path, image, JSON.stringify(jsonLd), jsonLdId, noindex]);
}
