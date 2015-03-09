import ns from 'core/namespace/ns.js';

// Import app/config
import {init as initBindCore} from 'core/config/bind.js';
import {init as initBindApp} from '../../app/config/bind.js';
import {init as initRoute} from '../../app/config/route.js';
import {init as initDictionaryCore} from 'core/config/dictionary.js';
import {init as initDictionaryApp} from '../../app/config/dictionary.js';
import {init as initVariableCore} from 'core/config/variable.js';
import {init as initVariableApp} from '../../app/config/variable.js';
import {init as initSetting} from '../../app/config/setting.js';

var getInit = () => {
	return {initBindCore, initBindApp, initRoute, initDictionaryCore, initDictionaryApp, initVariableCore, initVariableApp, initSetting};
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
			dictionary: {
				language: 'cs',
				dictionary: window.$IMA.i18n
			},
			variable: {
				respond: null,
				request: null
			}
		};

		Object.assign(bootConfig, getInit());
		boot.run(bootConfig);

		window.ns = ns;

	} else {

		//TODO onerror call boot with config
		window.addEventListener('error', () => {
		});

		window.addEventListener('load', () => {

			//set React for ReactJS extension for browser
			window.React = window.$IMA.Vendor.get('React');

			var boot = ns.oc.get('$Boot');

			var bootConfig = {
				vendor: window.$IMA.Vendor,
				dictionary: {
					language: window.$IMA.Language,
					dictionary: window.$IMA.i18n
				},
				variable: {
					respond: null,
					request: null
				},
				setting: {
					env: window.$IMA.Enviroment,
					language: window.$IMA.Language,
					protocol: window.$IMA.Protocol
				}
			};

			Object.assign(bootConfig, getInit());
			boot.run(bootConfig);

			 var cache = ns.oc.get('$Cache');
			 cache.deserialize(window.$IMA.Cache);

			 var router = ns.oc.get('$Router');
			 router
				 .init({mode: 'history'})
				 .listen()
				 .route(router.getPath());
		});
	}
}

export {getInit, getNameSpace};