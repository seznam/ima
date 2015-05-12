export var init = (ns, oc, config) => {

	oc
		.get('$Dictionary')
		.init(config.dictionary);

	oc
		.get('$Request')
		.init(config.request);

	oc
		.get('$Response')
		.init(config.response);

	oc
		.get('$CookieStorage')
		.init();

	oc
		.get('$CacheStorage')
		.init();

	oc
		.get('$Router')
		.init(config.router);

	oc
		.get('$PageManager')
		.init();

};
