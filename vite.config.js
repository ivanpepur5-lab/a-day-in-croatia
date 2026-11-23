import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';
import { sanitizeSiteUrl } from './src/config.js';

function buildId() {
  const commit = process.env.COMMIT_REF?.slice(0, 7) || (() => {
    try {
      return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      return 'local';
    }
  })();
  return `${new Date().toISOString().slice(0, 10)}-${commit}`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Netlify exposes the site's main URL as process.env.URL during builds.
  const netlifyUrl = sanitizeSiteUrl(process.env.URL || '');
  const siteUrl = sanitizeSiteUrl(env.VITE_SITE_URL) || netlifyUrl;

  return {
    plugins: [
      react(),
      {
        name: 'site-meta',
        // Absolute og:image / og:url when a production URL is known.
        transformIndexHtml(html) {
          const og = siteUrl ? `${siteUrl}/og-image.jpg` : '/og-image.jpg';
          const ogUrl = siteUrl ? `<meta property="og:url" content="${siteUrl}/" />` : '';
          return html.replace('%OG_IMAGE%', og).replace('<!--OG_URL-->', ogUrl);
        },
      },
    ],
    define: {
      __NETLIFY_SITE_URL__: JSON.stringify(netlifyUrl),
      __BUILD_ID__: JSON.stringify(buildId()),
    },
    // relative asset URLs: works at a site root (Netlify) and under a sub-path (previews)
    base: './',
    build: { target: 'es2020', sourcemap: false },
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.{js,jsx}'],
    },
  };
});
