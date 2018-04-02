'use strict';

const fs = require('fs');
const stackTrace = require('stack-trace');
const asyncEach = require('async-each');
const hljs = require('highlight.js');
const sep = require('path').sep;
const errorView = require('./template/errorView.js');
const instanceRecycler = require('./instanceRecycler.js');
const templateProcessor = require('./templateProcessor.js');
const errorToJSON = require('error-to-json');
const Cache = require('./cache.js').Cache;

hljs.configure({
  tabReplace: '  ',
  lineNodes: true
});

module.exports = (environment, logger, languageLoader, appFactory) => {
  appFactory();

  const spaCache = new Cache(
    Object.assign({}, environment.$Server.cache, {
      cacheKeyGenerator: null
    })
  );

  function _displayDetails(err, req, res) {
    let callstack = stackTrace.parse(err);
    let fileIndex = 1;

    logger.error('The application crashed due to an uncaught exception', {
      error: errorToJSON(err)
    });

    asyncEach(
      callstack,
      (stackFrame, cb) => {
        // exclude core node modules and node modules
        if (
          !stackFrame.fileName ||
          !stackFrame.fileName.includes(sep) ||
          /node_modules/.test(stackFrame.fileName) ||
          /internal/.test(stackFrame.fileName)
        ) {
          return cb();
        }

        fs.readFile(stackFrame.fileName, 'utf-8', (err, content) => {
          if (err) {
            return cb(err);
          }

          content = hljs.highlight('javascript', content);

          // start a few lines before the error or at the beginning of
          // the file
          let start = Math.max(stackFrame.lineNumber - 11, 0);
          let lines = content.value
            .split('\n')
            .map(line => `<span class="line">${line}</span>`);
          // end a few lines after the error or the last line of the file
          let end = Math.min(stackFrame.lineNumber + 10, lines.length);
          let snippet = lines.slice(start, end);
          // array starts at 0 but lines numbers begin with 1, so we have
          // to subtract 1 to get the error line position in the array
          let errLine = stackFrame.lineNumber - start - 1;

          snippet[errLine] = snippet[errLine].replace(
            '<span class="line">',
            '<span class="line error-line">'
          );

          stackFrame.content = snippet.join('\n');
          stackFrame.errLine = errLine;
          stackFrame.startLine = start;
          stackFrame.id = 'file-' + fileIndex;

          fileIndex++;

          cb(null, stackFrame);
        });
      },
      (error, callstack) => {
        if (!Array.isArray(callstack)) {
          callstack = [];
        }

        callstack = callstack.filter(item => !!item);

        // if something bad happened while processing the stacktrace make
        // sure to return something useful
        if (error) {
          logger.error('Failed to display error page', {
            error: errorToJSON(error)
          });
          res.send(err.stack);
        } else {
          res.send(errorView(err, callstack));
        }
      }
    );
  }

  function _initApp(req, res, appMain) {
    let bootConfig = _getBootConfig(req, res);
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
    let bootConfig = _getBootConfig(req, res);
    let status = 200;
    let cachedContent = spaCache.get(req);

    if (cachedContent) {
      res.status(status);
      res.send(cachedContent);

      return Promise.resolve({
        content: cachedContent,
        pageState: {},
        status,
        SPA: true
      });
    }

    return new Promise((resolve, reject) => {
      const filePath = './build/static/html/spa.html';
      fs.readFile(filePath, 'utf-8', (error, content) => {
        if (error) {
          return showStaticErrorPage(error, req, res).then(
            response => {
              resolve(response);
            },
            error => {
              reject(error);
            }
          );
        }

        content = templateProcessor(content, bootConfig.settings);

        spaCache.set(req, content);

        res.status(status);
        res.send(content);

        resolve({ content, status, SPA: true, error: null, pageState: {} });
      });
    });
  }

  function _hasToServeSPA(req, app) {
    let userAgent = req.headers['user-agent'] || '';
    let spaConfig = environment.$Server.serveSPA;
    let isAllowedServeSPA = spaConfig.allow;
    let isServerBusy = instanceRecycler.hasReachedMaxConcurrentRequests();
    let isAllowedUserAgent = !spaConfig.blackListReg.test(userAgent);
    let canBeRouteServeAsSPA = true;
    let routeInfo = _getRouteInfo(app);

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

  function _getBootConfig(req, res) {
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
      if (app) {
        instanceRecycler.clearInstance(app);
      }

      returnPromise = Promise.resolve({
        content: null,
        pageState: {},
        status: 500,
        error: error
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
        error: errorToJSON(e)
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

      Object.keys($IMA.Loader.modules).forEach(modulePath => {
        let module = root.$IMA.Loader.modules[modulePath];

        root.$IMA.Loader.modules[modulePath] = Object.assign({}, module, {
          instance: null,
          dependencyOf: [],
          dependencies: module.dependencies.slice()
        });
      });

      appFactory();
    }

    return _importAppMain().then(appMain => {
      let app = _initApp(req, res, appMain);
      _addImaToResponse(req, res, app);

      if (_hasToServeSPA(req, app)) {
        instanceRecycler.clearInstance(app);
        return showStaticSPAPage(req, res);
      }

      return _generateResponse(req, res, app);
    });
  }

  return {
    errorHandler,
    requestHandler,
    showStaticErrorPage,
    showStaticSPAPage
  };
};
