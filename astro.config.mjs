import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';

// Unofficial reproduction of tej.as — for study purposes only.
// Not affiliated with or endorsed by the site's owner.
export default defineConfig({
  output: 'static',
  site: 'http://localhost:4321',
  trailingSlash: 'never',
  integrations: [solidJs()],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
