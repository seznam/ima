const { RouteNames } = require('@ima/core');

const { Event } = require('../emitter.js');

module.exports = function hooksFactory({
  renderOverloadedPage,
  renderStaticSPAPage,
  renderStaticServerErrorPage,
  renderStaticClientErrorPage,
  urlParser,
  _initApp,
  _importAppMainAsync,
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

  function _isValidResponse(event) {
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

    const spaConfig = environment.$Server.serveSPA;
    const isAllowedServeSPA = spaConfig.allow;
    let isServerBusy = instanceRecycler.hasReachedMaxConcurrentRequests();

    if (environment.$Server.degradation) {
      isServerBusy = environment.$Server.degradation?.isSPA?.(event) ?? false;

      return isAllowedServeSPA && isServerBusy;
    }

    const userAgent = req.headers['user-agent'] || '';
    const isAllowedUserAgent = !(
      spaConfig.blackList &&
      typeof spaConfig.blackList === 'function' &&
      spaConfig.blackList(userAgent)
    );

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

    const isBadRequest =
      routeInfo && routeInfo.route.getName() === RouteNames.NOT_FOUND;

    // TODO IMA@19 documentation badRequestConcurrency
    return isBadRequest && _hasToServeStatic(event);
  }

  function _hasToServeStaticServerError(event) {
    const { req, res } = event;
    const routeInfo = _getRouteInfo({ req, res });

    const isServerError =
      routeInfo && routeInfo.route.getName() === RouteNames.ERROR;

    return isServerError && _hasToServeStatic(event);
  }

  async function _applyError(event) {
    if (!event.context?.app || _hasToServeStatic(event)) {
      return renderStaticServerErrorPage(event);
    }

    try {
      const { error, context } = event;
      return context.app.oc
        .get('$Router')
        .handleError({ error })
        .catch(e => {
          e.cause = error;

          return renderStaticServerErrorPage({ ...event, error: e });
        });
    } catch (e) {
      e.cause = event.error;

      return renderStaticServerErrorPage({ ...event, error: e });
    }
  }

  async function _applyNotFound(event) {
    if (!event.context?.app || _hasToServeStatic(event)) {
      return renderStaticClientErrorPage(event);
    }

    try {
      const { error, context } = event;
      const router = context.app.oc.get('$Router');

      return router.handleNotFound({ error }).catch(e => {
        e.cause = error;

        if (router.isRedirection(e)) {
          return _applyRedirect({ ...event, error: e });
        }

        return _applyError({ ...event, error: e });
      });
    } catch (e) {
      e.cause = event.error;

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
      e.cause = event.error;

      return _applyError({ ...event, error: e });
    }
  }

  async function renderError(event = {}) {
    if (
      environment.$Debug &&
      process.env.IMA_CLI_WATCH &&
      !event.error.isRedirection?.()
    ) {
      return devErrorPage(event);
    } else {
      try {
        const { context, error } = event;

        if (context?.app) {
          context.app.oc.get('$Cache').clear();
        }

        if (error.isClientError?.()) {
          return _applyNotFound(event);
        } else if (error.isRedirection?.()) {
          return _applyRedirect(event);
        } else {
          return _applyError(event);
        }
      } catch (e) {
        e.cause = event.error;

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
      _hasToLoadApp(event) && (await _importAppMainAsync(event));
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

      if (_hasToServeStaticServerError(event)) {
        event.stopPropagation();
        return renderStaticServerErrorPage({
          ...event,
          error:
            event.error ??
            new Error('The App error route exceed static thresholds.'),
        });
      }
    });
  }

  function useIMAHandleRequestHook() {
    emitter.on(Event.Request, async event => {
      await _initApp(event);

      event.stopPropagation();
      return _generateAppResponse(event);
    });
  }

  function useRequestHook() {
    useIMAInitializationRequestHook();
    userPerformanceOptimizationRequestHook();
    useIMAHandleRequestHook();
  }

  function useBeforeRequestHook() {
    useUrlParserBeforeRequestHook();
  }

  function useUrlParserBeforeRequestHook() {
    emitter.on(Event.BeforeRequest, async event => {
      urlParser(event);
    });
  }

  function useCreateContentVariablesHook() {
    emitter.on(Event.CreateContentVariables, async event => {
      if (!_isValidResponse(event)) {
        return event.result;
      }

      return {
        ...event.result,
        ...createContentVariables(event),
      };
    });
  }

  function useResponseHook() {
    emitter.on(Event.BeforeResponse, async event => {
      if (!_isValidResponse(event)) {
        return;
      }

      const { context } = event;
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

      // Store copy of BeforeResponse result before emitting new event
      const beforeResponseResult = { ...event.result };

      // Generate content variables
      event = await emitter.emit(Event.CreateContentVariables, event);
      event.context.response.contentVariables = {
        ...event.result,
      };

      // Restore before response event result contents
      event.result = beforeResponseResult;

      // Interpolate contentVariables into the response content
      event.context.response.content = processContent(event);
    });

    emitter.on(Event.Response, async event => {
      const { res, context } = event;
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
        const { oc } = context.app;
        oc.get('$Dispatcher').clear();
        oc.get('$Cache').clear();

        oc.get('$PageRenderer').unmount();
        oc.get('$PageManager').destroy();
        oc.clear();

        instanceRecycler.clearInstance(context.app);
        context.app = null;
      }
    });
  }

  function useIMADefaultHook() {
    useCreateContentVariablesHook();
    userErrorHook();
    useBeforeRequestHook();
    useRequestHook();
    useResponseHook();
  }

  return {
    useIMADefaultHook,
    userErrorHook,
    useBeforeRequestHook,
    useRequestHook,
    useResponseHook,
    useIMAHandleRequestHook,
    useIMAInitializationRequestHook,
    userPerformanceOptimizationRequestHook,
  };
};
