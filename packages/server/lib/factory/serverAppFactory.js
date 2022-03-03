'use strict';

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const errorToJSON = require('error-to-json');
const { Event, catchError } = require('../../emitter.js');

//const { RouteNames } = require('@ima/core');
const Cache = require('../cache.js').Cache;
const { createEvent } = require('../../hooks.js');

// --- templateFactory.js

function loadTemplateFile(path) {
  return fs.readFileSync(path, 'utf8');
}

// TODO IMA@18 change folder for build/template/ejs/(spa|error).ejs
function templateFactory({ applicationFolder }) {
  const templateSPA = ejs.compile(
    loadTemplateFile(path.join(applicationFolder, './build/static/ejs/spa.ejs'))
  );
  const template500 = ejs.compile(
    loadTemplateFile(path.join(applicationFolder, './build/static/ejs/500.ejs'))
  );
  const template404 = ejs.compile(
    loadTemplateFile(path.join(applicationFolder, './build/static/ejs/400.ejs'))
  );

  return { template404, template500, templateSPA };
}

// -/- templateFactory.js

// --- imaInternalFactory.js

function imaInternalFactory({
  emitter,
  instanceRecycler,
  serverGlobal,
  appFactory,
  languageLoader
}) {
  const GLOBAL = {
    APP_MAIN: 'appMain',
    DUMMY_APP: 'dummyApp'
  };

  function _createDummyApp({ environment }) {
    // TODO IMA@18 documentation dummy APP
    // BETTER 404 detection
    const event = createEvent('createDummyApp', {
      context: {},
      environment,
      req: {},
      res: {
        locals: {}
      }
    });

    const bootConfig = createBootConfig(event);
    const appMain = serverGlobal.get(GLOBAL.APP_MAIN);
    event.context.app = appMain.ima.createImaApp();

    emitter.emitUnsafe(Event.CreateImaApp, event);

    Object.assign(
      bootConfig,
      appMain.getInitialAppConfigFunctions(),
      appMain.ima.getInitialPluginConfig(),
      appMain.ima.getInitialImaConfigFunctions()
    );
    event.context.app.bootstrap.run(bootConfig);

    return event.context.app;
  }

  function _getRouteInfo({ req, res }) {
    let routeInfo = null;

    if (!serverGlobal.has('dummyApp')) {
      return routeInfo;
    }

    const dummyApp = serverGlobal.get('dummyApp');
    const {
      protocol,
      host,
      path: urlPath,
      root,
      languagePartPath
    } = res.locals;

    dummyApp.oc.get('$Request').init(req);
    dummyApp.oc.get('$Response').init(res);
    dummyApp.oc.get('$Router').init({
      $Protocol: protocol,
      $Host: host,
      $Path: urlPath,
      $Root: root,
      $LanguagePartPath: languagePartPath
    });

    try {
      routeInfo = dummyApp.oc.get('$Router').getCurrentRouteInfo();
    } catch (e) {
      console.warn('Failed to retrieve current route info', {
        error: errorToJSON(e)
      });
    }

    return routeInfo;
  }

  function _addImaToResponse({ req, res }) {
    let routeName = 'other';

    let routeInfo = _getRouteInfo({ req, res });
    if (routeInfo) {
      routeName = routeInfo.route.getName();
    }

    res.$IMA = res.$IMA ? { ...res.$IMA, routeName } : { routeName };
  }

  function _importAppMainSync({ environment, context = {} }) {
    let appMain = serverGlobal.has(GLOBAL.APP_MAIN)
      ? serverGlobal.get(GLOBAL.APP_MAIN)
      : appFactory();

    if (environment.$Env === 'dev') {
      appMain = appFactory();

      instanceRecycler.clear();
      if (!appMain) {
        throw new Error('Compile error.');
      }
    }

    if (!instanceRecycler.isInitialized()) {
      serverGlobal.set(GLOBAL.APP_MAIN, appMain);
      serverGlobal.set(GLOBAL.DUMMY_APP, _createDummyApp({ environment }));

      instanceRecycler.init(
        appMain.ima.createImaApp,
        environment.$Server.concurrency
      );
    }

    context.appMain = appMain;

    return context.appMain;
  }

  function createBootConfig(event) {
    const { req, res, environment } = event;
    let language = res.locals.language;
    let languagePartPath = res.locals.languagePartPath;
    let host = res.locals.host;
    let root = res.locals.root;
    let urlPath = res.locals.path;
    let protocol = res.locals.protocol;

    let dictionary = languageLoader(language);

    event.context.bootConfig = {
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

    event = emitter.emitUnsafe(Event.CreateBootConfig, event);

    if (event.$result) {
      event.$result = { ...event.context.bootConfig, ...event.$result };
      event.context.bootConfig = event.$result;
    }

    return event.context.bootConfig;
  }

  function _initApp(event) {
    let { context } = event;
    let bootConfig = createBootConfig(event);
    context.app = instanceRecycler.getInstance();

    emitter.emitUnsafe(Event.CreateImaApp, event);

    Object.assign(
      bootConfig,
      context.appMain.getInitialAppConfigFunctions(),
      context.appMain.ima.getInitialPluginConfig(),
      context.appMain.ima.getInitialImaConfigFunctions()
    );
    context.app.bootstrap.run(bootConfig);

    return context.app;
  }

  function _generateAppResponse({ context }) {
    let router = context.app.oc.get('$Router');

    return router.route(router.getPath());
  }

  return {
    _initApp,
    createBootConfig,
    _importAppMainSync,
    _createDummyApp,
    _getRouteInfo,
    _addImaToResponse,
    _generateAppResponse
  };
}

// -/- imaInternalFactory.js

module.exports = function serverAppFactory({
  environment,
  devErrorPage,
  languageLoader,
  applicationFolder,
  appFactory,
  emitter,
  logger,
  instanceRecycler,
  serverGlobal
}) {
  const { template404, template500, templateSPA } = templateFactory({
    applicationFolder
  });
  const {
    _initApp,
    createBootConfig,
    _importAppMainSync,
    _addImaToResponse,
    _getRouteInfo,
    _generateAppResponse
  } = imaInternalFactory({
    languageLoader,
    appFactory,
    emitter,
    instanceRecycler,
    serverGlobal
  });

  // TODO IMA@18 refactor
  // TODO IMA@18 documentation environment.$Server.serveSPA.cache
  // TODO performance test rendering SPA fro random url
  const spaCache = new Cache(
    Object.assign(
      {},
      environment.$Server.cache,
      {
        cacheKeyGenerator: null
      },
      environment.$Server.serveSPA.cache
    )
  );

  function renderStaticErrorPage({ error, req, res }) {
    try {
      const content = template500({ error, environment, req, res });

      return {
        content,
        status: 500,
        error,
        SPA: false,
        static: true,
        pageState: {},
        cache: false
      };
    } catch (e) {
      return {
        content: 'Internal Server Error',
        status: 500,
        error: e,
        SPA: false,
        static: true,
        pageState: {},
        cache: false
      };
    }
  }

  function renderStaticBadRequestPage(event) {
    const status = 404;
    const content = template404(event);

    return {
      content,
      status,
      SPA: false,
      static: true
    };
  }

  function renderStaticSPAPage(event) {
    const { req } = event;
    const status = 200;
    const cachedContent = spaCache.get(req);

    if (cachedContent) {
      return {
        content: cachedContent,
        status,
        SPA: true,
        cache: true,
        static: true
      };
    }

    createBootConfig(event);

    const content = templateSPA(event);
    spaCache.set(req, content);

    return {
      content,
      status,
      SPA: true,
      static: true
    };
  }

  async function renderOverloadedPage({ req, res }) {
    const requests = instanceRecycler.getConcurrentRequests() + 2;
    const error = new Error(
      `The server is overloaded with ${requests} concurrency requests.`
    );

    let page = renderStaticErrorPage({ req, res, error });
    page.status = 503;

    return page;
  }

  function _isServerOverloaded() {
    return (
      environment.$Server.overloadConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.overloadConcurrency
    );
  }

  function _hasToServeSPA({ req, environment }) {
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

    return isAllowedServeSPA && isServerBusy && isAllowedUserAgent;
  }

  function _hasToServeStaticBadRequest({ req, res }) {
    const routeInfo = _getRouteInfo({ req, res });

    // TODO IMA@18 import from @ima/core
    const isBadRequest = routeInfo && routeInfo.route.getName() === 'notfound';

    // TODO IMA@18 404 for /clanek/blbost not render 404 router => handleNotFound
    // https://github.com/seznam/ima/blob/master/packages/server/lib/clientApp.js#L442

    // TODO IMA@18 documentation badRequestConcurrency
    return (
      isBadRequest &&
      environment.$Server.badRequestConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.badRequestConcurrency
    );
  }

  async function _applyError({ error, req, res, context }) {
    try {
      return context.app.oc
        .get('$Router')
        .handleError({ error })
        .catch(fatalError => {
          return renderStaticErrorPage({ error: fatalError, req, res });
        });
    } catch (e) {
      return renderStaticErrorPage({ error: e, req, res });
    }
  }

  async function _applyNotFound({ error, req, res, context }) {
    try {
      return context.app.oc
        .get('$Router')
        .handleNotFound({ error })
        .catch(error => {
          return _applyError({ error, req, res, context });
        });
    } catch (e) {
      return _applyError({ error: e, req, res, context });
    }
  }

  async function _applyRedirect({ error, req, res, context }) {
    try {
      return {
        content: null,
        status: error.getHttpStatus(),
        error,
        isRedirection: true,
        url: error.getParams().url
      };
    } catch (e) {
      return _applyError({ error: e, req, res, context });
    }
  }

  async function errorHandler({ error, req, res, environment, context = {} }) {
    if (environment.$Debug) {
      return devErrorPage({ error, req, res, environment, context });
    } else {
      try {
        //TODO IMA@18 update after better performance check, use process.cpuUsage
        if (!context.app || _isServerOverloaded()) {
          return renderStaticErrorPage({ error, req, res });
        }

        let router = context.app.oc.get('$Router');
        context.app.oc.get('$Cache').clear();

        if (router.isClientError(error)) {
          return _applyNotFound({ error, req, res, context });
        } else if (router.isRedirection(error)) {
          return _applyRedirect({ error, req, res, context });
        } else {
          return _applyError({ error, req, res, context });
        }
      } catch (e) {
        return renderStaticErrorPage({ error: e, req, res });
      }
    }
  }

  emitter.on(Event.Error, ({ $error, name }) => {
    logger.error(`The "${name}" hook throw error.`, {
      error: errorToJSON($error)
    });
  });

  emitter.on(Event.Error, event => {
    return errorHandler({ ...event, error: event.$error });
  });

  emitter.on(Event.Request, async event => {
    _importAppMainSync(event);
    _addImaToResponse(event);

    if (_hasToServeSPA(event)) {
      return renderStaticSPAPage(event);
    }

    if (_isServerOverloaded(event)) {
      return renderOverloadedPage(event);
    }

    if (_hasToServeStaticBadRequest(event)) {
      return renderStaticBadRequestPage(event);
    }

    _initApp(event);

    return _generateAppResponse(event);
  });

  emitter.on(Event.Response, async ({ res, context }) => {
    if (context.app && typeof context.app !== 'function') {
      instanceRecycler.clearInstance(context.app);
      context.app = null;
    }

    if (res.headersSent || !context.response) {
      return;
    }

    if (context.response.isRedirection) {
      res.redirect(context.response.status, context.response.url);
      return;
    }

    res.status(context.response.status);
    res.send(context.response.content);
  });

  async function requestHandler(req, res) {
    const defaultResponse = {
      SPA: false,
      static: false,
      status: 204,
      content: null,
      pageState: {},
      cache: false
    };
    const context = {};
    let event = null;

    event = await emitter.emitUnsafe(Event.BeforeRequest, {
      req,
      res,
      environment,
      context
    });

    event = await emitter.emitUnsafe(Event.Request, {
      req,
      res,
      environment,
      context
    });
    event.context.response = event.$result;

    //TODO IMA@18
    if (event.$criticalError) {
      event.context.response = renderStaticErrorPage({
        error: event.$criticalError,
        req,
        res
      });
    }

    event.context.response = { ...defaultResponse, ...event.context.response };

    event = await emitter.emitUnsafe(Event.Response, event);
    event = await emitter.emitUnsafe(Event.AfterResponse, event);

    return event.context.response;
  }

  return {
    createBootConfig,
    errorHandler,
    requestHandler: catchError(emitter, requestHandler),
    renderStaticErrorPage,
    renderStaticSPAPage
  };
};
