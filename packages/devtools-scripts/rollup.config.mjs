import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  treeshake: false,
  input: './src/main.js',
  output: [
    {
      file: './dist/main.mjs',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [nodeResolve(), commonjs()],
};
