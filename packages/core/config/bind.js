export var init = (ns, oc, config) => { //jshint ignore:line

	//**************START VENDORS**************

	oc.constant('$Helper', ns.Vendor.$Helper);
	oc.constant('$Promise', Promise);

	//React
	oc.constant('$React', ns.Vendor.React);
	oc.constant('$ReactDOM', ns.Vendor.ReactDOM);
	oc.constant('$ReactDOMServer', ns.Vendor.ReactDOMServer);

	//SuperAgent
	oc.constant('$SuperAgent', ns.Vendor.SuperAgent);

	//*************END VENDORS*****************



	//*************START CONSTANTS*****************
	oc.constant('$Settings', config);
	oc.constant('$Env', config.$Env);
	oc.constant('$Protocol', config.$Protocol);
	oc.constant('$Secure', config.$Protocol === 'https:' ? true : false);

	oc.constant('$ROUTER_CONSTANTS', { ROUTE_NAMES: ns.Ima.Router.ROUTE_NAMES, EVENTS: ns.Ima.Router.EVENTS });
	oc.constant('$HTTP_STATUS_CODE', ns.Ima.Http.STATUS_CODE);

	//*************END CONSTANTS*****************



	//*************START Ima**************

	//Window helper
	if (typeof window !== 'undefined' && window !== null) {
		oc.provide(ns.Ima.Interface.Window, ns.Ima.Window.Client);
	} else {
		oc.provide(ns.Ima.Interface.Window, ns.Ima.Window.Server);
	}
	oc.bind('$Window', ns.Ima.Interface.Window);

	//Ima Error
	oc.bind('$Error', ns.Ima.IMAError);

	//Dictionary
	oc.provide(ns.Ima.Dictionary.Dictionary, ns.Ima.Dictionary.MessageFormatDictionary);
	oc.bind('$Dictionary', ns.Ima.Dictionary.Dictionary);

	//Request & Response
	oc.bind('$Request', ns.Ima.Router.Request);
	oc.bind('$Response', ns.Ima.Router.Response);

	//Storage
	oc.constant('$CookieTransformFunction', { encode: (s) => s, decode: (s) => s });
	oc.bind('$CookieStorage', ns.Ima.Storage.Cookie, ['$Window', '$Request', '$Response']);
	if (oc.get('$Window').hasSessionStorage()) {
		oc.bind('$SessionStorage', ns.Ima.Storage.Session);
	} else {
		oc.bind('$SessionStorage', ns.Ima.Storage.Map);
	}
	oc.bind('$MapStorage', ns.Ima.Storage.Map);
	oc.bind('$WeakMapStorage', ns.Ima.Storage.WeakMap, [{
		entryTtl: 30 * 60 * 1000,
		maxEntries: 1000,
		gcInterval: 60 * 1000,
		gcEntryCountTreshold: 16
	}]);
	oc.bind('$SessionMapStorage', ns.Ima.Storage.SessionMap, ['$MapStorage', '$SessionStorage']);

	// Dispatcher
	oc.provide(ns.Ima.Interface.Dispatcher, ns.Ima.Event.Dispatcher);
	oc.bind('$Dispatcher', ns.Ima.Interface.Dispatcher);

	// Custom Event Bus
	oc.provide(ns.Ima.Interface.EventBus, ns.Ima.Event.Bus, ['$Window']);
	oc.bind('$EventBus', ns.Ima.Interface.EventBus);

	//Cache
	oc.constant('$CacheEntry', ns.Ima.Cache.Entry);
	if (oc.get('$Window').hasSessionStorage()) {
		oc.constant('$CacheStorage', oc.get('$SessionMapStorage'));
	} else {
		oc.constant('$CacheStorage', oc.get('$MapStorage'));
	}
	oc.bind('$CacheFactory', ns.Ima.Cache.Factory, ['$CacheEntry']);
	oc.provide(ns.Ima.Interface.Cache, ns.Ima.Cache.Handler, ['$CacheStorage', '$CacheFactory', '$Helper', config.$Cache]);
	oc.bind('$Cache', ns.Ima.Interface.Cache);

	//SEO
	oc.bind('$MetaManager', ns.Ima.Meta.Manager);
	oc.bind('$ControllerDecorator', ns.Ima.Controller.ControllerDecorator);
	oc.bind('$DecoratorPageStateManager', ns.Ima.Decorator.PageStateManager);

	//Page
	oc.bind('$PageStateManager', ns.Ima.Page.StateManager);
	oc.bind('$PageFactory', ns.Ima.Page.Factory, [oc]);
	oc.constant('$PageRenderViewAdapter', ns.Ima.Page.Render.ViewAdapter);
	oc.bind('$PageRenderFactory', ns.Ima.Page.Render.Factory, [oc, '$React', '$PageRenderViewAdapter']);
	if (oc.get('$Window').isClient()) {
		oc.provide(ns.Ima.Interface.PageRender, ns.Ima.Page.Render.Client, ['$PageRenderFactory', '$Helper', '$ReactDOM', '$Settings', '$Window']);
	} else {
		oc.provide(ns.Ima.Interface.PageRender, ns.Ima.Page.Render.Server, ['$PageRenderFactory', '$Helper', '$ReactDOMServer', '$Settings', '$Response', '$Cache']);
	}
	oc.bind('$PageRender', ns.Ima.Interface.PageRender);
	//oc.provide(ns.Ima.Interface.PageManager, ns.Ima.Page.Manager, ['$PageFactory', '$PageRender', '$PageStateManager', '$Window', '$EventBus']);
	if (oc.get('$Window').isClient()) {
		oc.provide(ns.Ima.Interface.PageManager, ns.Ima.Page.Manager.Client, ['$PageFactory', '$PageRender', '$PageStateManager', '$Window', '$EventBus']);
	} else {
		oc.provide(ns.Ima.Interface.PageManager, ns.Ima.Page.Manager.Server, ['$PageFactory', '$PageRender', '$PageStateManager']);
	}
	oc.bind('$PageManager', ns.Ima.Interface.PageManager);

	//Router
	oc.constant('$Route', ns.Ima.Router.Route);
	oc.bind('$RouterFactory', ns.Ima.Router.Factory, ['$Route']);
	if (oc.get('$Window').isClient()) {
		oc.provide(ns.Ima.Interface.Router, ns.Ima.Router.Client, ['$PageManager', '$RouterFactory', '$Dispatcher', '$ROUTER_CONSTANTS', '$Window']);
	} else {
		oc.provide(ns.Ima.Interface.Router, ns.Ima.Router.Server, ['$PageManager', '$RouterFactory', '$Dispatcher', '$ROUTER_CONSTANTS', '$Request', '$Response']);
	}
	oc.bind('$Router', ns.Ima.Interface.Router);

	//SuperAgent
	oc.bind('$HttpTransformer', ns.Ima.Http.Transformer);
	oc.bind('$HttpProxy', ns.Ima.Http.Proxy, ['$SuperAgent', '$HTTP_STATUS_CODE', '$HttpTransformer', '$Window']);
	oc.provide(ns.Ima.Interface.HttpAgent, ns.Ima.Http.Agent, ['$HttpProxy', '$Cache', '$CookieStorage', config.$Http]);
	oc.bind('$Http', ns.Ima.Interface.HttpAgent);

	//Dev tools
	oc.bind('$DevTool', ns.Ima.Debug.DevTool, ['$PageManager', '$PageStateManager', '$Window', '$Dispatcher', '$EventBus']);

	//*************END Ima****************

};
