import Helper from 'ima-helpers';
import Controller from 'controller/Controller';
import ClientPageRenderer from 'page/renderer/ClientPageRenderer';
import RendererFactory from 'page/renderer/PageRendererFactory';
import Window from 'window/Window';
import Dispatcher from 'event/Dispatcher';
import {
  toMockedInstance,
  setGlobalMockMethod,
  setGlobalKeepUnmock,
  objectKeepUnmock
} from 'to-mock';

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);

describe('ima.page.renderer.ClientPageRenderer', function() {
  let param1 = 'param1';
  let param2 = 'param2';
  let params = {
    param1: param1,
    param2: Promise.resolve(param2)
  };
  let pageState = {
    param1: param1,
    param2: param2
  };

  let controller = new Controller();
  controller.getMetaManager = function() {};
  let view = function() {};

  let win = null;
  let dispatcher = null;
  let rendererFactory = null;
  let pageRenderer = null;
  let ReactDOM = {
    unmountComponentAtNode: function() {},
    render: function() {}
  };
  let settings = {
    $Page: {
      $Render: {
        scripts: [],
        documentView: 'app.component.document.DocumentView'
      }
    }
  };
  let routeOptions = {
    onlyUpdate: false,
    autoScroll: false,
    allowSPA: false,
    documentView: null
  };

  beforeEach(function() {
    rendererFactory = toMockedInstance(RendererFactory);
    win = toMockedInstance(Window);
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

  describe('mount method', function() {
    beforeEach(function() {
      spyOn(pageRenderer, '_separatePromisesAndValues').and.returnValue({
        values: { param1: params.param1 },
        promises: { param2: params.param2 }
      });

      spyOn(pageRenderer, '_updateMetaAttributes');
      spyOn(pageRenderer, '_renderToDOM');
    });

    it('should set default page state values', function(done) {
      spyOn(controller, 'setState');

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function() {
          expect(controller.setState).toHaveBeenCalledWith(pageState);
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should patch promises to state', function(done) {
      spyOn(pageRenderer, '_patchPromisesToState');
      pageRenderer._firstTime = false;

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function() {
          expect(pageRenderer._patchPromisesToState).toHaveBeenCalledWith(
            controller,
            {
              param2: params.param2
            }
          );
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should set page meta params', function(done) {
      spyOn(controller, 'setMetaParams');
      spyOn(controller, 'getState').and.returnValue(pageState);

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function() {
          expect(controller.setMetaParams).toHaveBeenCalledWith(pageState);
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should update page meta attributes', function(done) {
      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function() {
          expect(pageRenderer._updateMetaAttributes).toHaveBeenCalled();
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should return resolved promise with object of property content, status and pageState', function(done) {
      spyOn(controller, 'getHttpStatus').and.returnValue(200);

      pageRenderer
        .mount(controller, view, params, routeOptions)
        .then(function(response) {
          expect(response).toEqual({
            status: 200,
            content: null,
            pageState: pageState
          });
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });
  });

  describe('update method', function() {
    beforeEach(function() {
      spyOn(pageRenderer, '_separatePromisesAndValues').and.returnValue({
        values: { param1: params.param1 },
        promises: { param2: params.param2 }
      });

      spyOn(pageRenderer, '_updateMetaAttributes');
    });

    it('should set default page state values', function(done) {
      spyOn(controller, 'setState');

      pageRenderer
        .update(controller, params)
        .then(function() {
          expect(controller.setState).toHaveBeenCalledWith({
            param1: params.param1
          });
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should patch promises to state', function(done) {
      spyOn(pageRenderer, '_patchPromisesToState');

      pageRenderer
        .update(controller, params)
        .then(function() {
          expect(pageRenderer._patchPromisesToState).toHaveBeenCalledWith(
            controller,
            {
              param2: params.param2
            }
          );
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should set page meta params', function(done) {
      spyOn(controller, 'setMetaParams');
      spyOn(controller, 'getState').and.returnValue(params);

      pageRenderer
        .update(controller, params)
        .then(function() {
          expect(controller.setMetaParams).toHaveBeenCalledWith(params);
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should update page meta attributes', function(done) {
      pageRenderer
        .update(controller, params)
        .then(function() {
          expect(pageRenderer._updateMetaAttributes).toHaveBeenCalled();
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });

    it('should return resolved promise with object of property content, status and pageState', function(done) {
      spyOn(controller, 'getHttpStatus').and.returnValue(200);

      pageRenderer
        .update(controller, params)
        .then(function(response) {
          expect(response).toEqual({
            status: 200,
            content: null,
            pageState: pageState
          });
          done();
        })
        .catch(function(error) {
          console.error(error);
          done(error);
        });
    });
  });

  describe('_renderToDOM method', function() {
    let wrapedPageViewElement = {
      wrapElementView: 'wrapedPageViewElement'
    };
    let documentView = {
      masterElementId: 'id'
    };
    let htmlNode = {
      type: 'div',
      children: {
        length: 0
      }
    };

    beforeEach(function() {
      spyOn(ReactDOM, 'render').and.stub();
      spyOn(pageRenderer, '_getWrappedPageView').and.returnValue(
        wrapedPageViewElement
      );
      spyOn(pageRenderer, '_getDocumentView').and.returnValue(documentView);
      spyOn(win, 'getElementById').and.returnValue(htmlNode);

      pageRenderer._renderToDOM(controller, view, routeOptions);
    });

    it('should wrap page view', function() {
      expect(pageRenderer._getWrappedPageView).toHaveBeenCalledWith(
        controller,
        view,
        routeOptions
      );
    });

    it('should render react component to defined element', function() {
      expect(ReactDOM.render).toHaveBeenCalledWith(
        wrapedPageViewElement,
        htmlNode,
        expect.any(Function)
      );
    });
  });
});
