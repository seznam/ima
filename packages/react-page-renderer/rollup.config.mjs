import typescript from '@rollup/plugin-typescript';
import jscc from 'rollup-plugin-jscc';

import { createRollupConfig } from '../../createRollupConfig.mjs';

function generateConfig(environment) {
  return createRollupConfig(baseConfig => ({
    ...baseConfig,
    external: [
      '@ima/core',
      '@ima/helpers',
      'classnames',
      'memoize-one',
      'react-dom',
      'react-dom/client',
      'react-dom/server',
      'react',
    ],
    input: {
      [`${environment}`]: './src/index.ts',
    },
    plugins: [
      jscc({
        asloader: false,
        values: { _SERVER: environment === 'server' },
      }),
      typescript(),
    ],
  }));
}

export default [generateConfig('server'), generateConfig('client')];
