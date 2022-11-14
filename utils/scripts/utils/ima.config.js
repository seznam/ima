/**
 * This ima config makes sure that webpack watches changes
 * in node modules @ima/* directories. This is usefull during
 * development of new ima features.
 *
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  watchOptions: {
    ignored: /(node_modules|build|.husky|_templates|.git)\/(?!@ima).*/,
  },
  webpack: async (config, ctx) => {
    if (ctx.command === 'dev') {
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [/(node_modules\/(?!@ima).*)/],
      };
    }

    return config;
  },
};
