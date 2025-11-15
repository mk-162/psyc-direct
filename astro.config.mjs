// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://psyc-direct.vercel.app',
  // Remove base for Vercel (root domain deployment)
  vite: {
    plugins: [tailwindcss()]
  }
});