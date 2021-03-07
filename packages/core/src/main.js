import vendorLinker from './vendorLinker';
import ns from './namespace';
import ObjectContainer from './ObjectContainer';
import Bootstrap from './Bootstrap';

import initBindIma from './config/bind';
import initServicesIma from './config/services';

/* eslint-disable no-unused-vars */
import Cache from './cache/Cache';
import CacheEntry from './cache/CacheEntry';
import CacheFactory from './cache/CacheFactory';
import CacheImpl from './cache/CacheImpl';
import AbstractController from './controller/AbstractController';
import Controller from './controller/Controller';
import ControllerDecorator from './controller/ControllerDecorator';
import Dictionary from './dictionary/Dictionary';
import MessageFormatDictionary from './dictionary/MessageFormatDictionary';
import Error from './error/Error';
import ExtensibleError from './error/ExtensibleError';
import GenericError from './error/GenericError';
import Dispatcher from './event/Dispatcher';
import DispatcherImpl from './event/DispatcherImpl';
import EventBus from './event/EventBus';
import EventBusImpl from './event/EventBusImpl';
import AbstractExecution from './execution/AbstractExecution';
import Execution from './execution/Execution';
import SerialBatch from './execution/SerialBatch';
import AbstractExtension from './extension/AbstractExtension';
import Extension from './extension/Extension';
import HttpAgent from './http/HttpAgent';
import HttpAgentImpl from './http/HttpAgentImpl';
import HttpProxy from './http/HttpProxy';
import StatusCode from './http/StatusCode';
import UrlTransformer from './http/UrlTransformer';
import MetaManager from './meta/MetaManager';
import MetaManagerImpl from './meta/MetaManagerImpl';
import PageHandler from './page/handler/PageHandler';
import PageHandlerRegistry from './page/handler/PageHandlerRegistry';
import PageNavigationHandler from './page/handler/PageNavigationHandler';
import AbstractPageManager from './page/manager/AbstractPageManager';
import ClientPageManager from './page/manager/ClientPageManager';
import PageManager from './page/manager/PageManager';
import ServerPageManager from './page/manager/ServerPageManager';
import AbstractPageRenderer from './page/renderer/AbstractPageRenderer';
import BlankManagedRootView from './page/renderer/BlankManagedRootView';
import ClientPageRenderer from './page/renderer/ClientPageRenderer';
import ComponentUtils from './page/renderer/ComponentUtils';
import RendererEvents from './page/renderer/Events';
import PageRenderer from './page/renderer/PageRenderer';
import PageRendererFactory from './page/renderer/PageRendererFactory';
import ServerPageRenderer from './page/renderer/ServerPageRenderer';
import RendererTypes from './page/renderer/Types';
import ViewAdapter from './page/renderer/ViewAdapter';
import StateEvents from './page/state/Events';
import PageStateManager from './page/state/PageStateManager';
import PageStateManagerDecorator from './page/state/PageStateManagerDecorator';
import PageStateManagerImpl from './page/state/PageStateManagerImpl';
import AbstractComponent from './page/AbstractComponent';
import AbstractDocumentView from './page/AbstractDocumentView';
import AbstractPureComponent from './page/AbstractPureComponent';
import {
  getUtils,
  localize,
  link,
  cssClasses,
  defaultCssClasses,
  fire,
  listen,
  unlisten
} from './page/componentHelpers';
import PageContext from './page/Context';
import PageFactory from './page/PageFactory';
import AbstractRouter from './router/AbstractRouter';
import ActionTypes from './router/ActionTypes';
import ClientRouter from './router/ClientRouter';
import RouterEvents from './router/Events';
import Request from './router/Request';
import Response from './router/Response';
import AbstractRoute from './router/AbstractRoute';
import StaticRoute from './router/StaticRoute';
import DynamicRoute from './router/DynamicRoute';
import RouteFactory from './router/RouteFactory';
import RouteNames from './router/RouteNames';
import Router from './router/Router';
import ServerRouter from './router/ServerRouter';
import CookieStorage from './storage/CookieStorage';
import MapStorage from './storage/MapStorage';
import SessionMapStorage from './storage/SessionMapStorage';
import SessionStorage from './storage/SessionStorage';
import Storage from './storage/Storage';
import WeakMapStorage from './storage/WeakMapStorage';
import Window from './window/Window';
import ServerWindow from './window/ServerWindow';
import ClientWindow from './window/ClientWindow';
import { version } from '../package.json';
/* eslint-enable no-unused-vars */

function getInitialImaConfigFunctions() {
  return { initBindIma, initServicesIma };
}

function getNamespace() {
  return ns;
}

function getInitialPluginConfig() {
  return { plugins: vendorLinker.getImaPlugins() };
}

function _getRoot() {
  return _isClient() ? window : global;
}

function _isClient() {
  return typeof window !== 'undefined' && window !== null;
}

function createImaApp() {
  let oc = new ObjectContainer(ns);
  let bootstrap = new Bootstrap(oc);

  return { oc, bootstrap };
}

function getClientBootConfig(initialAppConfigFunctions) {
  let root = _getRoot();

  if ($Debug && _isClient()) {
    if ($IMA.$Protocol !== root.location.protocol) {
      throw new Error(
        `Your client's protocol is not same as server's protocol. ` +
          `For right setting protocol on the server site set ` +
          `'X-Forwarded-Proto' header.`
      );
    }

    if ($IMA.$Host !== root.location.host) {
      throw new Error(
        `Your client's host is not same as server's host. For right ` +
          `setting host on the server site set 'X-Forwarded-Host' ` +
          `header.`
      );
    }
  }

  let bootConfig = {
    services: {
      respond: null,
      request: null,
      $IMA: $IMA,
      dictionary: {
        $Language: $IMA.$Language,
        dictionary: $IMA.i18n
      },
      router: {
        $Protocol: $IMA.$Protocol,
        $Host: $IMA.$Host,
        $Path: $IMA.$Path,
        $Root: $IMA.$Root,
        $LanguagePartPath: $IMA.$LanguagePartPath
      }
    },
    settings: {
      $Debug: $IMA.$Debug,
      $Env: $IMA.$Env,
      $Version: $IMA.$Version,
      $App: $IMA.$App,
      $Protocol: $IMA.$Protocol,
      $Language: $IMA.$Language,
      $Host: $IMA.$Host,
      $Path: $IMA.$Path,
      $Root: $IMA.$Root,
      $LanguagePartPath: $IMA.$LanguagePartPath
    }
  };

  return Object.assign(
    bootConfig,
    initialAppConfigFunctions,
    getInitialPluginConfig(),
    getInitialImaConfigFunctions()
  );
}

function bootClientApp(app, bootConfig) {
  app.bootstrap.run(bootConfig);

  $IMA.$Dispatcher = app.oc.get('$Dispatcher');

  let cache = app.oc.get('$Cache');
  cache.deserialize($IMA.Cache || {});

  return app;
}

function routeClientApp(app) {
  let router = app.oc.get('$Router');

  return router
    .listen()
    .route(router.getPath())
    .catch(error => {
      if (typeof $IMA.fatalErrorHandler === 'function') {
        $IMA.fatalErrorHandler(error);
      } else {
        console.warn(
          'Define function config.$IMA.fatalErrorHandler in ' + 'services.js.'
        );
      }
    });
}

function reviveClientApp(initialAppConfigFunctions) {
  let root = _getRoot();

  //set React for ReactJS extension for browser
  root.React = vendorLinker.get('react');
  root.$Debug = root.$IMA.$Debug;

  let app = createImaApp();
  let bootConfig = getClientBootConfig(initialAppConfigFunctions);
  app = bootClientApp(app, bootConfig);

  return routeClientApp(app).then(pageInfo => {
    return Object.assign({}, pageInfo || {}, { app, bootConfig });
  });
}

function onLoad() {
  vendorLinker.bindToNamespace(ns);

  if (!_isClient()) {
    return Promise.reject(null);
  }

  if (document.readyState !== 'loading') {
    return new Promise(resolve => setTimeout(resolve, 1000 / 240));
  }

  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', () => resolve(), {
      once: true
    });
  });
}

export {
  getInitialImaConfigFunctions,
  getNamespace,
  getInitialPluginConfig,
  createImaApp,
  getClientBootConfig,
  bootClientApp,
  routeClientApp,
  reviveClientApp,
  onLoad,
  ObjectContainer,
  Bootstrap,
  Cache,
  CacheEntry,
  CacheFactory,
  CacheImpl,
  AbstractController,
  Controller,
  ControllerDecorator,
  Dictionary,
  MessageFormatDictionary,
  Error,
  ExtensibleError,
  GenericError,
  Dispatcher,
  DispatcherImpl,
  EventBus,
  EventBusImpl,
  AbstractExecution,
  Execution,
  SerialBatch,
  AbstractExtension,
  Extension,
  HttpAgent,
  HttpAgentImpl,
  HttpProxy,
  StatusCode,
  UrlTransformer,
  MetaManager,
  MetaManagerImpl,
  PageHandler,
  PageHandlerRegistry,
  PageNavigationHandler,
  AbstractPageManager,
  ClientPageManager,
  PageManager,
  ServerPageManager,
  AbstractPageRenderer,
  BlankManagedRootView,
  ClientPageRenderer,
  ComponentUtils,
  RendererEvents,
  RendererTypes,
  PageRenderer,
  PageRendererFactory,
  ServerPageRenderer,
  ViewAdapter,
  RouterEvents,
  PageStateManager,
  PageStateManagerDecorator,
  PageStateManagerImpl,
  AbstractComponent,
  AbstractDocumentView,
  AbstractPureComponent,
  PageContext,
  PageFactory,
  AbstractRouter,
  AbstractRoute,
  StaticRoute,
  DynamicRoute,
  ActionTypes,
  ClientRouter,
  StateEvents,
  Request,
  Response,
  StaticRoute as Route,
  RouteFactory,
  RouteNames,
  Router,
  ServerRouter,
  CookieStorage,
  MapStorage,
  SessionMapStorage,
  SessionStorage,
  Storage,
  WeakMapStorage,
  Window,
  ServerWindow,
  ClientWindow,
  ns,
  getUtils,
  localize,
  link,
  cssClasses,
  defaultCssClasses,
  fire,
  listen,
  unlisten,
  vendorLinker,
  version
};
