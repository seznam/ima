import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import jscc from 'rollup-plugin-jscc';

const { vendors } = require('./build');

function generateConfig(environemnt) {
  return {
    external: vendors.common,
    input: 'main.js',
    treeshake: {
      pureExternalModules: true
    },
    output: [
      {
        file: `./dist/ima.${environemnt}.cjs.js`,
        format: 'cjs',
        exports: 'named'
      },
      {
        file: `./dist/ima.${environemnt}.esm.js`,
        format: 'esm',
        exports: 'named'
      }
    ],
    plugins: [
      json({
        preferConst: true, // Default: false
        compact: true, // Default: false
        namedExports: true // Default: true
      }),
      replace({
        "path.dirname(path.resolve('ima'))":
          "path.dirname(require.resolve('ima'))",
        delimiters: ['', '']
      }),
      jscc({
        values: { _SERVER: environemnt === 'server' }
      })
    ]
  };
}

const config = [generateConfig('server'), generateConfig('client')];

export default config;
