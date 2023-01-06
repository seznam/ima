const { Event } = require('../emitter.js');

module.exports = function hooksFactory({
  renderOverloadedPage,
  renderStaticSPAPage,
  renderStaticServerErrorPage,
  renderStaticClientErrorPage,
  _initApp,
  _importAppMainSync,
  _addImaToResponse,
  _getRouteInfo,
  _generateAppResponse,
  processContent,
  createContentVariables,
  sendResponseHeaders,
  emitter,
  instanceRecycler,
  devErrorPage,
  environment,
}) {
  function _isServerOverloaded(event) {
    const { environment } = event;
    if (environment.$Server.degradation) {
      return environment.$Server.degradation?.isOverloaded?.(event) ?? false;
    }

    return (
      environment.$Server.overloadConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.overloadConcurrency
    );
  }

  function _isResponseWithContent(event) {
    const { res, context } = event;
    const isRedirectResponse =
      context.response.status >= 300 &&
      context.response.status < 400 &&
      context.response.url;

    if (res.headersSent || isRedirectResponse || !context.response) {
      return false;
    }

    return true;
  }

  function _hasToServeSPA(event) {
    if (process.env.IMA_CLI_FORCE_SPA) {
      return true;
    }
    const { req, environment } = event;

    const userAgent = req.headers['user-agent'] || '';
    const spaConfig = environment.$Server.serveSPA;
    const isAllowedServeSPA = spaConfig.allow;
    let isServerBusy = instanceRecycler.hasReachedMaxConcurrentRequests();
    const isAllowedUserAgent = !(
      spaConfig.blackList &&
      typeof spaConfig.blackList === 'function' &&
      spaConfig.blackList(userAgent)
    );

    if (environment.$Server.degradation) {
      isServerBusy =
        environment.$Server.degradation?.isSPA?.(event) ?? isServerBusy;
    }

    return isAllowedServeSPA && isServerBusy && isAllowedUserAgent;
  }

  function _hasToLoadApp(event) {
    const { environment } = event;

    return !(
      (environment.$Server.serveSPA?.allow &&
        environment.$Server.concurrency === 0) ||
      process.env.IMA_CLI_FORCE_SPA
    );
  }

  function _hasToServeStatic(event) {
    const { environment } = event;

    if (environment.$Server.degradation) {
      return environment.$Server.degradation?.isStatic?.(event) ?? false;
    }

    return (
      environment.$Server.staticConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.staticConcurrency
    );
  }

  function _hasToServeStaticBadRequest(event) {
    const { req, res } = event;
    const routeInfo = _getRouteInfo({ req, res });

    // TODO IMA@18 import from @ima/core 'notfound' alias, after merging to next
    const isBadRequest = routeInfo && routeInfo.route.getName() === 'notFound';

    // TODO IMA@18 documentation badRequestConcurrency
    //TODO IMA@18 update for better performance check
    return isBadRequest && _hasToServeStatic(event);
  }

  async function _applyError(event) {
    if (_hasToServeStatic(event)) {
      return renderStaticServerErrorPage(event);
    }

    try {
      const { error, context } = event;
      return context.app.oc
        .get('$Router')
        .handleError({ error })
        .catch(e => {
          return renderStaticServerErrorPage({ ...event, error: e });
        });
    } catch (e) {
      return renderStaticServerErrorPage({ ...event, error: e });
    }
  }

  async function _applyNotFound(event) {
    if (_hasToServeStatic(event)) {
      return renderStaticClientErrorPage(event);
    }

    try {
      const { error, context } = event;
      const router = context.app.oc.get('$Router');

      return router.handleNotFound({ error }).catch(e => {
        if (router.isRedirection(e)) {
          return _applyRedirect({ ...event, error: e });
        }

        return _applyError({ ...event, error: e });
      });
    } catch (e) {
      return _applyError({ ...event, error: e });
    }
  }

  async function _applyRedirect(event) {
    try {
      const { error } = event;
      return {
        content: null,
        status: error.getHttpStatus(),
        error,
        url: error.getParams().url,
      };
    } catch (e) {
      return _applyError({ ...event, error: e });
    }
  }

  async function renderError(event = {}) {
    if (environment.$Debug && process.env.IMA_CLI_WATCH) {
      return devErrorPage(event);
    } else {
      try {
        const { context } = event;

        if (!context?.app) {
          return renderStaticServerErrorPage(event);
        }

        let router = context.app.oc.get('$Router');
        context.app.oc.get('$Cache').clear();

        if (router.isClientError(event.error)) {
          return _applyNotFound(event);
        } else if (router.isRedirection(event.error)) {
          return _applyRedirect(event);
        } else {
          return _applyError(event);
        }
      } catch (e) {
        return renderStaticServerErrorPage({ ...event, error: e });
      }
    }
  }

  function userErrorHook() {
    emitter.on(Event.Error, async event => {
      return await renderError(event);
    });
  }

  function useIMAInitializationRequestHook() {
    emitter.on(Event.Request, async event => {
      _hasToLoadApp(event) && _importAppMainSync(event);
      _addImaToResponse(event);
    });
  }

  function userPerformanceOptimizationRequestHook() {
    emitter.on(Event.Request, async event => {
      if (_hasToServeSPA(event)) {
        event.stopPropagation();
        return renderStaticSPAPage(event);
      }

      if (_isServerOverloaded(event)) {
        event.stopPropagation();
        return renderOverloadedPage(event);
      }

      if (_hasToServeStaticBadRequest(event)) {
        event.stopPropagation();
        return renderStaticClientErrorPage(event);
      }
    });
  }

  function useIMAHandleRequestHook() {
    emitter.on(Event.Request, async event => {
      _initApp(event);

      event.stopPropagation();
      return _generateAppResponse(event);
    });
  }

  function useRequestHook() {
    useIMAInitializationRequestHook();
    userPerformanceOptimizationRequestHook();
    useIMAHandleRequestHook();
  }

  function useCreateContentVariablesHook() {
    emitter.on(Event.CreateContentVariables, async event => {
      const { context } = event;

      if (!_isResponseWithContent(event)) {
        return;
      }

      context.response.contentVariables = createContentVariables({
        ...context,
      });
    });
  }

  function useResponseHook() {
    emitter.on(Event.BeforeResponse, async event => {
      const { context } = event;

      if (!_isResponseWithContent(event)) {
        return;
      }

      const isAppExists = context.app && typeof context.app !== 'function';

      if (isAppExists) {
        const state = context.app.oc.get('$PageStateManager').getState();
        const cache = context.app.oc.get('$Cache').serialize();
        const { headers, cookie } = context.app.oc
          .get('$Response')
          .getResponseParams();

        context.response.page = {
          ...context.response.page,
          ...{ state, cache, headers, cookie },
        };
      }

      context.response.content = processContent({
        ...context,
      });
    });

    emitter.on(Event.Response, async ({ res, context }) => {
      if (res.headersSent || !context.response) {
        return;
      }

      sendResponseHeaders({ res, context });

      if (
        context.response.status >= 300 &&
        context.response.status < 400 &&
        context.response.url
      ) {
        res.redirect(context.response.status, context.response.url);
        return;
      }
      res.status(context.response.status);
      res.send(context.response.content);
    });

    emitter.on(Event.AfterResponse, async ({ context }) => {
      if (context.app) {
        instanceRecycler.clearInstance(context.app);
        context.app = null;
      }
    });
  }

  function useIMADefaultHook() {
    useCreateContentVariablesHook();
    userErrorHook();
    useRequestHook();
    useResponseHook();
  }

  return {
    useIMADefaultHook,
    userErrorHook,
    useRequestHook,
    useResponseHook,
    useIMAHandleRequestHook,
    useIMAInitializationRequestHook,
    userPerformanceOptimizationRequestHook,
  };
};
