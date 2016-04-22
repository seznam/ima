describe('Bootstrap', function() {

	var bootstrap = null;
	var objectContainer = null;
	var environments = {
		prod: {},
		test: {},
		dev: {}
	};
	var plugin = {
		$registerImaPlugin: function() {},
		initSettings: function() {
			return environments;
		},
		initBind: function() {}
	};
	var bootConfig = {
		plugins: [
			plugin
		],
		initSettings: function() {
			return environments;
		},
		initBindIma: function() {},
		initBindApp: function() {},
		initRoutes: function() {},
		bind: {},
		routes: {}
	};

	beforeEach(function() {
		objectContainer = new ns.ima.ObjectContainer(ns);
		bootstrap = new ns.ima.Bootstrap(objectContainer);

		bootstrap._config = bootConfig;
	});

	describe('run method', function() {

		beforeEach(function() {
			spyOn(bootstrap, '_initSettings')
				.and
				.stub();

			spyOn(bootstrap, '_bindDependencies')
				.and
				.stub();

			spyOn(bootstrap, '_initServices')
				.and
				.stub();

			spyOn(bootstrap, '_initRoutes')
				.and
				.stub();

			bootstrap.run(bootConfig);
		});

		it('should initialize settings', function() {
			expect(bootstrap._initSettings).toHaveBeenCalled();
		});

		it('should bind dependencies', function() {
			expect(bootstrap._bindDependencies).toHaveBeenCalled();
		});

		it('should initialize services', function() {
			expect(bootstrap._initServices).toHaveBeenCalled();
		});

		it('should initialize routes', function() {
			expect(bootstrap._initRoutes).toHaveBeenCalled();
		});
	});

	describe('_initSettings method', function() {

		beforeEach(function() {
			spyOn(bootstrap, '_getEnvironmentSetting')
				.and
				.returnValue({});
		});

		it('it should call initSettings method for app', function() {
			spyOn(bootConfig, 'initSettings')
				.and
				.callThrough();

			bootstrap._initSettings();

			expect(bootConfig.initSettings).toHaveBeenCalled();
		});

		it('it should call initSettings method for plugin', function() {
			spyOn(plugin, 'initSettings')
				.and
				.callThrough();

			bootstrap._initSettings();

			expect(plugin.initSettings).toHaveBeenCalled();
		});
	});

	describe('_bindDependencies method', function() {

		it('should lock object container', function() {
			spyOn(objectContainer, 'lock').and.callThrough();

			bootstrap._bindDependencies();

			expect(objectContainer.lock).toHaveBeenCalledWith();
		});

		it('should unlock object container', function() {
			spyOn(objectContainer, 'unlock').and.callThrough();

			bootstrap._bindDependencies();

			expect(objectContainer.unlock).toHaveBeenCalledWith();
		});

		it('should bind ima', function() {
			spyOn(bootConfig, 'initBindIma');

			bootstrap._bindDependencies();

			expect(bootConfig.initBindIma).toHaveBeenCalledWith(ns, objectContainer, {});
		});

		it('should bind ima plugin', function() {
			spyOn(plugin, 'initBind');

			bootstrap._bindDependencies();

			expect(plugin.initBind).toHaveBeenCalledWith(ns, objectContainer, {});
		});

		it('should bind app', function() {
			spyOn(bootConfig, 'initBindApp');

			bootstrap._bindDependencies();

			expect(bootConfig.initBindApp).toHaveBeenCalledWith(ns, objectContainer, {});
		});

	});

	describe('_initRoutes method', function() {

		it('should initalize app route', function() {
			spyOn(bootConfig, 'initRoutes');

			bootstrap._initRoutes();

			expect(bootConfig.initRoutes).toHaveBeenCalledWith(ns, objectContainer, bootConfig.routes);
		});

	});

});
