import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  build: {
    rollupOptions: {
      input: {
        legacy: resolve(__dirname, 'index.html'),
        reactPreview: resolve(__dirname, 'react-preview.html'),
      },
    },
  },
});
