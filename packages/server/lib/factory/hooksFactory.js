const { RouteNames } = require('@ima/core');

const { Event } = require('../emitter.js');

/**
 * Looks at the degradation configuration, processes potential degradation functions
 * in order to determine if the degradation was triggered or not.
 *
 * @returns {boolean} true when the degradation was triggered, false otherwise.
 */
function isDegraded(lookupKey, event) {
  const { environment } = event;
  const degradationFn = environment.$Server.degradation?.[lookupKey];

  if (!degradationFn) {
    return false;
  }

  /**
   * Degradation function can be an array of functions.
   */
  if (Array.isArray(degradationFn)) {
    for (const fn of degradationFn) {
      if (fn(event)) {
        return true;
      }
    }

    return false;
  }

  return degradationFn(event);
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
    return isDegraded('isOverloaded', event);
  }

  function _hasToServeStatic(event) {
    return isDegraded('isStatic', event);
  }

  function _hasToServeStaticBadRequest(event) {
    const { req, res } = event;
    const routeInfo = _getRouteInfo({ req, res });

    const isBadRequest =
      routeInfo && routeInfo.route.getName() === RouteNames.NOT_FOUND;

    return isBadRequest && _hasToServeStatic(event);
  }

  function _hasToServeStaticServerError(event) {
    const { req, res } = event;
    const routeInfo = _getRouteInfo({ req, res });

    const isServerError =
      routeInfo && routeInfo.route.getName() === RouteNames.ERROR;

    return isServerError && _hasToServeStatic(event);
  }

  function _hasToServeSPA(event) {
    if (process.env.IMA_CLI_FORCE_SPA) {
      return true;
    }

    // Fallback to concurency check when degradation is not defined
    return isDegraded('isSPA', event);
  }

  function _hasToServeSPAPrefetch(event) {
    if (process.env.IMA_CLI_FORCE_SPA_PREFETCH) {
      return true;
    }

    // Serve SPA prefetch when degradation logic indicates
    return isDegraded('isSPAPrefetch', event);
  }

  function _hasToLoadApp(event) {
    const { environment } = event;

    return !(
      (environment.$Server.serveSPA?.allow &&
        environment.$Server.concurrency === 0) ||
      process.env.IMA_CLI_FORCE_SPA
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
    event.context?.perf?.start('hooks.renderError', {
      errorType: event.error?.constructor?.name,
      isClientError: event.error?.isClientError?.(),
      isRedirection: event.error?.isRedirection?.(),
    });

    if (
      environment.$Debug &&
      process.env.IMA_CLI_WATCH &&
      !event.error.isRedirection?.()
    ) {
      event.context?.perf?.end('hooks.renderError');

      return devErrorPage(event);
    } else {
      try {
        const { context, error } = event;

        if (context?.app) {
          context.app.oc.get('$Cache').clear();
        }

        let result;
        if (error.isClientError?.()) {
          context?.perf?.track('hooks.renderError.applyNotFound');
          result = await _applyNotFound(event);
        } else if (error.isRedirection?.()) {
          context?.perf?.track('hooks.renderError.applyRedirect');
          result = await _applyRedirect(event);
        } else {
          context?.perf?.track('hooks.renderError.applyError');
          result = await _applyError(event);
        }

        context?.perf?.end('hooks.renderError');

        return result;
      } catch (e) {
        e.cause = event.error;
        event.context?.perf?.end('hooks.renderError');

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
      if (_hasToLoadApp(event)) {
        event.context?.perf?.start('hooks.importAppMain');
        await _importAppMainAsync(event);
        event.context?.perf?.end('hooks.importAppMain');
      }
      _addImaToResponse(event);
    });
  }

  function userPerformanceOptimizationRequestHook() {
    emitter.on(Event.Request, async event => {
      event.context?.perf?.start('hooks.performanceCheck', {
        concurrentRequests: instanceRecycler.getConcurrentRequests(),
        hasReachedMax: instanceRecycler.hasReachedMaxConcurrentRequests(),
      });

      if (_hasToServeSPAPrefetch(event)) {
        event.context?.perf?.end('hooks.performanceCheck', {
          result: 'serveSPAPrefetch',
        });

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
        event.context?.perf?.end('hooks.performanceCheck', {
          result: 'serveSPA',
        });
        event.stopPropagation();
        return renderStaticSPAPage(event);
      }

      if (_isServerOverloaded(event)) {
        event.context?.perf?.end('hooks.performanceCheck', {
          result: 'serveOverloaded',
        });
        event.stopPropagation();
        return renderOverloadedPage(event);
      }

      if (_hasToServeStaticBadRequest(event)) {
        event.context?.perf?.end('hooks.performanceCheck', {
          result: 'serveStaticBadRequest',
        });
        event.stopPropagation();
        return renderStaticClientErrorPage(event);
      }

      if (_hasToServeStaticServerError(event)) {
        event.context?.perf?.end('hooks.performanceCheck', {
          result: 'serveStaticServerError',
        });
        event.stopPropagation();
        return renderStaticServerErrorPage({
          ...event,
          error:
            event.error ??
            new Error('The App error route exceed static thresholds.'),
        });
      }

      event.context?.perf?.end('hooks.performanceCheck', { result: 'passed' });
    });
  }

  function useIMAHandleRequestHook() {
    emitter.on(Event.Request, async event => {
      event.context?.perf?.start('hooks.initApp');
      await _initApp(event);
      event.context?.perf?.end('hooks.initApp');

      event.context?.perf?.start('hooks.generateAppResponse');
      event.stopPropagation();
      const result = _generateAppResponse(event);
      event.context?.perf?.end('hooks.generateAppResponse');
      return result;
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
      event.context?.perf?.start('hooks.urlParser');
      urlParser(event);
      event.context?.perf?.end('hooks.urlParser');
    });
  }

  function useCreateContentVariablesHook() {
    emitter.on(Event.CreateContentVariables, async event => {
      if (!_isValidResponse(event)) {
        return event.result;
      }

      event.context?.perf?.start('hooks.createContentVariables');
      const variables = createContentVariables(event);
      event.context?.perf?.end('hooks.createContentVariables');

      return {
        ...event.result,
        ...variables,
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

      event.context?.perf?.start('hooks.checkJsonResponse');
      const { context, req, res } = event;
      const isAppExists = context.app && typeof context.app !== 'function';

      if (!isAppExists) {
        event.context?.perf?.end('hooks.checkJsonResponse');

        return;
      }

      const routeInfo = await _getRouteInfo({ req, res });

      if (!routeInfo?.route?.getController) {
        event.context?.perf?.end('hooks.checkJsonResponse');

        return;
      }

      const controller = await routeInfo.route.getController();
      const responseType = controller.$responseType;

      // Bail when the response type is not JSON.
      if (responseType !== 'json') {
        event.context?.perf?.end('hooks.checkJsonResponse');

        return;
      }

      event.context?.perf?.end('hooks.checkJsonResponse');

      context?.perf?.start('hooks.serializeJsonResponse');
      const state = context.app.oc.get('$PageStateManager').getState();

      res.setHeader('Content-Type', 'application/json');
      context.response.content = JSON.stringify(state);
      context?.perf?.end('hooks.serializeJsonResponse');

      event.stopPropagation();
      event.context?.perf?.track('hooks.checkJsonResponse.complete');
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
        context?.perf?.start('hooks.serializePageState');
        const state = context.app.oc.get('$PageStateManager').getState();

        context?.perf?.start('hooks.serializeCache');
        const cache = context.app.oc.get('$Cache').serialize();
        context?.perf?.end('hooks.serializeCache');

        const { headers, cookie } = context.app.oc
          .get('$Response')
          .getResponseParams();

        context.response.page = {
          ...context.response.page,
          ...{ state, cache, headers, cookie },
        };

        context?.perf?.end('hooks.serializePageState');
      }

      // Handle SPA prefetch
      if (context?.flags?.spaPrefetch) {
        context?.perf?.start('hooks.renderStaticSPAPrefetchPage');

        context.response = {
          ...context.response,
          ...renderStaticSPAPrefetchPage(event),
        };

        context?.perf?.end('hooks.renderStaticSPAPrefetchPage');
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
      event.context?.perf?.start('hooks.processContent');
      event.context.response.content = processContent(event);
      event.context?.perf?.end('hooks.processContent');
    });

    emitter.on(Event.Response, async event => {
      const { res, context } = event;
      if (res.headersSent || !context.response) {
        return;
      }

      context?.perf?.start('hooks.sendResponse', {
        status: context.response.status,
        contentLength: context.response.content?.length || 0,
      });

      sendResponseHeaders({ res, context });

      if (
        context.response.status >= 300 &&
        context.response.status < 400 &&
        context.response.url
      ) {
        context?.perf?.track('hooks.sendRedirect', {
          status: context.response.status,
          url: context.response.url,
        });

        res.redirect(context.response.status, context.response.url);

        context?.perf?.end('hooks.sendResponse', {
          type: 'redirect',
          url: context.response.url,
        });

        return;
      }

      res.status(context.response.status);
      res.send(context.response.content);

      context?.perf?.end('hooks.sendResponse', {
        type: 'content',
        contentLength: context.response.content?.length || 0,
        status: context.response.status,
        static: context.response.static,
        spa: context.response.SPA,
        cache: context.response.page.cache,
        spaPrefetch: context.response.spaPrefetch,
        error: context.response.error,
      });
    });

    emitter.on(Event.AfterResponse, async event => {
      event.context?.perf?.start('hooks.clearApp');
      _clearApp(event);
      event.context?.perf?.end('hooks.clearApp');
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
