/**
 * Public site configuration.
 *
 * SITE_URL is the production origin printed on share cards and share text.
 * Resolution order (build time):
 *   1. VITE_SITE_URL           — set this in Netlify → Site settings → Environment variables
 *   2. Netlify's built-in URL  — the site's main URL, injected by vite.config.js
 *   3. ''                      — no URL is printed at all
 *
 * It is NEVER taken from window.location, and local/dev hosts are rejected,
 * so a share card can never show "localhost".
 */
/* global __NETLIFY_SITE_URL__ */
const netlifyUrl = typeof __NETLIFY_SITE_URL__ !== 'undefined' ? __NETLIFY_SITE_URL__ : '';

const LOCAL_HOST = /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\]|::1)$/i;

/** Returns a clean https origin, or '' if the value is missing, local or not https. */
export function sanitizeSiteUrl(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') return '';
    const host = url.hostname;
    if (LOCAL_HOST.test(host) || host.endsWith('.local') || host.endsWith('.localhost') || !host.includes('.')) {
      return '';
    }
    return url.origin;
  } catch {
    return '';
  }
}

export const SITE_URL = sanitizeSiteUrl(import.meta.env?.VITE_SITE_URL) || sanitizeSiteUrl(netlifyUrl);

/** "adayincroatia.com" — for printing on images. */
export const SITE_DISPLAY = SITE_URL.replace(/^https:\/\//, '').replace(/^www\./, '');
