const { Event } = require('../emitter.js');

module.exports = function hooksFactory({
  renderOverloadedPage,
  renderStaticSPAPage,
  renderStaticErrorPage,
  renderStaticBadRequestPage,
  _initApp,
  _importAppMainSync,
  _addImaToResponse,
  _getRouteInfo,
  _generateAppResponse,
  emitter,
  instanceRecycler,
  devErrorPage,
  environment
}) {
  function _isServerOverloaded({ environment }) {
    return (
      environment.$Server.overloadConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.overloadConcurrency
    );
  }

  function _hasToServeSPA({ req, environment }) {
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

  function _hasToServeStaticBadRequest({ req, res, environment }) {
    const routeInfo = _getRouteInfo({ req, res });

    // TODO IMA@18 import from @ima/core 'notfound' alias, after merging to next
    const isBadRequest = routeInfo && routeInfo.route.getName() === 'notfound';

    // TODO IMA@18 documentation badRequestConcurrency
    //TODO IMA@18 update for better performance check
    return (
      isBadRequest &&
      environment.$Server.badRequestConcurrency !== undefined &&
      instanceRecycler.getConcurrentRequests() + 1 >
        environment.$Server.badRequestConcurrency
    );
  }

  async function _applyError(event) {
    try {
      const { error, context } = event;
      return context.app.oc
        .get('$Router')
        .handleError({ error })
        .catch(e => {
          return renderStaticErrorPage({ ...event, error: e });
        });
    } catch (e) {
      return renderStaticErrorPage({ ...event, error: e });
    }
  }

  async function _applyNotFound(event) {
    try {
      const { error, context } = event;
      return context.app.oc
        .get('$Router')
        .handleNotFound({ error })
        .catch(e => {
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
        isRedirection: true,
        url: error.getParams().url
      };
    } catch (e) {
      return _applyError({ ...event, error: e });
    }
  }

  async function renderError(event = {}) {
    if (environment.$Debug) {
      return devErrorPage(event);
    } else {
      try {
        const { context } = event;
        //TODO IMA@18 update for better performance check
        if (!context?.app || _isServerOverloaded(event)) {
          return renderStaticErrorPage(event);
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
        return renderStaticErrorPage({ ...event, error: e });
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
      _importAppMainSync(event);
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
        return renderStaticBadRequestPage(event);
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

  function useResponseHook() {
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
  }

  function useIMADefaultHook() {
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
    userPerformanceOptimizationRequestHook
  };
};
