import Bootstrap from '../Bootstrap';
import ObjectContainer from '../ObjectContainer';
import namespace from '../Namespace';

describe('bootstrap', () => {
  let bootstrap, objectContainer, environments, plugin, bootConfig;

  beforeEach(() => {
    bootstrap = null;
    objectContainer = null;

    environments = {
      prod: {},
      test: {},
      dev: {},
    };

    plugin = {
      $registerImaPlugin: jest.fn(() => {}),
      initSettings: jest.fn(() => ({ prod: { pluginSettings: true } })),
      initBind: jest.fn(() => {}),
      initServices: jest.fn(() => {}),
    };

    bootConfig = {
      settings: {
        $Env: 'prod',
      },
      plugins: [{ name: 'test-plugin', module: plugin }],
      initSettings: () => environments,
      initBindIma: () => {},
      initBindApp: () => {},
      initRoutes: () => {},
      bind: {},
      routes: {},
    };

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
      expect(bootstrap._initSettings).toHaveBeenCalledTimes(1);
    });

    it('should bind dependencies', () => {
      expect(bootstrap._bindDependencies).toHaveBeenCalledTimes(1);
    });

    it('should initialize services', () => {
      expect(bootstrap._initServices).toHaveBeenCalledTimes(1);
    });

    it('should initialize routes', () => {
      expect(bootstrap._initRoutes).toHaveBeenCalledTimes(1);
    });
  });

  describe('initPlugin method', () => {
    let module;

    beforeEach(() => {
      jest.spyOn(bootstrap, '_initPluginSettings').mockImplementation();
      jest.spyOn(bootstrap, '_bindPluginDependencies').mockImplementation();
      jest.spyOn(bootstrap, '_initPluginServices').mockImplementation();

      module = jest.fn(() => {});
      bootstrap.initPlugin('plugin-name', module);
    });

    it('should initialize plugin settings', () => {
      expect(bootstrap._initPluginSettings).toHaveBeenCalledWith(
        'plugin-name',
        module
      );
    });

    it('should bind plugin', () => {
      expect(bootstrap._bindPluginDependencies).toHaveBeenCalledWith(
        'plugin-name',
        module
      );
    });

    it('should initialize plugin services', () => {
      expect(bootstrap._initPluginServices).toHaveBeenCalledWith(module);
    });
  });

  describe('_initSettings method', () => {
    it('should call initSettings method for app', () => {
      jest.spyOn(bootConfig, 'initSettings');

      bootstrap._initSettings();

      expect(bootConfig.initSettings).toHaveBeenCalledTimes(1);
    });

    it('should call initSettings method for plugin', () => {
      bootstrap._initSettings();

      expect(plugin.initSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('_initPluginSettings method', () => {
    it('should init plugin settings', () => {
      expect(bootstrap._config.bind).toStrictEqual({});

      bootstrap._initPluginSettings('plugin-name', plugin);

      expect(plugin.initSettings).toHaveBeenCalledWith(
        namespace,
        objectContainer,
        { $Env: 'prod' },
        true
      );

      expect(bootstrap._config.bind).toStrictEqual({
        __meta__: {
          pluginSettings: 'plugin-name',
        },
        pluginSettings: true,
      });
    });

    it('should ignore invalid module interfaces', () => {
      expect(bootstrap._config.bind).toStrictEqual({});

      bootstrap._initPluginSettings('invalid-plugin 1', {});
      bootstrap._initPluginSettings('invalid-plugin 2');
      bootstrap._initPluginSettings('invalid-plugin 3', null);

      expect(bootstrap._config.bind).toStrictEqual({});
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
        {},
        'ima.core'
      );
    });

    it('should bind ima plugin', () => {
      bootstrap._bindDependencies();

      expect(plugin.initBind).toHaveBeenCalledWith(
        namespace,
        objectContainer,
        {},
        false
      );
    });

    it('should bind app', () => {
      jest.spyOn(bootConfig, 'initBindApp');

      bootstrap._bindDependencies();

      expect(bootConfig.initBindApp).toHaveBeenCalledWith(
        namespace,
        objectContainer,
        {},
        'app'
      );
    });
  });

  describe('_bindPluginDependencies method', () => {
    beforeEach(() => {
      jest.spyOn(objectContainer, 'setBindingState');
    });

    it('should ignore invalid plugins', () => {
      bootstrap._initPluginSettings('invalid-plugin 1', {});
      bootstrap._initPluginSettings('invalid-plugin 2');
      bootstrap._initPluginSettings('invalid-plugin 3', null);

      expect(objectContainer.setBindingState).not.toHaveBeenCalled();
    });

    it('should bind plugin', () => {
      bootstrap._bindPluginDependencies('plugin-name', plugin);

      expect(plugin.initBind).toHaveBeenCalledWith(
        namespace,
        objectContainer,
        {},
        'plugin-name',
        true
      );

      expect(objectContainer.setBindingState).toHaveBeenNthCalledWith(
        1,
        'plugin',
        'plugin-name'
      );
      expect(objectContainer.setBindingState).toHaveBeenNthCalledWith(2, 'app');
    });

    it('should set binding state to "app" after binding', () => {
      bootstrap._bindPluginDependencies('plugin-name', plugin);

      expect(objectContainer._bindingState).toBe('app');
    });
  });

  describe('_initRoutes method', () => {
    it('should initialize app route', () => {
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

  describe('_initPluginServices method', () => {
    it('should init plugin services', () => {
      bootstrap._initPluginServices(plugin);

      expect(plugin.initServices).toHaveBeenCalledTimes(1);
    });
  });
});
