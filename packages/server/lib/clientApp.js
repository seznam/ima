const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const instanceRecycler = require('./instanceRecycler.js');
const { processContent } = require('@ima/helpers');
const errorToJSON = require('error-to-json').default;
const Cache = require('./cache.js').Cache;

module.exports = (environment, logger, languageLoader, appFactory) => {
  const app = appFactory();

  const runner = fs.readFileSync('./build/static/public/runner.js', 'utf8');
  const spaTemplate = ejs.compile(
    fs.readFileSync('./build/static/public/spa.html', 'utf8'),
    { cache: true, filename: 'spa.html' }
  );

  const errorTemplate = ejs.compile(
    fs.readFileSync(path.resolve(__dirname, './error-view/index.ejs'), 'utf8'),
    {
      cache: true,
      filename: 'error.html',
    }
  );

  const spaCache = new Cache(
    Object.assign({}, environment.$Server.cache, {
      cacheKeyGenerator: null,
    })
  );

  async function _displayDetails(err, req, res) {
    res.status(500);

    if (!err || !err?.stack) {
      logger.error('Failed to display error page', {
        error: errorToJSON(err),
      });

      res.send(err.stack);
    } else {
      res.send(
        errorTemplate({
          devServerPublic: process.env.IMA_CLI_DEV_SERVER_PUBLIC_URL,
          serverError: {
            name: err.name,
            message: err.message,
            stack: err.stack.toString(),
          },
        })
      );
    }
  }

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
      const filePath = './build/static/public/error.html';
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
        error: null,
      });
    }

    return new Promise((resolve, reject) => {
      if (!spaTemplate) {
        return showStaticErrorPage(
          new Error('Unable to render SPA template'),
          req,
          res
        ).then(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      }

      let content = processContent({
        content: spaTemplate(bootConfig.settings),
        SPA: true,
        settings: bootConfig.settings,
        runner,
      });

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
      pageState: {},
    });
  }

  function _isServerOverloaded() {
    return (
      environment.$Server.overloadConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.overloadConcurrency
    );
  }

  function _hasToServeSPA(req, app) {
    // Force SPA if enabled through cli option
    if (environment.$Env === 'dev' && process.env.IMA_CLI_FORCE_SPA) {
      return true;
    }

    const userAgent = req.headers['user-agent'] || '';
    const spaConfig = environment.$Server.serveSPA;
    const isAllowedServeSPA = spaConfig.allow;
    const isServerBusy = instanceRecycler.hasReachedMaxConcurrentRequests();
    const isAllowedUserAgent = !(
      spaConfig.blackList &&
      typeof spaConfig.blackList === 'function' &&
      spaConfig.blackList(userAgent)
    );
    let canBeRouteServeAsSPA = true;
    const routeInfo = _getRouteInfo(app);

    if (routeInfo && routeInfo.route.getOptions().allowSPA === false) {
      canBeRouteServeAsSPA = false;
    }

    return (
      isAllowedServeSPA &&
      isServerBusy &&
      isAllowedUserAgent &&
      canBeRouteServeAsSPA
    );
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
          dictionary: dictionary,
        },
        router: {
          $Protocol: protocol,
          $Host: host,
          $Path: urlPath,
          $Root: root,
          $LanguagePartPath: languagePartPath,
        },
      },
      settings: {
        $Debug: environment.$Debug,
        $Env: environment.$Env,
        $Version: environment.$Version,
        $App: environment.$App || {},
        $Source: environment.$Source,
        $Protocol: protocol,
        $Language: language,
        $Host: host,
        $Path: urlPath,
        $Root: root,
        $LanguagePartPath: languagePartPath,
      },
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
      app.oc.get('$Router').redirect(error.getParams().url, {
        httpStatus: error.getHttpStatus(),
        headers: error.getParams().headers,
      });
      instanceRecycler.clearInstance(app);
      promise = Promise.resolve({
        content: null,
        pageState: {},
        status: error.getHttpStatus(),
        error: error,
      });
    } catch (e) {
      promise = _applyError(e, req, res, app);
    }

    return promise;
  }

  function _importAppMain() {
    let mainJs = app;

    if (environment.$Env === 'dev') {
      let updatedMainJs = appFactory();

      if (updatedMainJs) {
        instanceRecycler.clear();
        mainJs = updatedMainJs;
      } else {
        Promise.reject();
      }
    }

    if (!instanceRecycler.isInitialized()) {
      instanceRecycler.init(
        mainJs.ima.createImaApp,
        environment.$Server.concurrency
      );
    }

    return Promise.resolve(mainJs);
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
        error: error,
      });

      _displayDetails(error, req, res);
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
        error: errorToJSON(e),
      });
    }

    return routeInfo;
  }

  function _addImaToResponse(req, res, app) {
    let routeName = 'other';
    let routeInfo = _getRouteInfo(app);

    if (routeInfo) {
      routeName = routeInfo.route.getName();
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
      appFactory();
    }

    return _importAppMain()
      .then(appMain => {
        let app = _initApp(req, res, appMain);
        _addImaToResponse(req, res, app);

        if (_hasToServeSPA(req, app)) {
          instanceRecycler.clearInstance(app);
          return showStaticSPAPage(req, res);
        }

        if (_isServerOverloaded()) {
          instanceRecycler.clearInstance(app);
          return _overloadHandler(req, res);
        }

        return _generateResponse(req, res, app);
      })
      .catch(err => {
        _displayDetails(err, req, res);

        return err;
      });
  }

  return {
    getBootConfig,
    errorHandler,
    requestHandler,
    showStaticErrorPage,
    showStaticSPAPage,
  };
};
