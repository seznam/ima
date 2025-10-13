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

      if (_hasToServeSPA(event)) {
        event.context?.perf?.end('hooks.performanceCheck', {
          result: 'serveSPA',
          reason: 'server-busy',
        });
        event.stopPropagation();
        return renderStaticSPAPage(event);
      }

      if (_isServerOverloaded(event)) {
        event.context?.perf?.end('hooks.performanceCheck', {
          result: 'serveOverloaded',
          concurrentRequests: instanceRecycler.getConcurrentRequests(),
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
      // Using start/end to measure duration
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
      event.context?.perf?.measure('hooks.urlParser', () => urlParser(event), {
        url: event.req?.url,
        method: event.req?.method,
      });
    });
  }

  function useCreateContentVariablesHook() {
    emitter.on(Event.CreateContentVariables, async event => {
      if (!_isValidResponse(event)) {
        return event.result;
      }

      const variables = event.context?.perf?.measure(
        'hooks.createContentVariables',
        () => createContentVariables(event)
      );

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

      event.context?.perf?.track('hooks.checkJsonResponse.start');
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

      context?.perf?.measure('hooks.serializeJsonResponse', () => {
        const state = context.app.oc.get('$PageStateManager').getState();

        res.setHeader('Content-Type', 'application/json');
        context.response.content = JSON.stringify(state);
      });

      event.stopPropagation();
      event.context?.perf?.track('hooks.checkJsonResponse.complete');
    });

    emitter.on(Event.BeforeResponse, async event => {
      if (!_isValidResponse(event)) {
        return;
      }

      const { context } = event;
      const isAppExists = context.app && typeof context.app !== 'function';

      if (isAppExists) {
        // Using start/end to measure serialization
        context?.perf?.track('hooks.serializePageState.start');
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

        context?.perf?.track('hooks.serializePageState.complete');
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
      event.context.response.content = context?.perf?.measure(
        'hooks.processContent',
        () => processContent(event)
      );
    });

    emitter.on(Event.Response, async event => {
      const { res, context } = event;
      if (res.headersSent || !context.response) {
        return;
      }

      context?.perf?.start('hooks.sendResponse', {
        status: context.response.status,
        isRedirect:
          context.response.status >= 300 && context.response.status < 400,
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
        context?.perf?.end('hooks.sendResponse', { type: 'redirect' });
        return;
      }

      res.status(context.response.status);
      res.send(context.response.content);
      context?.perf?.end('hooks.sendResponse', { type: 'content' });
    });

    emitter.on(Event.AfterResponse, async event => {
      event.context?.perf?.measure('hooks.clearApp', () => _clearApp(event));
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
