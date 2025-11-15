// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://mk-162.github.io',
  base: '/psyc-direct',
  vite: {
    plugins: [tailwindcss()]
  }
});