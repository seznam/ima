/**
 * Temporary fix for file extensions requiremen in module resolution for esm modules
 * https://nodejs.org/api/esm.html#mandatory-file-extensions
 */
function modifyWebpackConfig(config) {
  config.module.rules.push(
    {
      /**
       * Allow interop import of .mjs modules.
       */
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
    }
  );

  return config;
};

module.exports = [
  {
    limit: '4 KB',
    path: './dist/client/index.js',
    import: '*',
    running: false,
    modifyWebpackConfig,

  },
  {
    limit: '3 KB',
    path: './dist/server/index.js',
    import: '*',
    running: false,
    modifyWebpackConfig,
  }
];
