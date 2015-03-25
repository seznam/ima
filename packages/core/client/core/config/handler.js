export var init = (ns, config) => {

	ns.oc
		.get('$Request')
		.init(config.request);

	ns.oc
		.get('$Respond')
		.init(config.respond);

	ns.oc
		.get('$CookieStorage')
		.init();

	ns.oc
		.get('$CacheStorage')
		.init();

	ns.oc
		.get('$Dictionary')
		.init(config.dictionary);

};
