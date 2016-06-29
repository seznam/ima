import vendorLinker from 'ima/vendorLinker';
import ns from 'ima/namespace';
import ObjectContainer from 'ima/ObjectContainer';
import Bootstrap from 'ima/Bootstrap';

import { init as initBindIma } from 'ima/config/bind';
import { init as initServicesIma } from 'ima/config/services';

var getInitialImaConfigFunctions = () => {
	return { initBindIma, initServicesIma };
};

var getNamespace = () => {
	return ns;
};

var getInitialPluginConfig = () => {
	return { plugins: vendorLinker.getImaPlugins() };
};

var _getRoot = () => {
	return _isClient() ? window : global;
};

var _isClient = () => {
	return typeof window !== 'undefined' && window !== null;
};

var createImaApp = () => {

	var oc = new ObjectContainer(ns);
	var bootstrap = new Bootstrap(oc);

	return { oc, bootstrap };
};

var getClientBootConfig = (initialAppConfigFunctions) => {
	var root = _getRoot();

	if ($Debug && _isClient()) {
		if ($IMA.$Protocol !== root.location.protocol) {
			throw new Error(`Your client's protocol is not same as server's protocol.` +
					`For right setting protocol on the server site set 'X-Forwarded-Proto' header.`);
		}

		if ($IMA.$Host !== root.location.host) {
			throw new Error(`Your client's host is not same as server's host.` +
					`For right setting host on the server site set 'X-Forwarded-Host' header.`);
		}
	}

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
				$Protocol: $IMA.$Protocol,
				$Host: $IMA.$Host,
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
};

var getTestClientBootConfig = (initialAppConfigFunctions) => {
	var root = _getRoot();
	$IMA.$Debug = true;
	root.$Debug = $IMA.$Debug;

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
			$Debug: $IMA.$Debug,
			$App: {}
		},
		plugins: []
	};

	return Object.assign(
		bootConfig,
		initialAppConfigFunctions,
		getInitialPluginConfig(),
		getInitialImaConfigFunctions()
	);
};

var bootClientApp = (app, bootConfig) => {
	app.bootstrap.run(bootConfig);

	var cache = app.oc.get('$Cache');
	cache.deserialize($IMA.Cache || {});

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
				.manage(currentRoute.getController(), currentRoute.getView(), { onlyUpdate: false, autoScroll: false, allowSPA: false }, currentRouteInfo.params)
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
	var root = _getRoot();

	if (_isClient()) {

		//hack for browser Chrome, which has sometimes problem with rendering page
		document.body.style.display = 'none';
		document.body.offsetHeight; //eslint-disable-line
		document.body.style.display = '';
	}

	//set React for ReactJS extension for browser
	root.React = vendorLinker.get('react');
	root.$Debug = root.$IMA.$Debug;

	var app = createImaApp();
	var bootConfig = getClientBootConfig(initialAppConfigFunctions);
	app = bootClientApp(app, bootConfig);

	return routeClientApp(app);
};

var reviveTestClientApp = (initialAppConfigFunctions) => {
	var root = _getRoot();
	var app = createImaApp();
	var bootConfig = getTestClientBootConfig(initialAppConfigFunctions);

	app = bootClientApp(app, bootConfig);

	root.ns = ns;
	root.oc = app.oc;
};

var onLoad = (callback) => {
	if (_isClient()) {

		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			$IMA.Loader.initAllModules()
				.then(callback)
				.catch((error) => {
					console.error(error);
				});
		} else {
			window.addEventListener('DOMContentLoaded', () => {
				$IMA.Loader.initAllModules()
					.then(callback)
					.catch((error) => {
						console.error(error);
					});
			});
		}
	}
};

vendorLinker.bindToNamespace(ns);

export {
	getInitialImaConfigFunctions,
	getNamespace,
	getInitialPluginConfig,
	createImaApp,
	getClientBootConfig,
	getTestClientBootConfig,
	bootClientApp,
	routeClientApp,
	hotReloadClientApp,
	reviveClientApp,
	reviveTestClientApp,
	onLoad
};
