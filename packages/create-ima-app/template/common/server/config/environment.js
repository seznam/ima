const pkgJson = require('../../package.json');

module.exports = (() => {
  /**
   * @type import('@ima/core').AppEnvironment
   */
  const environment = {
    prod: {
      $Version: pkgJson.version,
      /**
       * Options for 'express-http-proxy' defined in app.js file. It's purpose
       * is mainly to create proxy to REST API server. This should be used only
       * in development due to performance and possible security concerns.
       */
      $Proxy: {
        // Server route/path at which the proxy will be listening for
        path: '/api',
        // Proxy sever URL
        server: 'example.com',
        // Options to pass to the express-http-proxy
        options: {
          https: true,
          timeout: 10000,
          proxyReqPathResolver: request => `/api/v1${request.url}`,
        },
      },
    },

    dev: {
      $Proxy: {
        server: 'localhost:3001',
        options: {
          proxyReqPathResolver: request => `/api${request.url}`,
        },
      },
    },
  };

  return environment;
})();
