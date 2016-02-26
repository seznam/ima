export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS')

	router
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.ERROR, '/error', ns.app.page.error.Controller, ns.app.page.error.View)
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.NOT_FOUND, '/not-found', ns.app.page.notFound.Controller, ns.app.page.notFound.View)
		.add('home', '/', ns.app.page.home.Controller, ns.app.page.home.View)
		.add('category', '/:category', ns.app.page.home.Controller, ns.app.page.home.View)
		.add('post', '/:category/:itemId', ns.app.page.detail.Controller, ns.app.page.detail.View);
};
