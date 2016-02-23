import ns from 'ima/namespace';
import ObjectContainer from 'ima/objectContainer';
import Bootstrap from 'ima/bootstrap';

import { init as initBindIma } from 'ima/config/bind';
import { init as initServicesIma } from 'ima/config/services';

var getInitialImaConfigFunctions = () => {
	return { initBindIma, initServicesIma };
};

var getNamespace = () => {
	return ns;
};

var createImaApp = () => {
	var oc = new ObjectContainer(ns);
	var bootstrap = new Bootstrap(oc);

	return { oc, bootstrap };
};

var getClientBootConfig = (initialAppConfigFunctions) => {
	if ($Debug) {
		if (window.$IMA.$Protocol !== window.location.protocol) {
			throw new Error(`Your client's protocol is not same as server's protocol.` +
					`For right setting protocol on the server site set 'X-Forwarded-Proto' header.`);
		}

		if (window.$IMA.$Host !== window.location.host) {
			throw new Error(`Your client's host is not same as server's host.` +
					`For right setting host on the server site set 'X-Forwarded-Proto' header.`);
		}
	}

	var bootConfig = {
		vendor: window.$IMA.Vendor,
		services: {
			respond: null,
			request: null,
			$IMA: window.$IMA,
			dictionary: {
				$Language: window.$IMA.$Language,
				dictionary: window.$IMA.i18n
			},
			router: {
				$Protocol: window.$IMA.$Protocol,
				$Host: window.$IMA.$Host,
				$Root: window.$IMA.$Root,
				$LanguagePartPath: window.$IMA.$LanguagePartPath
			}
		},
		settings: {
			$Debug: window.$IMA.$Debug,
			$Env: window.$IMA.$Env,
			$Version: window.$IMA.$Version,
			$App: window.$IMA.$App,
			$Protocol: window.$IMA.$Protocol,
			$Language: window.$IMA.$Language,
			$Host: window.$IMA.$Host,
			$Root: window.$IMA.$Root,
			$LanguagePartPath: window.$IMA.$LanguagePartPath
		}
	};

	return Object.assign(bootConfig, initialAppConfigFunctions(), getInitialImaConfigFunctions());
};

var getTestClientBootConfig = (initialAppConfigFunctions) => {
	var root = typeof window !== 'undefined' && window !== null ? window : GLOBAL;
	root.$Debug = true;

	var bootConfig = {
		services: {
			respond: null,
			request: null,
			$IMA: $IMA,
			dictionary: {
				$Language: $IMA.$Language,
				dictionary: $IMA.i18n
			},
			router: {
				$Host: $IMA.$Host,
				$Root: $IMA.$Root,
				$LanguagePartPath: $IMA.$LanguagePartPath
			}
		},
		settings: {
			$Env: 'dev',
			$Language: 'en',
			$Protocol: 'http:',
			$Debug: true,
			$App: {}
		}
	};

	return Object.assign(bootConfig, initialAppConfigFunctions(), getInitialImaConfigFunctions());
};

var bootClientApp = (app, bootConfig) => {
	app.bootstrap.run(bootConfig);

	var cache = app.oc.get('$Cache');
	cache.deserialize(window.$IMA.Cache || {});

	return app;
};

var routeClientApp = (app) => {
	var router = app.oc.get('$Router');

	return router
		.listen()
		.route(router.getPath())
		.catch((error) => {
			if (typeof $IMA.fatalErrorHandler === 'function') {
				$IMA.fatalErrorHandler(error);
			} else {
				console.warn('Define function config.$IMA.fatalErrorHandler in services.js.');
			}
		});
};

var hotReloadClientApp = (initialAppConfigFunctions) => {
	if ($Debug) {
		var app = createImaApp();
		var bootConfig = getClientBootConfig(initialAppConfigFunctions);
		app = bootClientApp(app, bootConfig);

		var router = app.oc.get('$Router');
		var pageManager = app.oc.get('$PageManager');
		var currentRouteInfo = router.getCurrentRouteInfo();
		var currentRoute = currentRouteInfo.route;

		router.listen();

		try {
			return pageManager
				.manage(currentRoute.getController(), currentRoute.getView(), { onlyUpdate: false, autoScroll: false }, currentRouteInfo.params)
				.catch((error) => {
					return router.handleError({ error });
				})
				.catch((error) => {
					if (typeof $IMA.fatalErrorHandler === 'function') {
						$IMA.fatalErrorHandler(error);
					} else {
						console.warn('Define function config.$IMA.fatalErrorHandler in services.js.');
					}
				});
		} catch (error) {
			return router.handleError({ error });
		}
	}
};

var reviveClientApp = (initialAppConfigFunctions) => {
	//hack for browser Chrome, which has sometimes problem with rendering page
	document.body.style.display = 'none';
	document.body.offsetHeight; //eslint-disable-line
	document.body.style.display = '';

	//set React for ReactJS extension for browser
	window.React = window.$IMA.Vendor.get('React');
	window.$Debug = window.$IMA.$Debug;

	var app = createImaApp();
	var bootConfig = getClientBootConfig(initialAppConfigFunctions);
	app = bootClientApp(app, bootConfig);

	routeClientApp(app);
};

var reviveTestClientApp = (initialAppConfigFunctions) => {
	var root = typeof window !== 'undefined' && window !== null ? window : GLOBAL;
	var app = createImaApp();
	var bootConfig = getTestClientBootConfig(initialAppConfigFunctions);

	app = bootClientApp(app, bootConfig);

	root.ns = ns;
	root.oc = app.oc;
};

export {
	getInitialImaConfigFunctions,
	getNamespace,
	createImaApp,
	getClientBootConfig,
	getTestClientBootConfig,
	bootClientApp,
	routeClientApp,
	hotReloadClientApp,
	reviveClientApp,
	reviveTestClientApp
};
