const ignorePaths = /(node_modules\/(?!@ima).*)/;

/**
 * This ima config makes sure that webpack watches changes
 * in node modules @ima/* directories. This is useful during
 * development of new ima features.
 *
 * @type import('@ima/cli').ImaConfig
 */
module.exports = {
  publicPath: '/static/',
  watchOptions: {
    ignored: ignorePaths,
  },
  webpack: async (config, ctx) => {
    if (ctx.command === 'dev') {
      config.snapshot = {
        ...config.snapshot,
        managedPaths: [ignorePaths],
      };
    }

    return config;
  },
};
