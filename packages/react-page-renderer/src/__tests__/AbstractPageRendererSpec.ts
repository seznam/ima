import {
  ControllerDecorator,
  Dispatcher,
  MetaManager,
  RendererEvents,
  Window,
} from '@ima/core';
import * as Helper from '@ima/helpers';
import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import {
  toMockedInstance,
  setGlobalMockMethod,
  setGlobalKeepUnmock,
  objectKeepUnmock,
} from 'to-mock';

import { RouteOptions, Settings } from '@/types';

import AbstractClientPageRenderer from '../AbstractClientPageRenderer';
import AbstractPureComponent from '../AbstractPureComponent';
import BlankManagedRootView from '../BlankManagedRootView';
import PageRendererFactory from '../PageRendererFactory';

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);

globalThis.$Debug = false;

class ClientPageRenderer extends AbstractClientPageRenderer {
  unmount(): void {
    return;
  }

  protected _hydrateViewAdapter(): void {
    render(
      this._getViewAdapterElement({
        refCallback: this._getHydrateCallback(),
      }) as ReactElement,
      { hydrate: true }
    );
  }

  protected _renderViewAdapter(
    props?: unknown,
    callback?: (() => void) | undefined
  ): void {
    render(
      this._getViewAdapterElement(
        Object.assign({}, props, {
          refCallback: callback ? callback : this._getRenderCallback(),
        })
      ) as ReactElement
    );
  }
}

class DocumentView extends AbstractPureComponent {
  render() {
    return null;
  }
}

const routeOptions = {
  autoScroll: false,
  allowSPA: false,
} as RouteOptions;

const settings = {
  $App: undefined,
  $Debug: true,
  $Env: undefined,
  $Host: undefined,
  $Language: undefined,
  $LanguagePartPath: undefined,
  $Path: undefined,
  $Page: {
    $Render: {
      documentView: DocumentView,
      masterElementId: 'page',
    },
  },
  $Protocol: undefined,
  $Root: undefined,
  $Version: undefined,
} as Settings;

describe('ClientPageRenderer', () => {
  let pageRenderer: ClientPageRenderer;
  const metaManager = toMockedInstance(MetaManager, {
    getLinks: () => [],
    getMetaNames: () => [],
    getMetaProperties: () => [],
  });
  const controller = toMockedInstance(ControllerDecorator, {
    getMetaManager: () => metaManager,
  });
  const $window = toMockedInstance(Window, {
    getElementById: (id: string) => document.getElementById(id),
  });
  const pageRendererFactory = toMockedInstance(PageRendererFactory, {
    getManagedRootView: () => BlankManagedRootView,
  });
  const dispatcher = toMockedInstance(Dispatcher);
  const viewContainer = document.createElement('div');
  viewContainer.id = settings.$Page.$Render.masterElementId as string;

  beforeEach(() => {
    document.body.appendChild(viewContainer);
    pageRenderer = new ClientPageRenderer(
      pageRendererFactory,
      Helper,
      dispatcher,
      settings,
      $window
    );
  });

  describe('setState method', () => {
    it('should set new state and re-render react component', async () => {
      const state = { state: 'state' };

      jest.spyOn(dispatcher, 'fire').mockImplementation();

      await pageRenderer.mount(controller, () => null, {}, routeOptions);
      pageRenderer.setState(state);

      expect(dispatcher.fire).toHaveBeenLastCalledWith(
        RendererEvents.UPDATED,
        expect.any(Object),
        true
      );
    });
  });

  describe('_prepareViewAdapter method', () => {
    const utils = { router: 'router' };
    const state = { state: 'state', pageView: () => null };

    beforeEach(function () {
      jest.spyOn(controller, 'getState').mockReturnValue(state);
    });

    it('should set $Utils to props', async () => {
      jest.spyOn(pageRendererFactory, 'getUtils').mockReturnValue(utils);

      await pageRenderer.mount(controller, () => null, {}, routeOptions);

      expect(pageRenderer['_viewAdapterProps'].$Utils).toEqual(utils);
    });

    it('should generate view props from controller state', async () => {
      await pageRenderer.mount(controller, () => null, {}, routeOptions);

      expect(pageRenderer['_viewAdapterProps'].state).toEqual(state);
    });
  });

  describe('_getDocumentView method', () => {
    beforeEach(() => {
      jest.spyOn(pageRendererFactory, 'getDocumentView').mockImplementation();
    });

    it('should return default document view which is set in settings.$Page.$Render.documentView', () => {
      pageRenderer['_getDocumentView'](routeOptions);

      expect(pageRendererFactory.getDocumentView).toHaveBeenCalledWith(
        settings.$Page.$Render.documentView
      );
    });

    it('should return document view which is defined in routeOptions.documentView', () => {
      class AnotherDocumentView extends DocumentView {}
      const routeOptionsWithDocumentView = Object.assign({}, routeOptions, {
        documentView: AnotherDocumentView,
      });

      pageRenderer['_getDocumentView'](routeOptionsWithDocumentView);

      expect(pageRendererFactory.getDocumentView).toHaveBeenCalledWith(
        AnotherDocumentView
      );
    });
  });
});
