import Dictionary from 'ima/dictionary/Dictionary';
import Dispatcher from 'ima/event/Dispatcher';
import EventBus from 'ima/event/EventBus';
import Router from 'ima/router/Router';
import Window from 'ima/window/Window';

import ListItemResource from '../model/listItem/ListItemResource';
import ListItemFactory from '../model/listItem/ListItemFactory';
import ListItemService from '../model/listItem/ListItemService';

import ErrorController from '../page/error/ErrorController';
import HomeController from '../page/home/HomeController';
import NotFoundController from '../page/notFound/NotFoundController';

export let init = (ns, oc, config) => {

	oc.inject(ListItemResource, []);
	oc.inject(ListItemFactory, []);
	oc.inject(ListItemService, [ListItemResource, ListItemFactory]);

	oc.inject(HomeController, [ListItemService]);
	oc.inject(ErrorController, []);
	oc.inject(NotFoundController, []);

	oc.constant('$Utils', {
		get $Router() { return oc.get(Router); },
		get $Dispatcher() { return oc.get(Dispatcher); },
		get $EventBus() { return oc.get(EventBus); },
		get $Dictionary() { return oc.get(Dictionary); },
		get $Settings() { return oc.get('$Settings'); },
		get $Window() { return oc.get(Window); }
	});
};
