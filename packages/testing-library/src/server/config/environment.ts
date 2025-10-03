import type { AppEnvironment } from '@ima/core';
import type { Request } from 'express';

const environment: AppEnvironment = {
  /**
   * The production environment is used as a base template for other
   * environment configurations. Meaning that all `dev` or `test` env
   * definitions are deeply merged into `prod` base config.
   *
   * So you can only define other-env specific overrides without the need
   * to re-define whole custom configuration.
   */
  prod: {
    $Version: '1.0.0',
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
        proxyReqPathResolver: (request: Request) => `/api/v1${request.url}`,
      },
    },
  },
};

const { prod } = environment;

export { prod };
