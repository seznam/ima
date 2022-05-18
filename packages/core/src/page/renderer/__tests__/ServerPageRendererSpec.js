import Helper from '@ima/helpers';
import Cache from 'src/cache/Cache';
import Controller from 'src/controller/Controller';
import GenericError from 'src/error/GenericError';
import ServerPageRenderer from '../ServerPageRenderer';
import RendererFactory from '../PageRendererFactory';
import Response from 'src/router/Response';
import Dispatcher from 'src/event/Dispatcher';
import {
  toMockedInstance,
  setGlobalMockMethod,
  setGlobalKeepUnmock,
  objectKeepUnmock,
} from 'to-mock';

jest.mock('fs');
jest.mock('path', () => {
  const original = jest.requireActual('path');
  const resolve = (...args) => {
    if (args[1] === undefined && args[0] === '@ima/core') {
      return original.join(process.cwd(), 'index.js');
    }

    return original.resolve(...args);
  };

  return Object.assign({}, original, { resolve });
});

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);

describe('ima.core.page.renderer.ServerPageRenderer', () => {
  let param1 = 'param1';
  let param2 = 'param2';
  let params = {
    param1: param1,
    param2: Promise.resolve(param2),
  };

  let controller = new Controller();
  controller.getMetaManager = () => {};
  let view = () => {};

  let cache = null;
  let response = null;
  let pageRenderer = null;
  let rendererFactory = null;
  let dispatcher = null;
  let ReactDOMServer = {
    renderToString: () => {},
    renderToStaticMarkup: () => {},
  };
  let settings = {
    $Source: jest.fn().mockReturnValue({}),
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

  beforeEach(() => {
    cache = toMockedInstance(Cache);
    dispatcher = toMockedInstance(Dispatcher);
    response = toMockedInstance(Response);
    rendererFactory = toMockedInstance(RendererFactory);
    pageRenderer = new ServerPageRenderer(
      rendererFactory,
      Helper,
      ReactDOMServer,
      dispatcher,
      settings,
      response,
      cache
    );
  });

  it('should be wrap each key to promise', () => {
    spyOn(Promise, 'resolve').and.callThrough();

    pageRenderer._wrapEachKeyToPromise(params);

    expect(Promise.resolve).toHaveBeenCalledWith(param1);
    expect(Promise.resolve.calls.count()).toBe(1);
  });

  describe('update method', () => {
    it('should reject promise with error', done => {
      spyOn(pageRenderer, 'mount').and.stub();

      pageRenderer.update(controller, params).catch(error => {
        expect(error instanceof GenericError).toBeTruthy();
        done();
      });
    });
  });

  describe('mount method', () => {
    let loadedPageState = {
      param1: 'param1',
      param2: Promise.resolve('param2'),
    };

    it('should return already sent data to the client', done => {
      let responseParams = {
        content: '',
        status: 200,
        pageState: loadedPageState,
      };

      spyOn(response, 'isResponseSent').and.returnValue(true);
      spyOn(response, 'getResponseParams').and.returnValue(responseParams);

      pageRenderer
        .mount(controller, view, loadedPageState, routeOptions)
        .then(page => {
          expect(page).toStrictEqual(responseParams);
          done();
        });
    });

    it('should call _renderPage method', done => {
      spyOn(pageRenderer, '_renderPage').and.stub();

      pageRenderer
        .mount(controller, view, loadedPageState, routeOptions)
        .then(() => {
          expect(pageRenderer._renderPage).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('_renderPage method', () => {
    let fetchedResource = {
      resource: 'json',
    };

    it('should return already sent data to client', () => {
      let responseParams = {
        content: '',
        status: 200,
        pageState: fetchedResource,
      };

      spyOn(response, 'isResponseSent').and.returnValue(true);
      spyOn(response, 'getResponseParams').and.returnValue(responseParams);

      expect(
        pageRenderer._renderPage(controller, view, fetchedResource)
      ).toStrictEqual(responseParams);
    });

    describe('render new page', () => {
      let responseParams = { status: 200, content: '', pageState: {} };
      let pageRenderResponse = null;

      beforeEach(() => {
        spyOn(controller, 'setState').and.stub();
        spyOn(controller, 'setMetaParams').and.stub();
        spyOn(controller, 'getHttpStatus').and.stub();
        spyOn(pageRenderer, '_renderPageContentToString').and.stub();
        spyOn(response, 'status').and.returnValue(response);
        spyOn(response, 'setPageState').and.returnValue(response);
        spyOn(response, 'send').and.returnValue(response);
        spyOn(response, 'getResponseParams').and.returnValue(responseParams);

        pageRenderResponse = pageRenderer._renderPage(
          controller,
          view,
          fetchedResource,
          routeOptions
        );
      });

      it('should set controller state', () => {
        expect(controller.setState).toHaveBeenCalledWith(fetchedResource);
      });

      it('should set meta params', () => {
        expect(controller.setMetaParams).toHaveBeenCalledWith(fetchedResource);
      });

      it('should send response for request', () => {
        expect(response.status).toHaveBeenCalled();
        expect(response.setPageState).toHaveBeenCalled();
        expect(response.send).toHaveBeenCalled();
        expect(controller.getHttpStatus).toHaveBeenCalled();
        expect(pageRenderer._renderPageContentToString).toHaveBeenCalledWith(
          controller,
          view,
          routeOptions
        );
      });

      it('should return response params', () => {
        expect(pageRenderResponse).toStrictEqual(responseParams);
      });
    });
  });

  describe('_renderPageContentToString method', () => {
    let utils = { $Utils: 'utils' };
    let wrapedPageViewElement = {
      wrapElementView: 'wrapedPageViewElement',
    };
    let pageMarkup = '<body></body>';
    let documentView = () => {};
    let documentViewElement = () => {};
    let documentViewFactory = () => {
      return documentViewElement;
    };
    let appMarkup = '<html>' + pageMarkup + '</html>';
    let revivalSettings = { revivalSettings: 'revivalSettings' };
    let metaManager = { metaManager: 'metaManager' };
    let pageContent = null;

    beforeEach(() => {
      spyOn(ReactDOMServer, 'renderToString').and.returnValue(pageMarkup);
      spyOn(rendererFactory, 'createReactElementFactory').and.returnValue(
        documentViewFactory
      );
      jest
        .spyOn(ReactDOMServer, 'renderToStaticMarkup')
        .mockReturnValue(appMarkup);
      spyOn(pageRenderer, '_getRevivalSettings').and.returnValue(
        revivalSettings
      );
      spyOn(pageRenderer, '_getWrappedPageView').and.returnValue(
        wrapedPageViewElement
      );
      spyOn(pageRenderer, '_getDocumentView').and.returnValue(documentView);
      spyOn(controller, 'getMetaManager').and.returnValue(metaManager);
      spyOn(rendererFactory, 'getUtils').and.returnValue(utils);

      pageContent = pageRenderer._renderPageContentToString(
        controller,
        view,
        routeOptions
      );
    });

    it('should wrap page view', () => {
      expect(pageRenderer._getWrappedPageView).toHaveBeenCalledWith(
        controller,
        view,
        routeOptions
      );
    });

    it('should render page view to string', () => {
      expect(ReactDOMServer.renderToString).toHaveBeenCalledWith(
        wrapedPageViewElement
      );
    });

    it('should create factory for creating React element from document view', () => {
      expect(rendererFactory.createReactElementFactory).toHaveBeenCalledWith(
        documentView
      );
    });

    it('should render static markup from document view', () => {
      expect(rendererFactory.getUtils).toHaveBeenCalled();
      expect(controller.getMetaManager).toHaveBeenCalled();
      expect(pageRenderer._getRevivalSettings).toHaveBeenCalled();
      expect(ReactDOMServer.renderToStaticMarkup).toHaveBeenCalledWith(
        documentViewElement
      );
    });

    it('should return page content', () => {
      expect(pageContent).toBe('<!doctype html>\n' + appMarkup);
    });
  });
});
