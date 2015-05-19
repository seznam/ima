export var init = (ns, oc, config) => {

	oc
		.get('$Dictionary')
		.init(config.dictionary);

	oc
		.get('$Dispatcher')
		.clear();

	oc
		.get('$Request')
		.init(config.request);

	oc
		.get('$Response')
		.init(config.response);

	oc
		.get('$CookieStorage')
		.clear()
		.init({secure: oc.get('$SECURE')});

	oc
		.get('$SessionStorage')
		.init();

	if (!oc.get('$Window').hasSessionStorage()) {
		oc
			.get('$SessionStorage')
			.clear();
	}

	oc
		.get('$Router')
		.init(config.router);

	oc
		.get('$PageManager')
		.init();

};
