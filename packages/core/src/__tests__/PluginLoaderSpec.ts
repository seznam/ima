import { BootConfig, Bootstrap, InitPluginConfig } from '../Bootstrap';
import { ns } from '../Namespace';
import { ObjectContainer } from '../oc/ObjectContainer';
import { PluginLoader } from '../pluginLoader';

describe('pluginLoader', () => {
  let bootstrap: Bootstrap;
  let pluginLoader: PluginLoader;
  let objectContainer: ObjectContainer;
  let bootConfig: BootConfig;

  beforeEach(() => {
    pluginLoader = new PluginLoader();
    objectContainer = new ObjectContainer(ns);
    bootstrap = new Bootstrap(objectContainer);

    bootstrap['_config'] = bootConfig;

    jest.spyOn(bootstrap, 'initPlugin');
  });

  describe('register method', () => {
    it('should register plugins to loader', () => {
      pluginLoader.register('plugin-1', jest.fn());
      pluginLoader.register('plugin-2', jest.fn());
      pluginLoader.register('plugin-3', jest.fn());

      expect(Object.values(pluginLoader['_plugins'])).toHaveLength(3);
    });

    it('should call register function on plugins', () => {
      const registerFunction = jest.fn();

      pluginLoader.register('plugin-name', registerFunction);

      // Should not init plugins dynamically when loaded statically
      expect(bootstrap.initPlugin).not.toHaveBeenCalled();
      expect(registerFunction).toHaveBeenCalledTimes(1);
    });

    it('should dynamically load plugins if the app is already bootstrapped', () => {
      const pluginInterface = {} as InitPluginConfig;
      const registerFunction = jest.fn(() => pluginInterface);

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
