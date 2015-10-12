import ns from 'imajs/client/core/namespace';
import ObjectContainer from 'imajs/client/core/objectContainer';
import Bootstrap from 'imajs/client/core/bootstrap';

// Import app/config
import { init as initBindCore } from 'imajs/client/core/config/bind';
import { init as initBindApp } from 'app/config/bind';
import { init as initRoutes } from 'app/config/routes';
import { init as initServicesCore } from 'imajs/client/core/config/services';
import { init as initServicesApp } from 'app/config/services';
import { init as initSettings } from 'app/config/settings';

var getInit = () => {
	return { initBindCore, initBindApp, initRoutes, initServicesCore, initServicesApp, initSettings };
};

var getNamespace = () => {
	return ns;
};

var createIMAJsApp = () => {
	var oc = new ObjectContainer(ns);
	var bootstrap = new Bootstrap(oc);

	return { oc, bootstrap };
};

var root = typeof window !== 'undefined' && window !== null ? window : GLOBAL;

//Check testing
if (root.$IMA.Test === true) {

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

	Object.assign(bootConfig, getInit());

	var app = createIMAJsApp();

	app.bootstrap.run(bootConfig);

	root.ns = ns;
	root.oc = app.oc;

} else {

	if (typeof window !== 'undefined' && window !== null) {

		var revivalIMAjsApp = () => {
			//hack for browser Chrome, which has sometimes problem with rendering page
			document.body.style.display = 'none';
			document.body.offsetHeight; //eslint-disable-line
			document.body.style.display = '';

			//set React for ReactJS extension for browser
			window.React = window.$IMA.Vendor.get('React');
			window.React.initializeTouchEvents(true);
			window.$Debug = window.$IMA.$Debug;

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

			Object.assign(bootConfig, getInit());

			var app = createIMAJsApp();
			app.bootstrap.run(bootConfig);

			var cache = app.oc.get('$Cache');
			cache.deserialize(window.$IMA.Cache);

			var router = app.oc.get('$Router');
			router
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

		//revival IMA.js app
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			revivalIMAjsApp();
		} else {
			window.addEventListener('DOMContentLoaded', revivalIMAjsApp);
		}
	}

}

export { getInit, getNamespace, createIMAJsApp };
