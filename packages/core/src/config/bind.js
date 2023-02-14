import * as $Helper from '@ima/helpers';

import { Cache } from '../cache/Cache';
import { CacheFactory } from '../cache/CacheFactory';
import { CacheImpl } from '../cache/CacheImpl';
import { ControllerDecorator } from '../controller/ControllerDecorator';
import { Dictionary } from '../dictionary/Dictionary';
import { MessageFormatDictionary } from '../dictionary/MessageFormatDictionary';
import { GenericError } from '../error/GenericError';
import { Dispatcher } from '../event/Dispatcher';
import { DispatcherImpl } from '../event/DispatcherImpl';
import { EventBus } from '../event/EventBus';
import { EventBusImpl } from '../event/EventBusImpl';
import { HttpAgent } from '../http/HttpAgent';
import { HttpAgentImpl } from '../http/HttpAgentImpl';
import { HttpProxy } from '../http/HttpProxy';
import { HttpStatusCode } from '../http/HttpStatusCode';
import { UrlTransformer } from '../http/UrlTransformer';
import { MetaManager } from '../meta/MetaManager';
import { MetaManagerImpl } from '../meta/MetaManagerImpl';
import { PageHandlerRegistry } from '../page/handler/PageHandlerRegistry';
import { PageMetaHandler } from '../page/handler/PageMetaHandler';
import { PageNavigationHandler } from '../page/handler/PageNavigationHandler';
import { ClientPageManager } from '../page/manager/ClientPageManager';
import { PageManager } from '../page/manager/PageManager';
import { ServerPageManager } from '../page/manager/ServerPageManager';
import { PageFactory } from '../page/PageFactory';
import { ComponentUtils } from '../page/renderer/ComponentUtils';
import { PageStateManager } from '../page/state/PageStateManager';
import { PageStateManagerDecorator } from '../page/state/PageStateManagerDecorator';
import { PageStateManagerImpl } from '../page/state/PageStateManagerImpl';
import { ClientRouter } from '../router/ClientRouter';
import { Request } from '../router/Request';
import { Response } from '../router/Response';
import { RouteFactory } from '../router/RouteFactory';
import { RouteNames } from '../router/RouteNames';
import { Router } from '../router/Router';
import { RouterEvents } from '../router/RouterEvents';
import { ServerRouter } from '../router/ServerRouter';
import { CookieStorage } from '../storage/CookieStorage';
import { MapStorage } from '../storage/MapStorage';
import { SessionMapStorage } from '../storage/SessionMapStorage';
import { SessionStorage } from '../storage/SessionStorage';
import { WeakMapStorage } from '../storage/WeakMapStorage';
import { ClientWindow } from '../window/ClientWindow';
import { ServerWindow } from '../window/ServerWindow';
import { Window } from '../window/Window';

export const initBind = (ns, oc, config) => {
  //**************START VENDORS**************
  oc.constant('$Helper', $Helper);

  //*************END VENDORS*****************

  //*************START CONSTANTS*****************
  oc.constant('$oc', oc);
  oc.constant('$Settings', config);
  oc.constant('$Env', config.$Env);
  oc.constant('$Protocol', config.$Protocol);
  oc.constant('$Secure', config.$Protocol === 'https:');
  //*************END CONSTANTS*****************

  //*************START IMA**************

  //Request & Response
  oc.bind('$Request', Request);
  oc.bind('$Response', Response);

  //Window helper
  if (typeof window !== 'undefined' && window !== null) {
    oc.provide(Window, ClientWindow);
  } else {
    oc.provide(Window, ServerWindow);
  }
  oc.bind('$Window', Window);

  //IMA Error
  oc.bind('$Error', GenericError);

  //Dictionary
  oc.provide(Dictionary, MessageFormatDictionary);
  oc.bind('$Dictionary', Dictionary);

  //Storage
  oc.constant('$CookieTransformFunction', {
    encode: s => s,
    decode: s => s,
  });
  oc.bind('$CookieStorage', CookieStorage);
  if (oc.get(Window).hasSessionStorage()) {
    oc.bind('$SessionStorage', SessionStorage);
  } else {
    oc.bind('$SessionStorage', MapStorage);
  }
  oc.bind('$MapStorage', MapStorage);
  oc.inject(WeakMapStorage, [
    {
      entryTtl: 30 * 60 * 1000,
      maxEntries: 1000,
      gcInterval: 60 * 1000,
      gcEntryCountTreshold: 16,
    },
  ]);
  oc.bind('$WeakMapStorage', WeakMapStorage);
  oc.bind('$SessionMapStorage', SessionMapStorage);

  // Dispatcher
  oc.provide(Dispatcher, DispatcherImpl);
  oc.bind('$Dispatcher', Dispatcher);

  // Custom Event Bus
  oc.provide(EventBus, EventBusImpl);
  oc.bind('$EventBus', EventBus);

  //Cache
  oc.constant('$CacheStorage', oc.get(MapStorage));
  oc.bind('$CacheFactory', CacheFactory);
  oc.provide(Cache, CacheImpl, [
    '$CacheStorage',
    CacheFactory,
    '$Helper',
    config.$Cache,
  ]);
  oc.bind('$Cache', Cache);

  //SEO
  oc.provide(MetaManager, MetaManagerImpl);
  oc.bind('$MetaManager', MetaManager);
  oc.bind('$ControllerDecorator', ControllerDecorator);
  oc.bind('$PageStateManagerDecorator', PageStateManagerDecorator);

  //Page
  oc.provide(PageStateManager, PageStateManagerImpl);
  oc.bind('$PageStateManager', PageStateManager);

  oc.inject(PageFactory, [oc]);
  oc.bind('$PageFactory', PageFactory);

  oc.inject(ComponentUtils, [oc]);
  oc.bind('$ComponentUtils', ComponentUtils);

  oc.get(ComponentUtils).register({
    $Dictionary: Dictionary,
    $Dispatcher: Dispatcher,
    $EventBus: EventBus,
    $Helper: '$Helper',
    $Http: HttpAgent,
    $PageStateManager: PageStateManager,
    $Router: Router,
    $Settings: '$Settings',
    $Window: Window,
  });

  if (oc.get(Window).isClient()) {
    oc.bind('$PageHandlerRegistry', PageHandlerRegistry, [
      PageNavigationHandler,
      PageMetaHandler,
    ]);
    oc.provide(PageManager, ClientPageManager);
  } else {
    oc.bind('$PageHandlerRegistry', PageHandlerRegistry, []);
    oc.provide(PageManager, ServerPageManager);
  }
  oc.bind('$PageManager', PageManager);

  //Router
  oc.bind('$RouteFactory', RouteFactory);

  if (oc.get(Window).isClient()) {
    oc.provide(Router, ClientRouter);
  } else {
    oc.provide(Router, ServerRouter);
  }
  oc.bind('$Router', Router);
  oc.constant('$RouteNames', RouteNames);
  oc.constant('$RouterEvents', RouterEvents);

  //Http agent
  oc.bind('$HttpUrlTransformer', UrlTransformer);
  oc.bind('$HttpAgentProxy', HttpProxy, ['$HttpUrlTransformer', '$Window']);
  oc.provide(HttpAgent, HttpAgentImpl, [
    '$HttpAgentProxy',
    '$Cache',
    CookieStorage,
    config.$Http,
    '$Helper',
  ]);
  oc.bind('$Http', HttpAgent);
  oc.constant('$HttpStatusCode', HttpStatusCode);

  //*************END IMA****************
};
