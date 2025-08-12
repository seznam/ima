import { defineConfig, mergeConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from '../../vitest.config.base.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      setupFiles: ['./vitest.setup.js'],
    },
    resolve: {
      alias: [
        {
          find: /^@ima\/react-page-renderer$/,
          replacement: path.resolve(__dirname, './src/index.ts'),
        },
        {
          find: /^@ima\/react-page-renderer\/renderer\/(.*)$/,
          replacement: path.resolve(__dirname, './src/renderer') + '/$1',
        },
      ],
    },
  })
);
