export var init = (ns, oc, config) => { //jshint ignore:line

	//**************START VENDORS**************

	oc.constant('$Helper', ns.Vendor.$Helper);
	oc.constant('$Promise', Promise);

	//React
	oc.constant('$React', ns.Vendor.React);

	//SuperAgent
	oc.constant('$SuperAgent', ns.Vendor.SuperAgent);

	//*************END VENDORS*****************



	//*************START CONSTANTS*****************

	oc.constant('$Settings', config);
	oc.constant('$Env', config.$Env);
	oc.constant('$Protocol', config.$Protocol);

	oc.constant('$HTTP_CONFIG', config.$Http);
	oc.constant('$CACHE_CONFIG', config.$Cache);
	oc.constant('$SECURE', config.$Protocol === 'https:' ? true : false);
	oc.constant('$ROUTE_NAMES', ns.Core.Router.ROUTE_NAMES);
	oc.constant('$HTTP_STATUS_CODE', ns.Core.Http.STATUS_CODE);

	//*************END CONSTANTS*****************



	//*************START CORE**************

	//Window helper
	if (typeof window !== 'undefined' && window !== null) {
		oc.provide(ns.Core.Interface.Window, ns.Core.Window.Client);
	} else {
		oc.provide(ns.Core.Interface.Window, ns.Core.Window.Server);
	}
	oc.bind('$Window', ns.Core.Interface.Window);

	//Core Error
	oc.bind('$Error', ns.Core.IMAError);

	//Dictionary
	oc.provide(ns.Core.Interface.Dictionary, ns.Core.Dictionary.MessageFormat);
	oc.bind('$Dictionary', ns.Core.Interface.Dictionary);

	//Request & Response
	oc.bind('$Request', ns.Core.Router.Request);
	oc.bind('$Response', ns.Core.Router.Response);

	//Storage
	oc.bind('$CookieStorage', ns.Core.Storage.Cookie, ['$Window', '$Request', '$Response']);
	oc.bind('$CookieStorage', ns.Core.Storage.Cookie, ['$Window', '$Request', '$Response']);
	if (oc.get('$Window').hasSessionStorage()) {
		oc.bind('$SessionStorage', ns.Core.Storage.Session);
	} else {
		oc.bind('$SessionStorage', ns.Core.Storage.Map);
	}
	oc.bind('$MapStorage', ns.Core.Storage.Map);
	oc.bind('$WeakMapStorage', ns.Core.Storage.WeakMap, [30 * 60 * 1000, 1000, 60 * 1000, 16]);
	oc.bind('$SessionMapStorage', ns.Core.Storage.SessionMap, ['$MapStorage', '$SessionStorage']);

	// Dispatcher
	oc.provide(ns.Core.Interface.Dispatcher, ns.Core.Event.Dispatcher);
	oc.bind('$Dispatcher', ns.Core.Interface.Dispatcher);

	// Custom Event Bus
	oc.provide(ns.Core.Interface.EventBus, ns.Core.Event.Bus, ['$Window']);
	oc.bind('$EventBus', ns.Core.Interface.EventBus);

	//Cache
	oc.constant('$CacheEntry', ns.Core.Cache.Entry);
	if (oc.get('$Window').hasSessionStorage()) {
		oc.constant('$CacheStorage', oc.get('$SessionMapStorage'));
	} else {
		oc.constant('$CacheStorage', oc.get('$MapStorage'));
	}
	oc.bind('$CacheFactory', ns.Core.Cache.Factory, ['$CacheEntry']);
	oc.provide(ns.Core.Interface.Cache, ns.Core.Cache.Handler, ['$CacheStorage', '$CacheFactory', '$CACHE_CONFIG']);
	oc.bind('$Cache', ns.Core.Interface.Cache);

	//SEO
	oc.bind('$MetaManager', ns.Core.Meta.Manager);
	oc.bind('$DecoratorController', ns.Core.Decorator.Controller);

	//Page
	oc.bind('$PageStateManager', ns.Core.Page.StateManager);
	oc.bind('$PageFactory', ns.Core.Page.Factory, [oc]);
	if (oc.get('$Window').isClient()) {
		oc.provide(ns.Core.Interface.PageRender, ns.Core.Page.Render.Client, ['$Helper', '$React', '$Settings', '$Window']);
	} else {
		oc.provide(ns.Core.Interface.PageRender, ns.Core.Page.Render.Server, ['$Helper', '$React', '$Settings', '$Response', '$Cache']);
	}
	oc.bind('$PageRender', ns.Core.Interface.PageRender);
	oc.provide(ns.Core.Interface.PageManager, ns.Core.Page.Manager, ['$PageFactory', '$PageRender', '$PageStateManager', '$Window', '$EventBus']);
	oc.bind('$PageManager', ns.Core.Interface.PageManager);

	//Router
	oc.constant('$Route', ns.Core.Router.Route);
	oc.bind('$RouterFactory', ns.Core.Router.Factory, ['$Route']);
	if (oc.get('$Window').isClient()) {
		oc.provide(ns.Core.Interface.Router, ns.Core.Router.Client, ['$PageManager', '$RouterFactory', '$ROUTE_NAMES', '$Window']);
		oc.bind('$Router', ns.Core.Router.Client, ['$PageManager', '$RouterFactory', '$ROUTE_NAMES', '$Window']);
	} else {
		oc.provide(ns.Core.Interface.Router, ns.Core.Router.Server, ['$PageManager', '$RouterFactory', '$ROUTE_NAMES', '$Request', '$Response']);
	}
	oc.bind('$Router', ns.Core.Interface.Router);

	//SuperAgent
	oc.bind('$HttpProxy', ns.Core.Http.Proxy, ['$SuperAgent', '$HTTP_STATUS_CODE', '$Window']);
	oc.provide(ns.Core.Interface.HttpAgent, ns.Core.Http.Agent, ['$HttpProxy', '$Cache', '$CookieStorage', '$HTTP_CONFIG']);
	oc.bind('$Http', ns.Core.Interface.HttpAgent);

	//*************END CORE****************

};
