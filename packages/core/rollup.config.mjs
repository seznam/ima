import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import jscc from 'rollup-plugin-jscc';
import { createRollupConfig } from '../../createRollupConfig.mjs';

function generateConfig(environment) {
  return createRollupConfig({
    external: [
      '@ima/helpers',
      'classnames',
      'react',
      'react-dom',
      'memoize-one',
      'node-fetch',
      'react-dom/server',
    ].filter(Boolean),
    input: {
      [`ima.${environment}`]: './src/main.js',
    },
    treeshake: {
      moduleSideEffects: 'no-external',
    },
    plugins: [
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
  });
}

export default [generateConfig('server'), generateConfig('client')];
