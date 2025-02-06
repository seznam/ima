import {
  ControllerDecorator,
  Dispatcher,
  DispatcherImpl,
  MetaManager,
  RendererEvents,
  type Utils,
  type RouteOptions,
  Window,
} from '@ima/core';
import { Settings } from '@ima/core';
import * as Helper from '@ima/helpers';
import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { toMockedInstance } from 'to-mock';

import { AbstractPureComponent } from '../../component/AbstractPureComponent';
import { BlankManagedRootView } from '../../component/BlankManagedRootView';
import { AbstractClientPageRenderer } from '../AbstractClientPageRenderer';
import { PageRendererFactory } from '../PageRendererFactory';

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

  protected _renderViewAdapter(callback: () => void, props?: unknown): void {
    render(
      this._getViewAdapterElement(
        Object.assign({}, props, {
          refCallback: callback,
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

const routeOptions: RouteOptions = {
  autoScroll: true,
  documentView: null,
  managedRootView: null,
  onlyUpdate: false,
  viewAdapter: null,
  middlewares: [],
};

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
} as unknown as Settings;

const param1 = 'param1';
const param2 = 'param2';
const params = {
  param1: param1,
  param2: Promise.resolve(param2),
};
const pageState = {
  param1: param1,
  param2: param2,
};

describe('ClientPageRenderer', () => {
  let pageRenderer: ClientPageRenderer;
  let metaManager: MetaManager;
  let controller: ReturnType<typeof toMockedInstance>;
  let $window: Window;
  let pageRendererFactory: PageRendererFactory;
  let dispatcher: Dispatcher;
  let viewContainer: HTMLDivElement;

  beforeEach(() => {
    metaManager = toMockedInstance(MetaManager, {
      getLinks: () => [],
      getMetaNames: () => [],
      getMetaProperties: () => [],
    });
    controller = toMockedInstance(ControllerDecorator, {
      getMetaManager: () => metaManager,
    });
    $window = toMockedInstance(Window, {
      getElementById: (id: string) => document.getElementById(id),
    });
    pageRendererFactory = toMockedInstance(PageRendererFactory, {
      getManagedRootView: () => BlankManagedRootView,
    });
    dispatcher = new DispatcherImpl();
    viewContainer = document.createElement('div');
    viewContainer.id = settings.$Page.$Render.masterElementId as string;
    viewContainer.appendChild(document.createElement('div'));
    pageRenderer = new ClientPageRenderer(
      pageRendererFactory,
      Helper,
      dispatcher,
      settings,
      $window
    );

    document.body.innerHTML = '';
    document.body.appendChild(viewContainer);
  });

  describe('mount method', () => {
    beforeEach(() => {
      jest.useRealTimers();

      jest
        .spyOn(pageRenderer, '_separatePromisesAndValues' as never)
        .mockReturnValue({
          values: { param1: params.param1 },
          promises: { param2: params.param2 },
        } as never);
    });

    it('should set default page state values', async () => {
      jest.spyOn(controller, 'setState').mockImplementation();

      await pageRenderer.mount(controller, () => null, {}, routeOptions);

      expect(controller.setState).toHaveBeenCalledWith(pageState);
    });

    it('should patch promises to state', async () => {
      jest
        .spyOn(pageRenderer, '_patchPromisesToState' as never)
        .mockImplementation();

      pageRenderer['_viewContainer'] = document.getElementById(
        settings.$Page.$Render.masterElementId as string
      ) as Element;
      await pageRenderer.mount(controller, () => null, {}, routeOptions);

      expect(pageRenderer['_patchPromisesToState']).toHaveBeenCalledWith(
        controller,
        {
          param2: params.param2,
        }
      );
    });

    it('should set page meta params', async () => {
      jest.spyOn(controller, 'setMetaParams').mockImplementation();
      jest.spyOn(controller, 'getState').mockReturnValue(pageState);

      await pageRenderer.mount(controller, () => null, {}, routeOptions);

      expect(controller.setMetaParams).toHaveBeenCalledWith(pageState);
    });

    it('should return resolved promise with object of property status and pageState', async () => {
      jest.spyOn(controller, 'getHttpStatus').mockReturnValue(200);
      jest.spyOn(controller, 'getState').mockReturnValue(params);

      const response = await pageRenderer.mount(
        controller,
        () => null,
        {},
        routeOptions
      );

      expect(response).toStrictEqual({
        pageState: params,
        status: 200,
      });
    });
  });

  describe('update method', () => {
    beforeEach(() => {
      jest.useRealTimers();

      jest
        .spyOn(pageRenderer, '_separatePromisesAndValues' as never)
        .mockReturnValue({
          values: { param1: params.param1 },
          promises: { param2: params.param2 },
        } as never);
    });

    it('should set default page state values', async () => {
      jest.spyOn(controller, 'setState').mockImplementation();

      await pageRenderer.update(controller, () => null, params);

      expect(controller.setState).toHaveBeenCalledWith({
        param1: params.param1,
      });
    });

    it('should patch promises to state', async () => {
      jest
        .spyOn(pageRenderer, '_patchPromisesToState' as never)
        .mockImplementation(() => ({}) as never);

      await pageRenderer.update(controller, () => null, params);

      expect(pageRenderer['_patchPromisesToState']).toHaveBeenCalledWith(
        controller,
        {
          param2: params.param2,
        }
      );
    });

    it('should set page meta params', async () => {
      jest.spyOn(controller, 'setMetaParams').mockImplementation();
      jest.spyOn(controller, 'getState').mockReturnValue(params);

      await pageRenderer.update(controller, () => null, params);

      expect(controller.setMetaParams).toHaveBeenCalledWith(params);
    });

    it('should return resolved promise with object of property status and pageState', async () => {
      jest.spyOn(controller, 'getHttpStatus').mockReturnValue(200);
      jest.spyOn(controller, 'getState').mockReturnValue(params);

      const response = await pageRenderer.update(
        controller,
        () => null,
        params
      );

      expect(response).toStrictEqual({
        pageState: params,
        status: 200,
      });
    });
  });

  describe('_renderPageViewToDOM method', () => {
    it('should render react component to defined element', async () => {
      jest
        .spyOn(pageRenderer, '_renderViewAdapter' as never)
        .mockImplementation();

      viewContainer.replaceChildren();
      pageRenderer['_mounted'] = Promise.resolve();
      await pageRenderer['_renderPageViewToDOM'](
        controller,
        () => null,
        routeOptions
      );

      expect(pageRenderer['_renderViewAdapter']).toHaveBeenCalled();
    });
  });

  describe('setState method', () => {
    it('should set new state and re-render react component', async () => {
      const state = { state: 'state' };

      await pageRenderer.mount(controller, () => null, {}, routeOptions);
      jest.spyOn(dispatcher, 'fire').mockImplementation();
      await pageRenderer.setState(state);

      expect(dispatcher.fire).toHaveBeenLastCalledWith(
        RendererEvents.UPDATED,
        expect.any(Object)
      );
    });
  });

  describe('_prepareViewAdapter method', () => {
    const utils = { router: 'router' } as unknown as Utils;
    const state = { state: 'state', pageView: () => null };

    beforeEach(() => {
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
