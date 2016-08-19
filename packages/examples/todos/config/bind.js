import ListItemResource from 'app/model/listItem/Resource';
import ListItemFactory from 'app/model/listItem/Factory';
import ListItemService from 'app/model/listItem/Service';

import ErrorController from 'app/page/error/Controller';
import HomeController from 'app/page/home/Controller';
import NotFoundController from 'app/page/notFound/Controller';

export let init = (ns, oc, config) => {

	oc.inject(ListItemResource, []);
	oc.inject(ListItemFactory, []);
	oc.inject(ListItemService, [ListItemResource, ListItemFactory]);

	oc.inject(HomeController, [ListItemService]);
	oc.inject(ErrorController, []);
	oc.inject(NotFoundController, []);

	oc.constant('$Utils', {
		get $Router() { return oc.get('$Router'); },
		get $Dispatcher() { return oc.get('$Dispatcher'); },
		get $EventBus() { return oc.get('$EventBus'); },
		get $Dictionary() { return oc.get('$Dictionary'); },
		get $Settings() { return oc.get('$Settings'); },
		get $Window() { return oc.get('$Window'); }
	});
};
