import { createRollupConfig } from '../../createRollupConfig.mjs';
import jscc from 'rollup-plugin-jscc';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';

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
    ].filter(Boolean),
    input: {
      [`${environment}`]: './src/index.ts',
    },
    treeshake: {
      moduleSideEffects: 'no-external',
    },
    plugins: [
      typescript(),
      json({
        preferConst: true,
        compact: true,
        namedExports: true,
      }),
      replace({
        "path.dirname(path.resolve('@ima/core'))":
          "path.dirname(require.resolve('@ima/core'))",
        delimiters: ['', ''],
        preventAssignment: true,
      }),
      jscc({
        values: { _SERVER: environment === 'server' },
      }),
    ],
  }));
}

export default [generateConfig('server'), generateConfig('client')];

