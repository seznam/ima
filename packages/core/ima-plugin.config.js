import { defaultConfig } from '@ima/plugin-cli';

/**
 * @type {import('@ima/plugin-cli').ImaPluginConfig}
 */
export default {
  ...defaultConfig,
  additionalWatchPaths: ['./transform', './polyfill', './setupJest.js'],
};
