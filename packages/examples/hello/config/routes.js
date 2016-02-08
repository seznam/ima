import HomeController from 'app/page/home/controller';
import HomeView from 'app/page/home/view';
import ErrorController from 'app/page/error/controller';
import ErrorView from 'app/page/error/view';
import NotFoundController from 'app/page/notFound/controller';
import NotFoundView from 'app/page/notFound/view';

export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS');

	router
		.add('home', '/', HomeController, HomeView)
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.ERROR, '/error', ErrorController, ErrorView)
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);

};
