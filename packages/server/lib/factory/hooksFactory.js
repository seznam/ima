const { RouteNames } = require('@ima/core');

const { Event } = require('../emitter.js');

const DegradationStatus = {
  Degraded: 'degraded',
  NotDegraded: 'notDegraded',
  NotDefined: 'notDefined',
};

/**
 * Looks at the degradation configuration, processes potential degradation functions
 * in order to determine if the degradation was triggered or not.
 *
 * Returns one of three possible string values:
 *  - 'degraded'        : the degradation was triggered
 *  - 'notDegraded'     : the degradation was NOT triggered
 *  - 'notDefined'      : no degradation function is defined
 *
 * @returns {'degraded'|'notDegraded'|'notDefined'}
 */
function resolveDegradation(lookupKey, event) {
  const { environment } = event;
  const degradationFn = environment.$Server.degradation?.[lookupKey];

  if (!degradationFn) {
    return DegradationStatus.NotDefined;
  }

  /**
   * Degradation function can be an array of functions.
   */
  if (Array.isArray(degradationFn)) {
    for (const fn of degradationFn) {
      if (fn(event)) {
        return DegradationStatus.Degraded;
      }
    }

    return DegradationStatus.NotDegraded;
  }

  return degradationFn(event)
    ? DegradationStatus.Degraded
    : DegradationStatus.NotDegraded;
}

module.exports = function hooksFactory({
  renderOverloadedPage,
  renderStaticSPAPage,
  renderStaticServerErrorPage,
  renderStaticClientErrorPage,
  renderStaticSPAPrefetchPage,
  urlParser,
  _initApp,
  _importAppMainAsync,
  _clearApp,
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
    const degradationResult = resolveDegradation('isOverloaded', event);

    // Prioritize degradation logic
    if (degradationResult !== DegradationStatus.NotDefined) {
      return degradationResult === DegradationStatus.Degraded;
    }

    // Fallback to concurency check
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
    const { environment } = event;
    const isSpaAllowed = !!environment.$Server.serveSPA?.allow;

    // Do not serve when SPA is disabled
    if (!isSpaAllowed) {
      return false;
    }

    const isServerBusy = instanceRecycler.hasReachedMaxConcurrentRequests();
    const degradationResult = resolveDegradation('isSPA', event);

    // Prioritize degradation logic
    if (degradationResult === DegradationStatus.Degraded) {
      return true;
    }

    // Fallback to concurency check when degradation is not defined
    return isServerBusy;
  }

  /**
   * Checks if the server should serve a SPA prefetch page
   * based on different conditions like:
   * - ENV variable override (IMA_CLI_FORCE_SPA_PREFETCH)
   * - Degradation config (optional)
   */
  function _hasToServeSPAPrefetch(event) {
    if (process.env.IMA_CLI_FORCE_SPA_PREFETCH) {
      return true;
    }

    const { environment } = event;
    const isSpaPrefetchAllowed = !!environment.$Server.serveSPAPrefetch?.allow;

    // Do not serve when SPA prefetch is disabled
    if (!isSpaPrefetchAllowed) {
      return false;
    }

    // Resolve degradation logic for SPA prefetch.
    const degradationResult = resolveDegradation('isSPAPrefetch', event);

    // When degradation is not defined, default to enabled (when allow is true)
    if (degradationResult === DegradationStatus.NotDefined) {
      return true;
    }

    return degradationResult === DegradationStatus.Degraded;
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

    if (resolveDegradation('isStatic', event) === DegradationStatus.Degraded) {
      return true;
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
      if (_hasToServeSPAPrefetch(event)) {
        // Track SPA prefetch render mode
        event.context = {
          ...event.context,
          flags: {
            ...event.context.flags,
            spaPrefetch: true,
          },
        };

        // Continue as usual for SPA prefetch
        return;
      }

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
    /**
     * Special hook for handling JSON responses defined using
     * $responseType property on the controller.
     */
    emitter.prependListener(Event.BeforeResponse, async event => {
      if (!_isValidResponse(event)) {
        return;
      }

      const { context, req, res } = event;
      const isAppExists = context.app && typeof context.app !== 'function';

      if (!isAppExists) {
        return;
      }

      const routeInfo = await _getRouteInfo({ req, res });

      if (!routeInfo?.route?.getController) {
        return;
      }

      const controller = await routeInfo.route.getController();
      const responseType = controller.$responseType;

      // Bail when the response type is not JSON.
      if (responseType !== 'json') {
        return;
      }

      const state = context.app.oc.get('$PageStateManager').getState();

      res.setHeader('Content-Type', 'application/json');
      context.response.content = JSON.stringify(state);

      event.stopPropagation();
    });

    /**
     * Serialize the page state and cache, when SPA-prefetch is enabled
     * we also render the SPA template for the prefetch page.
     */
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

        // Handle SPA prefetch
        if (context?.flags?.spaPrefetch) {
          context.response = {
            ...context.response,
            ...renderStaticSPAPrefetchPage(event),
          };
        }
      }
    });

    /**
     * Handle server SPA templates Content Variables preprocessing.
     */
    emitter.on(Event.BeforeResponse, async event => {
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

    emitter.on(Event.AfterResponse, async event => {
      _clearApp(event);
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
