function createRollupConfig(config = {}) {
  return {
    input: {
      main: './src/main.js',
    },
    output: [
      {
        dir: './dist',
        entryFileNames: '[name].cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        dir: './dist',
        entryFileNames: '[name].js',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        dir: './dist',
        entryFileNames: '[name].mjs',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
    ],
    ...config,
  };
}

export { createRollupConfig };
