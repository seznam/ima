import * as Helper from '@ima/helpers';
import ReactDOM from 'react-dom';
import Controller from 'src/controller/Controller';
import AbstractDocumentView from 'src/page/AbstractDocumentView';
import AbstractPageRenderer from '../AbstractPageRenderer';
import BlankManagedRootView from '../BlankManagedRootView';
import RendererFactory from '../PageRendererFactory';
import ViewAdapter from '../ViewAdapter';
import Dispatcher from 'src/event/Dispatcher';
import {
  toMockedInstance,
  setGlobalMockMethod,
  setGlobalKeepUnmock,
  objectKeepUnmock,
} from 'to-mock';

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);

describe('ima.core.page.renderer.AbstractPageRenderer', function () {
  let pageRenderer = null;
  let rendererFactory = null;
  let dispatcher = null;
  let settings = {
    $Page: {
      $Render: {
        documentView: 'app.component.document.DocumentView',
      },
    },
  };

  let reactiveComponentView = {
    state: {
      key1: 1,
      key2: 'string',
    },
    setState: function () {},
    replaceState: function () {},
  };

  let controller = toMockedInstance(Controller);
  let view = function () {};

  let routeOptions = {
    onlyUpdate: false,
    autoScroll: false,
    allowSPA: false,
    documentView: null,
  };

  beforeEach(function () {
    rendererFactory = toMockedInstance(RendererFactory);
    dispatcher = toMockedInstance(Dispatcher);
    pageRenderer = new AbstractPageRenderer(
      rendererFactory,
      Helper,
      ReactDOM,
      dispatcher,
      settings
    );

    pageRenderer._reactiveView = reactiveComponentView;
  });

  it('should be throw error for mounting component', function () {
    expect(function () {
      pageRenderer.mount();
    }).toThrow();
  });

  it('should be throw error for updating component', function () {
    expect(function () {
      pageRenderer.update();
    }).toThrow();
  });

  it('should be throw error for unmounting component', function () {
    expect(function () {
      pageRenderer.unmount();
    }).toThrow();
  });

  describe('setState method', function () {
    it('should be set new state to reactive component view', function () {
      const state = { state: 'state' };
      //we expect that pageRenderer add temp indicator for viewAdapter method getDerivedStateFromProps
      const stateWithIndicator = Object.assign({}, state, {
        notUsePropsState: true,
      });

      jest.spyOn(reactiveComponentView, 'setState').mockImplementation();

      pageRenderer.setState(state);

      expect(reactiveComponentView.setState).toHaveBeenCalledWith(
        stateWithIndicator,
        expect.any(Function)
      );
    });
  });

  describe('_generateViewProps method', function () {
    it('should be set $Utils to props', function () {
      let utils = { router: 'router' };

      jest.spyOn(rendererFactory, 'getUtils').mockReturnValue(utils);

      expect(pageRenderer._generateViewProps(view)).toStrictEqual({
        $Utils: utils,
        view: view,
        state: {},
      });
    });
  });

  describe('_getWrappedPageView method', function () {
    let utils = { $Utils: 'utils' };
    let state = { state: 'state', $pageView: view };
    let propsView = { view: view };
    let props = Object.assign({}, state, utils, propsView);
    let wrapedPageViewElement = {
      wrapElementView: 'wrapedPageViewElement',
    };
    let managedRootView = function () {};

    beforeEach(function () {
      jest.spyOn(pageRenderer, '_generateViewProps').mockReturnValue(props);
      jest.spyOn(controller, 'getState').mockReturnValue(state);
      jest
        .spyOn(rendererFactory, 'wrapView')
        .mockReturnValue(wrapedPageViewElement);
      jest
        .spyOn(rendererFactory, 'getManagedRootView')
        .mockReturnValue(managedRootView);
    });

    it('should generate view props from controller state', function () {
      pageRenderer._getWrappedPageView(controller, view, routeOptions);

      expect(pageRenderer._generateViewProps).toHaveBeenCalledWith(
        managedRootView,
        state
      );
    });

    it('should return React Component for managedRootView from route options managedRootView property', function () {
      let routeOptionsWithManagedRouteView = Object.assign({}, routeOptions, {
        managedRootView: BlankManagedRootView,
      });
      pageRenderer._getWrappedPageView(
        controller,
        view,
        routeOptionsWithManagedRouteView
      );

      expect(rendererFactory.getManagedRootView).toHaveBeenCalledWith(
        BlankManagedRootView
      );
    });

    it('should call wrapView with default ViewAdapter', function () {
      pageRenderer._getWrappedPageView(controller, view, routeOptions);

      expect(rendererFactory.wrapView).toHaveBeenCalledWith(ViewAdapter, props);
    });
  });

  describe('_getDocumentView method', function () {
    beforeEach(function () {
      jest.spyOn(rendererFactory, 'getDocumentView').mockImplementation();
    });

    it('should return default document view which is set in settings.$Page.$Render.documentView', function () {
      pageRenderer._getDocumentView(routeOptions);

      expect(rendererFactory.getDocumentView).toHaveBeenCalledWith(
        settings.$Page.$Render.documentView
      );
    });

    it('should return document view which is defined in routeOptions.documentView', function () {
      let routeOptionsWithDocumentView = Object.assign({}, routeOptions, {
        documentView: AbstractDocumentView,
      });
      pageRenderer._getDocumentView(routeOptionsWithDocumentView);

      expect(rendererFactory.getDocumentView).toHaveBeenCalledWith(
        AbstractDocumentView
      );
    });
  });
});
