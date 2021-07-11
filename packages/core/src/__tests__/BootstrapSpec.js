import Bootstrap from '../Bootstrap';
import ObjectContainer from '../ObjectContainer';
import namespace from '../namespace';

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
    settings: {
      $Env: 'prod'
    },
    plugins: [{ name: 'test-plugin', module: plugin }],
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
      jest.spyOn(bootstrap, '_initSettings').mockImplementation();

      jest.spyOn(bootstrap, '_bindDependencies').mockImplementation();

      jest.spyOn(bootstrap, '_initServices').mockImplementation();

      jest.spyOn(bootstrap, '_initRoutes').mockImplementation();

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
      jest.spyOn(bootstrap, '_getEnvironmentSetting').mockReturnValue({});
    });

    it('it should call initSettings method for app', () => {
      jest.spyOn(bootConfig, 'initSettings');

      bootstrap._initSettings();

      expect(bootConfig.initSettings).toHaveBeenCalled();
    });

    it('it should call initSettings method for plugin', () => {
      jest.spyOn(plugin, 'initSettings');

      bootstrap._initSettings();

      expect(plugin.initSettings).toHaveBeenCalled();
    });
  });

  describe('_bindDependencies method', () => {
    it('should set ima binding state to object container', () => {
      jest.spyOn(objectContainer, 'setBindingState');

      bootstrap._bindDependencies();

      expect(objectContainer.setBindingState).toHaveBeenCalledWith(
        ObjectContainer.IMA_BINDING_STATE
      );
    });

    it('should set plugin binding state to object container', () => {
      jest.spyOn(objectContainer, 'setBindingState');

      bootstrap._bindDependencies();

      expect(objectContainer.setBindingState).toHaveBeenCalledWith(
        ObjectContainer.PLUGIN_BINDING_STATE,
        'test-plugin'
      );
    });

    it('should set app binding state to object container', () => {
      jest.spyOn(objectContainer, 'setBindingState');

      bootstrap._bindDependencies();

      expect(objectContainer.setBindingState).toHaveBeenCalledWith(
        ObjectContainer.APP_BINDING_STATE
      );
    });

    it('should bind ima', () => {
      jest.spyOn(bootConfig, 'initBindIma');

      bootstrap._bindDependencies();

      expect(bootConfig.initBindIma).toHaveBeenCalledWith(
        namespace,
        objectContainer,
        {
          $Env: 'prod',
          __meta__: {}
        },
        'ima.core'
      );
    });

    it('should bind ima plugin', () => {
      jest.spyOn(plugin, 'initBind');

      bootstrap._bindDependencies();

      expect(plugin.initBind).toHaveBeenCalledWith(
        namespace,
        objectContainer,
        {
          $Env: 'prod',
          __meta__: {}
        },
        'test-plugin'
      );
    });

    it('should bind app', () => {
      jest.spyOn(bootConfig, 'initBindApp');

      bootstrap._bindDependencies();

      expect(bootConfig.initBindApp).toHaveBeenCalledWith(
        namespace,
        objectContainer,
        {
          $Env: 'prod',
          __meta__: {}
        },
        'app'
      );
    });
  });

  describe('_initRoutes method', () => {
    it('should initalize app route', () => {
      let router = {};

      jest.spyOn(bootConfig, 'initRoutes');
      jest.spyOn(objectContainer, 'get').mockReturnValue(router);

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
