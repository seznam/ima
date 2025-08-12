/* eslint-disable @typescript-eslint/ban-ts-comment */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Bootstrap, InitPluginConfig, BootConfig } from '../Bootstrap';
import { ns } from '../Namespace';
import { BindingState } from '../oc/BindingState';
import { ObjectContainer } from '../oc/ObjectContainer';
import { UnknownParameters } from '../types';

describe('bootstrap', () => {
  let bootstrap: Bootstrap;
  let objectContainer: ObjectContainer;
  let environments: UnknownParameters;
  let plugin: InitPluginConfig;
  let bootConfig: BootConfig;

  beforeEach(() => {
    environments = {
      prod: {},
      test: {},
      dev: {},
    };

    plugin = {
      // @ts-expect-error
      initSettings: vi.fn(() => ({ prod: { pluginSettings: true } })),
      initBind: vi.fn(() => {}),
      //@ts-ignore
      initServices: vi.fn(() => {}),
    };

    bootConfig = {
      // @ts-expect-error
      settings: {
        $Env: 'prod',
      },
      plugins: [{ name: 'test-plugin', plugin: plugin }],
      // @ts-expect-error
      initSettings: () => environments,
      initBindIma: () => {},
      initBindApp: () => {},
      initRoutes: () => {},
      initServicesApp: () => {},
      initServicesIma: () => {},
      // @ts-expect-error
      bind: {},
      routes: {},
      // @ts-expect-error
      services: {},
    };

    objectContainer = new ObjectContainer(ns);
    bootstrap = new Bootstrap(objectContainer);

    bootstrap['_config'] = bootConfig;
  });

  describe('run method', () => {
    beforeEach(() => {
      vi.spyOn(bootstrap, '_initSettings').mockImplementation();
      vi.spyOn(bootstrap, '_bindDependencies').mockImplementation();
      vi.spyOn(bootstrap, '_initServices').mockImplementation();
      vi.spyOn(bootstrap, '_initRoutes').mockImplementation();

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
    let plugin: InitPluginConfig;

    beforeEach(() => {
      vi.spyOn(bootstrap, '_initPluginSettings').mockImplementation();
      vi.spyOn(bootstrap, '_bindPluginDependencies').mockImplementation();
      vi.spyOn(bootstrap, '_initPluginServices').mockImplementation();

      // @ts-ignore
      plugin = vi.fn(() => {});
      bootstrap.initPlugin('plugin-name', plugin);
    });

    it('should initialize plugin settings', () => {
      expect(bootstrap._initPluginSettings).toHaveBeenCalledWith(
        'plugin-name',
        plugin
      );
    });

    it('should bind plugin', () => {
      expect(bootstrap._bindPluginDependencies).toHaveBeenCalledWith(
        'plugin-name',
        plugin
      );
    });

    it('should initialize plugin services', () => {
      expect(bootstrap._initPluginServices).toHaveBeenCalledWith(plugin);
    });
  });

  describe('_initSettings method', () => {
    it('should call initSettings method for app', () => {
      vi.spyOn(bootConfig, 'initSettings');

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
      expect(bootstrap['_config'].bind).toStrictEqual({});

      bootstrap._initPluginSettings('plugin-name', plugin);

      expect(plugin.initSettings).toHaveBeenCalledWith(
        ns,
        objectContainer,
        { $Env: 'prod' },
        true
      );

      expect(bootstrap['_config'].bind).toStrictEqual({
        __meta__: {
          pluginSettings: 'plugin-name',
        },
        pluginSettings: true,
      });
    });

    it('should ignore invalid plugin interfaces', () => {
      expect(bootstrap['_config'].bind).toStrictEqual({});

      // @ts-ignore
      bootstrap._initPluginSettings('invalid-plugin 1', {});
      // @ts-ignore
      bootstrap._initPluginSettings('invalid-plugin 2');
      // @ts-ignore
      bootstrap._initPluginSettings('invalid-plugin 3', null);

      expect(bootstrap['_config'].bind).toStrictEqual({});
    });
  });

  describe('_bindDependencies method', () => {
    it('should set ima binding state to object container', () => {
      vi.spyOn(objectContainer, 'setBindingState');

      bootstrap._bindDependencies();

      expect(objectContainer.setBindingState).toHaveBeenCalledWith(
        BindingState.IMA
      );
    });

    it('should set plugin binding state to object container', () => {
      vi.spyOn(objectContainer, 'setBindingState');

      bootstrap._bindDependencies();

      expect(objectContainer.setBindingState).toHaveBeenCalledWith(
        BindingState.Plugin,
        'test-plugin'
      );
    });

    it('should set app binding state to object container', () => {
      vi.spyOn(objectContainer, 'setBindingState');

      bootstrap._bindDependencies();

      expect(objectContainer.setBindingState).toHaveBeenCalledWith(
        BindingState.App
      );
    });

    it('should bind ima', () => {
      vi.spyOn(bootConfig, 'initBindIma');

      bootstrap._bindDependencies();

      expect(bootConfig.initBindIma).toHaveBeenCalledWith(
        ns,
        objectContainer,
        {},
        'ima.core'
      );
    });

    it('should bind ima plugin', () => {
      bootstrap._bindDependencies();

      expect(plugin.initBind).toHaveBeenCalledWith(
        ns,
        objectContainer,
        {},
        false
      );
    });

    it('should bind app', () => {
      vi.spyOn(bootConfig, 'initBindApp');

      bootstrap._bindDependencies();

      expect(bootConfig.initBindApp).toHaveBeenCalledWith(
        ns,
        objectContainer,
        {},
        'app'
      );
    });
  });

  describe('_bindPluginDependencies method', () => {
    beforeEach(() => {
      vi.spyOn(objectContainer, 'setBindingState');
    });

    it('should ignore invalid plugins', () => {
      // @ts-ignore
      bootstrap._initPluginSettings('invalid-plugin 1', {});
      // @ts-ignore
      bootstrap._initPluginSettings('invalid-plugin 3', null);

      expect(objectContainer.setBindingState).not.toHaveBeenCalled();
    });

    it('should bind plugin', () => {
      bootstrap._bindPluginDependencies('plugin-name', plugin);

      expect(plugin.initBind).toHaveBeenCalledWith(
        ns,
        objectContainer,
        {},
        true,
        'plugin-name'
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

      expect(objectContainer['_bindingState']).toBe('app');
    });
  });

  describe('_initRoutes method', () => {
    it('should initialize app route', () => {
      const router = {};

      vi.spyOn(bootConfig, 'initRoutes');
      vi.spyOn(objectContainer, 'get').mockReturnValue(router);

      bootstrap._initRoutes();

      expect(bootConfig.initRoutes).toHaveBeenCalledWith(
        ns,
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
