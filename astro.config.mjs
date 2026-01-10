import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://flickai.net',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar', 'de', 'es', 'fr', 'hi', 'id', 'it', 'ro', 'zh'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true,
      fallbackType: 'redirect'
    }
  },

  output: 'static',

  build: {
    format: 'directory'
  },

  trailingSlash: 'always',

  integrations: [sitemap(), mdx()],

  vite: {
    plugins: [tailwindcss()]
  }
});