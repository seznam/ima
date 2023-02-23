import { AssetInfo } from 'webpack';

import {
  InitAppConfig,
  BootSettings,
  Bootstrap,
  BootConfig,
  InitImaConfig,
} from './Bootstrap';
import { Cache, SerializedData } from './cache/Cache';
import { initBindIma } from './config/bind';
import { initServicesIma } from './config/services';
import { GenericError } from './error/GenericError';
import { HttpAgentRequestOptions } from './http/HttpAgent';
import { HttpAgentImplCacheOptions } from './http/HttpAgentImpl';
import { Namespace, ns } from './Namespace';
import { ObjectContainer } from './ObjectContainer';
import { pluginLoader } from './pluginLoader';
import { AbstractRouter } from './router/AbstractRouter';
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
      }
    ];

export interface Resources {
  styles: Resource[];
  scripts: Resource[];
  esScripts: Resource[];
}

/**
 * App environment for single env key.
 */
export interface Environment {
  [key: string]: unknown;
  $Debug: GlobalImaObject['$Version'];
  $Language: Record<string, string>;
  $Version: GlobalImaObject['$Version'];
  $App: GlobalImaObject['$App'];
  $Resources?: (
    response: unknown,
    manifest: Manifest,
    defaultResources: Resources
  ) => Resources;
  $Server: {
    protocol?: string;
    host?: string;
    port: number;
    staticPath: string;
    concurrency: number;
    staticConcurrency: number;
    overloadConcurrency: number;
    clusters: null | number;
    serveSPA: {
      allow: boolean;
      blackList?: (userAgent: string) => boolean;
    };
    cache: {
      enabled: boolean | ((req: Express.Request) => boolean);
      cacheKeyGenerator?: (req: Express.Request) => string;
      entryTtl: number;
      unusedEntryTtl: number;
      maxEntries: number;
    };
    logger: {
      formatting: 'simple' | 'dev' | 'JSON';
    };
  };
}

/**
 * App Environment structure, used in ./server/config/environment.js
 */
export interface AppEnvironment {
  prod: Environment;
  dev?: Partial<Environment>;
  test?: Partial<Environment>;
  regression?: Partial<Environment>;
}

/**
 * App settings for single env key.
 */
export interface Settings {
  [key: string]: unknown;
  $Version: string;
  $Http: {
    defaultRequestOptions: HttpAgentRequestOptions;
    cacheOptions: HttpAgentImplCacheOptions;
  };
  $Router?: {
    middlewareTimeout?: number;
  };
  $Cache?: {
    ttl?: number;
    enable?: number;
  };
  $Page: {
    $Render: {
      masterElementId: string;
      documentView: unknown;
      managedRootView?: unknown;
      viewAdapter?: unknown;
    };
  };
}

/**
 * App settings function, used in ./app/config/settings.js
 */
export type AppSettings = (
  ns: Namespace,
  oc: ObjectContainer,
  config: BootSettings
) => {
  prod: Settings;
  dev?: Partial<Settings>;
  test?: Partial<Settings>;
  regression?: Partial<Settings>;
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

  if ($Debug && _isClient()) {
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

  return {
    services: {
      request: null,
      response: null,
      $IMA: $IMA,
      dictionary: {
        $Language: $IMA.$Language,
        dictionary: $IMA.i18n,
      },
      router: {
        $Protocol: $IMA.$Protocol,
        $Host: $IMA.$Host,
        $Path: $IMA.$Path,
        $Root: $IMA.$Root,
        $LanguagePartPath: $IMA.$LanguagePartPath,
      },
    },
    settings: {
      $Debug: $IMA.$Debug,
      $Env: $IMA.$Env,
      $Version: $IMA.$Version,
      $App: $IMA.$App,
      $Protocol: $IMA.$Protocol,
      $Language: $IMA.$Language,
      $Host: $IMA.$Host,
      $Path: $IMA.$Path,
      $Root: $IMA.$Root,
      $LanguagePartPath: $IMA.$LanguagePartPath,
    },
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

  const cache = app.oc.get<Cache>('$Cache');
  cache.deserialize(($IMA.Cache || {}) as SerializedData);

  return app;
}

export function routeClientApp(app: {
  bootstrap: Bootstrap;
  oc: ObjectContainer;
}) {
  const router = app.oc.get<AbstractRouter>('$Router');

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

export function reviveClientApp(initialAppConfigFunctions: InitAppConfig) {
  console.error('revive');

  const root = _getRoot();

  root.$Debug = !!root.$IMA.$Debug;

  let app = createImaApp();
  const bootConfig = getClientBootConfig(initialAppConfigFunctions);

  app = bootClientApp(app, bootConfig);

  return routeClientApp(app).then(pageInfo => {
    return Object.assign({}, pageInfo || {}, { app, bootConfig });
  });
}

export function onLoad() {
  if (!_isClient()) {
    return Promise.reject(null);
  }

  if (document.readyState !== 'loading') {
    return new Promise(resolve => setTimeout(resolve, 1000 / 60));
  }

  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', () => resolve(undefined), {
      once: true,
    });
  });
}
