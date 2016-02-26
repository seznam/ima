import HomeController from 'app/page/home/HomeController';
import HomeView from 'app/page/home/HomeView';
import ErrorController from 'app/page/error/ErrorController';
import ErrorView from 'app/page/error/ErrorView';
import NotFoundController from 'app/page/notFound/NotFoundController';
import NotFoundView from 'app/page/notFound/NotFoundView';

export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS');

	router
		.add('home', '/', HomeController, HomeView)
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.ERROR, '/error', ErrorController, ErrorView)
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);

};
