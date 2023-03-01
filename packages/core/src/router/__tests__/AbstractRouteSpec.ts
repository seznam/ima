import { AbstractRoute } from '../AbstractRoute';
import { RouteOptions } from '../Router';

class MockedAbstractRoute extends AbstractRoute<string> {
  toPath() {
    return '';
  }

  matches() {
    return true;
  }

  extractParameters() {
    return {};
  }
}

describe('ima.core.router.AbstractRoute', function () {
  let route: MockedAbstractRoute;
  const name = 'home';
  const controller = function () {
    return {};
  };
  const view = function () {
    return {};
  };
  const pathExpression = '/home/:userId/something/:somethingId/:?optional';
  const options = {
    onlyUpdate: false,
    autoScroll: true,
    documentView: null,
    managedRootView: null,
    viewAdapter: null,
    middlewares: [],
  };

  beforeEach(function () {
    route = new MockedAbstractRoute(
      name,
      pathExpression,
      controller,
      view,
      options as unknown as RouteOptions
    );
  });

  it('should return route name', function () {
    expect(route.getName()).toBe(name);
  });

  it('should return route path', function () {
    expect(route.getPathExpression()).toBe(pathExpression);
  });

  it('should return route options', function () {
    expect(route.getOptions()).toStrictEqual(options);
  });

  it('should return route controller', () => {
    const result = route.getController();

    expect(result).toStrictEqual(controller);
  });

  it('should return route view', () => {
    const result = route.getView();

    expect(result).toStrictEqual(view);
  });

  it('should return and cache async route controller', async () => {
    route['_controller'] = async () => controller;
    const result = await route.getController();

    expect(result).toStrictEqual(controller);
    await expect(route['_cachedController']).resolves.toStrictEqual(result);
  });

  it('should return and cache async route view', async () => {
    route['_view'] = async () => view;
    const result = await route.getView();

    expect(result).toStrictEqual(view);
    await expect(route['_cachedView']).resolves.toStrictEqual(result);
  });

  it('should preload async view and controller', async () => {
    const asyncController = async () =>
      Promise.resolve({ default: controller });
    const asyncView = async () => Promise.resolve({ default: view });

    route = new MockedAbstractRoute(
      name,
      pathExpression,
      asyncController,
      asyncView,
      options as unknown as RouteOptions
    );

    jest.spyOn(route, 'getView');
    jest.spyOn(route, 'getController');

    const [resultController, resultView] = await route.preload();

    expect(route.getView).toHaveBeenCalledTimes(1);
    expect(route.getController).toHaveBeenCalledTimes(1);
    expect(resultView).toStrictEqual(view);
    expect(resultController).toStrictEqual(controller);
  });

  describe('_getAsyncModule() method', () => {
    it('should return promise resolving to default export for async import', async () => {
      const asyncController = async () =>
        Promise.resolve({ default: controller });

      await expect(
        route._getAsyncModule(asyncController)
      ).resolves.toStrictEqual(controller);
    });

    it('should return promise resolving to async constructor', async () => {
      const asyncController = async () => Promise.resolve(controller);

      await expect(
        route._getAsyncModule(asyncController)
      ).resolves.toStrictEqual(controller);
    });

    it('should return constructor', () => {
      expect(route._getAsyncModule(controller)).toStrictEqual(controller);
    });
  });
});
