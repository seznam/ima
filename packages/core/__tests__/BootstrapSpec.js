import Bootstrap from 'Bootstrap';
import ObjectContainer from 'ObjectContainer';
import namespace from 'namespace';

describe('Bootstrap', () => {
	let bootstrap = null;
	let objectContainer = null;
	let environments = {
		prod: {},
		test: {},
		dev: {}
	};
	let plugin = {
		$registerImaPlugin: () => {},
		initSettings: () => environments,
		initBind: () => {}
	};
	let bootConfig = {
		plugins: [plugin],
		initSettings: () => environments,
		initBindIma: () => {},
		initBindApp: () => {},
		initRoutes: () => {},
		bind: {},
		routes: {}
	};

	beforeEach(() => {
		objectContainer = new ObjectContainer(namespace);
		bootstrap = new Bootstrap(objectContainer);

		bootstrap._config = bootConfig;
	});

	describe('run method', () => {
		beforeEach(() => {
			spyOn(bootstrap, '_initSettings').and.stub();

			spyOn(bootstrap, '_bindDependencies').and.stub();

			spyOn(bootstrap, '_initServices').and.stub();

			spyOn(bootstrap, '_initRoutes').and.stub();

			bootstrap.run(bootConfig);
		});

		it('should initialize settings', () => {
			expect(bootstrap._initSettings).toHaveBeenCalled();
		});

		it('should bind dependencies', () => {
			expect(bootstrap._bindDependencies).toHaveBeenCalled();
		});

		it('should initialize services', () => {
			expect(bootstrap._initServices).toHaveBeenCalled();
		});

		it('should initialize routes', () => {
			expect(bootstrap._initRoutes).toHaveBeenCalled();
		});
	});

	describe('_initSettings method', () => {
		beforeEach(() => {
			spyOn(bootstrap, '_getEnvironmentSetting').and.returnValue({});
		});

		it('it should call initSettings method for app', () => {
			spyOn(bootConfig, 'initSettings').and.callThrough();

			bootstrap._initSettings();

			expect(bootConfig.initSettings).toHaveBeenCalled();
		});

		it('it should call initSettings method for plugin', () => {
			spyOn(plugin, 'initSettings').and.callThrough();

			bootstrap._initSettings();

			expect(plugin.initSettings).toHaveBeenCalled();
		});
	});

	describe('_bindDependencies method', () => {
		it('should set ima binding state to object container', () => {
			spyOn(objectContainer, 'setBindingState').and.callThrough();

			bootstrap._bindDependencies();

			expect(objectContainer.setBindingState).toHaveBeenCalledWith(
				ObjectContainer.IMA_BINDING_STATE
			);
		});

		it('should set plugin binding state to object container', () => {
			spyOn(objectContainer, 'setBindingState').and.callThrough();

			bootstrap._bindDependencies();

			expect(objectContainer.setBindingState).toHaveBeenCalledWith(
				ObjectContainer.PLUGIN_BINDING_STATE
			);
		});

		it('should set app binding state to object container', () => {
			spyOn(objectContainer, 'setBindingState').and.callThrough();

			bootstrap._bindDependencies();

			expect(objectContainer.setBindingState).toHaveBeenCalledWith(
				ObjectContainer.APP_BINDING_STATE
			);
		});

		it('should bind ima', () => {
			spyOn(bootConfig, 'initBindIma');

			bootstrap._bindDependencies();

			expect(bootConfig.initBindIma).toHaveBeenCalledWith(
				namespace,
				objectContainer,
				{}
			);
		});

		it('should bind ima plugin', () => {
			spyOn(plugin, 'initBind');

			bootstrap._bindDependencies();

			expect(plugin.initBind).toHaveBeenCalledWith(
				namespace,
				objectContainer,
				{}
			);
		});

		it('should bind app', () => {
			spyOn(bootConfig, 'initBindApp');

			bootstrap._bindDependencies();

			expect(bootConfig.initBindApp).toHaveBeenCalledWith(
				namespace,
				objectContainer,
				{}
			);
		});
	});

	describe('_initRoutes method', () => {
		it('should initalize app route', () => {
			let router = {};

			spyOn(bootConfig, 'initRoutes');
			spyOn(objectContainer, 'get').and.returnValue(router);

			bootstrap._initRoutes();

			expect(bootConfig.initRoutes).toHaveBeenCalledWith(
				namespace,
				objectContainer,
				bootConfig.routes,
				router
			);
		});
	});
});
