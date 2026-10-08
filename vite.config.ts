import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';

const blopDevelopmentProxy = {
  target: 'https://www.rcdigitalcreations.co.za',
  changeOrigin: true,
  secure: true,
  rewrite: (path: string) => path.replace(/^\/__blop_dev/, ''),
  configure(proxy) {
    proxy.on('proxyReq', (proxyReq) => {
      // The upstream endpoint requires an explicitly allowed Origin.
      // Never forward the localhost browser Origin to production.
      proxyReq.setHeader('Origin', 'https://ruancoetzee.co.za');
    });
  },
} satisfies ProxyOptions;

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'preserve-legacy-static-files',
      writeBundle(options) {
        const outputDirectory = typeof options.dir === 'string' ? options.dir : resolve(__dirname, 'dist');
        copyFileSync(resolve(__dirname, 'script.js'), resolve(outputDirectory, 'script.js'));
        copyFileSync(resolve(__dirname, '_redirects'), resolve(outputDirectory, '_redirects'));
      },
    },
  ],
  // Development only: same-origin browser requests are forwarded server-side.
  // The production chatbot API retains its strict public-origin allowlist.
  server: {
    proxy: {
      '/__blop_dev/api/chat': blopDevelopmentProxy,
    },
  },
  build: {
    rollupOptions: {
      input: {
        legacy: resolve(__dirname, 'index.html'),
        reactPreview: resolve(__dirname, 'react-preview.html'),
      },
    },
  },
});
