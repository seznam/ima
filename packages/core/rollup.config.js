const config = [
  {
    external: ['ima-helpers', 'classnames', 'prop-types', 'react', 'react-dom'],
    input: 'main.js',
    treeshake: {
      pureExternalModules: true
    },
    output: [
      {
        file: 'dist/ima.cjs.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'dist/ima.es.js',
        format: 'esm',
        exports: 'named'
      }
    ]
  }
];

export default config;
