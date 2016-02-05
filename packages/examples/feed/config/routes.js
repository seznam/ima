export var init = (ns, oc, config) => {
	var router = oc.get('$Router');
	var ROUTES = ns.Core.Router.ROUTE_NAMES;

	router
		.add(ROUTES.ERROR, '/error', ns.App.Page.Error.Controller, ns.App.Page.Error.View)
		.add(ROUTES.NOT_FOUND, '/not-found', ns.App.Page.NotFound.Controller, ns.App.Page.NotFound.View)
		.add('home', '/', ns.App.Page.Home.Controller, ns.App.Page.Home.View)
		.add('category', '/:category', ns.App.Page.Home.Controller, ns.App.Page.Home.View)
		.add('post', '/:category/:itemId', ns.App.Page.Detail.Controller, ns.App.Page.Detail.View);
};
