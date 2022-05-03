import typescript from '@rollup/plugin-typescript';

import { createRollupConfig } from '../../createRollupConfig.mjs';

export default createRollupConfig(baseConfig => ({
  ...baseConfig,
  input: {
    imaHmrClient: './src/imaHmrClient.ts',
    fastRefreshClient: './src/fastRefreshClient.ts',
  },
  plugins: [...baseConfig.plugins, typescript()],
}));
