import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

// Import app/config
import {init as initBindCore} from 'imajs/client/core/config/bind.js';
import {init as initBindApp} from 'app/config/bind.js';
import {init as initRoutes} from 'app/config/routes.js';
import {init as initServicesCore} from 'imajs/client/core/config/services.js';
import {init as initServicesApp} from 'app/config/services.js';
import {init as initSettings} from 'app/config/settings.js';

var getInit = () => {
	return {initBindCore, initBindApp, initRoutes, initServicesCore, initServicesApp, initSettings};
};

var getNameSpace = () => {
	return ns;
};

var getObjectContainer = () => {
	return oc;
};

var getBootstrap = () => {
	return bootstrap;
};

//only on client side
if (typeof window !== 'undefined' && window !== null) {

	//check enviroment
	if (window.$IMA.Test === true) {

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
					$Domain: window.$IMA.$Domain,
					$Root: window.$IMA.$Root,
					$LanguagePartPath: window.$IMA.$LanguagePartPath
				}
			},
			settings: {
				$Env: 'dev',
				$Language: 'en',
				$Protocol: 'http:'
			}
		};

		Object.assign(bootConfig, getInit());
		bootstrap.run(bootConfig);

		window.ns = ns;
		window.oc = oc;

	} else {

		/*window.addEventListener('error', (e) => {
			if (oc.has('$Router')) {
				oc
					.get('$Router')
					.handleError(e.error)
			}
		});*/

		window.addEventListener('DOMContentLoaded', () => {

			//set React for ReactJS extension for browser
			window.React = window.$IMA.Vendor.get('React');
			window.React.initializeTouchEvents(true);

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
						$Domain: window.$IMA.$Domain,
						$Root: window.$IMA.$Root,
						$LanguagePartPath: window.$IMA.$LanguagePartPath
					}
				},
				settings: {
					$Env: window.$IMA.$Env,
					$Language: window.$IMA.$Language,
					$Protocol: window.$IMA.$Protocol,
					$Domain: window.$IMA.$Domain,
					$Root: window.$IMA.$Root,
					$LanguagePartPath: window.$IMA.$LanguagePartPath
				}
			};

			Object.assign(bootConfig, getInit());
			bootstrap.run(bootConfig);

			var cache = oc.get('$Cache');
			cache.deserialize(window.$IMA.Cache);

			var router = oc.get('$Router');

			router
				.listen()
				.route(router.getPath());
		});
	}
}

export {getInit, getNameSpace, getObjectContainer, getBootstrap};