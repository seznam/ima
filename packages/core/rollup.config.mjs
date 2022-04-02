import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import jscc from 'rollup-plugin-jscc';

function generateConfig(environment) {
  return {
    external: [
      '@ima/helpers',
      'classnames',
      'react',
      'react-dom',
      'memoize-one',
      ...(environment === 'server' ? ['react-dom/server'] : []),
    ].filter(Boolean),
    input: './src/main.js',
    treeshake: {
      moduleSideEffects: 'no-external',
    },
    output: [
      {
        file: `./dist/ima.${environment}.cjs`,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: `./dist/ima.${environment}.js`,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: `./dist/ima.${environment}.mjs`,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
    ],
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
  };
}

export default [generateConfig('server'), generateConfig('client')];
