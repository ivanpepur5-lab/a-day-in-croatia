import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { sanitizeSiteUrl } from './src/config.js';

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
    },
    build: { target: 'es2020', sourcemap: false },
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.{js,jsx}'],
    },
  };
});
