'use strict';

const { Event } = require('../emitter.js');

const staticPageFactory = require('./staticPageFactory.js');
const IMAInternalFactory = require('./IMAInternalFactory.js');
const hooksFactory = require('./hooksFactory.js');

module.exports = function serverAppFactory({
  environment,
  devErrorPage,
  languageLoader,
  applicationFolder,
  appFactory,
  emitter,
  instanceRecycler,
  serverGlobal,
}) {
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
    renderStaticErrorPage,
    renderStaticBadRequestPage,
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
    environment,
  });

  const defaultResponse = {
    SPA: false,
    static: false,
    status: 204,
    content: null,
    pageState: {},
    cache: false,
  };

  // TODO IMA@18 need performance test for usefulness
  // TODO IMA@18@performance refactor
  // TODO IMA@18@performance documentation environment.$Server.serveSPA.cache
  // TODO IMA@18performance test rendering SPA fro random url
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

      event = await emitter.emit(Event.Request, event);
      event.context.response = event.result;

      event.context.response = {
        ...defaultResponse,
        ...event.context.response,
      };

      event = await responseHandler(event);

      return event.context.response;
    } catch (error) {
      return errorHandler(error, event);
    }
  }

  async function responseHandler(event) {
    event = await emitter.emit(Event.BeforeResponse, event);
    event = await emitter.emit(Event.Response, event);
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
      return renderStaticErrorPage({
        ...event,
        error: error,
        cause: event.error,
      });
    }
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
    // eslint-disable-next-line no-unused-vars
    errorHandlerMiddleware: async (error, req, res, next) => {
      let event = {
        error,
        req,
        res,
        environment,
      };

      return errorHandler(error, event);
    },
    requestHandlerMiddleware: async (req, res) => {
      return requestHandler(req, res);
    },
    renderStaticErrorPage,
    renderStaticSPAPage,
    requestHandler,
    responseHandler,
    errorHandler,
  };
};
