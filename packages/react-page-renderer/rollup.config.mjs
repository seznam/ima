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
      'react',
      'react-dom',
      'memoize-one',
      'react-dom/server',
    ],
    input: {
      [`${environment}`]: './src/index.ts',
    },
    plugins: [
      typescript(),
      jscc({
        values: { _SERVER: environment === 'server' }
      })
    ],
  }));
}

export default [generateConfig('server'), generateConfig('client')];
