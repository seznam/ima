export let init = (ns, oc, config) => {

	oc.inject(ns.app.model.listItem.Resource, []);
	oc.inject(ns.app.model.listItem.Factory, []);
	oc.inject(ns.app.model.listItem.Service, [
		ns.app.model.listItem.Resource,
		ns.app.model.listItem.Factory
	]);

	oc.inject(ns.app.page.home.Controller, [
		ns.app.model.listItem.Service
	]);

	oc.inject(ns.app.page.error.Controller, []);

	oc.inject(ns.app.page.notFound.Controller, []);

	oc.constant('$Utils', {
		get $Router() { return oc.get('$Router'); },
		get $Dispatcher() { return oc.get('$Dispatcher'); },
		get $EventBus() { return oc.get('$EventBus'); },
		get $Dictionary() { return oc.get('$Dictionary'); },
		get $Settings() { return oc.get('$Settings'); },
		get $Window() { return oc.get('$Window'); }
	});
};
