import RouteNames from 'ima/router/RouteNames';

export var init = (ns, oc, config) => {
	var router = oc.get('$Router');

	router
		.add('home', '/', ns.app.page.home.Controller, ns.app.page.home.View)
		.add(RouteNames.ERROR, '/error', ns.app.page.error.Controller, ns.app.page.error.View)
		.add(RouteNames.NOT_FOUND, '/not-found', ns.app.page.notFound.Controller, ns.app.page.notFound.View)
		.add('filtered', '/:filter', ns.app.page.home.Controller, ns.app.page.home.View);

};
