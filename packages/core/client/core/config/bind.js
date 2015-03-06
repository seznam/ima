export var init = (ns) => { //jshint ignore:line

	//**************START VENDORS**************
	//RSVP
	ns.oc.bind('$Rsvp', ns.Vendor.Rsvp); // ???
	ns.oc.bind('$Promise', ns.Vendor.Rsvp.Promise);
	ns.oc.bind('$BindPromise', () => {
		return ns.oc.get('$Promise');
	});

	//React
	ns.oc.bind('$React', ns.Vendor.React);
	ns.oc.bind('$BindReact', () => {
		return ns.oc.get('$React');
	});

	//SuperAgent
	ns.oc.bind('$SuperAgent', () => {
		return ns.Vendor.SuperAgent;
	});
	//*************END VENDORS*****************

	//*************START CONSTANT**************
	ns.oc.bind('$ENV', ns.Setting.$Env);
	ns.oc.bind('$HTTP_CONFIG', ns.Setting.$Http);
	ns.oc.bind('$SOCKET_CONFIG', ns.Setting.$Socket);
	ns.oc.bind('$CACHE_CONFIG', ns.Setting.$Cache);
	ns.oc.bind('$ANIMATE_CONFIG', ns.Setting.$Animate);

	ns.oc.bind('$SECURE', ns.Setting.$Protocol === 'https:' ? true: false );
	ns.oc.bind('$PROTOCOL', ns.Setting.$Protocol );
	//*************END CONSTANT****************


	//*************START CORE**************
	//Helper
	ns.oc.bind('$TemplateHelper', ns.oc.create('Core.Helper.Template'));
	if (typeof window !== 'undefined' && window !== null) {
		ns.oc.bind('$WindowHelper', ns.oc.create('Core.Helper.WindowClient'));
	} else {
		ns.oc.bind('$WindowHelper', ns.oc.create('Core.Helper.WindowServer'));
	}

	//Core Error
	ns.oc.bind('$Error', ns.Core.Error.Handler);

	//Dispatcher
	ns.oc.bind('$Dispatcher', ns.oc.create('Core.Dispatcher.Handler'));

	//Dictionary
	ns.oc.bind('$Dictionary', ns.oc.create('Core.Dictionary.Handler'));

	//Request & Respond
	ns.oc.bind('$Request', ns.oc.create('Core.Router.Request'));
	ns.oc.bind('$Respond', ns.oc.create('Core.Router.Respond'));

	//Storage
	ns.oc.bind('$CookieStorage', ns.oc.make('Core.Storage.Cookie', ['$Request', '$Respond', '$SECURE']));
	ns.oc.bind('$SessionStorage', ns.Core.Storage.Session);
	ns.oc.bind('$MapStorage', ns.Core.Storage.Map);
	ns.oc.bind('$SessionMapStorage', ns.Core.Storage.SessionMap, ['$MapStorage', '$SessionStorage']);

	//Animate
	ns.oc.bind('$Animate', ns.oc.make('Core.Animate.Handler', ['$Dispatcher', '$BindPromise', '$WindowHelper', '$CookieStorage', '$ANIMATE_CONFIG']));

	//Cache
	if (ns.oc.get('$WindowHelper').isSessionStorage()) {
		ns.oc.bind('$CacheStorage', ns.oc.make('$SessionMapStorage'));
	} else {
		ns.oc.bind('$CacheStorage', ns.oc.make('$MapStorage'));
	}

	ns.oc.bind('$Cache', ns.oc.make('Core.Cache.Handler', ['$CacheStorage' ,'$CACHE_CONFIG']));
	ns.oc.bind('$CacheData', ns.Core.Cache.Data);

	//Render
	if (ns.oc.get('$WindowHelper').isClient()) {
		ns.oc.bind('$PageRender', ns.oc.make('Core.PageRender.Client', ['$Rsvp', '$BindReact', '$Animate', ns.Setting]));
	} else {
		ns.oc.bind('$PageRender', ns.oc.make('Core.PageRender.Server', ['$Rsvp', '$BindReact', '$Animate', ns.Setting]));
	}

	//Router
	ns.oc.bind('$Router', ns.oc.make('Core.Router.Handler', ['$PageRender', '$Request', '$Respond']));
	ns.oc.bind('$Route', ns.Core.Router.Data);

	//SuperAgent
	ns.oc.bind('$HttpProxy', ns.oc.make('Core.Http.Proxy', ['$SuperAgent', '$BindPromise']));
	ns.oc.bind('$Http', ns.oc.make('Core.Http.Handler', ['$HttpProxy', '$Cache', '$CookieStorage', '$Dictionary', '$BindPromise', '$HTTP_CONFIG']));

	//Sockets
	ns.oc.bind('$SocketFactory', ns.Core.Socket.Factory, [ns.oc.get('$WindowHelper').getWebSocket()]);
	ns.oc.bind('$SocketParser', ns.Core.Socket.Parser, []);
	ns.oc.bind('$SocketProxy', ns.Core.Socket.Proxy, ['$Dispatcher', '$SocketFactory', '$SocketParser', '$SOCKET_CONFIG', '$SECURE']);

	//*************END CORE****************

};
