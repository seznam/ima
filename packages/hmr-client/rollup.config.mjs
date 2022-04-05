import typescript from '@rollup/plugin-typescript';

import { createRollupConfig } from '../../createRollupConfig.mjs';

export default createRollupConfig(config => ({
  ...config,
  input: {
    imaHmrClient: './src/imaHmrClient.ts',
    fastRefreshClient: './src/fastRefreshClient.ts',
  },
  plugins: [...config.plugins, typescript()],
}));
