export var init = (ns, oc, config) => {

	// Page Home
	oc.bind('HomeController', ns.App.Page.Home.Controller);
	oc.bind('HomeView', () => oc.get('App.Page.Home.View'));

	// Page Error
	oc.bind('ErrorController', ns.App.Page.Error.Controller);
	oc.bind('ErrorView', () => oc.get('App.Page.Error.View'));

	// Page Not Found
	oc.bind('NotFoundController', ns.App.Page.NotFound.Controller);
	oc.bind('NotFoundView', () => oc.get('App.Page.NotFound.View'));

};