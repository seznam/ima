/** @jest-environment jsdom */

import '@testing-library/jest-dom';

import {
  DispatcherImpl,
  type ControllerDecorator,
  type Dispatcher,
  type RouteOptions,
  type Settings,
  type Window,
} from '@ima/core';
import * as helpers from '@ima/helpers';
import {
  BlankManagedRootView,
  PageRendererFactory,
} from '@ima/react-page-renderer';
import { ClientPageRenderer } from '@ima/react-page-renderer/renderer/ClientPageRenderer';
import { screen } from '@testing-library/dom';
import { cleanup, render } from '@testing-library/react/pure';
import { createElement, type ComponentType } from 'react';
import * as reactDomClient from 'react-dom/client';

import {
  createTestingLibraryClientPageRenderer,
  type PageRendererConstructor,
} from '../integration/TestingLibraryClientPageRenderer';

jest.mock('react-dom/client', () => {
  const original = jest.requireActual('react-dom/client');

  return {
    ...original,
    createRoot: jest.fn(original.createRoot),
    hydrateRoot: jest.fn(original.hydrateRoot),
  };
});

const TestingLibraryClientPageRenderer = createTestingLibraryClientPageRenderer(
  ClientPageRenderer as unknown as PageRendererConstructor
);

const routeOptions: RouteOptions = {
  autoScroll: true,
  documentView: null,
  managedRootView: null,
  onlyUpdate: false,
  viewAdapter: null,
  middlewares: [],
};

const settings = {
  $Page: {
    $Render: {
      documentView: () => null,
      masterElementId: 'page',
    },
  },
} as Settings;

describe('TestingLibraryClientPageRenderer', () => {
  function createRenderer() {
    const factory = {
      getManagedRootView: () => BlankManagedRootView,
      getUtils: () => ({}),
    } as unknown as PageRendererFactory;
    const dispatcher: Dispatcher = new DispatcherImpl();
    const imaWindow = {
      getElementById: (id: string) => document.getElementById(id),
    } as Window;

    return new TestingLibraryClientPageRenderer(
      factory,
      helpers,
      dispatcher,
      settings,
      imaWindow
    );
  }

  function createController(state: { title: string }) {
    return {
      getHttpStatus: () => 200,
      getState: () => state,
      setMetaParams: jest.fn(),
      setState: (nextState: typeof state) => {
        Object.assign(state, nextState);
      },
    } as unknown as ControllerDecorator;
  }

  const PageView = (({ title }: { title: string }) =>
    createElement('h1', null, title)) as unknown as ComponentType;

  async function mountPage(title: string) {
    const renderer = createRenderer();
    const state = { title };

    await renderer.mount(
      createController(state),
      PageView,
      state as unknown as Record<string, Promise<unknown>>,
      routeOptions
    );

    return renderer;
  }

  it('does not retain discarded application roots in Testing Library cleanup', async () => {
    const createRoot = jest.mocked(reactDomClient.createRoot);
    const hydrateRoot = jest.mocked(reactDomClient.hydrateRoot);
    const unmounts: jest.SpyInstance[] = [];

    try {
      for (const title of ['First application', 'Second application']) {
        createRoot.mockClear();
        hydrateRoot.mockClear();
        document.body.innerHTML = '<main id="page"></main>';
        const renderer = await mountPage(title);

        const root =
          createRoot.mock.results.at(-1)?.value ??
          hydrateRoot.mock.results.at(-1)?.value;
        unmounts.push(jest.spyOn(root, 'unmount'));
        renderer.unmount();
      }

      cleanup();

      for (const unmount of unmounts) {
        expect(unmount).toHaveBeenCalledTimes(1);
      }
    } finally {
      createRoot.mockClear();
      hydrateRoot.mockClear();
    }
  });

  it('renders and updates an IMA page through React Testing Library', async () => {
    document.body.innerHTML = '<main id="page"></main>';

    const renderer = await mountPage('Initial title');

    expect(
      screen.getByRole('heading', { name: 'Initial title' })
    ).toBeVisible();

    await renderer.setState({ title: 'Updated title' });

    expect(
      screen.getByRole('heading', { name: 'Updated title' })
    ).toBeVisible();

    renderer.unmount();

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('can mount a new application after the previous page was cleared', async () => {
    document.body.innerHTML = '<main id="page"></main>';

    const firstRenderer = await mountPage('First application');

    firstRenderer.unmount();

    const secondRenderer = await mountPage('Second application');

    expect(
      screen.getByRole('heading', { name: 'Second application' })
    ).toBeVisible();

    secondRenderer.unmount();
  });

  it('restores the original server markup after unmounting', async () => {
    document.body.innerHTML =
      '<main id="page"><h1>Server application</h1></main>';

    const renderer = await mountPage('Server application');

    await renderer.setState({ title: 'Client application' });
    renderer.unmount();

    expect(
      screen.getByRole('heading', { name: 'Server application' })
    ).toBeVisible();
  });

  it('does not unmount unrelated Testing Library roots', async () => {
    document.body.innerHTML = '<main id="page"></main>';

    const unrelatedRender = render(
      createElement('p', null, 'Unrelated render')
    );
    const renderer = await mountPage('IMA application');

    renderer.unmount();

    expect(screen.getByText('Unrelated render')).toBeVisible();
    unrelatedRender.unmount();
  });

  describe('page mounted once for the whole suite', () => {
    let renderer: ReturnType<typeof createRenderer>;

    beforeAll(async () => {
      document.body.innerHTML = '<main id="page"></main>';

      renderer = await mountPage('Persisted title');
    });

    afterAll(() => {
      renderer.unmount();
    });

    it('is rendered for the first test', () => {
      expect(
        screen.getByRole('heading', { name: 'Persisted title' })
      ).toBeVisible();
    });

    it('stays mounted until the integration application is cleared', () => {
      expect(
        screen.getByRole('heading', { name: 'Persisted title' })
      ).toBeVisible();
    });
  });
});
