import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import html from 'rollup-plugin-html-string';

export default {
  input: {
    imaHmrClient: './src/imaHmrClient.ts',
    fastRefreshClient: './src/fastRefreshClient.ts',
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
      format: 'cjs',
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
  plugins: [html(), typescript(), nodeResolve(), commonjs()],
};
