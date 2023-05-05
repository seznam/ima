import * as $Helper from '@ima/helpers';

import { AppEnvironment } from '../boot';
import { InitBindFunction } from '../Bootstrap';
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
import { ObjectContainer } from '../oc/ObjectContainer';
import { PageHandlerRegistry } from '../page/handler/PageHandlerRegistry';
import { PageMetaHandler } from '../page/handler/PageMetaHandler';
import { PageNavigationHandler } from '../page/handler/PageNavigationHandler';
import { ClientPageManager } from '../page/manager/ClientPageManager';
import { PageManager } from '../page/manager/PageManager';
import { ServerPageManager } from '../page/manager/ServerPageManager';
import { PageFactory } from '../page/PageFactory';
import { ComponentUtils } from '../page/renderer/ComponentUtils';
import { PageRenderer } from '../page/renderer/PageRenderer';
import { PageStateManager } from '../page/state/PageStateManager';
import { PageStateManagerDecorator } from '../page/state/PageStateManagerDecorator';
import { PageStateManagerImpl } from '../page/state/PageStateManagerImpl';
import { ClientRouter } from '../router/ClientRouter';
import { Request } from '../router/Request';
import { CookieTransformFunction, Response } from '../router/Response';
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
import { GlobalImaObject, Utils } from '../types';
import { ClientWindow } from '../window/ClientWindow';
import { ServerWindow } from '../window/ServerWindow';
import { Window } from '../window/Window';

type AddOCPrefixes<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K] | null;
};

type WithOCOptional<T> = AddOCPrefixes<T, '?'>;
type WithOCSpread<T> = AddOCPrefixes<T, '...'>;
type WithOCOptionalSpread<T> = AddOCPrefixes<T, '...?'>;

export type DecoratedOCAliasMap = OCAliasMap &
  WithOCOptional<OCAliasMap> &
  WithOCOptionalSpread<OCAliasMap> &
  WithOCSpread<OCAliasMap>;

/**
 * Map of IMA default string aliases and constants initialized in
 * the ObjectContainer. This is used for typechecking and type
 * hinting of string OC arguments.
 */
export interface OCAliasMap {
  $Helper: typeof $Helper;
  $oc: ObjectContainer;
  $Settings: Parameters<InitBindFunction>['2'] & { [key: string]: any };
  $Env: keyof AppEnvironment;
  $Protocol: GlobalImaObject['$Protocol'];
  $Secure: boolean;
  $Request: Request;
  $Response: Response;
  $Window: Window;
  $Error: Dispatcher;
  $Dictionary: Dictionary;
  $CookieTransformFunction: CookieTransformFunction;
  $CookieStorage: CookieStorage;
  $SessionStorage:
    | InstanceType<typeof SessionStorage>
    | InstanceType<typeof MapStorage>;
  $MapStorage: InstanceType<typeof MapStorage>;
  $WeakMapStorage: WeakMapStorage;
  $SessionMapStorage: InstanceType<typeof SessionMapStorage>;
  $Dispatcher: Dispatcher;
  $EventBus: EventBus;
  $CacheStorage: OCAliasMap['$MapStorage'];
  $CacheFactory: InstanceType<typeof CacheFactory>;
  $Cache: Cache;
  $MetaManager: MetaManager;
  $ControllerDecorator: ControllerDecorator;
  $PageStateManagerDecorator: PageStateManagerDecorator;
  $PageStateManager: PageStateManager;
  $PageFactory: PageFactory;
  $ComponentUtils: ComponentUtils;
  $Utils: Utils;
  $PageHandlerRegistry: PageHandlerRegistry;
  $PageManager: PageManager;
  $RouteFactory: RouteFactory;
  $Router: Router;
  $RouteNames: RouteNames;
  $RouterEvents: RouterEvents;
  $HttpUrlTransformer: UrlTransformer;
  $HttpAgentProxy: HttpProxy;
  $Http: HttpAgent;
  $HttpStatusCode: typeof HttpStatusCode;
  $PageRenderer: PageRenderer;
}

export const initBind: InitBindFunction = (ns, oc, config) => {
  oc.constant('$Helper', $Helper);
  oc.constant('$oc', oc);
  oc.constant('$Settings', config);
  oc.constant('$Env', config.$Env);
  oc.constant('$Protocol', config.$Protocol);
  oc.constant('$Secure', config.$Protocol === 'https:');

  // Request & Response
  oc.bind('$Request', Request);
  oc.bind('$Response', Response);

  // Window helper
  if (typeof window !== 'undefined' && window !== null) {
    oc.provide(Window, ClientWindow);
  } else {
    oc.provide(Window, ServerWindow);
  }

  oc.bind('$Window', Window);
  oc.bind('$Error', GenericError);

  // Dictionary
  oc.provide(Dictionary, MessageFormatDictionary);
  oc.bind('$Dictionary', Dictionary);

  // Storage
  oc.constant('$CookieTransformFunction', {
    encode: (s: string) => s,
    decode: (s: string) => s,
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

  // Cache
  oc.constant('$CacheStorage', oc.get(MapStorage));
  oc.bind('$CacheFactory', CacheFactory);
  oc.provide(Cache, CacheImpl, [
    '$CacheStorage',
    CacheFactory,
    '$Helper',
    config.$Cache || {},
  ]);
  oc.bind('$Cache', Cache);

  // SEO
  oc.provide(MetaManager, MetaManagerImpl);
  oc.bind('$MetaManager', MetaManager);
  oc.bind('$ControllerDecorator', ControllerDecorator);
  oc.bind('$PageStateManagerDecorator', PageStateManagerDecorator);

  // Page
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

  // Router
  oc.bind('$RouteFactory', RouteFactory);

  if (oc.get(Window).isClient()) {
    oc.provide(Router, ClientRouter);
  } else {
    oc.provide(Router, ServerRouter);
  }
  oc.bind('$Router', Router);
  oc.constant('$RouteNames', RouteNames);
  oc.constant('$RouterEvents', RouterEvents);

  // Http agent
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
};
