import { typescriptDeclarationsPlugin } from '../plugins/typescriptDeclarationsPlugin';
import { ImaPluginConfig } from '../types';

const stylesRe = /\.(less|css)$/i;

export const defaultConfig: ImaPluginConfig = {
  inputDir: './src',
  target: 'es2024',
  output: [
    {
      dir: './dist/esm',
      format: 'es6',
      exclude: stylesRe,
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
      exclude: stylesRe,
    },
    {
      dir: './dist/styles',
      format: 'es6',
      include: stylesRe,
    },
  ],
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

export const clientServerConfig: ImaPluginConfig = {
  ...defaultConfig,
  output: [
    {
      dir: './dist/esm/client',
      format: 'es6',
      bundle: 'client',
      exclude: stylesRe,
    },
    {
      dir: './dist/esm/server',
      format: 'es6',
      bundle: 'server',
      exclude: stylesRe,
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
      exclude: stylesRe,
    },
    {
      dir: './dist/styles',
      format: 'es6',
      include: stylesRe,
    },
  ],
};

export const nodeConfig: ImaPluginConfig = {
  ...defaultConfig,
  output: [
    {
      dir: './dist',
      format: 'commonjs',
    },
  ],
};
