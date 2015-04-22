export var init = (ns, oc, config) => { //jshint ignore:line

	//**************START VENDORS**************
	//RSVP
	oc.bind('$Rsvp', ns.Vendor.Rsvp); //
	oc.bind('$Promise', ns.Vendor.Rsvp.Promise);
	oc.bind('$BindPromise', () => {
		return oc.get('$Promise');
	});

	//React
	oc.bind('$React', ns.Vendor.React);
	oc.bind('$BindReact', () => {
		return oc.get('$React');
	});

	//SuperAgent
	oc.bind('$SuperAgent', () => {
		return ns.Vendor.SuperAgent;
	});
	//*************END VENDORS*****************

	//*************START CONSTANT**************
	oc.bind('$Settings', ns.$Settings);
	oc.bind('$Env', ns.$Settings.$Env);
	oc.bind('$Protocol', ns.$Settings.$Protocol );

	oc.bind('$HTTP_CONFIG', ns.$Settings.$Http);
	oc.bind('$SOCKET_CONFIG', ns.$Settings.$Socket);
	oc.bind('$CACHE_CONFIG', ns.$Settings.$Cache);
	oc.bind('$SECURE', ns.$Settings.$Protocol === 'https:' ? true: false );
	//*************END CONSTANT****************


	//*************START CORE**************
	//Helper
	if (typeof window !== 'undefined' && window !== null) {
		oc.bind('$Window', oc.create('Core.Window.Client'));
	} else {
		oc.bind('$Window', oc.create('Core.Window.Server'));
	}

	//Core Error
	oc.bind('$Error', ns.Core.CoreError);

	//Dictionary
	oc.bind('$Dictionary', oc.create('Core.Dictionary.MessageFormat'));

	//Request & Response
	oc.bind('$Request', oc.create('Core.Router.Request'));
	oc.bind('$Response', oc.create('Core.Router.Response'));

	//Storage
	oc.bind('$CookieStorage', oc.make('Core.Storage.Cookie', ['$Request', '$Response', '$SECURE']));
	oc.bind('$SessionStorage', ns.Core.Storage.Session);
	oc.bind('$MapStorage', ns.Core.Storage.Map);
	oc.bind('$WeakMapStorage', ns.Core.Storage.WeakMap, [30 * 60 * 1000, 1000, 60 * 1000, 16]);
	oc.bind('$SessionMapStorage', ns.Core.Storage.SessionMap, ['$MapStorage', '$SessionStorage']);

	//Dispatcher
	oc.bind('$Dispatcher', oc.make('Core.Event.Dispatcher', ['$MapStorage']));

	//Animate
	//oc.bind('$Animate', oc.make('Core.Animate.Handler', ['$Dispatcher', '$BindPromise', '$Window', '$CookieStorage', '$ANIMATE_CONFIG']));

	//Cache
	if (oc.get('$Window').hasSessionStorage()) {
		oc.bind('$CacheStorage', oc.make('$SessionMapStorage'));
	} else {
		oc.bind('$CacheStorage', oc.make('$MapStorage'));
	}

	oc.bind('$Cache', oc.make('Core.Cache.Handler', ['$CacheStorage' ,'$CACHE_CONFIG']));
	oc.bind('$CacheEntry', ns.Core.Cache.Entry);

	//SEO
	oc.bind('$Seo', oc.make('Core.Seo.Manager', []));
	oc.bind('$DecoratorController', ns.Core.Decorator.Controller);

	//Page
	oc.bind('$PageStateManager', oc.make('Core.Page.StateManager'));
	oc.bind('$PageFactory', oc.make('Core.Page.Factory'));
	if (oc.get('$Window').isClient()) {
		oc.bind('$PageRender', oc.make('Core.Page.Render.Client', ['$Rsvp', '$BindReact', ns.$Settings, '$Window']));
	} else {
		oc.bind('$PageRender', oc.make('Core.Page.Render.Server', ['$Rsvp', '$BindReact', ns.$Settings, '$Response', '$Cache']));
	}
	oc.bind('$PageManager', oc.make('Core.Page.Manager', ['$PageFactory', '$PageRender', '$PageStateManager', '$Window']));

	//Router
	oc.bind('$RouterFactory', oc.make('Core.Router.Factory', []));
	if (oc.get('$Window').isClient()) {
		oc.bind('$Router', oc.make('Core.Router.Client', ['$PageManager', '$RouterFactory', '$BindPromise', '$Window']));
	} else {
		oc.bind('$Router', oc.make('Core.Router.Server', ['$PageManager', '$RouterFactory', '$BindPromise', '$Request', '$Response']));
	}
	oc.bind('$Route', ns.Core.Router.Route);

	//SuperAgent
	oc.bind('$HTTP_STATUS_CODE', ns.Core.Http.STATUS_CODE);
	oc.bind('$HttpProxy', oc.make('Core.Http.Proxy', ['$SuperAgent', '$BindPromise', '$HTTP_STATUS_CODE', '$Window']));
	oc.bind('$Http', oc.make('Core.Http.Agent', ['$HttpProxy', '$Cache', '$CookieStorage', '$BindPromise', '$HTTP_CONFIG']));

	//Sockets
	//oc.bind('$SocketFactory', ns.Core.Socket.Factory, [oc.get('$Window').getWebSocket()]);
	//oc.bind('$SocketParser', ns.Core.Socket.Parser, []);
	//oc.bind('$SocketProxy', ns.Core.Socket.Proxy, ['$Dispatcher', '$SocketFactory', '$SocketParser', '$SOCKET_CONFIG', '$SECURE']);

	//COMPONENT
	oc.bind('$Utils', {
		$Router: oc.get('$Router'),
		$Dispatcher: oc.get('$Dispatcher'),
		$Dictionary: oc.get('$Dictionary'),
		$Settings: oc.get('$Settings'),
		$Window: oc.get('$Window')
	});

	//*************END CORE****************

};
