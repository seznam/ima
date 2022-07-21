import typescript from '@rollup/plugin-typescript';

import { createRollupConfig } from '../../createRollupConfig.mjs';

export default createRollupConfig(baseConfig => ({
  ...baseConfig,
  input: {
    index: './src/index.ts'
  },
  plugins: [...baseConfig.plugins, typescript()],
}));
