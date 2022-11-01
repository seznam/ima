'use strict';

const { Event } = require('../emitter.js');

const staticPageFactory = require('./staticPageFactory.js');
const IMAInternalFactory = require('./IMAInternalFactory.js');
const hooksFactory = require('./hooksFactory.js');
const devErrorPageFactory = require('./devErrorPageFactory.js');
const responseUtilsFactory = require('./responseUtilsFactory.js');

module.exports = function serverAppFactory({
  environment,
  logger,
  languageLoader,
  applicationFolder,
  appFactory,
  emitter,
  instanceRecycler,
  serverGlobal,
}) {
  const devErrorPage = devErrorPageFactory({ logger });
  const { processContent, sendResponseHeaders } = responseUtilsFactory();
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

  // TODO IMA@18 need performance test for usefulness
  // TODO IMA@18@performance refactor
  // TODO IMA@18@performance documentation environment.$Server.serveSPA.cache
  // TODO IMA@18performance test rendering SPA for random url
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
    let event = {};

    try {
      event = await emitter.emit(Event.BeforeRequest, {
        req,
        res,
        environment,
      });

      if (!event.defaultPrevented) {
        event = await emitter.emit(Event.Request, event);
        event.context.response = event.result;
      }

      event.context.response = {
        ...defaultResponse,
        ...event.context.response,
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
      event.context.response = event.result;

      event.context.response = {
        ...defaultResponse,
        ...event.context.response,
      };

      event = await emitter.emit(Event.AfterError, event);

      event = await responseHandler(event);

      return event.context.response;
    } catch (error) {
      return renderStaticServerErrorPage({
        ...event,
        error: error,
        cause: event.error,
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  async function errorHandlerMiddleware(error, req, res, next) {
    let event = {
      error,
      req,
      res,
      environment,
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
