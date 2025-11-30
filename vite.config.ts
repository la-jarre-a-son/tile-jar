import path from 'path';
import crypto from 'crypto';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { plugin as mdPlugin, Mode } from 'vite-plugin-markdown';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), mdPlugin({ mode: [Mode.REACT] })],
  css: {
    modules: {
      scopeBehaviour: 'local', // everything local by default
      generateScopedName: (className, filePath) => {
        const fileName = path.basename(filePath, '.module.scss');
        const hash = crypto.createHash('sha256').update(fileName.concat(className)).digest('hex').substring(0, 5);
        return `${fileName}${className.startsWith('-') ? '' : '-'}${className}_${hash}`;
      },
    },
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import'],
        loadPaths: ['./node_modules/@la-jarre-a-son/ui/lib/theme/jar'],
      },
    },
  },
});
