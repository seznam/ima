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
import { toMockedInstance } from 'to-mock';

import { RouteOptions, Settings } from '@/types';

import AbstractClientPageRenderer from '../AbstractClientPageRenderer';
import AbstractPureComponent from '../AbstractPureComponent';
import BlankManagedRootView from '../BlankManagedRootView';
import PageRendererFactory from '../PageRendererFactory';

// @ts-ignore
globalThis.$Debug = true;

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
  viewContainer.appendChild(document.createElement('div'));

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

  describe('mount method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageRenderer, '_separatePromisesAndValues' as never)
        .mockReturnValue({
          values: { param1: params.param1 },
          promises: { param2: params.param2 },
        } as never);

      // TODO fix test
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

    // it('should batch page state with state transaction', (done) => {
    //   jest.useFakeTimers();
    //   jest.spyOn(pageRenderer, '_renderPageViewToDOM' as never).mockImplementation(() => null as never);

    //   pageRenderer['_viewContainer'] = document.getElementById(settings.$Page.$Render.masterElementId as string) as Element;
    //   pageRenderer.mount(controller, () => null, {}, routeOptions).then(() => {
    //     jest.runAllTimers();

    //     expect(controller.beginStateTransaction.mock.calls).toHaveLength(1);
    //     expect(controller.commitStateTransaction.mock.calls).toHaveLength(1);
    //     expect(controller.setState.mock.calls).toMatchInlineSnapshot(`
    //       [
    //         [
    //           {
    //             "param1": "param1",
    //           },
    //         ],
    //         [
    //           {
    //             "param2": "param2",
    //           },
    //         ],
    //       ]
    //     `);
    //     done();
    //   });
    // });

    it('should set page meta params', async () => {
      jest.spyOn(controller, 'setMetaParams').mockImplementation();
      jest.spyOn(controller, 'getState').mockReturnValue(pageState);

      await pageRenderer.mount(controller, () => null, {}, routeOptions);

      expect(controller.setMetaParams).toHaveBeenCalledWith(pageState);
    });

    it('should update page meta attributes', async () => {
      jest
        .spyOn(pageRenderer, '_updateMetaAttributes' as never)
        .mockImplementation();

      await pageRenderer.mount(controller, () => null, {}, routeOptions);

      expect(pageRenderer['_updateMetaAttributes']).toHaveBeenCalled();
    });

    it('should return resolved promise with object of property content, status and pageState', async () => {
      jest.spyOn(controller, 'getHttpStatus').mockReturnValue(200);

      const response = await pageRenderer.mount(
        controller,
        () => null,
        {},
        routeOptions
      );

      expect(response).toStrictEqual({
        status: 200,
        content: null,
        pageState: pageState,
      });
    });
  });

  describe('update method', () => {
    beforeEach(() => {
      jest
        .spyOn(pageRenderer, '_separatePromisesAndValues' as never)
        .mockReturnValue({
          values: { param1: params.param1 },
          promises: { param2: params.param2 },
        } as never);

      jest
        .spyOn(pageRenderer, '_updateMetaAttributes' as never)
        .mockImplementation(() => ({} as never));
    });

    it('should set default page state values', async () => {
      jest.spyOn(controller, 'setState').mockImplementation();

      await pageRenderer.update(controller, () => null, params);

      expect(controller.setState).toHaveBeenCalledWith({
        param1: params.param1,
      });
    });

    // it('should batch page state with state transaction', async () => {
    //   jest.useFakeTimers();

    //   await pageRenderer.update(controller, () => null, params);

    //   jest.runAllTimers();

    //   expect(controller.beginStateTransaction.mock.calls).toHaveLength(1);
    //   expect(controller.commitStateTransaction.mock.calls).toHaveLength(1);
    //   expect(controller.setState.mock.calls).toMatchInlineSnapshot(`
    //         [
    //           [
    //             {
    //               "param1": "param1",
    //             },
    //           ],
    //           [
    //             {
    //               "param2": "param2",
    //             },
    //           ],
    //         ]
    //       `);
    // });

    it('should patch promises to state', async () => {
      jest
        .spyOn(pageRenderer, '_patchPromisesToState' as never)
        .mockImplementation(() => ({} as never));

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

    it('should update page meta attributes', async () => {
      await pageRenderer.update(controller, () => null, params);

      expect(pageRenderer['_updateMetaAttributes']).toHaveBeenCalled();
    });

    it('should return resolved promise with object of property content, status and pageState', async () => {
      jest.spyOn(controller, 'getHttpStatus').mockReturnValue(200);

      const response = await pageRenderer.update(
        controller,
        () => null,
        params
      );

      expect(response).toStrictEqual({
        status: 200,
        content: null,
        pageState,
      });
    });
  });

  describe('_renderPageViewToDOM method', () => {
    it('should render react component to defined element', async () => {
      jest
        .spyOn(pageRenderer, '_renderViewAdapter' as never)
        .mockImplementation();

      viewContainer.replaceChildren();
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
