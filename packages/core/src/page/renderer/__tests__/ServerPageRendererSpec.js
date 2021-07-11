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
  objectKeepUnmock
} from 'to-mock';

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
    param2: Promise.resolve(param2)
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
    renderToStaticMarkup: () => {}
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
    documentView: null
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
    jest.spyOn(Promise, 'resolve');

    pageRenderer._wrapEachKeyToPromise(params);

    expect(Promise.resolve).toHaveBeenCalledWith(param1);
    expect(Promise.resolve.mock.calls.length).toEqual(1);
  });

  describe('update method', () => {
    it('should reject promise with error', done => {
      jest.spyOn(pageRenderer, 'mount').mockImplementation();

      pageRenderer.update(controller, params).catch(error => {
        expect(error instanceof GenericError).toEqual(true);
        done();
      });
    });
  });

  describe('mount method', () => {
    let loadedPageState = {
      param1: 'param1',
      param2: Promise.resolve('param2')
    };

    it('should return already sent data to the client', done => {
      let responseParams = {
        content: '',
        status: 200,
        pageState: loadedPageState
      };

      jest.spyOn(response, 'isResponseSent').mockReturnValue(true);
      jest.spyOn(response, 'getResponseParams').mockReturnValue(responseParams);

      pageRenderer
        .mount(controller, view, loadedPageState, routeOptions)
        .then(page => {
          expect(page).toEqual(responseParams);
          done();
        });
    });

    it('should call _renderPage method', done => {
      jest.spyOn(pageRenderer, '_renderPage').mockImplementation();

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
      resource: 'json'
    };

    it('should return already sent data to client', () => {
      let responseParams = {
        content: '',
        status: 200,
        pageState: fetchedResource
      };

      jest.spyOn(response, 'isResponseSent').mockReturnValue(true);
      jest.spyOn(response, 'getResponseParams').mockReturnValue(responseParams);

      expect(
        pageRenderer._renderPage(controller, view, fetchedResource)
      ).toEqual(responseParams);
    });

    describe('render new page', () => {
      let responseParams = { status: 200, content: '', pageState: {} };
      let pageRenderResponse = null;

      beforeEach(() => {
        jest.spyOn(controller, 'setState').mockImplementation();
        jest.spyOn(controller, 'setMetaParams').mockImplementation();
        jest.spyOn(controller, 'getHttpStatus').mockImplementation();
        jest
          .spyOn(pageRenderer, '_renderPageContentToString')
          .mockImplementation();
        jest.spyOn(response, 'status').mockReturnValue(response);
        jest.spyOn(response, 'setPageState').mockReturnValue(response);
        jest.spyOn(response, 'send').mockReturnValue(response);
        jest
          .spyOn(response, 'getResponseParams')
          .mockReturnValue(responseParams);

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
        expect(pageRenderResponse).toEqual(responseParams);
      });
    });
  });

  describe('_renderPageContentToString method', () => {
    let utils = { $Utils: 'utils' };
    let wrapedPageViewElement = {
      wrapElementView: 'wrapedPageViewElement'
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
      jest.spyOn(ReactDOMServer, 'renderToString').mockReturnValue(pageMarkup);
      jest
        .spyOn(rendererFactory, 'createReactElementFactory')
        .mockReturnValue(documentViewFactory);
      jest
        .spyOn(ReactDOMServer, 'renderToStaticMarkup')
        .mockReturnValue(appMarkup);
      jest
        .spyOn(pageRenderer, '_getRevivalSettings')
        .mockReturnValue(revivalSettings);
      jest
        .spyOn(pageRenderer, '_getWrappedPageView')
        .mockReturnValue(wrapedPageViewElement);
      jest
        .spyOn(pageRenderer, '_getDocumentView')
        .mockReturnValue(documentView);
      jest.spyOn(controller, 'getMetaManager').mockReturnValue(metaManager);
      jest.spyOn(rendererFactory, 'getUtils').mockReturnValue(utils);

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
      expect(pageContent).toEqual('<!doctype html>\n' + appMarkup);
    });
  });
});
