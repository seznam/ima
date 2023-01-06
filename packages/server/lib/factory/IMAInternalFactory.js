const { Event, createEvent } = require('../emitter.js');

module.exports = function IMAInternalFactory({
  emitter,
  instanceRecycler,
  serverGlobal,
  appFactory,
  languageLoader,
}) {
  const GLOBAL = {
    APP_MAIN: 'appMain',
    DUMMY_APP: 'dummyApp',
  };

  function _createDummyApp({ environment }) {
    // TODO IMA@18 doc dummy APP
    // BETTER 404 detection
    const event = createEvent('createDummyApp', {
      context: {},
      environment,
      res: {
        app: {},
        headersSent: false,
        locals: {
          language: 'en',
        },
        append() {},
        attachment() {},
        clearCookie() {},
        download() {},
        end() {},
        format() {},
        json() {},
        jsonp() {},
        links() {},
        location() {},
        redirect() {},
        render() {},
        send() {},
        sendFile() {},
        sendStatus() {},
        set() {},
        setHeader() {},
        type() {},
        get() {},
        getHeader() {},
      },
      req: {
        app: {},
        baseUrl: '',
        body: {},
        cookies: {},
        fresh: true,
        hostname: '',
        headers: {},
        ip: '127.0.0.1',
        ips: [],
        method: 'GET',
        originalUrl: '/',
        params: {},
        path: '',
        protocol: 'https',
        query: {},
        route: {},
        secure: true,
        signedCookies: {},
        stale: false,
        subdomains: [],
        xhr: true,
        accepts() {},
        acceptsCharsets() {},
        acceptsEncodings() {},
        acceptsLanguages() {},
        get() {},
        is() {},
        range() {},
      },
    });

    const bootConfig = createBootConfig(event);
    const appMain = serverGlobal.get(GLOBAL.APP_MAIN);
    event.context.app = appMain.ima.createImaApp();

    emitter.emit(Event.CreateImaApp, event);

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

    if (!serverGlobal.has(GLOBAL.DUMMY_APP)) {
      return routeInfo;
    }

    const dummyApp = serverGlobal.get(GLOBAL.DUMMY_APP);
    const {
      protocol,
      host,
      path: urlPath,
      root,
      languagePartPath,
    } = res.locals;

    dummyApp.oc.get('$Request').init(req);
    dummyApp.oc.get('$Response').init(res);
    dummyApp.oc.get('$Router').init({
      $Protocol: protocol,
      $Host: host,
      $Path: urlPath,
      $Root: root,
      $LanguagePartPath: languagePartPath,
    });

    try {
      routeInfo = dummyApp.oc.get('$Router').getCurrentRouteInfo();
    } catch (e) {
      console.warn('Failed to retrieve current route info', {
        error: e,
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
      appMain = serverGlobal.has(GLOBAL.APP_MAIN) ? appFactory() : appMain;

      instanceRecycler.clear();
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

    let dictionary = language ? languageLoader(language) : {};

    event.context.bootConfig = {
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

    event = emitter.emit(Event.CreateBootConfig, event);

    if (event.result) {
      event.result = { ...event.context.bootConfig, ...event.result };
      event.context.bootConfig = event.result;
    }

    return event.context.bootConfig;
  }

  function _initApp(event) {
    let { context } = event;
    let bootConfig = createBootConfig(event);
    context.app = instanceRecycler.getInstance();

    emitter.emit(Event.CreateImaApp, event);

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
    _generateAppResponse,
  };
};
