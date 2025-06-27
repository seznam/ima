import { autoYield, nextFrameYield } from '@esmj/task';
import { Request as ExpressRequest } from 'express';
import { PartialDeep, RequiredDeep } from 'type-fest';
import { AssetInfo } from 'webpack';

import {
  BootConfig,
  Bootstrap,
  InitAppConfig,
  InitImaConfig,
} from './Bootstrap';
import { SerializedData } from './cache/Cache';
import { initBind as initBindIma } from './config/bind';
import { initServices as initServicesIma } from './config/services';
import { GenericError } from './error/GenericError';
import { HttpAgentRequestOptions } from './http/HttpAgent';
import { HttpAgentImplCacheOptions } from './http/HttpAgentImpl';
import { ns } from './Namespace';
import { ObjectContainer } from './oc/ObjectContainer';
import { pluginLoader } from './pluginLoader';
import { RouteAction } from './router/Router';
import { GlobalImaObject } from './types';

export interface ManifestAsset extends AssetInfo {
  name: string;
}

export interface Manifest {
  assets: Record<string, ManifestAsset>;
  assetsByCompiler: Record<
    'server' | 'client' | 'client.es',
    Record<string, ManifestAsset>
  >;
  publicPath: string;
}

export type Resource =
  | string
  | [
      string,
      {
        [attribute: string]: unknown;
        fallback: boolean;
      },
    ];

export interface Resources {
  styles: Resource[];
  scripts: Resource[];
  esScripts: Resource[];
}

/**
 * App environment for single env key.
 *
 * The production environment is used as a base template for other
 * environment configurations. Meaning that all `dev` or `test` env
 * definitions are deeply merged into `prod` base config.
 *
 * So you can only define other-env specific overrides without the need
 * to re-define whole custom configuration.
 */
export interface Environment {
  [key: string]: unknown;
  /**
   * Enable/disable debug mode. When enabled you can see additional
   * error messages while this also enable some additional validation
   * that can produce additional errors.
   */
  $Debug?: GlobalImaObject['$Debug'];

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
  $Language?: Record<string, string>;
  $Version: GlobalImaObject['$Version'];
  $App?: GlobalImaObject['$App'];
  $Resources?: (
    response: unknown,
    manifest: Manifest,
    defaultResources: Resources
  ) => Resources;
  $Server?: {
    /**
     * When defined it overrides any other protocol
     * settings in the urlParser hook.
     */
    protocol?:
      | GlobalImaObject['$Protocol']
      | (({
          environment,
          protocol,
          req,
        }: {
          environment: Environment;
          protocol: string;
          req: ExpressRequest;
        }) => GlobalImaObject['$Protocol']);

    /**
     * When defined it overrides any other
     * host settings in the urlParser hook.
     */
    host?:
      | string
      | (({
          environment,
          host,
          req,
        }: {
          environment: Environment;
          host: string;
          req: ExpressRequest;
        }) => string);

    /**
     * The port at which the server listens for incoming HTTP connections
     */
    port?: number;

    /**
     * Base path, which serves static files form the build folder,
     * see https://imajs.io/cli/ima-config-js/#publicpath for more info.
     * Used in staticPath middleware definition in app.js.
     */
    staticPath?: string;

    /**
     * The number of application instances (not threads) used to handle
     * concurrent connections within a single thread.
     */
    concurrency?: number;

    /**
     * When the number of concurrent connection exceeds the `staticConcurrency`,
     * the server response with static files for 4xx and 5xx.
     */
    staticConcurrency?: number;

    /**
     * When the number of concurrent connection exceeds the `overloadConcurrency`,
     * the server response with 503 status code.
     */
    overloadConcurrency?: number;

    /**
     * Define the number of server processes you want to start.
     * Use `null` for the current number of available CPU cores.
     */
    clusters?: null | number;

    /**
     * SPA mode means, that the server-side-render is completely disabled
     * and clients receive base template generated from spa.ejs file
     * with app root html and static files, which initialize the app
     * only on client-side. This negates some performance impacts of SSR
     * on the app server.
     */
    serveSPA?: {
      /**
       * When enabled, and the number of concurrent connection exceeds the concurrency,
       * the server will serve the application in SPA mode (without server-side rendering)
       */
      allow?: boolean;

      /**
       * These user agents will always be served a server-rendered page.
       */
      blackList?: (userAgent: string) => boolean;
    };

    /**
     * Cache configuration.
     */
    cache?: {
      /**
       * Enable/disable cache for the server.
       */
      enabled?: boolean | ((req: ExpressRequest) => boolean);

      /**
       * Cache key generator function.
       */
      cacheKeyGenerator?: (req: ExpressRequest) => string;

      /**
       * The maximum time a cache entry is kept.
       */
      entryTtl?: number;

      /**
       * The time after which the unused entries are discarded.
       */
      unusedEntryTtl?: number;

      /**
       * The maximum entries in cache.
       */
      maxEntries?: number;
    };
    logger?: {
      /**
       * Use "simple", "JSON" or "dev". "dev" option produces colorful output
       * with source-mapping of error stacks. This is usefull in development.
       */
      formatting?: 'simple' | 'dev' | 'JSON';
    };
  };
}

/**
 * Environment object after it has been processed by the environmentFactory.
 * It has default values set for all optional properties in the Environment
 * interface.
 *
 * The optional properties are made required since the environmentFactory
 * sets default values for them.
 */
export interface ParsedEnvironment extends RequiredDeep<Environment> {}

/**
 * App Environment structure, used in ./server/config/environment.js
 */
export interface AppEnvironment {
  prod: Environment;
  dev?: PartialDeep<Environment>;
  test?: PartialDeep<Environment>;
  regression?: PartialDeep<Environment>;
}

export interface PageRendererSettings {
  batchResolve?: boolean;
  batchResolveNoTransaction?: boolean;
  masterElementId: string;
  documentView: unknown;
  managedRootView?: unknown;
  viewAdapter?: unknown;
}

/**
 * App settings for single env key.
 */
export interface Settings {
  $Http?: {
    defaultRequestOptions?: Omit<HttpAgentRequestOptions, 'abortController'>;
    cacheOptions?: HttpAgentImplCacheOptions;
  };
  $Router?: {
    /**
     * Middleware execution timeout, see https://imajs.io/basic-features/routing/middlewares#execution-timeout
     * for more information.
     */
    middlewareTimeout?: number;
    isSPARouted?: (url: string, action?: RouteAction) => boolean;
  };
  $Cache?: {
    /**
     * Default time to live for cached value in ms.
     */
    ttl?: number;

    /**
     * Enable cache for all applications.
     */
    enabled?: boolean;
  };
  $Page: {
    $Render: PageRendererSettings;
  };
  $Observable?: {
    maxHistoryLength?: number;
  };
}

/**
 * Default settings provided by the ima core.
 */
export interface DefaultSettings extends Omit<Settings, '$Page'> {}

/**
 * App settings function, used in ./app/config/settings.js
 */
export type AppSettings = {
  prod: Settings;
  dev?: PartialDeep<Settings>;
  test?: PartialDeep<Settings>;
  regression?: PartialDeep<Settings>;
};

export function getInitialImaConfigFunctions(): InitImaConfig {
  return { initBindIma, initServicesIma };
}

export function getInitialPluginConfig() {
  return { plugins: pluginLoader.getPlugins() };
}

export function _getRoot() {
  return _isClient() ? window : global;
}

export function _isClient() {
  return typeof window !== 'undefined' && window !== null;
}

export function createImaApp() {
  const oc = new ObjectContainer(ns);
  const bootstrap = new Bootstrap(oc);
  pluginLoader.init(bootstrap);

  return { oc, bootstrap };
}

export function getClientBootConfig(
  initialAppConfigFunctions: InitAppConfig
): BootConfig {
  const root = _getRoot();

  if ($Debug && _isClient() && !$IMA?.Test) {
    if ($IMA.$Protocol !== root.location.protocol) {
      throw new GenericError(
        `Your client's protocol is not same as server's protocol. ` +
          `For right setting protocol on the server site set ` +
          `'X-Forwarded-Proto' header.`
      );
    }

    if ($IMA.$Host !== root.location.host) {
      throw new GenericError(
        `Your client's host is not same as server's host. For right ` +
          `setting host on the server site set 'X-Forwarded-Host' ` +
          `header.`
      );
    }
  }

  const bootConfig: BootConfig = {
    services: {
      response: null,
      request: null,
      $IMA: $IMA,
      dictionary: {
        $Language: $IMA.$Language,
        dictionary: $IMA.i18n,
      },
      router: {
        $Protocol: $IMA.$Protocol,
        $Host: $IMA.$Host,
        $Root: $IMA.$Root,
        $LanguagePartPath: $IMA.$LanguagePartPath,
      },
    },
    settings: {
      $Debug: $IMA.$Debug,
      $Env: $IMA.$Env,
      $Version: $IMA.$Version,
      $App: $IMA.$App,
      // @ts-expect-error This is intentional for integration testing.
      $Resources: $IMA.$Resources,
      $Protocol: $IMA.$Protocol,
      $Language: $IMA.$Language,
      $Host: $IMA.$Host,
      $Root: $IMA.$Root,
      $LanguagePartPath: $IMA.$LanguagePartPath,
    },
  };

  return {
    ...bootConfig,
    ...initialAppConfigFunctions,
    ...getInitialPluginConfig(),
    ...getInitialImaConfigFunctions(),
  };
}

export function bootClientApp(
  app: {
    bootstrap: Bootstrap;
    oc: ObjectContainer;
  },
  bootConfig: BootConfig
) {
  app.bootstrap.run(bootConfig);

  const cache = app.oc.get('$Cache');
  cache.deserialize(($IMA.Cache || {}) as SerializedData);

  return app;
}

export function routeClientApp(app: {
  bootstrap: Bootstrap;
  oc: ObjectContainer;
}) {
  const router = app.oc.get('$Router');

  return router
    .listen()
    .route(router.getPath())
    .catch((error: GenericError) => {
      if (typeof $IMA.fatalErrorHandler === 'function') {
        $IMA.fatalErrorHandler(error);
      } else {
        console.warn(
          'Define function config.$IMA.fatalErrorHandler in ' + 'services.js.'
        );
      }
    });
}

export async function reviveClientApp(
  initialAppConfigFunctions: InitAppConfig
) {
  await autoYield();
  const root = _getRoot();

  root.$Debug = !!root.$IMA.$Debug;

  let app = createImaApp();
  await autoYield();
  const bootConfig = getClientBootConfig(initialAppConfigFunctions);

  await autoYield();
  app = bootClientApp(app, bootConfig);

  await autoYield();
  return routeClientApp(app).then(pageInfo => {
    return Object.assign({}, pageInfo || {}, { app, bootConfig });
  });
}

export function onLoad() {
  if (!_isClient()) {
    return Promise.reject(null);
  }

  if (document.readyState !== 'loading') {
    return nextFrameYield();
  }

  return new Promise(resolve => {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        return autoYield().then(resolve);
      },
      {
        once: true,
      }
    );
  });
}
