export var init = (ns, oc, config) => {

	// Page Home
	oc.bind('HomeController', ns.App.Page.Home.Controller, []);

	// Page Error
	oc.bind('ErrorController', ns.App.Page.Error.Controller, []);

	// Page Not Found
	oc.bind('NotFoundController', ns.App.Page.NotFound.Controller, []);

};