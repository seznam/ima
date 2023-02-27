'use strict';

const devErrorPageFactory = require('./devErrorPageFactory.js');
const hooksFactory = require('./hooksFactory.js');
const IMAInternalFactory = require('./IMAInternalFactory.js');
const responseUtilsFactory = require('./responseUtilsFactory.js');
const staticPageFactory = require('./staticPageFactory.js');
const { Event } = require('../emitter.js');

module.exports = function serverAppFactory({
  environment,
  languageLoader,
  applicationFolder,
  appFactory,
  emitter,
  performance,
  instanceRecycler,
  serverGlobal,
  logger,
}) {
  const devErrorPage = devErrorPageFactory({ logger });
  const { processContent, createContentVariables, sendResponseHeaders } =
    responseUtilsFactory();
  const {
    _initApp,
    createBootConfig,
    _importAppMainSync,
    _addImaToResponse,
    _getRouteInfo,
    _generateAppResponse,
  } = IMAInternalFactory({
    languageLoader,
    appFactory,
    emitter,
    instanceRecycler,
    serverGlobal,
  });
  const {
    renderOverloadedPage,
    renderStaticSPAPage,
    renderStaticServerErrorPage,
    renderStaticClientErrorPage,
  } = staticPageFactory({
    applicationFolder,
    instanceRecycler,
    createBootConfig,
    environment,
  });

  const {
    useIMADefaultHook,
    userErrorHook,
    useRequestHook,
    useResponseHook,
    useIMAHandleRequestHook,
    useIMAInitializationRequestHook,
    userPerformanceOptimizationRequestHook,
  } = hooksFactory({
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
  });

  const defaultResponse = {
    SPA: false,
    static: false,
    status: 204,
    content: null,
    page: {
      state: {},
      cache: null,
      cookie: new Map(),
      headers: {},
    },
    cache: false,
  };

  // TODO IMA@19 need performance test for usefulness
  // TODO IMA@19@performance refactor
  // TODO IMA@19@performance documentation environment.$Server.serveSPA.cache
  // TODO IMA@19performance test rendering SPA for random url
  // const spaCache = new Cache(
  //   Object.assign(
  //     {},
  //     environment.$Server.cache,
  //     {
  //       cacheKeyGenerator: null
  //     },
  //     environment.$Server.serveSPA.cache
  //   )
  // );

  async function requestHandler(req, res) {
    let event = {
      req,
      res,
      environment,
      performance,
    };

    try {
      event = await emitter.emit(Event.BeforeRequest, event);

      if (!event.defaultPrevented) {
        event = await emitter.emit(Event.Request, event);
      }

      event.context.response = {
        ...defaultResponse,
        ...event.context.response,
        ...event.result,
      };

      event = await emitter.emit(Event.AfterRequest, event);

      event = await responseHandler(event);

      return event.context.response;
    } catch (error) {
      return errorHandler(error, event);
    }
  }

  async function responseHandler(event) {
    event = await emitter.emit(Event.BeforeResponse, event);

    if (!event.defaultPrevented) {
      event = await emitter.emit(Event.Response, event);
    }

    event = await emitter.emit(Event.AfterResponse, event);

    return event;
  }

  async function errorHandler(error, event) {
    try {
      event = { ...event, error };

      event = await emitter.emit(Event.BeforeError, event);
      event = await emitter.emit(Event.Error, event);

      event.context.response = {
        ...defaultResponse,
        ...event.context.response,
        ...event.result,
      };

      event = await emitter.emit(Event.AfterError, event);
    } catch (error) {
      error.cause = event.error;

      event.context.response = renderStaticServerErrorPage({
        ...event,
        error,
      });
    }

    try {
      event = await responseHandler(event);
    } catch (error) {
      error.cause = event.error;
      const { res, context } = event;

      if (context.app) {
        instanceRecycler.clearInstance(context.app);
        context.app = null;
      }

      if (res.headersSent) {
        return context.response;
      }

      context.response = renderStaticServerErrorPage({
        ...event,
        error,
      });

      res.status(context.response.status);
      res.send(context.response.content);
    }

    return event.context.response;
  }

  // eslint-disable-next-line no-unused-vars
  async function errorHandlerMiddleware(error, req, res, next) {
    let event = {
      error,
      req,
      res,
      environment,
      performance,
    };

    return errorHandler(error, event);
  }

  async function requestHandlerMiddleware(req, res) {
    return requestHandler(req, res);
  }

  return {
    createBootConfig,
    useIMADefaultHook,
    userErrorHook,
    useRequestHook,
    useResponseHook,
    useIMAHandleRequestHook,
    useIMAInitializationRequestHook,
    userPerformanceOptimizationRequestHook,
    errorHandlerMiddleware,
    requestHandlerMiddleware,
    renderStaticServerErrorPage,
    renderStaticSPAPage,
    requestHandler,
    responseHandler,
    errorHandler,
  };
};
