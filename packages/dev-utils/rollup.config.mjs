import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: './index.ts',
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
  plugins: [typescript(), nodeResolve(), commonjs()],
};
