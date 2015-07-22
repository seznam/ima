export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTES = oc.get('$ROUTE_NAMES');

	router
		.add('home', '/', ns.App.Page.Home.Controller, ns.App.Page.Home.View)
		.add(ROUTES.ERROR, '/error', ns.App.Page.Error.Controller, ns.App.Page.Error.View)
		.add(ROUTES.NOT_FOUND, '/not-found', ns.App.Page.NotFound.Controller, ns.App.Page.NotFound.View)
		.add('filtered', '/:filter', ns.App.Page.Home.Controller, ns.App.Page.Home.View);

};
