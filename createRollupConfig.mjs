import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

function createRollupConfig(callback) {
  return callback({
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
    plugins: [nodeResolve(), commonjs()],
  });
}

export { createRollupConfig };
