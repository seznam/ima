import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import jscc from 'rollup-plugin-jscc';

const { vendors } = require('./build');

function generateConfig(environment) {
  return {
    external: vendors.common,
    input: 'src/main.js',
    treeshake: {
      pureExternalModules: true
    },
    output: [
      {
        file: `./dist/ima.${environment}.cjs.js`,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: `./dist/ima.${environment}.esm.js`,
        format: 'esm',
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins: [
      json({
        preferConst: true, // Default: false
        compact: true, // Default: false
        namedExports: true // Default: true
      }),
      replace({
        "path.dirname(path.resolve('@ima/core'))":
          "path.dirname(require.resolve('@ima/core'))",
        delimiters: ['', '']
      }),
      jscc({
        values: { _SERVER: environment === 'server' }
      })
    ]
  };
}

const config = [generateConfig('server'), generateConfig('client')];

export default config;
