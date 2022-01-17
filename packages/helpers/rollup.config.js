import json from '@rollup/plugin-json';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

function createRollupConfig() {
  const config = {
    input: 'src/main.js',
    treeshake: {
      moduleSideEffects: 'no-external'
    },
    plugins: [
      json({
        preferConst: true,
        compact: true,
        namedExports: true
      })
    ]
  };

  return config;
}

function createRollupESConfig() {
  let config = createRollupConfig();

  config.output = [
    {
      dir: './dist',
      entryFileNames: '[name].cjs',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      dir: './dist',
      entryFileNames: '[name].js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      dir: './dist',
      entryFileNames: '[name].mjs',
      format: 'esm',
      exports: 'named',
      sourcemap: true
    }
  ];

  return config;
}

function createRollupES5Config() {
  let config = createRollupConfig();

  config.output = [
    {
      dir: './dist',
      entryFileNames: '[name].es5.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      plugins: [
        getBabelOutputPlugin({
          babelrc: false,
          moduleIds: true,
          presets: [
            [
              '@babel/preset-env',
              {
                modules: 'auto',
                useBuiltIns: 'usage',
                corejs: { version: 3, proposals: true }
              }
            ]
          ]
        })
      ]
    }
  ];

  return config;
}

export default [createRollupESConfig(), createRollupES5Config()];
