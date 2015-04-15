export var init = (ns, oc, config) => { //jshint ignore:line

	//**************START VENDORS**************
	//RSVP
	oc.bind('$Rsvp', ns.Vendor.Rsvp); // ???
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
	oc.bind('$SETTING', ns.Setting);
	oc.bind('$ENV', ns.Setting.$Env);
	oc.bind('$HTTP_CONFIG', ns.Setting.$Http);
	oc.bind('$SOCKET_CONFIG', ns.Setting.$Socket);
	oc.bind('$CACHE_CONFIG', ns.Setting.$Cache);
	oc.bind('$ANIMATE_CONFIG', ns.Setting.$Animate);

	oc.bind('$SECURE', ns.Setting.$Protocol === 'https:' ? true: false );
	oc.bind('$PROTOCOL', ns.Setting.$Protocol );
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

	//Request & Respond
	oc.bind('$Request', oc.create('Core.Router.Request'));
	oc.bind('$Respond', oc.create('Core.Router.Respond'));

	//Storage
	oc.bind('$CookieStorage', oc.make('Core.Storage.Cookie', ['$Request', '$Respond', '$SECURE']));
	oc.bind('$SessionStorage', ns.Core.Storage.Session);
	oc.bind('$MapStorage', ns.Core.Storage.Map);
	oc.bind('$SessionMapStorage', ns.Core.Storage.SessionMap, ['$MapStorage', '$SessionStorage']);

	//Dispatcher
	oc.bind('$Dispatcher', oc.make('Core.Dispatcher.Handler', ['$MapStorage']));

	//Animate
	oc.bind('$Animate', oc.make('Core.Animate.Handler', ['$Dispatcher', '$BindPromise', '$Window', '$CookieStorage', '$ANIMATE_CONFIG']));

	//Cache
	if (oc.get('$Window').hasSessionStorage()) {
		oc.bind('$CacheStorage', oc.make('$SessionMapStorage'));
	} else {
		oc.bind('$CacheStorage', oc.make('$MapStorage'));
	}

	oc.bind('$Cache', oc.make('Core.Cache.Handler', ['$CacheStorage' ,'$CACHE_CONFIG']));
	oc.bind('$CacheEntry', ns.Core.Cache.Entry);

	//Render
	if (oc.get('$Window').isClient()) {
		oc.bind('$PageRender', oc.make('Core.Page.Render.Client', ['$Rsvp', '$BindReact', '$Animate', ns.Setting, '$Window']));
	} else {
		oc.bind('$PageRender', oc.make('Core.Page.Render.Server', ['$Rsvp', '$BindReact', '$Animate', ns.Setting, '$Respond', '$Cache']));
	}

	//SEO
	oc.bind('$Seo', oc.make('Core.Seo.Manager', []));
	oc.bind('$DecoratorController', ns.Core.Decorator.Controller);

	//Router
	oc.bind('$RouterFactory', oc.make('Core.Router.Factory', ['$Seo', '$Dictionary', ns.Setting]));
	if (oc.get('$Window').isClient()) {
		oc.bind('$Router', oc.make('Core.Router.ClientHandler', ['$PageRender', '$RouterFactory', '$BindPromise', '$Window']));
	} else {
		oc.bind('$Router', oc.make('Core.Router.ServerHandler', ['$PageRender', '$RouterFactory', '$BindPromise', '$Request', '$Respond']));
	}
	oc.bind('$Route', ns.Core.Router.Route);

	//SuperAgent
	oc.bind('$HTTP_STATUS_CODE', ns.Core.Http.STATUS_CODE);
	oc.bind('$HttpProxy', oc.make('Core.Http.Proxy', ['$SuperAgent', '$BindPromise', '$HTTP_STATUS_CODE', '$Window']));
	oc.bind('$Http', oc.make('Core.Http.Agent', ['$HttpProxy', '$Cache', '$CookieStorage', '$Dictionary', '$BindPromise', '$HTTP_CONFIG']));

	//Sockets
	oc.bind('$SocketFactory', ns.Core.Socket.Factory, [oc.get('$Window').getWebSocket()]);
	oc.bind('$SocketParser', ns.Core.Socket.Parser, []);
	oc.bind('$SocketProxy', ns.Core.Socket.Proxy, ['$Dispatcher', '$SocketFactory', '$SocketParser', '$SOCKET_CONFIG', '$SECURE']);

	//*************END CORE****************

};
