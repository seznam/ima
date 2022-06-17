import { createRollupConfig } from '../../createRollupConfig.mjs';

export default createRollupConfig(baseConfig => ({
  ...baseConfig,
  input: {
    main: './index.js',
  },
}));
