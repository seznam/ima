export var init = (ns, oc, config) => {

	// Page Home
	oc.bind('HomeView', ns.App.Page.Home.View, ['$BindReact']);
	oc.bind('HomeController', ns.App.Page.Home.Controller, ['HomeView']);

	// Page Error
	oc.bind('ErrorView', ns.App.Page.Error.View, ['$BindReact']);
	oc.bind('ErrorController', ns.App.Page.Error.Controller, ['ErrorView']);

	// Page Not Found
	oc.bind('NotFoundView', ns.App.Page.NotFound.View, ['$BindReact']);
	oc.bind('NotFoundController', ns.App.Page.NotFound.Controller, ['NotFoundView']);

};