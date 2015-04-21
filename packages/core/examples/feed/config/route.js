export var init = (ns, oc, config) => {
	var router = oc.get('$Router');

	router
		.add('home', '/', 'HomeController', 'App.Page.Home.View')
		.add('category', '/:category', 'HomeController', 'App.Page.Home.View')
		.add('post', '/:category/:itemId', 'DetailController', 'App.Page.Detail.View')
		.add(router.ROUTE_NAME_ERROR, '/error', 'ErrorController', 'App.Page.Error.View')
		.add(router.ROUTE_NAME_NOT_FOUND, '/not-found', 'NotFoundController', 'App.Page.NotFound.View');

};
