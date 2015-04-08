import ns from 'core/namespace/ns.js';

// Import app/config
import {init as initBindCore} from 'core/config/bind.js';
import {init as initBindApp} from '../../app/config/bind.js';
import {init as initRoute} from '../../app/config/route.js';
import {init as initHandlerCore} from 'core/config/handler.js';
import {init as initHandlerApp} from '../../app/config/handler.js';
import {init as initSetting} from '../../app/config/setting.js';

var getInit = () => {
	return {initBindCore, initBindApp, initRoute, initHandlerCore, initHandlerApp, initSetting};
};

var getNameSpace = () => {
	return ns;
};

//only on client side
if (typeof window !== 'undefined' && window !== null) {

	//check enviroment
	if (window.$IMA.Test === true) {

		var boot = ns.oc.get('$Boot');

		var bootConfig = {
			vendor: window.$IMA.Vendor,
			handler: {
				respond: null,
				request: null,
				$IMA: window.$IMA,
				dictionary: {
					language: window.$IMA.Language,
					dictionary: window.$IMA.i18n
				},
				router: {
					domain: window.$IMA.Domain,
					root: window.$IMA.Root,
					languagePartPath: window.$IMA.LanguagePartPath
				}
			},
			setting: {
				env: 'dev',
				language: 'en',
				protocol: 'http:'
			}
		};

		Object.assign(bootConfig, getInit());
		boot.run(bootConfig);

		window.ns = ns;

	} else {

		window.addEventListener('error', (e) => {
			if (ns.oc.has('$Router')) {
				ns.oc
					.get('$Router')
					.handleError(e.error)
			}
		});

		window.addEventListener('DOMContentLoaded', () => {

			//set React for ReactJS extension for browser
			window.React = window.$IMA.Vendor.get('React');

			var boot = ns.oc.get('$Boot');

			var bootConfig = {
				vendor: window.$IMA.Vendor,
				handler: {
					respond: null,
					request: null,
					$IMA: window.$IMA,
					dictionary: {
						language: window.$IMA.Language,
						dictionary: window.$IMA.i18n
					},
					router: {
						protocol: window.$IMA.Protocol,
						domain: window.$IMA.Domain,
						root: window.$IMA.Root,
						languagePartPath: window.$IMA.LanguagePartPath
					}
				},
				setting: {
					env: window.$IMA.Environment,
					language: window.$IMA.Language,
					protocol: window.$IMA.Protocol,
					domain: window.$IMA.Domain,
					root: window.$IMA.Root,
					languagePartPath: window.$IMA.LanguagePartPath
				}
			};

			Object.assign(bootConfig, getInit());
			boot.run(bootConfig);

			var cache = ns.oc.get('$Cache');
			cache.deserialize(window.$IMA.Cache);

			var router = ns.oc.get('$Router');

			router
				.listen()
				.route(router.getPath());
		});
	}
}

export {getInit, getNameSpace};