// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';   // ← 新しい推奨のimport

export default defineConfig({
  output: 'server',                      // ← 'hybrid' ではなく 'server'
  adapter: vercel(),                     // そのままでOK
});
