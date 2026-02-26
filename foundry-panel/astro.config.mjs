import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  vite: {
    compatibilityDate: '2024-11-08',
    build: {
      target: 'esnext',
    },
    ssr: {
      external: ['node:path', 'node:fs', 'node:fs/promises', 'node:url', 'node:crypto'],
    },
  },
});
