export var init = (ns, oc, config) => {

	// Page Home
	oc.inject(ns.App.Page.Home.Controller, []);

	// Page Error
	oc.inject(ns.App.Page.Error.Controller, []);

	// Page Not Found
	oc.inject(ns.App.Page.NotFound.Controller, []);

	//COMPONENT Utils
	oc.constant('$Utils', {
		$Router: oc.get('$Router'),
		$Dispatcher: oc.get('$Dispatcher'),
		$EventBus: oc.get('$EventBus'),
		$Dictionary: oc.get('$Dictionary'),
		$Settings: oc.get('$Settings'),
		$Window: oc.get('$Window')
	});
};
