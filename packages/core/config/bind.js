import vendorLinker from '../vendorLinker';
import Cache from '../cache/Cache';
import CacheEntry from '../cache/CacheEntry';
import CacheFactory from '../cache/CacheFactory';
import CacheImpl from '../cache/CacheImpl';
import ControllerDecorator from '../controller/ControllerDecorator';
import DevTool from '../debug/DevTool';
import Dictionary from '../dictionary/Dictionary';
import MessageFormatDictionary from '../dictionary/MessageFormatDictionary';
import EventBus from '../event/EventBus';
import EventBusImpl from '../event/EventBusImpl';
import Dispatcher from '../event/Dispatcher';
import DispatcherImpl from '../event/DispatcherImpl';
import GenericError from '../error/GenericError';
import HttpAgent from '../http/HttpAgent';
import HttpAgentImpl from '../http/HttpAgentImpl';
import HttpProxy from '../http/HttpProxy';
import UrlTransformer from '../http/UrlTransformer';
import MetaManager from '../meta/MetaManager';
import MetaManagerImpl from '../meta/MetaManagerImpl';
import PageFactory from '../page/PageFactory';
import ClientPageManager from '../page/manager/ClientPageManager';
import PageManager from '../page/manager/PageManager';
import ServerPageManager from '../page/manager/ServerPageManager';
import ClientPageRenderer from '../page/renderer/ClientPageRenderer';
import PageRenderer from '../page/renderer/PageRenderer'
import PageRendererFactory from '../page/renderer/PageRendererFactory';
import ServerPageRenderer from '../page/renderer/ServerPageRenderer';
import ViewAdapter from '../page/renderer/ViewAdapter';
import PageStateManager from '../page/state/PageStateManager';
import PageStateManagerDecorator from '../page/state/PageStateManagerDecorator';
import PageStateManagerImpl from '../page/state/PageStateManagerImpl';
import ClientRouter from '../router/ClientRouter';
import RouterEvents from '../router/Events';
import Request from '../router/Request';
import Response from '../router/Response';
import Route from '../router/Route';
import RouteFactory from '../router/RouteFactory';
import RouteNames from '../router/RouteNames';
import Router from '../router/Router';
import ServerRouter from '../router/ServerRouter';
import CookieStorage from '../storage/CookieStorage';
import MapStorage from '../storage/MapStorage';
import SessionMapStorage from '../storage/SessionMapStorage';
import SessionStorage from '../storage/SessionStorage';
import WeakMapStorage from '../storage/WeakMapStorage';
import ClientWindow from '../window/ClientWindow';
import ServerWindow from '../window/ServerWindow';
import Window from '../window/Window';

export let init = (ns, oc, config) => { //jshint ignore:line

	//**************START VENDORS**************

	oc.constant('$Helper', vendorLinker.get('ima-helpers', true));
	oc.constant('$Promise', Promise);

	//React
	oc.constant('$React', vendorLinker.get('react', true));
	oc.constant('$ReactDOM', vendorLinker.get('react-dom', true));
	oc.constant('$ReactDOMServer', vendorLinker.get('react-dom/server.js', true));

	//SuperAgent
	oc.constant('$SuperAgent', vendorLinker.get('superagent'));

	//*************END VENDORS*****************


	//*************START CONSTANTS*****************
	oc.constant('$Settings', config);
	oc.constant('$Env', config.$Env);
	oc.constant('$Protocol', config.$Protocol);
	oc.constant('$Secure', config.$Protocol === 'https:');
	//*************END CONSTANTS*****************


	//*************START IMA**************

	//Request & Response
	oc.bind('$Request', Request);
	oc.bind('$Response', Response);

	//Window helper
	if ((typeof window !== 'undefined') && (window !== null)) {
		oc.provide(Window, ClientWindow);
	} else {
		oc.provide(Window, ServerWindow);
	}
	oc.bind('$Window', Window);

	//IMA Error
	oc.bind('$Error', GenericError);

	//Dictionary
	oc.provide(Dictionary, MessageFormatDictionary);
	oc.bind('$Dictionary', Dictionary);

	//Storage
	oc.constant('$CookieTransformFunction', { encode: (s) => s, decode: (s) => s });
	oc.bind('$CookieStorage', CookieStorage, ['$Window', '$Request', '$Response']);
	if (oc.get('$Window').hasSessionStorage()) {
		oc.bind('$SessionStorage', SessionStorage);
	} else {
		oc.bind('$SessionStorage', MapStorage);
	}
	oc.bind('$MapStorage', MapStorage);
	oc.bind('$WeakMapStorage', WeakMapStorage, [{
		entryTtl: 30 * 60 * 1000,
		maxEntries: 1000,
		gcInterval: 60 * 1000,
		gcEntryCountTreshold: 16
	}]);
	oc.bind('$SessionMapStorage', SessionMapStorage, ['$MapStorage', '$SessionStorage']);

	// Dispatcher
	oc.provide(Dispatcher, DispatcherImpl);
	oc.bind('$Dispatcher', Dispatcher);

	// Custom Event Bus
	oc.provide(EventBus, EventBusImpl, ['$Window']);
	oc.bind('$EventBus', EventBus);

	//Cache
	oc.constant('$CacheEntry', CacheEntry);

	if (oc.get('$Window').hasSessionStorage()) {
		oc.constant('$CacheStorage', oc.get('$SessionMapStorage'));
	} else {
		oc.constant('$CacheStorage', oc.get('$MapStorage'));
	}
	oc.bind('$CacheFactory', CacheFactory, ['$CacheEntry']);
	oc.provide(Cache, CacheImpl, ['$CacheStorage', '$CacheFactory', '$Helper', config.$Cache]);
	oc.bind('$Cache', Cache);

	//SEO
	oc.provide(MetaManager, MetaManagerImpl);
	oc.bind('$MetaManager', MetaManager);
	oc.bind('$ControllerDecorator', ControllerDecorator);
	oc.bind('$PageStateManagerDecorator', PageStateManagerDecorator);

	//Page
	oc.provide(PageStateManager, PageStateManagerImpl);
	oc.bind('$PageStateManager', PageStateManager);
	oc.bind('$PageFactory', PageFactory, [oc]);
	oc.constant('$PageRendererViewAdapter', ViewAdapter);
	oc.bind('$PageRendererFactory', PageRendererFactory, [oc, '$React', '$PageRendererViewAdapter']);

	if (oc.get('$Window').isClient()) {
		oc.provide(PageRenderer, ClientPageRenderer, ['$PageRendererFactory', '$Helper', '$ReactDOM', '$Settings', '$Window']);
	} else {
		oc.provide(PageRenderer, ServerPageRenderer, ['$PageRendererFactory', '$Helper', '$ReactDOMServer', '$Settings', '$Response', '$Cache']);
	}
	oc.bind('$PageRenderer', PageRenderer);

	if (oc.get('$Window').isClient()) {
		oc.provide(PageManager, ClientPageManager, ['$PageFactory', '$PageRenderer', '$PageStateManager', '$Window', '$EventBus']);
	} else {
		oc.provide(PageManager, ServerPageManager, ['$PageFactory', '$PageRenderer', '$PageStateManager']);
	}
	oc.bind('$PageManager', PageManager);

	//Router
	oc.constant('$Route', Route);
	oc.bind('$RouteFactory', RouteFactory, ['$Route']);

	if (oc.get('$Window').isClient()) {
		oc.provide(Router, ClientRouter, ['$PageManager', '$RouteFactory', '$Dispatcher', '$Window']);
	} else {
		oc.provide(Router, ServerRouter, ['$PageManager', '$RouteFactory', '$Dispatcher', '$Request', '$Response']);
	}
	oc.bind('$Router', Router);

	//SuperAgent
	oc.bind('$HttpUrlTransformer', UrlTransformer);
	oc.bind('$SuperAgentProxy', HttpProxy, ['$SuperAgent', '$HttpUrlTransformer', '$Window']);
	oc.provide(HttpAgent, HttpAgentImpl, ['$SuperAgentProxy', '$Cache', '$CookieStorage', config.$Http]);
	oc.bind('$Http', HttpAgent);

	//Dev tools
	oc.bind('$DevTool', DevTool, ['$PageManager', '$PageStateManager', '$Window', '$Dispatcher', '$EventBus']);

	//*************END IMA****************

};
