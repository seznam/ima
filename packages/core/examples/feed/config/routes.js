export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTE_NAMES = oc.get('$ROUTE_NAMES');

	router
		.add('home', '/', 'HomeController', 'App.Page.Home.View')
		.add('category', '/:category', 'HomeController', 'App.Page.Home.View')
		.add('post', '/:category/:itemId', 'DetailController', 'App.Page.Detail.View')
		.add(ROUTE_NAMES.ERROR, '/error', 'ErrorController', 'App.Page.Error.View')
		.add(ROUTE_NAMES.NOT_FOUND, '/not-found', 'NotFoundController', 'App.Page.NotFound.View');

	router.link('post', {category: 'green', itemId: 1, filter: 'aaaa'});

};
