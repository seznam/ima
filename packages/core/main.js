import vendorLinker from './vendorLinker';
import ns from './namespace';
import ObjectContainer from './ObjectContainer';
import Bootstrap from './Bootstrap';

import initBindIma from './config/bind';
import initServicesIma from './config/services';

function getInitialImaConfigFunctions() {
  return { initBindIma, initServicesIma };
}

function getNamespace() {
  return ns;
}

function getInitialPluginConfig() {
  return { plugins: vendorLinker.getImaPlugins() };
}

function _getRoot() {
  return _isClient() ? window : global;
}

function _isClient() {
  return typeof window !== 'undefined' && window !== null;
}

function createImaApp() {
  let oc = new ObjectContainer(ns);
  let bootstrap = new Bootstrap(oc);

  return { oc, bootstrap };
}

function getClientBootConfig(initialAppConfigFunctions) {
  let root = _getRoot();

  if ($Debug && _isClient()) {
    if ($IMA.$Protocol !== root.location.protocol) {
      throw new Error(
        `Your client's protocol is not same as server's protocol. ` +
          `For right setting protocol on the server site set ` +
          `'X-Forwarded-Proto' header.`
      );
    }

    if ($IMA.$Host !== root.location.host) {
      throw new Error(
        `Your client's host is not same as server's host. For right ` +
          `setting host on the server site set 'X-Forwarded-Host' ` +
          `header.`
      );
    }
  }

  let bootConfig = {
    services: {
      respond: null,
      request: null,
      $IMA: $IMA,
      dictionary: {
        language: $IMA.$Language,
        dictionary: $IMA.i18n
      },
      router: {
        $Protocol: $IMA.$Protocol,
        $Host: $IMA.$Host,
        $Path: $IMA.$Path,
        $Root: $IMA.$Root,
        $LanguagePartPath: $IMA.$LanguagePartPath
      }
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
      $LanguagePartPath: $IMA.$LanguagePartPath
    }
  };

  return Object.assign(
    bootConfig,
    initialAppConfigFunctions,
    getInitialPluginConfig(),
    getInitialImaConfigFunctions()
  );
}

function bootClientApp(app, bootConfig) {
  app.bootstrap.run(bootConfig);

  $IMA.$Dispatcher = app.oc.get('$Dispatcher');

  let cache = app.oc.get('$Cache');
  cache.deserialize($IMA.Cache || {});

  return app;
}

function routeClientApp(app) {
  let router = app.oc.get('$Router');

  return router
    .listen()
    .route(router.getPath())
    .catch(error => {
      if (typeof $IMA.fatalErrorHandler === 'function') {
        $IMA.fatalErrorHandler(error);
      } else {
        console.warn(
          'Define function config.$IMA.fatalErrorHandler in ' + 'services.js.'
        );
      }
    });
}

function hotReloadClientApp(initialAppConfigFunctions) {
  if (!$Debug) {
    return;
  }

  let app = createImaApp();
  let bootConfig = getClientBootConfig(initialAppConfigFunctions);
  app = bootClientApp(app, bootConfig);

  let router = app.oc.get('$Router');
  let pageManager = app.oc.get('$PageManager');
  let currentRouteInfo = router.getCurrentRouteInfo();
  let currentRoute = currentRouteInfo.route;
  let currentRouteOptions = Object.assign({}, currentRoute.getOptions(), {
    onlyUpdate: false,
    autoScroll: false,
    allowSPA: false
  });

  router.listen();

  try {
    return pageManager
      .manage(currentRoute, currentRouteOptions, currentRouteInfo.params)
      .catch(error => {
        return router.handleError({ error });
      })
      .catch(error => {
        if (typeof $IMA.fatalErrorHandler === 'function') {
          $IMA.fatalErrorHandler(error);
        } else {
          console.warn(
            'Define the config.$IMA.fatalErrorHandler function ' +
              'in services.js.'
          );
        }
      });
  } catch (error) {
    return router.handleError({ error });
  }
}

function reviveClientApp(initialAppConfigFunctions) {
  let root = _getRoot();

  //set React for ReactJS extension for browser
  root.React = vendorLinker.get('react');
  root.$Debug = root.$IMA.$Debug;

  let app = createImaApp();
  let bootConfig = getClientBootConfig(initialAppConfigFunctions);
  app = bootClientApp(app, bootConfig);

  return routeClientApp(app).then(pageInfo => {
    return Object.assign({}, pageInfo || {}, { app, bootConfig });
  });
}

function onLoad() {
  vendorLinker.bindToNamespace(ns);

  if (!_isClient()) {
    return Promise.reject(null);
  }

  if (document.readyState !== 'loading') {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', () => resolve(), {
      once: true
    });
  });
}

export {
  getInitialImaConfigFunctions,
  getNamespace,
  getInitialPluginConfig,
  createImaApp,
  getClientBootConfig,
  bootClientApp,
  routeClientApp,
  hotReloadClientApp,
  reviveClientApp,
  onLoad
};
