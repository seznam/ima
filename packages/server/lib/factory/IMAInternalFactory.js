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

  async function _createDummyApp({ environment, language }) {
    // TODO IMA@18 doc dummy APP
    // BETTER 404 detection
    const event = createEvent('createDummyApp', {
      context: {},
      environment,
      res: {
        app: {},
        headersSent: false,
        locals: {
          language,
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

    await event.context.app.bootstrap.run(bootConfig);

    return event.context.app;
  }

  function _getRouteInfo({ req, res }) {
    let routeInfo = null;

    if (!serverGlobal.has(GLOBAL.DUMMY_APP)) {
      return routeInfo;
    }

    const dummyApp = serverGlobal.get(GLOBAL.DUMMY_APP);
    const { protocol, host, root, languagePartPath } = res.locals;

    dummyApp.oc.get('$Request').init(req);
    dummyApp.oc.get('$Response').init(res);
    dummyApp.oc.get('$Router').init({
      $Protocol: protocol,
      $Host: host,
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

    res.locals.routeName = routeName;
  }

  async function _importAppMainAsync({ res, environment, context = {} }) {
    let appMain = serverGlobal.has(GLOBAL.APP_MAIN)
      ? serverGlobal.get(GLOBAL.APP_MAIN)
      : appFactory();

    if (environment.$Env === 'dev') {
      appMain = serverGlobal.has(GLOBAL.APP_MAIN) ? appFactory() : appMain;

      instanceRecycler.clear();
    }

    if (!instanceRecycler.isInitialized()) {
      serverGlobal.set(GLOBAL.APP_MAIN, appMain);
      serverGlobal.set(
        GLOBAL.DUMMY_APP,
        await _createDummyApp({ environment, language: res.locals.language })
      );

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
          $Root: root,
          $LanguagePartPath: languagePartPath,
        },
      },
      settings: {
        $Debug: environment.$Debug,
        $Env: environment.$Env,
        $Version: environment.$Version,
        $App: environment.$App || {},
        $Resources: environment.$Resources,
        $Protocol: protocol,
        $Language: language,
        $Host: host,
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

  async function _initApp(event) {
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

    await context.app.bootstrap.run(bootConfig);

    return context.app;
  }

  function _generateAppResponse({ context }) {
    let router = context.app.oc.get('$Router');

    return router.route(router.getPath());
  }

  function _clearApp({ context }) {
    if (context.app) {
      const { oc } = context.app;
      oc.get('$Dispatcher').clear();
      oc.get('$Cache').clear();

      oc.get('$PageRenderer').unmount();
      oc.get('$PageManager').destroy();
      oc.clear();

      instanceRecycler.clearInstance(context.app);
      context.app = null;
    }
  }

  return {
    _initApp,
    _clearApp,
    createBootConfig,
    _importAppMainAsync,
    _createDummyApp,
    _getRouteInfo,
    _addImaToResponse,
    _generateAppResponse,
  };
};
