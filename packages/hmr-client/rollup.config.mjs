import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import { createRollupConfig } from '../../createRollupConfig.mjs';

export default createRollupConfig({
  input: {
    imaHmrClient: './src/imaHmrClient.ts',
    fastRefreshClient: './src/fastRefreshClient.ts',
  },
  plugins: [typescript(), nodeResolve(), commonjs()],
});
