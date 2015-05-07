export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTES = oc.get('$ROUTE_NAMES');

	router
		.add('home', '/', 'HomeController', 'HomeView')
		.add(ROUTES.ERROR, '/error', 'ErrorController', 'ErrorView')
		.add(ROUTES.NOT_FOUND, '/not-found', 'NotFoundController', 'NotFoundView');

};
