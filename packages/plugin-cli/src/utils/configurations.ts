import { typescriptDeclarationsPlugin } from '../plugins/typescriptDeclarationsPlugin.js';
import { ImaPluginConfig } from '../types.js';

export const defaultConfig: ImaPluginConfig = {
  inputDir: './src',
  outDir: './dist',
  target: 'es2024',
  plugins: [
    typescriptDeclarationsPlugin({
      additionalArgs: ['--skipLibCheck'],
    }),
  ],
  exclude: [
    '**/__snapshots__/**',
    '**/__tests__/**/*Spec*',
    '**/node_modules/**',
    '**/dist/**',
    '**/typings/**',
    '**/.DS_Store/**',
    'tsconfig.tsbuildinfo',
  ],
};
