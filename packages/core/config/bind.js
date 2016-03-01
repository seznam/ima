import vendorLinker from 'ima/vendorLinker';

export var init = (ns, oc, config) => { //jshint ignore:line

	//**************START VENDORS**************

	oc.constant('$Helper', vendorLinker.get('ima-helpers', true));
	oc.constant('$Promise', Promise);

	//React
	oc.constant('$React', vendorLinker.get('react', true));
	oc.constant('$ReactDOM', vendorLinker.get('react-dom', true));
	oc.constant('$ReactDOMServer', vendorLinker.get('react-dom/server.js', true));

	//SuperAgent
	oc.constant('$SuperAgent', vendorLinker.get('superagent'));

	//*************END VENDORS*****************


	//*************START CONSTANTS*****************
	oc.constant('$Settings', config);
	oc.constant('$Env', config.$Env);
	oc.constant('$Protocol', config.$Protocol);
	oc.constant('$Secure', config.$Protocol === 'https:' ? true : false);

	oc.constant('$ROUTER_CONSTANTS', { ROUTE_NAMES: ns.ima.router.RouteNames, EVENTS: ns.ima.router.Events });
	oc.constant('$HTTP_STATUS_CODE', ns.ima.http.StatusCode);

	//*************END CONSTANTS*****************


	//*************START IMA**************

	//Window helper
	if (typeof window !== 'undefined' && window !== null) {
		oc.provide(ns.ima.window.Window, ns.ima.window.ClientWindow);
	} else {
		oc.provide(ns.ima.window.Window, ns.ima.window.ServerWindow);
	}
	oc.bind('$Window', ns.ima.window.Window);

	//IMA Error
	oc.bind('$Error', ns.ima.error.GenericError);

	//Dictionary
	oc.provide(ns.ima.dictionary.Dictionary, ns.ima.dictionary.MessageFormatDictionary);
	oc.bind('$Dictionary', ns.ima.dictionary.Dictionary);

	//Request & Response
	oc.bind('$Request', ns.ima.router.Request);
	oc.bind('$Response', ns.ima.router.Response);

	//Storage
	oc.constant('$CookieTransformFunction', { encode: (s) => s, decode: (s) => s });
	oc.bind('$CookieStorage', ns.ima.storage.CookieStorage, ['$Window', '$Request', '$Response']);
	if (oc.get('$Window').hasSessionStorage()) {
		oc.bind('$SessionStorage', ns.ima.storage.SessionStorage);
	} else {
		oc.bind('$SessionStorage', ns.ima.storage.MapStorage);
	}
	oc.bind('$MapStorage', ns.ima.storage.MapStorage);
	oc.bind('$WeakMapStorage', ns.ima.storage.WeakMapStorage, [{
		entryTtl: 30 * 60 * 1000,
		maxEntries: 1000,
		gcInterval: 60 * 1000,
		gcEntryCountTreshold: 16
	}]);
	oc.bind('$SessionMapStorage', ns.ima.storage.SessionMapStorage, ['$MapStorage', '$SessionStorage']);

	// Dispatcher
	oc.provide(ns.ima.event.Dispatcher, ns.ima.event.DispatcherImpl);
	oc.bind('$Dispatcher', ns.ima.event.Dispatcher);

	// Custom Event Bus
	oc.provide(ns.ima.event.EventBus, ns.ima.event.EventBusImpl, ['$Window']);
	oc.bind('$EventBus', ns.ima.event.EventBus);

	//Cache
	oc.constant('$CacheEntry', ns.ima.cache.CacheEntry);

	if (oc.get('$Window').hasSessionStorage()) {
		oc.constant('$CacheStorage', oc.get('$SessionMapStorage'));
	} else {
		oc.constant('$CacheStorage', oc.get('$MapStorage'));
	}
	oc.bind('$CacheFactory', ns.ima.cache.CacheFactory, ['$CacheEntry']);
	oc.provide(ns.ima.cache.Cache, ns.ima.cache.CacheImpl, ['$CacheStorage', '$CacheFactory', '$Helper', config.$Cache]);
	oc.bind('$Cache', ns.ima.cache.Cache);

	//SEO
	oc.provide(ns.ima.meta.MetaManager, ns.ima.meta.MetaManagerImpl);
	oc.bind('$MetaManager', ns.ima.meta.MetaManager);
	oc.bind('$ControllerDecorator', ns.ima.controller.ControllerDecorator);
	oc.bind('$PageStateManagerDecorator', ns.ima.page.state.PageStateManagerDecorator);

	//Page
	oc.provide(ns.ima.page.state.PageStateManager, ns.ima.page.state.PageStateManagerImpl);
	oc.bind('$PageStateManager', ns.ima.page.state.PageStateManager);
	oc.bind('$PageFactory', ns.ima.page.PageFactory, [oc]);
	oc.constant('$PageRendererViewAdapter', ns.ima.page.renderer.ViewAdapter);
	oc.bind('$PageRendererFactory', ns.ima.page.renderer.PageRendererFactory, [oc, '$React', '$PageRendererViewAdapter']);

	if (oc.get('$Window').isClient()) {
		oc.provide(ns.ima.page.renderer.PageRenderer, ns.ima.page.renderer.ClientPageRenderer, ['$PageRendererFactory', '$Helper', '$ReactDOM', '$Settings', '$Window']);
	} else {
		oc.provide(ns.ima.page.renderer.PageRenderer, ns.ima.page.renderer.ServerPageRenderer, ['$PageRendererFactory', '$Helper', '$ReactDOMServer', '$Settings', '$Response', '$Cache']);
	}
	oc.bind('$PageRenderer', ns.ima.page.renderer.PageRenderer);

	if (oc.get('$Window').isClient()) {
		oc.provide(ns.ima.page.manager.PageManager, ns.ima.page.manager.ClientPageManager, ['$PageFactory', '$PageRenderer', '$PageStateManager', '$Window', '$EventBus']);
	} else {
		oc.provide(ns.ima.page.manager.PageManager, ns.ima.page.manager.ServerPageManager, ['$PageFactory', '$PageRenderer', '$PageStateManager']);
	}
	oc.bind('$PageManager', ns.ima.page.manager.PageManager);

	//Router
	oc.constant('$Route', ns.ima.router.Route);
	oc.bind('$RouteFactory', ns.ima.router.RouteFactory, ['$Route']);

	if (oc.get('$Window').isClient()) {
		oc.provide(ns.ima.router.Router, ns.ima.router.ClientRouter, ['$PageManager', '$RouteFactory', '$Dispatcher', '$ROUTER_CONSTANTS', '$Window']);
	} else {
		oc.provide(ns.ima.router.Router, ns.ima.router.ServerRouter, ['$PageManager', '$RouteFactory', '$Dispatcher', '$ROUTER_CONSTANTS', '$Request', '$Response']);
	}
	oc.bind('$Router', ns.ima.router.Router);

	//SuperAgent
	oc.bind('$HttpUrlTransformer', ns.ima.http.UrlTransformer);
	oc.bind('$SuperAgentProxy', ns.ima.http.SuperAgentProxy, ['$SuperAgent', '$HTTP_STATUS_CODE', '$HttpUrlTransformer', '$Window']);
	oc.provide(ns.ima.http.HttpAgent, ns.ima.http.HttpAgentImpl, ['$SuperAgentProxy', '$Cache', '$CookieStorage', config.$Http]);
	oc.bind('$Http', ns.ima.http.HttpAgent);

	//Dev tools
	oc.bind('$DevTool', ns.ima.debug.DevTool, ['$PageManager', '$PageStateManager', '$Window', '$Dispatcher', '$EventBus']);

	//*************END IMA****************

};
