import anymatch from 'anymatch';

import { typescriptDeclarationsPlugin } from '../plugins/typescriptDeclarationsPlugin';
import { ImaPluginConfig } from '../types';

function jsSourceTest(filePath: string) {
  const jsRe = /\.(jsx?|tsx?)$/i;
  const excludeRe = /__tests__/;

  return jsRe.test(filePath) && !excludeRe.test(filePath);
}

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
      include: jsSourceTest,
    },
  ],
  plugins: [
    typescriptDeclarationsPlugin({ additionalArgs: ['--skipLibCheck'] }),
  ],
  exclude: (filePath: string) => {
    // Include suite files
    if (filePath.includes('__tests__') && !filePath.endsWith('__tests__')) {
      return !anymatch(['**/*Suite*'], filePath);
    }

    return anymatch(
      [
        '**/node_modules/**',
        '**/dist/**',
        '**/typings/**',
        '**/.DS_Store/**',
        'tsconfig.tsbuildinfo',
      ],
      filePath
    );
  },
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
      include: jsSourceTest,
    },
    {
      dir: './dist/cjs',
      format: 'commonjs',
      include: jsSourceTest,
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
