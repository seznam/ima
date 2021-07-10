'use strict';

const fs = require('fs');
const instanceRecycler = require('./instanceRecycler.js');
const templateProcessor = require('./templateProcessor.js');
const errorToJSON = require('error-to-json');
const Cache = require('./cache.js').Cache;

// TODO IMA@18 rewrite to ejs
const filePath = './build/static/html/spa.html';
let SPAContent;
let SPAError;
try {
  SPAContent = fs.readFileSync(filePath, 'utf-8');
} catch (error) {
  SPAError = error;
}

module.exports = ({
  environment,
  logger,
  devErrorPage,
  languageLoader,
  appFactory
}) => {
  appFactory();

  const spaCache = new Cache(
    Object.assign({}, environment.$Server.cache, {
      cacheKeyGenerator: null
    })
  );

  function _initApp(req, res, appMain) {
    let bootConfig = getBootConfig(req, res);
    let app = instanceRecycler.getInstance();

    Object.assign(
      bootConfig,
      appMain.getInitialAppConfigFunctions(),
      appMain.ima.getInitialPluginConfig(),
      appMain.ima.getInitialImaConfigFunctions()
    );
    app.bootstrap.run(bootConfig);

    return app;
  }

  function showStaticErrorPage(error, req, res) {
    logger.error(
      'Failed to display error page, displaying the static error page',
      { error: errorToJSON(error) }
    );

    return new Promise((resolve, reject) => {
      const filePath = './build/static/html/error.html';
      fs.readFile(filePath, 'utf-8', (error, content) => {
        let status = 500;
        res.status(status);

        if (error) {
          res.send('500');
          reject(error);
        }

        res.send(content);

        resolve({ content, status, error, SPA: false, pageState: {} });
      });
    });
  }

  function showStaticSPAPage(req, res) {
    let bootConfig = getBootConfig(req, res);
    let status = 200;
    let cachedContent = spaCache.get(req);

    if (cachedContent) {
      res.status(status);
      res.send(cachedContent);

      return Promise.resolve({
        content: cachedContent,
        pageState: {},
        status,
        SPA: true,
        error: null
      });
    }

    return new Promise((resolve, reject) => {
      if (SPAError) {
        return showStaticErrorPage(SPAError, req, res).then(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      }

      let content = templateProcessor(SPAContent, bootConfig.settings);
      spaCache.set(req, content);

      res.status(status);
      res.send(content);

      resolve({ content, status, SPA: true, error: null, pageState: {} });
    });
  }

  function _overloadHandler(req, res) {
    const status = 503;
    const requests = instanceRecycler.getConcurrentRequests() + 2;

    res.status(status).send();

    return Promise.resolve({
      content: '',
      status,
      SPA: false,
      error: new Error(
        `The server is overloaded with ${requests} concurrency requests.`
      ),
      pageState: {}
    });
  }

  function _isServerOverloaded() {
    return (
      environment.$Server.overloadConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.overloadConcurrency
    );
  }

  function _hasToServeSPA(req) {
    const userAgent = req.headers['user-agent'] || '';
    const spaConfig = environment.$Server.serveSPA;
    const isAllowedServeSPA = spaConfig.allow;
    const isServerBusy = instanceRecycler.hasReachedMaxConcurrentRequests();
    const isAllowedUserAgent = !(
      spaConfig.blackList &&
      typeof spaConfig.blackList === 'function' &&
      spaConfig.blackList(userAgent)
    );

    return isAllowedServeSPA && isServerBusy && isAllowedUserAgent;
  }

  function getBootConfig(req, res) {
    let language = res.locals.language;
    let languagePartPath = res.locals.languagePartPath;
    let host = res.locals.host;
    let root = res.locals.root;
    let urlPath = res.locals.path;
    let protocol = res.locals.protocol;

    let dictionary = languageLoader(language);

    let bootConfig = {
      services: {
        request: req,
        response: res,
        $IMA: {},
        dictionary: {
          $Language: language,
          dictionary: dictionary
        },
        router: {
          $Protocol: protocol,
          $Host: host,
          $Path: urlPath,
          $Root: root,
          $LanguagePartPath: languagePartPath
        }
      },
      settings: {
        $Debug: environment.$Debug,
        $Env: environment.$Env,
        $Version: environment.$Version,
        $App: environment.$App || {},
        $Protocol: protocol,
        $Language: language,
        $Host: host,
        $Path: urlPath,
        $Root: root,
        $LanguagePartPath: languagePartPath
      }
    };

    return bootConfig;
  }

  function _applyError(error, req, res, app) {
    let promise;

    try {
      promise = app.oc
        .get('$Router')
        .handleError({ error })
        .then(response => {
          instanceRecycler.clearInstance(app);

          return response;
        })
        .catch(fatalError => {
          instanceRecycler.clearInstance(app);

          return showStaticErrorPage(fatalError, req, res);
        });
    } catch (e) {
      instanceRecycler.clearInstance(app);

      return showStaticErrorPage(e, req, res);
    }

    return promise;
  }

  function _applyNotFound(error, req, res, app) {
    let promise;

    try {
      promise = app.oc
        .get('$Router')
        .handleNotFound({ error })
        .then(response => {
          instanceRecycler.clearInstance(app);

          return response;
        })
        .catch(error => {
          return _applyError(error, req, res, app);
        });
    } catch (e) {
      promise = _applyError(e, req, res, app);
    }

    return promise;
  }

  function _applyRedirect(error, req, res, app) {
    let promise;

    try {
      app.oc
        .get('$Router')
        .redirect(error.getParams().url, { httpStatus: error.getHttpStatus() });
      instanceRecycler.clearInstance(app);
      promise = Promise.resolve({
        content: null,
        pageState: {},
        status: error.getHttpStatus(),
        error: error
      });
    } catch (e) {
      promise = _applyError(e, req, res, app);
    }

    return promise;
  }

  function _importAppMain() {
    return $IMA.Loader.import('app/main').then(appMain => {
      if (!instanceRecycler.isInitialized()) {
        instanceRecycler.init(
          appMain.ima.createImaApp,
          environment.$Server.concurrency
        );
      }

      return appMain;
    });
  }

  function errorHandler(error, req, res, app) {
    let returnPromise;

    if (environment.$Debug) {
      if (app && typeof app !== 'function') {
        instanceRecycler.clearInstance(app);
      }

      returnPromise = Promise.resolve({
        content: null,
        pageState: {},
        status: 500,
        error: error
      });
      devErrorPage(error, req, res);
    } else {
      let appPromise = Promise.resolve(app);

      if (!app) {
        appPromise = _importAppMain().then(appMain => {
          return _initApp(req, res, appMain);
        });
      }

      returnPromise = appPromise
        .then(app => {
          let router = app.oc.get('$Router');
          app.oc.get('$Cache').clear();

          if (router.isClientError(error)) {
            return _applyNotFound(error, req, res, app);
          } else if (router.isRedirection(error)) {
            return _applyRedirect(error, req, res, app);
          } else {
            return _applyError(error, req, res, app);
          }
        })
        .catch(e => {
          appPromise.then(app => {
            instanceRecycler.clearInstance(app);
          });

          return showStaticErrorPage(e, req, res);
        });
    }

    return returnPromise;
  }

  function _getRouteInfo(app) {
    let router = app.oc.get('$Router');
    let routeInfo = null;

    try {
      routeInfo = router.getCurrentRouteInfo();
    } catch (e) {
      logger.warn('Failed to retrieve current route info', {
        error: errorToJSON(e)
      });
    }

    return routeInfo;
  }

  function _addImaToResponse(req, res, app) {
    let routeName = 'other';

    if (app) {
      let routeInfo = _getRouteInfo(app);

      if (routeInfo) {
        routeName = routeInfo.route.getName();
      }
    }

    res.$IMA = res.$IMA || { routeName };
  }

  function _generateResponse(req, res, app) {
    let returnPromise;
    let router = app.oc.get('$Router');

    try {
      returnPromise = router
        .route(router.getPath())
        .then(response => {
          instanceRecycler.clearInstance(app);

          return response;
        })
        .catch(error => {
          return errorHandler(error, req, res, app);
        });
    } catch (e) {
      returnPromise = errorHandler(e, req, res, app);
    }

    return returnPromise;
  }

  function requestHandler(req, res) {
    if (environment.$Env === 'dev') {
      instanceRecycler.clear();

      Object.keys($IMA.Loader.modules).forEach(modulePath => {
        let module = global.$IMA.Loader.modules[modulePath];

        global.$IMA.Loader.modules[modulePath] = Object.assign({}, module, {
          instance: null,
          dependencyOf: [],
          dependencies: module.dependencies.slice()
        });
      });

      appFactory();
    }

    return _importAppMain().then(appMain => {
      if (_hasToServeSPA(req)) {
        _addImaToResponse(req, res);
        return showStaticSPAPage(req, res);
      }

      let app = _initApp(req, res, appMain);
      _addImaToResponse(req, res, app);

      if (_isServerOverloaded()) {
        instanceRecycler.clearInstance(app);
        return _overloadHandler(req, res);
      }

      return _generateResponse(req, res, app);
    });
  }

  return {
    getBootConfig,
    errorHandler,
    requestHandler,
    showStaticErrorPage,
    showStaticSPAPage
  };
};
