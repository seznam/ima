import { typescriptDeclarationsPlugin } from '../plugins/typescriptDeclarationsPlugin';
import { ImaPluginConfig } from '../types';

const jsRe = /\.(jsx?|tsx?)/i;

export const defaultConfig: ImaPluginConfig = {
  inputDir: './src',
  target: 'es2022',
  output: [
    {
      dir: './dist/esm',
      format: 'es6',
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
      include: jsRe,
    },
  ],
  plugins: [
    typescriptDeclarationsPlugin({ additionalArgs: ['--skipLibCheck'] }),
  ],
  exclude: [
    '**/__tests__/**',
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
    },
    {
      dir: './dist/esm/server',
      format: 'es6',
      bundle: 'server',
      include: jsRe,
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
      include: jsRe,
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
