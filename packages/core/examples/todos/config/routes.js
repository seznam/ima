export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS');

	router
		.add('home', '/', ns.App.Page.Home.Controller, ns.App.Page.Home.View)
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.ERROR, '/error', ns.App.Page.Error.Controller, ns.App.Page.Error.View)
		.add(ROUTER_CONSTANTS.ROUTE_NAMES.NOT_FOUND, '/not-found', ns.App.Page.NotFound.Controller, ns.App.Page.NotFound.View)
		.add('filtered', '/:filter', ns.App.Page.Home.Controller, ns.App.Page.Home.View);

};
