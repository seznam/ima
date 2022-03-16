import Bootstrap from '../Bootstrap';
import ObjectContainer from '../ObjectContainer';
import { PluginLoader } from '../pluginLoader';
import namespace from '../namespace';

describe('pluginLoader', () => {
  let bootstrap, pluginLoader, objectContainer, bootConfig;

  beforeEach(() => {
    pluginLoader = new PluginLoader();
    objectContainer = new ObjectContainer(namespace);
    bootstrap = new Bootstrap(objectContainer);

    bootstrap._config = bootConfig;

    jest.spyOn(bootstrap, 'initPlugin');
  });

  describe('register method', () => {
    it('should register plugins to loader', () => {
      pluginLoader.register('plugin-1', jest.fn());
      pluginLoader.register('plugin-2', jest.fn());
      pluginLoader.register('plugin-3', jest.fn());

      expect(pluginLoader._plugins).toHaveLength(3);
    });

    it('should call register function on plugins', () => {
      let registerFunction = jest.fn();

      pluginLoader.register('plugin-name', registerFunction);

      // Should not init plugins dynamically when loaded statically
      expect(bootstrap.initPlugin).not.toHaveBeenCalled();
      expect(registerFunction).toHaveBeenCalledTimes(1);
    });

    it('should dynamically load plugins if the app is already bootstrapped', () => {
      let pluginInterface = {};
      let registerFunction = jest.fn(() => pluginInterface);

      pluginLoader.init(bootstrap);
      pluginLoader.register('plugin-name', registerFunction);

      expect(registerFunction).toHaveBeenCalledTimes(1);
      expect(bootstrap.initPlugin).toHaveBeenCalledWith(
        'plugin-name',
        pluginInterface
      );
    });
  });
});
