/** @jest-environment jsdom */

import '@testing-library/jest-dom';

import {
  AbstractController,
  AbstractExtension,
  ClientPageManager,
  ClientRouter,
  RendererEvents,
  RouteNames,
  RouterEvents,
  pluginLoader,
} from '@ima/core';
import { useComponentUtils } from '@ima/react-page-renderer';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { createElement, useEffect, type MouseEvent } from 'react';

import { clearImaApp, initImaApp, routeImaApp } from '../integration';
import type { ImaApp } from '../types';

interface LifecycleState {
  title: string;
  details?: string;
  message?: string;
}

describe('integration application lifecycle', () => {
  const originalIma = window.$IMA;
  const bootStages: string[] = [];
  const lifecycle: string[] = [];
  const controllers: LifecycleController[] = [];
  const onViewMount = jest.fn();
  const onViewUnmount = jest.fn(() => lifecycle.push('view:unmount'));
  let app: ImaApp | undefined;
  let deferredDetails: Promise<string> | undefined;

  class LifecycleExtension extends AbstractExtension<
    { message: string },
    { title?: string }
  > {
    init() {
      lifecycle.push(`${this.params.title}:extension:init`);
    }

    load() {
      lifecycle.push(`${this.params.title}:extension:load`);
      return { message: 'Initial message' };
    }

    update() {
      lifecycle.push(`${this.params.title}:extension:update`);
      return { message: 'Updated message' };
    }

    onChangeMessage({ message }: { message: string }) {
      this.setState({ message });
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
    LifecycleState,
    { title: string }
  > {
    private extension = new LifecycleExtension();

    getExtensions() {
      return [this.extension];
    }

    init() {
      controllers.push(this);
      lifecycle.push(`${this.params.title}:init`);
    }

    load() {
      lifecycle.push(`${this.params.title}:load`);

      if (this.params.title === 'broken') {
        throw new Error('load failed');
      }

      return {
        title: this.params.title,
        details: deferredDetails ?? 'Ready',
      };
    }

    update() {
      lifecycle.push(`${this.params.title}:update`);

      return { title: this.params.title };
    }

    onRename({ title }: { title: string }) {
      this.setState({ title });
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

  class ErrorController extends AbstractController<{ title: string }> {
    load() {
      return { title: 'error page' };
    }
  }

  function PageView({ title, details, message }: LifecycleState) {
    const { $EventBus } = useComponentUtils();

    useEffect(() => {
      onViewMount();

      return () => {
        onViewUnmount();
      };
    }, []);

    return createElement(
      'div',
      null,
      createElement('h1', null, title),
      createElement('p', null, details ?? 'Loading details'),
      createElement('p', null, message),
      createElement('a', { href: '/linked' }, 'Linked page'),
      createElement(
        'button',
        {
          onClick: (event: MouseEvent<HTMLButtonElement>) =>
            $EventBus.fire(event.currentTarget, 'rename', {
              title: 'Controller event',
            }),
        },
        'Rename page'
      ),
      createElement(
        'button',
        {
          onClick: (event: MouseEvent<HTMLButtonElement>) =>
            $EventBus.fire(event.currentTarget, 'changeMessage', {
              message: 'Extension event',
            }),
        },
        'Change message'
      )
    );
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
    controllers.length = 0;
    deferredDetails = undefined;
    onViewMount.mockClear();
    onViewUnmount.mockClear();
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

  function bootApplication(
    initialTitle: string,
    {
      onEvent = () => {},
      onlyUpdate = false,
    }: { onEvent?: () => void; onlyUpdate?: boolean } = {}
  ) {
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
        oc.inject(ErrorController, []);
      },
      initServicesApp: (_namespace, oc) => {
        bootStages.push('app:services');
        expect(window.location.pathname).toBe(`/${initialTitle}`);
        oc.get('$Window').bindEventListener(window, 'lifecycle', onEvent);
      },
      initRoutes: (_namespace, _oc, _config, router) => {
        bootStages.push('app:routes');
        router.add('page', '/:title', LifecycleController, PageView, {
          onlyUpdate,
        });
        router.add(RouteNames.ERROR, '/error', ErrorController, PageView);
      },
    });
  }

  it('boots, navigates and unmounts independent applications through real IMA services', async () => {
    const consoleError = jest.spyOn(console, 'error');
    const onEvent = jest.fn();

    for (const initialTitle of ['first', 'restarted']) {
      bootStages.length = 0;
      lifecycle.length = 0;
      app = await bootApplication(initialTitle, { onEvent });

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

      await expect(routeImaApp(app)).resolves.toMatchObject({ status: 200 });
      expect(screen.getByRole('heading', { name: initialTitle })).toBeVisible();
      expect(lifecycle).toEqual([
        `${initialTitle}:init`,
        `${initialTitle}:extension:init`,
        `${initialTitle}:load`,
        `${initialTitle}:extension:load`,
        `${initialTitle}:activate`,
        `${initialTitle}:extension:activate`,
      ]);
      lifecycle.length = 0;

      await expect(app.oc.get('$Router').route('/next')).resolves.toMatchObject(
        {
          status: 200,
        }
      );
      expect(screen.getByRole('heading', { name: 'next' })).toBeVisible();
      // PageNavigationHandler ignores the first pre-manage call, later ones own the address bar.
      expect(window.location.pathname).toBe('/next');
      expect(lifecycle).toEqual([
        `${initialTitle}:extension:deactivate`,
        `${initialTitle}:deactivate`,
        `${initialTitle}:extension:destroy`,
        `${initialTitle}:destroy`,
        'next:init',
        'next:extension:init',
        'next:load',
        'next:extension:load',
        'next:activate',
        'next:extension:activate',
      ]);

      window.dispatchEvent(new Event('lifecycle'));
      expect(onEvent).toHaveBeenCalledTimes(1);
      onEvent.mockClear();
      lifecycle.length = 0;

      await clearImaApp(app);
      app = undefined;

      expect(lifecycle.at(-1)).toBe('view:unmount');
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      window.dispatchEvent(new Event('lifecycle'));
      expect(onEvent).not.toHaveBeenCalled();
    }

    expect(consoleError).not.toHaveBeenCalled();
  });

  it('routes the initial path passed to routeImaApp', async () => {
    app = await bootApplication('first');

    await routeImaApp(app, '/explicit');

    expect(window.location.pathname).toBe('/explicit');
    expect(screen.getByRole('heading', { name: 'explicit' })).toBeVisible();
  });

  it('handles clicks on rendered links through the listening router', async () => {
    app = await bootApplication('first');
    await routeImaApp(app);

    fireEvent.click(screen.getByRole('link', { name: 'Linked page' }));

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'linked' })).toBeVisible()
    );
    expect(window.location.pathname).toBe('/linked');
  });

  it('updates the page instead of remounting it on onlyUpdate routes', async () => {
    app = await bootApplication('first', { onlyUpdate: true });
    await routeImaApp(app);
    const controller = controllers[0];
    const heading = screen.getByRole('heading', { name: 'first' });
    lifecycle.length = 0;

    await app.oc.get('$Router').route('/updated');

    expect(screen.getByRole('heading', { name: 'updated' })).toBe(heading);
    expect(controllers).toEqual([controller]);
    expect(controller.getRouteParams()).toEqual({ title: 'updated' });
    expect(onViewMount).toHaveBeenCalledTimes(1);
    expect(onViewUnmount).not.toHaveBeenCalled();
    expect(lifecycle).toEqual(['updated:update', 'updated:extension:update']);
  });

  it('renders the error route when the page controller fails to load', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    const fatalErrorHandler = jest.fn();
    window.$IMA.fatalErrorHandler = fatalErrorHandler;

    app = await bootApplication('first');
    await routeImaApp(app, '/broken');

    expect(screen.getByRole('heading', { name: 'error page' })).toBeVisible();
    expect(fatalErrorHandler).not.toHaveBeenCalled();
  });

  it('renders deferred load results and subsequent controller state updates', async () => {
    app = await bootApplication('first');
    await routeImaApp(app);
    const details = Promise.withResolvers<string>();
    deferredDetails = details.promise;

    const navigation = app.oc.get('$Router').route('/deferred');

    await screen.findByRole('heading', { name: 'deferred' });
    expect(screen.getByText('Loading details')).toBeVisible();
    expect(lifecycle).not.toContain('deferred:activate');

    details.resolve('Loaded details');
    await expect(navigation).resolves.toMatchObject({ status: 200 });

    expect(screen.getByText('Loaded details')).toBeVisible();
    expect(lifecycle).toContain('deferred:activate');

    const controller = controllers.at(-1)!;
    controller.setState({ details: 'Changed details' });

    await waitFor(() =>
      expect(screen.getByText('Changed details')).toBeVisible()
    );
    expect(controller.getState()).toMatchObject({
      title: 'deferred',
      details: 'Changed details',
      message: 'Initial message',
    });
  });

  it('routes view events through the controller and extensions into page state', async () => {
    app = await bootApplication('first');
    await routeImaApp(app);
    const controller = controllers[0];

    fireEvent.click(screen.getByRole('button', { name: 'Rename page' }));

    await screen.findByRole('heading', { name: 'Controller event' });
    expect(controller.getState().title).toBe('Controller event');

    fireEvent.click(screen.getByRole('button', { name: 'Change message' }));

    await screen.findByText('Extension event');
    expect(controller.getExtensions()[0].getState().message).toBe(
      'Extension event'
    );
    expect(controller.getState()).toMatchObject({
      title: 'Controller event',
      message: 'Extension event',
    });
    expect(controllers).toEqual([controller]);
    expect(onViewMount).toHaveBeenCalledTimes(1);
    expect(onViewUnmount).not.toHaveBeenCalled();
  });

  it('fires the router and renderer events the application listens to', async () => {
    app = await bootApplication('first');
    const dispatcher = app.oc.get('$Dispatcher');
    const events: string[] = [];

    dispatcher.listen(RouterEvents.BEFORE_HANDLE_ROUTE, () =>
      events.push('beforeHandleRoute')
    );
    dispatcher.listen(RouterEvents.AFTER_HANDLE_ROUTE, () =>
      events.push('afterHandleRoute')
    );
    dispatcher.listen(RendererEvents.MOUNTED, () => events.push('mounted'));
    dispatcher.listen(RendererEvents.UNMOUNTED, () => events.push('unmounted'));

    await routeImaApp(app);

    expect(events).toEqual([
      'beforeHandleRoute',
      'mounted',
      'afterHandleRoute',
    ]);

    await clearImaApp(app);
    app = undefined;

    expect(events.at(-1)).toBe('unmounted');
  });

  it.failing.each(['initial page', 'after navigation'])(
    'destroys the active controller and extensions on %s (known core defect)',
    async stage => {
      app = await bootApplication(
        stage === 'initial page' ? 'active' : 'previous'
      );
      await routeImaApp(app);

      if (stage === 'after navigation') {
        await app.oc.get('$Router').route('/active');
      }

      lifecycle.length = 0;

      await clearImaApp(app);
      app = undefined;

      expect(lifecycle).toEqual([
        'active:extension:deactivate',
        'active:deactivate',
        'active:extension:destroy',
        'active:destroy',
        'view:unmount',
      ]);
    }
  );
});
