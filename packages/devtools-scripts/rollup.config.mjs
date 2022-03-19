import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { createRollupConfig } from '../../createRollupConfig.mjs';

export default createRollupConfig({
  treeshake: false,
  plugins: [nodeResolve(), commonjs()],
});
