/** @jest-environment jsdom */

import '@testing-library/jest-dom';

import {
  AbstractController,
  AbstractExtension,
  ClientPageManager,
  ClientRouter,
  pluginLoader,
  routeClientApp,
} from '@ima/core';
import { screen } from '@testing-library/dom';
import { createElement, useEffect } from 'react';

import { clearImaApp, initImaApp } from '../integration';
import type { ImaApp } from '../types';

describe('integration application lifecycle', () => {
  const originalIma = window.$IMA;
  const bootStages: string[] = [];
  const lifecycle: string[] = [];
  let app: ImaApp | undefined;

  class LifecycleExtension extends AbstractExtension<{}, { title?: string }> {
    init() {
      lifecycle.push(`${this.params.title}:extension:init`);
    }

    load() {
      lifecycle.push(`${this.params.title}:extension:load`);
      return {};
    }

    activate() {
      lifecycle.push(`${this.params.title}:extension:activate`);
    }

    deactivate() {
      lifecycle.push(`${this.params.title}:extension:deactivate`);
    }

    async destroy() {
      await Promise.resolve();
      lifecycle.push(`${this.params.title}:extension:destroy`);
    }
  }

  class LifecycleController extends AbstractController<
    { title: string },
    { title: string }
  > {
    private extension = new LifecycleExtension();

    getExtensions() {
      return [this.extension];
    }

    init() {
      lifecycle.push(`${this.params.title}:init`);
    }

    load() {
      lifecycle.push(`${this.params.title}:load`);
      return { title: this.params.title };
    }

    activate() {
      lifecycle.push(`${this.params.title}:activate`);
    }

    deactivate() {
      lifecycle.push(`${this.params.title}:deactivate`);
    }

    async destroy() {
      await Promise.resolve();
      lifecycle.push(`${this.params.title}:destroy`);
    }
  }

  function PageView({ title }: { title: string }) {
    useEffect(() => {
      return () => {
        lifecycle.push(`${title}:unmount`);
      };
    }, [title]);

    return createElement('h1', null, title);
  }

  beforeAll(() => {
    pluginLoader.register('integration-lifecycle', () => ({
      initSettings: () => {
        bootStages.push('plugin:settings');
        return {};
      },
      initBind: () => {
        bootStages.push('plugin:bind');
      },
      initServices: () => {
        bootStages.push('plugin:services');
      },
    }));
  });

  beforeEach(() => {
    bootStages.length = 0;
    lifecycle.length = 0;
    document.body.innerHTML = '<main id="page"></main>';
    window.$IMA = {
      ...originalIma,
      $App: {},
      $Env: 'test',
      $Host: window.location.host,
      $Protocol: 'http:',
      $Root: '',
      $LanguagePartPath: '',
      $Language: 'en',
      Cache: {},
      SPA: true,
    };
  });

  afterEach(async () => {
    await clearImaApp(app);
    app = undefined;
    window.$IMA = originalIma;
    jest.restoreAllMocks();
  });

  function bootApplication(initialTitle: string, onEvent = () => {}) {
    window.history.replaceState(null, '', `/${initialTitle}`);

    return initImaApp({
      initSettings: () => {
        bootStages.push('app:settings');
        return {
          prod: {
            $Page: {
              $Render: {
                masterElementId: 'page',
                documentView: () => null,
              },
            },
          },
        };
      },
      initBindApp: (_namespace, oc) => {
        bootStages.push('app:bind');
        oc.inject(LifecycleController, []);
      },
      initServicesApp: (_namespace, oc) => {
        bootStages.push('app:services');
        expect(window.location.pathname).toBe(`/${initialTitle}`);
        oc.get('$Window').bindEventListener(window, 'lifecycle', onEvent);
      },
      initRoutes: (_namespace, _oc, _config, router) => {
        bootStages.push('app:routes');
        router.add('page', '/:title', LifecycleController, PageView, {
          onlyUpdate: false,
        });
      },
    });
  }

  it('boots, navigates and unmounts independent applications through real IMA services', async () => {
    const consoleError = jest.spyOn(console, 'error');
    const onEvent = jest.fn();

    for (const initialTitle of ['first', 'restarted']) {
      bootStages.length = 0;
      lifecycle.length = 0;
      app = await bootApplication(initialTitle, onEvent);

      expect(bootStages).toEqual([
        'plugin:settings',
        'app:settings',
        'plugin:bind',
        'app:bind',
        'plugin:services',
        'app:services',
        'app:routes',
      ]);
      expect(app.oc.get('$Router')).toBeInstanceOf(ClientRouter);
      expect(app.oc.get('$PageManager')).toBeInstanceOf(ClientPageManager);
      expect(lifecycle).toEqual([]);

      await expect(routeClientApp(app)).resolves.toMatchObject({ status: 200 });
      expect(screen.getByRole('heading', { name: initialTitle })).toBeVisible();
      expect(lifecycle).toEqual([
        `${initialTitle}:init`,
        `${initialTitle}:extension:init`,
        `${initialTitle}:load`,
        `${initialTitle}:extension:load`,
        `${initialTitle}:activate`,
        `${initialTitle}:extension:activate`,
      ]);

      await expect(app.oc.get('$Router').route('/next')).resolves.toMatchObject(
        {
          status: 200,
        }
      );
      expect(screen.getByRole('heading', { name: 'next' })).toBeVisible();
      expect(lifecycle).toEqual(
        expect.arrayContaining([
          `${initialTitle}:extension:deactivate`,
          `${initialTitle}:deactivate`,
          `${initialTitle}:extension:destroy`,
          `${initialTitle}:destroy`,
          'next:init',
          'next:extension:activate',
        ])
      );

      window.dispatchEvent(new Event('lifecycle'));
      expect(onEvent).toHaveBeenCalledTimes(1);
      onEvent.mockClear();
      lifecycle.length = 0;

      await clearImaApp(app);
      app = undefined;

      expect(lifecycle.at(-1)).toBe('next:unmount');
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      window.dispatchEvent(new Event('lifecycle'));
      expect(onEvent).not.toHaveBeenCalled();
    }

    expect(consoleError).not.toHaveBeenCalled();
  });

  it.failing(
    'destroys the active controller and extensions before unmounting (core uses the previous page)',
    async () => {
      app = await bootApplication('active');
      await routeClientApp(app);
      lifecycle.length = 0;

      await clearImaApp(app);
      app = undefined;

      expect(lifecycle).toEqual([
        'active:extension:deactivate',
        'active:deactivate',
        'active:extension:destroy',
        'active:destroy',
        'active:unmount',
      ]);
    }
  );
});
