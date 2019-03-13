import json from 'rollup-plugin-json';

const config = [
  {
    external: ['ima-helpers', 'classnames', 'prop-types', 'react', 'react-dom'],
    input: 'main.js',
    treeshake: {
      pureExternalModules: true
    },
    output: [
      {
        file: './dist/ima.cjs.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: './dist/ima.es.js',
        format: 'esm',
        exports: 'named'
      }
    ],
    plugins: [
      json({
        preferConst: true, // Default: false
        compact: true, // Default: false
        namedExports: true // Default: true
      })
    ]
  }
];

export default config;
