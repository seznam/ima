export var init = (ns, oc, config) => {
	var router = oc.get('$Router');

	router
		.add('home', '/', 'HomeController')
		.add('category', '/:category', 'HomeController')
		.add('post', '/:category/:itemId', 'DetailController')
		.add(router.ROUTE_NAME_ERROR, '/error', 'ErrorController')
		.add(router.ROUTE_NAME_NOT_FOUND, '/not-found', 'NotFoundController');

};
