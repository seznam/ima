import Dispatcher from '../event/Dispatcher';
import DevTool from '../debug/DevTool';
import Dictionary from '../dictionary/Dictionary';
import UrlTransformer from '../http/UrlTransformer';
import PageManager from '../page/manager/PageManager';
import PageStateManager from '../page/state/PageStateManager';
import Request from '../router/Request';
import Response from '../router/Response';
import Router from '../router/Router';
import CookieStorage from '../storage/CookieStorage';
import Window from '../window/Window';

export let init = (ns, oc, config) => {

	oc
		.get(Dictionary)
		.init(config.dictionary);

	oc
		.get(Dispatcher)
		.clear();

	oc
		.get(Request)
		.init(config.request);

	oc
		.get(Response)
		.init(config.response, oc.get('$CookieTransformFunction'));

	if (!oc.get(Window).isClient()) {
		oc
			.get(CookieStorage)
			.clear();

		oc
			.get('$SessionStorage')
			.clear();

		oc
			.get('$CacheStorage')
			.clear();
	}

	oc
		.get(CookieStorage)
		.init(
			{ secure: oc.get('$Secure') },
			oc.get('$CookieTransformFunction')
		);

	oc
		.get('$SessionStorage')
		.init();

	oc
		.get('$CacheStorage')
		.init();

	oc
		.get(Router)
		.init(config.router);

	oc
		.get(PageManager)
		.init();

	oc
		.get(PageStateManager)
		.clear();

	oc
		.get(UrlTransformer)
		.clear();

	oc
		.get(DevTool)
		.init();

};
