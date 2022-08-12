import * as Helper from '@ima/helpers';
import Controller from 'src/controller/Controller';
import ClientPageRenderer from '../ClientPageRenderer';
import RendererFactory from '../PageRendererFactory';
import Window from 'src/window/Window';
import Dispatcher from 'src/event/Dispatcher';
import {
  toMockedInstance,
  setGlobalMockMethod,
  setGlobalKeepUnmock,
  objectKeepUnmock,
} from 'to-mock';

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);

describe('ima.core.page.renderer.ClientPageRenderer', function () {
  let param1 = 'param1';
  let param2 = 'param2';
  let params = {
    param1: param1,
    param2: Promise.resolve(param2),
  };
  let pageState = {
    param1: param1,
    param2: param2,
  };

  let view = function () {};

  let controller = null;
  let win = null;
  let dispatcher = null;
  let rendererFactory = null;
  let pageRenderer = null;
  let ReactDOM = {
    unmountComponentAtNode: function () {},
    render: function () {},
  };
  let settings = {
    $Page: {
      $Render: {
        documentView: 'app.component.document.DocumentView',
      },
    },
  };
  let routeOptions = {
    onlyUpdate: false,
    autoScroll: false,
    allowSPA: false,
    documentView: null,
  };

  beforeEach(function () {
    controller = toMockedInstance(Controller, {
      getMetaManager() {
        return () => {};
      },
    });
    rendererFactory = toMockedInstance(RendererFactory);
    win = toMockedInstance(Window, {
      getWindow() {
        return {
          requestIdleCallback: callback => setTimeout(callback, 0),
        };
      },
    });
    dispatcher = toMockedInstance(Dispatcher);

    pageRenderer = new ClientPageRenderer(
      rendererFactory,
      Helper,
      ReactDOM,
      dispatcher,
      settings,
      win
    );
  });

  describe('mount method', function () {
    beforeEach(function () {
      spyOn(pageRenderer, '_separatePromisesAndValues').and.returnValue({
        values: { param1: params.param1 },
        promises: { param2: params.param2 },
      });

      spyOn(pageRenderer, '_updateMetaAttributes');
      spyOn(pageRenderer, '_renderToDOM');
    });

    it('should set default page state values', function (done) {
      spyOn(controller, 'setState');

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function () {
          expect(controller.setState).toHaveBeenCalledWith(pageState);
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should patch promises to state', function (done) {
      spyOn(pageRenderer, '_patchPromisesToState');
      pageRenderer._firstTime = false;

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function () {
          expect(pageRenderer._patchPromisesToState).toHaveBeenCalledWith(
            controller,
            {
              param2: params.param2,
            }
          );
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should batch page state with state transaction', function (done) {
      jest.useFakeTimers();
      pageRenderer._firstTime = false;

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function () {
          jest.runAllTimers();

          expect(controller.beginStateTransaction.mock.calls).toHaveLength(1);
          expect(controller.commitStateTransaction.mock.calls).toHaveLength(1);
          expect(controller.setState.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                Object {
                  "param1": "param1",
                },
              ],
              Array [
                Object {
                  "param2": "param2",
                },
              ],
            ]
          `);
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should overwrite previous state values with undefined', done => {
      spyOn(controller, 'setState');
      spyOn(pageRenderer, '_patchStateToClearPreviousState').and.callThrough();
      spyOn(pageRenderer, '_patchPromisesToState').and.stub();

      pageRenderer._firstTime = false;
      pageRenderer._reactiveView = {
        state: { prevParam1: 'param1', param1: '1param' },
      };

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function () {
          expect(
            pageRenderer._patchStateToClearPreviousState
          ).toHaveBeenCalled();
          expect(controller.setState).toHaveBeenCalledWith({
            param1: 'param1',
            prevParam1: undefined,
          });
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should set page meta params', function (done) {
      spyOn(controller, 'setMetaParams');
      spyOn(controller, 'getState').and.returnValue(pageState);

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function () {
          expect(controller.setMetaParams).toHaveBeenCalledWith(pageState);
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should update page meta attributes', function (done) {
      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function () {
          expect(pageRenderer._updateMetaAttributes).toHaveBeenCalled();
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should return resolved promise with object of property content, status and pageState', function (done) {
      spyOn(controller, 'getHttpStatus').and.returnValue(200);

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function (response) {
          expect(response).toStrictEqual({
            status: 200,
            content: null,
            pageState: pageState,
          });
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });
  });

  describe('update method', function () {
    beforeEach(function () {
      spyOn(pageRenderer, '_separatePromisesAndValues').and.returnValue({
        values: { param1: params.param1 },
        promises: { param2: params.param2 },
      });

      spyOn(pageRenderer, '_updateMetaAttributes');
    });

    it('should set default page state values', function (done) {
      spyOn(controller, 'setState');

      pageRenderer
        .update(controller, params)
        .then(function () {
          expect(controller.setState).toHaveBeenCalledWith({
            param1: params.param1,
          });
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should batch page state with state transaction', function (done) {
      jest.useFakeTimers();
      pageRenderer._firstTime = false;

      pageRenderer
        .update(controller, view, params, routeOptions)
        .then(function () {
          jest.runAllTimers();

          expect(controller.beginStateTransaction.mock.calls).toHaveLength(1);
          expect(controller.commitStateTransaction.mock.calls).toHaveLength(1);
          expect(controller.setState.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                Object {
                  "param1": "param1",
                },
              ],
              Array [
                Object {
                  "param2": "param2",
                },
              ],
            ]
          `);
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should patch promises to state', function (done) {
      spyOn(pageRenderer, '_patchPromisesToState');

      pageRenderer
        .update(controller, params)
        .then(function () {
          expect(pageRenderer._patchPromisesToState).toHaveBeenCalledWith(
            controller,
            {
              param2: params.param2,
            }
          );
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should set page meta params', function (done) {
      spyOn(controller, 'setMetaParams');
      spyOn(controller, 'getState').and.returnValue(params);

      pageRenderer
        .update(controller, params)
        .then(function () {
          expect(controller.setMetaParams).toHaveBeenCalledWith(params);
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should update page meta attributes', function (done) {
      pageRenderer
        .update(controller, params)
        .then(function () {
          expect(pageRenderer._updateMetaAttributes).toHaveBeenCalled();
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });

    it('should return resolved promise with object of property content, status and pageState', function (done) {
      spyOn(controller, 'getHttpStatus').and.returnValue(200);

      pageRenderer
        .update(controller, params)
        .then(function (response) {
          expect(response).toStrictEqual({
            status: 200,
            content: null,
            pageState: pageState,
          });
          done();
        })
        .catch(function (error) {
          console.error(error);
          done(error);
        });
    });
  });

  describe('_renderToDOM method', function () {
    let wrapedPageViewElement = {
      wrapElementView: 'wrapedPageViewElement',
    };
    let documentView = {
      masterElementId: 'id',
    };
    let htmlNode = {
      type: 'div',
      children: {
        length: 0,
      },
    };

    beforeEach(function () {
      spyOn(ReactDOM, 'render').and.stub();
      spyOn(pageRenderer, '_getWrappedPageView').and.returnValue(
        wrapedPageViewElement
      );
      spyOn(pageRenderer, '_getDocumentView').and.returnValue(documentView);
      spyOn(win, 'getElementById').and.returnValue(htmlNode);

      pageRenderer._renderToDOM(controller, view, routeOptions);
    });

    it('should wrap page view', function () {
      expect(pageRenderer._getWrappedPageView).toHaveBeenCalledWith(
        controller,
        view,
        routeOptions
      );
    });

    it('should render react component to defined element', function () {
      expect(ReactDOM.render).toHaveBeenCalledWith(
        wrapedPageViewElement,
        htmlNode,
        expect.any(Function)
      );
    });
  });

  describe('_patchStateToClearPreviousState() method', () => {
    beforeEach(() => {
      pageRenderer._reactiveView = {
        state: { prevParam1: 'param1', param1: '1param' },
      };
    });

    it('should set every property from previous state to undefined if not present in new state.', () => {
      const patchedState =
        pageRenderer._patchStateToClearPreviousState(pageState);

      expect(patchedState).toStrictEqual({
        ...pageState,
        prevParam1: undefined,
      });
    });
  });
});
