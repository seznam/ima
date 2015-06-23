export var init = (ns, oc, config) => {

	oc.inject(ns.App.Model.ListItem.Resource, []);
	oc.inject(ns.App.Model.ListItem.Factory, []);
	oc.inject(ns.App.Model.ListItem.Service, [
		ns.App.Model.ListItem.Resource,
		ns.App.Model.ListItem.Factory
	]);

	oc.inject(ns.App.Page.Home.Controller, [
		ns.App.Model.ListItem.Service
	]);

	oc.inject(ns.App.Page.Error.Controller, []);

	oc.inject(ns.App.Page.NotFound.Controller, []);

	oc.constant('$Utils', {
		get $Router() { return oc.get('$Router'); },
		get $Dispatcher() { return oc.get('$Dispatcher'); },
		get $EventBus() { return oc.get('$EventBus'); },
		get $Dictionary() { return oc.get('$Dictionary'); },
		get $Settings() { return oc.get('$Settings'); },
		get $Window() { return oc.get('$Window'); }
	});
};
