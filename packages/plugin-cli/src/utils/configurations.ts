import { typescriptDeclarationsPlugin } from '../plugins/typescriptDeclarationsPlugin';
import { ImaPluginConfig } from '../types';

export const defaultConfig: ImaPluginConfig = {
  inputDir: './src',
  output: [
    {
      dir: './dist/esm',
      format: 'es6',
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
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
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
    },
  ],
};
