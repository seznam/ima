const pkgJson = require('../../package.json');

module.exports = (() => {
  return {
    /**
     * The production environment is used as a base template for other
     * environment configurations. Meaning that all `dev` or `test` env
     * definitions are deeply merged into `prod` base config.
     *
     * So you can only define other-env specific overrides without the need
     * to re-define whole custom configuration.
     */
    prod: {
      /**
       * Enable/disable debug mode. When enabled you can see additional
       * error messages while this also enable some additional validation
       * that can produce additional errors.
       */
      $Debug: false,
      $Version: pkgJson.version,
      /*
       * Key-value pairs used for configuring the languages used with
       * specific hosts or starting paths.
       *
       * - Key: Has to start with '//' instead of a protocol, and you can
       *        define the root path. Optional parameter ":language"
       *        could be defined at the end to display language in the
       *        URL.
       *
       * - Value: Language to use when the key is matched by the current
       *          URL. If the ":language" parameter is used, the language
       *          specified in this value is used as the default language
       *          when the path part specifying the language is not
       *          present in the current URL.
       */
      $Language: {
        '//*:*': 'en',
      },
      $Server: {
        /**
         * When defined it overrides any other protocol and
         * host settings in the urlParser hook.
         */
        // protocol: 'https',
        // host: 'localhost',
        /**
         * The port at which the server listens for incoming HTTP connections
         */
        port: 3001,
        /**
         * Base path, which serves static files form the build folder,
         * see https://imajs.io/cli/ima-config-js/#publicpath for more info.
         * Used in staticPath middleware definition in app.js.
         */
        staticPath: '/static',
        /**
         * The number of application instances (not threads) used to handle
         * concurrent connections within a single thread.
         */
        concurrency: 100,
        /**
         * When the number of concurrent connection exceeds the `staticConcurrency`,
         * the server response with static files for 4xx and 5xx.
         */
        staticConcurrency: 100,
        /**
         * When the number of concurrent connection exceeds the `overloadConcurrency`,
         * the server response with 503 status code.
         */
        overloadConcurrency: 100,
        /**
         * Define the number of server processes you want to start.
         * Use `null` for the current number of available CPU cores.
         */
        clusters: null,
        /**
         * SPA mode means, that the server-side-render is completely disabled
         * and clients receive base template generated from spa.ejs file
         * with app root html and static files, which initialize the app
         * only on client-side. This negates some performance impacts of SSR
         * on the app server.
         */
        serveSPA: {
          /**
           * When enabled, and the number of concurrent connection exceeds the concurrency,
           * the server will serve the application in SPA mode (without server-side rendering)
           */
          allow: true,
          /**
           * These user agents will always be served a server-rendered page.
           */
          blackList: userAgent =>
            new RegExp('Googlebot|SeznamBot', 'g').test(userAgent),
        },
        cache: {
          // boolean, or function(Express.Request): boolean
          enabled: false,
          // null or function(Express.Request): string
          cacheKeyGenerator: null,
          // the maximum time a cache entry is kept
          entryTtl: 60 * 60 * 1000, // milliseconds
          // the time after which the unused entries are discarded
          unusedEntryTtl: 15 * 60 * 1000, // milliseconds
          // the maximum entries in cache
          maxEntries: 500,
        },
        logger: {
          /**
           * Use "simple", "JSON" or "dev". "dev" option produces colorful output
           * with source-mapping of error stacks. This is usefull in development.
           */
          formatting: 'simple',
        },
      },
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
    test: {
      $Server: {
        // Force client SPA app for integration tests
        concurrency: 0,
      },
    },
    dev: {
      $Debug: true,
      $Language: {
        '//*:*': 'en',
      },
      $Server: {
        concurrency: 1,
        logger: {
          formatting: 'dev',
        },
      },
      $Proxy: {
        server: 'localhost:3001',
        options: {
          proxyReqPathResolver: request => `/api${request.url}`,
        },
      },
    },
  };
})();
