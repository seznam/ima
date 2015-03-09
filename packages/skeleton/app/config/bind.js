export var init = (ns) => {

	// Page Home
	ns.oc.bind('HomeView', ns.App.Page.Home.View, ['$BindReact']);
	ns.oc.bind('HomeController', ns.App.Page.Home.Controller, ['HomeView', '$BindPromise']);

	// Page Error
	ns.oc.bind('ErrorView', ns.App.Page.Error.View, ['$BindReact']);
	ns.oc.bind('ErrorController', ns.App.Page.Error.Controller, ['ErrorView', '$BindPromise']);

	// Page Not Found
	ns.oc.bind('NotFoundView', ns.App.Page.NotFound.View, ['$BindReact']);
	ns.oc.bind('NotFoundController', ns.App.Page.NotFound.Controller, ['NotFoundView', '$BindPromise']);

};