import { StringParameters } from '../../types';
import { RouteOptions } from '../Router';
import { StaticRoute } from '../StaticRoute';

type toPathParam = { [key: string]: string | number };

describe('ima.core.router.StaticRoute', function () {
  let route: StaticRoute;
  const name = 'home';
  const controller = 'controller-mock';
  const view = 'view-mock';
  const pathExpression = '/home/:userId/something/:somethingId/:?optional';
  const options = {
    onlyUpdate: false,
    autoScroll: true,
    documentView: null,
    managedRootView: null,
    viewAdapter: null,
  } as unknown as RouteOptions;

  beforeEach(function () {
    route = new StaticRoute(name, pathExpression, controller, view, options);
  });

  describe('should create right path -', function () {
    [
      {
        pathExpression: '/home/:userId/something/:somethingId',
        params: { userId: 1, somethingId: 2 },
        result: '/home/1/something/2',
      },
      {
        pathExpression: '/home/:userId/something/:somethingId/',
        params: { userId: 1, somethingId: 2 },
        result: '/home/1/something/2',
      },
      {
        pathExpression: '/list/:route/:action/:sort/:page',
        params: {
          route: 'users',
          action: 'view',
          sort: 'price',
          page: 5,
        },
        result: '/list/users/view/price/5',
      },
      {
        pathExpression: '/list/:route/:action/:sort/:page',
        params: {
          action: 'view',
          route: 'users',
          sort: 'price',
          page: 5,
        },
        result: '/list/users/view/price/5',
      },
      {
        pathExpression: '/list/:?route/:?action/:?sort/:?page',
        params: { route: 'users', action: 'view' },
        result: '/list/users/view',
      },
      {
        pathExpression: '/list/:?route/:?action/:?sort/:?page',
        params: { action: 'view', route: 'users' },
        result: '/list/users/view',
      },
      {
        pathExpression: '/search/:?phrase/:?action/:?sort/:?page',
        params: { phrase: 'users', action: '' },
        result: '/search/users',
      },
      {
        pathExpression: '/search/:?phrase/:?action/:?sort/:?page',
        params: { action: '', phrase: 'users' },
        result: '/search/users',
      },
      {
        pathExpression: '/search/:phrase/:?action/:?sort/:?page',
        params: { phrase: 'users', action: '' },
        result: '/search/users',
      },
      {
        pathExpression: '/search/:phrase/:?action/:?sort/:?page',
        params: { action: '', phrase: 'users' },
        result: '/search/users',
      },

      {
        pathExpression: '/search/:phrase/:?sort/:?page',
        params: { phrase: '' },
        result: '/search',
      },

      {
        pathExpression: '/:someId-:?someName/:?cntr/:?price/:?sort/:?page',
        params: {
          someId: 11,
          cntr: 'gb',
          price: 'all',
          sort: 'top',
          page: 2,
        },
        result: '/11-/gb/all/top/2',
      },
      {
        pathExpression: '/:someId-:?someName/:?locality/:?price/:?sort/:?page',
        params: { someId: 11, locality: 'cz', price: 'all-prices' },
        result: '/11-/cz/all-prices',
      },
      {
        pathExpression:
          '/:someId-:?anotherId-:?someName/:?locality/:?price/:?sort/:?page',
        params: { someId: 11, locality: 'cz', price: 'all-prices' },
        result: '/11--/cz/all-prices',
      },
      {
        pathExpression: '/:?route/:?action/:?sort/:?page',
        params: { route: 'users', action: 'view' },
        result: '/users/view',
      },
      {
        pathExpression: '/:?route/:?action/:?sort/:?page',
        params: { action: 'view', route: 'users' },
        result: '/users/view',
      },

      {
        pathExpression: '/home/:userId/something/:somethingId/:?optional',
        params: { userId: 'hello', somethingId: 'job' },
        result: '/home/hello/something/job',
      },

      {
        pathExpression: '/:catId-:catName',
        params: { catId: 2012, catName: 'some-category' },
        result: '/2012-some-category',
      },
      {
        pathExpression: '/:someId-:?someName',
        params: { someId: 2012, someName: 'some-name' },
        result: '/2012-some-name',
      },
      {
        pathExpression: '/:someId-:?someName',
        params: { someId: 2012 },
        result: '/2012-',
      },
      {
        pathExpression: '/:catId-special-event-:catName',
        params: { catId: '12', catName: 'yellow-roses' },
        result: '/12-special-event-yellow-roses',
      },
      {
        pathExpression: '/:detailId-:catId-:detailName',
        params: {
          detailId: '125569',
          catId: '1992',
          detailName: 'skoda-105',
        },
        result: '/125569-1992-skoda-105',
      },
      {
        pathExpression: '/:?detailId-:?catId-:?detailName',
        params: {
          detailId: '125569',
          catId: '1992',
          detailName: 'skoda-105',
        },
        result: '/125569-1992-skoda-105',
      },
      {
        pathExpression: '/:detailId-:catId/:?name',
        params: { detailId: '125569', catId: '1992' },
        result: '/125569-1992',
      },
      {
        pathExpression: '/:detailId-:catId/:?name',
        params: {
          detailId: '125569',
          catId: '6992',
          name: 'skoda-rapid',
        },
        result: '/125569-6992/skoda-rapid',
      },
      {
        pathExpression: '/cars/:detailId-:catId/:name',
        params: {
          detailId: '125569',
          catId: '6992',
          name: 'skoda-rapid',
        },
        result: '/cars/125569-6992/skoda-rapid',
      },
      {
        pathExpression: ':param/home/:userId/something/:?somethingId/',
        params: { param: 'cool', userId: 1, somethingId: 2 },
        result: '/cool/home/1/something/2',
      },

      // invalid parameters order
      {
        pathExpression: '/:?optional/home/:userId/something/:someId/',
        params: { optional: 'too-bad', userId: 1, someId: 2 },
        result: '/too-bad/home/1/something/2',
      },
      {
        pathExpression: '/home/:userId/:?optional/something/:someId',
        params: { userId: 1, someId: 2 },
        result: '/home/1/something/2',
      },
    ].forEach((value: Record<string, unknown>) => {
      const localStaticRoute = new StaticRoute(
        name,
        value.pathExpression as string,
        controller,
        view,
        options
      );
      it(
        'for path params for pathExpr ' +
          value.pathExpression +
          ' and params ' +
          JSON.stringify(value.params),
        function () {
          expect(
            localStaticRoute.toPath(value.params as StringParameters)
          ).toBe(value.result);
        }
      );
    });

    it('for empty variables will be return defined path', function () {
      expect(route.toPath()).toBe('/home/:userId/something/:somethingId');
    });

    it('encode path params', function () {
      const localStaticRoute = new StaticRoute(
        name,
        '/home/:encodeString',
        controller,
        view,
        options
      );
      expect(localStaticRoute.toPath({ encodeString: 'á/b?č#d:ě%25' })).toBe(
        '/home/%C3%A1%2Fb%3F%C4%8D%23d%3A%C4%9B%2525'
      );
    });

    [
      {
        pathExpression:
          ':?optional/home/:userId/something/:somethingId/:?optional2',
        params: { userId: 1, somethingId: 2, optional: 'en' },
        result: '/en/home/1/something/2',
      },
      {
        pathExpression:
          ':?optional/home/:userId/something/:somethingId/:?optional2',
        params: { userId: 1, somethingId: 2, optional2: 'today' },
        result: '/home/1/something/2/today',
      },
      {
        pathExpression: '/home/:userId/something/:somethingId/:?optional2/',
        params: {
          userId: 'hello',
          somethingId: 'job',
          optional2: 'today',
        },
        result: '/home/hello/something/job/today',
      },
      {
        pathExpression:
          ':?optional/home/:userId/something/:somethingId/:?optional2',
        params: { userId: 1, somethingId: 2, optional: 'en' },
        result: '/en/home/1/something/2',
      },
      {
        pathExpression:
          ':?optional/home/:userId/something/:somethingId/:?optional2',
        params: {
          userId: 1,
          somethingId: 2,
          optional: 'en',
          optional2: 'today',
        },
        result: '/en/home/1/something/2/today',
      },
    ].forEach(value => {
      const localStaticRoute = new StaticRoute(
        name,
        value.pathExpression,
        controller,
        view,
        options
      );
      const { params, result } = value;

      it(
        'for optional param will be return defined path for pathExpr ' +
          value.pathExpression +
          ' and params ' +
          JSON.stringify(params),
        function () {
          expect(localStaticRoute.toPath(params as toPathParam)).toBe(result);
        }
      );
    });

    [
      { pathExpression: ':?optional', params: {}, result: '/' },
      { pathExpression: ':?optional/', params: {}, result: '/' },
      {
        pathExpression: ':?optional/:?optional2',
        params: { optional: 'en' },
        result: '/en',
      },
      {
        pathExpression: ':?optional',
        params: { optional: 'en' },
        result: '/en',
      },
      {
        pathExpression: ':?optional/',
        params: { optional: 'en' },
        result: '/en',
      },
      {
        pathExpression: ':?optional/:?optional2',
        params: { optional: 'en', optional2: 'cs' },
        result: '/en/cs',
      },
    ].forEach(value => {
      const localStaticRoute = new StaticRoute(
        name,
        value.pathExpression,
        controller,
        view,
        options
      );
      const { params, result } = value;

      it(
        'for only optional param will be return defined path for pathExpr ' +
          value.pathExpression +
          ' and params ' +
          JSON.stringify(params),
        function () {
          expect(localStaticRoute.toPath(params as toPathParam)).toBe(result);
        }
      );
    });

    it('for path and query variables', function () {
      const value = {
        userId: 'hello',
        somethingId: 'job',
        query1: 'query',
        query2: 'text for you',
      };

      expect(route.toPath(value)).toBe(
        '/home/' +
          value.userId +
          '/something/' +
          value.somethingId +
          '?query1=query&query2=' +
          encodeURIComponent(value.query2)
      );
    });
  });

  describe('should get params from path', function () {
    const multipleParamsExpr =
      '/offer/:group/:catId-:catName/:?productId/:?promo';

    [
      {
        pathExpression: '/:userId',
        path: '/user12',
        params: { userId: 'user12' },
      },
      {
        pathExpression: '/:category',
        path: '/89524174-white-roses',
        params: { category: '89524174-white-roses' },
      },
      {
        pathExpression: '/:userId-',
        path: '/895174-bad-user',
        params: {},
      },
      {
        pathExpression: '/:?userId-',
        path: '/895174-bad-user',
        params: {},
      },
      {
        pathExpression: '/:userId_',
        path: '/895174_bad-user',
        params: {},
      },
      {
        pathExpression: '/:?userId_',
        path: '/895174_bad-user',
        params: {},
      },
      {
        pathExpression: '/:userId ',
        path: '/895174 bad-user',
        params: {},
      },
      {
        pathExpression: '/:?userId ',
        path: '/895174 bad-user',
        params: {},
      },

      {
        pathExpression: '/:catId-:catName',
        path: '/89524171-yellow-roses',
        params: { catId: '89524171', catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:catId_:catName',
        path: '/89524171-yellow-roses',
        params: {},
      },
      {
        pathExpression: '/:catId_:catName',
        path: '/89524171_yellow-roses',
        params: { catId: '89524171', catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:catId-special-event-:catName',
        path: '/12-special-event-roses-mixed',
        params: { catId: '12', catName: 'roses-mixed' },
      },
      {
        pathExpression: '/:detailId-:catId-:detailName',
        path: '/125569-12-skoda-105',
        params: {
          detailId: '125569',
          catId: '12',
          detailName: 'skoda-105',
        },
      },

      {
        pathExpression: '/:?catId-:catName',
        path: '/89524171-yellow-roses',
        params: { catId: '89524171', catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:?catId-:catName',
        path: '/-yellow-roses',
        params: { catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:?catId-:?catName',
        path: '/89524171-yellow-roses',
        params: { catId: '89524171', catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:?catId-:?catName',
        path: '/89524171-',
        params: { catId: '89524171' },
      },
      {
        pathExpression: '/:?catId-:?catName',
        path: '/-yellow-roses',
        params: { catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:?catId-:?catName',
        path: '/-',
        params: {},
      },

      {
        pathExpression: '/:?catId_:catName',
        path: '/89524331_yellow-roses',
        params: { catId: '89524331', catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:?catId_:catName',
        path: '/_yellow-roses',
        params: { catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:?catId_:catName',
        path: '/-yellow-roses',
        params: {},
      },
      {
        pathExpression: '/:?catId_:?catName',
        path: '/89524331_yellow-roses',
        params: { catId: '89524331', catName: 'yellow-roses' },
      },
      {
        pathExpression: '/:?catId_:?catName',
        path: '/89524331_',
        params: { catId: '89524331' },
      },
      {
        pathExpression: '/:?catId_:?catName',
        path: '/_yellow-roses',
        params: { catName: 'yellow-roses' },
      },

      {
        pathExpression: '/:?catId :catName',
        path: '/89524171 yellow-roses',
        params: {},
      },
      {
        pathExpression: '/:?catId :catName',
        path: '/ yellow-roses',
        params: {},
      },
      {
        pathExpression: '/:?catId :?catName',
        path: '/89524171 yellow-roses',
        params: {},
      },
      {
        pathExpression: '/:?catId :?catName',
        path: '/89524171 ',
        params: {},
      },
      {
        pathExpression: '/:?catId :?catName',
        path: '/ yellow-roses',
        params: {},
      },
      {
        pathExpression: '/:?catId :?catName',
        path: '/ ',
        params: {},
      },

      {
        pathExpression: '/:?catId-some-expected-string-:catName',
        path: '/89524221-some-expected-string-pink-roses',
        params: { catId: '89524221', catName: 'pink-roses' },
      },
      {
        pathExpression: '/:?catId-some-expected-string-:catName',
        path: '/-some-expected-string-pink-roses',
        params: { catName: 'pink-roses' },
      },
      {
        pathExpression: '/:?catId-some-expected-string-:?catName',
        path: '/89524221-some-expected-string-pink-roses',
        params: { catId: '89524221', catName: 'pink-roses' },
      },
      {
        pathExpression: '/:?catId-some-expected-string-:?catName',
        path: '/89524221-some-unexpected-string-pink-roses',
        params: {},
      },
      {
        pathExpression: '/:?catId-some-expected-string-:?catName',
        path: '/-some-expected-string-',
        params: {},
      },
      {
        pathExpression: '/:?catId-some-expected-string-:?catName',
        path: '/-some-expected-string-pink-roses',
        params: { catName: 'pink-roses' },
      },
      {
        pathExpression: '/:?catId-some-expected-string-:?catName',
        path: '/89524221-some-expected-string-',
        params: { catId: '89524221' },
      },

      {
        pathExpression: '/:?catId_some_expected_string_:catName',
        path: '/89524221_some_expected_string_pink_roses',
        params: { catId: '89524221', catName: 'pink_roses' },
      },
      {
        pathExpression: '/:?catId_some_expected_string_:catName',
        path: '/_some_expected_string_pink_roses',
        params: { catName: 'pink_roses' },
      },
      {
        pathExpression: '/:?catId_some_expected_string_:?catName',
        path: '/89524221_some_expected_string_pink_roses',
        params: { catId: '89524221', catName: 'pink_roses' },
      },
      {
        pathExpression: '/:?catId_some_expected_string_:?catName',
        path: '/_some_expected_string_',
        params: {},
      },
      {
        pathExpression: '/:?catId_some_expected_string_:?catName',
        path: '/_some_expected_string_pink_roses',
        params: { catName: 'pink_roses' },
      },
      {
        pathExpression: '/:?catId_some_expected_string_:?catName',
        path: '/89524221_some_expected_string_',
        params: { catId: '89524221' },
      },

      {
        pathExpression: '/:?catId some expected string :catName',
        path: '/89524521 some expected string pink roses',
        params: {},
      },
      {
        pathExpression: '/:?catId some expected string :catName',
        path: '/ some expected string pink roses',
        params: {},
      },
      {
        pathExpression: '/:?catId some expected string :?catName',
        path: '/89524521 some expected string pink roses',
        params: {},
      },
      {
        pathExpression: '/:?catId some expected string :?catName',
        path: '/ some expected string pink roses',
        params: {},
      },
      {
        pathExpression: '/:?catId some expected string :?catName',
        path: '/89524521 some expected string ',
        params: {},
      },

      {
        pathExpression: '/:userId/:detailId-:catId-:detailName',
        path: '/1986/125569-12-skoda-105',
        params: {
          userId: '1986',
          detailId: '125569',
          catId: '12',
          detailName: 'skoda-105',
        },
      },
      {
        pathExpression: '/:catId-:catName/:?someId/:?anotherId',
        path: '/578742-roses',
        params: { catId: '578742', catName: 'roses' },
      },
      {
        pathExpression: '/:catId-:catName/:?someId/:?another',
        path: '/578742-roses/8999',
        params: {
          catId: '578742',
          catName: 'roses',
          someId: '8999',
        },
      },
      {
        pathExpression: '/:catId-:catName/:?someId/:?another',
        path: '/578742-roses/8999/75258-eoc',
        params: {
          catId: '578742',
          catName: 'roses',
          someId: '8999',
          another: '75258-eoc',
        },
      },
      {
        pathExpression: '/something/:group/:catId-:catName',
        path: '/something/flowers/',
        params: {},
      },
      {
        pathExpression: '/something/:group/:catId-:catName',
        path: '/something/flowers/89524175-red-roses',
        params: {
          group: 'flowers',
          catId: '89524175',
          catName: 'red-roses',
        },
      },
      {
        pathExpression: multipleParamsExpr,
        path: '/offer/flowers/524175',
        params: {},
      },
      {
        pathExpression: multipleParamsExpr,
        path: '/offer/flowers/524175-red-roses',
        params: {
          group: 'flowers',
          catId: '524175',
          catName: 'red-roses',
        },
      },
      {
        pathExpression: multipleParamsExpr,
        path: '/offer/flowers/524175-red-roses/120415247',
        params: {
          group: 'flowers',
          catId: '524175',
          catName: 'red-roses',
          productId: '120415247',
        },
      },
      {
        pathExpression: multipleParamsExpr,
        path: '/offer/flowers/524175-red-roses/120415247/winter2017',
        params: {
          group: 'flowers',
          catId: '524175',
          catName: 'red-roses',
          productId: '120415247',
          promo: 'winter2017',
        },
      },

      {
        pathExpression: '/home/:userId/something/:somethingId',
        path: '/home/1/something/2',
        params: { userId: '1', somethingId: '2' },
      },
      {
        pathExpression: '/home/:userId/something/:somethingId',
        path: '/home/1/something',
        params: { userId: undefined, somethingId: undefined },
      },
      {
        pathExpression: '/home/:userId/something/:somethingId',
        path: '/home/param1/something/param2',
        params: { userId: 'param1', somethingId: 'param2' },
      },

      {
        pathExpression: '/home/:userId/something/:somethingId',
        path: '/home/param1/something/param2?query=param3',
        params: {
          userId: 'param1',
          somethingId: 'param2',
          query: 'param3',
        },
      },

      {
        pathExpression: '/:?userId',
        path: '/user12',
        params: { userId: 'user12' },
      },

      {
        pathExpression: '/:userId/something/:?somethingId',
        path: 'user1/something',
        params: { userId: 'user1' },
      },
      {
        pathExpression: '/:userId/something/:?somethingId',
        path: 'user1/something/param1',
        params: { userId: 'user1', somethingId: 'param1' },
      },
      {
        pathExpression: '/something/:?somethingId/:?userId',
        path: '/something/param1',
        params: { somethingId: 'param1' },
      },
      {
        pathExpression: '/something/:?somethingId/:?userId',
        path: '/something/param1/user1',
        params: { somethingId: 'param1', userId: 'user1' },
      },
      {
        pathExpression: '/:encodeString',
        path: '/%C3%A1%2Fb%3F%C4%8D%23d%3A%C4%9B%2525',
        params: { encodeString: 'á/b?č#d:ě%25' },
      },

      // not matched route
      {
        pathExpression: '/:catId-:catName/:?someParam/:?another',
        path: '/rondam/moje-inzeraty/nejlevneji',
        params: {},
      },
      {
        pathExpression: '/:catId-:catName/:?someParam/:?another',
        path: '/rondam?name=moje-inzeraty&param=nejlevneji',
        params: {},
      },

      // invalid parameters order (required vs. optional)
      {
        pathExpression: '/:?userId/something/:someId',
        path: '/something/param1',
        params: {},
      },
      {
        pathExpression: '/:?userId/something/:someId',
        path: 'user1/something/param1',
        params: {},
      },
      {
        pathExpression: '/something/:?someId/:userId',
        path: '/something/user1',
        params: {},
      },
      {
        pathExpression: '/something/:?someId/:userId',
        path: '/something/param1/user1',
        params: {},
      },
      {
        pathExpression: '/test/:?param1/:?param2',
        path: '/test/xxx',
        params: { param1: 'xxx', param2: undefined },
      },
    ].forEach(value => {
      it(value.pathExpression, function () {
        const localStaticRoute = new StaticRoute(
          'unknown',
          value.pathExpression,
          controller,
          view,
          options
        );

        const routeParams = localStaticRoute.extractParameters(
          value.path,
          'https://imajs.io' + value.path
        );
        const keys = Object.keys(value.params);

        keys.forEach(key => {
          // @ts-expect-error
          expect(routeParams[key]).toBe(value.params[key]);
        });
      });
    });
  });

  describe('should return true for matched route regular', function () {
    [
      { path: '/home/1/something/2', result: true },
      { path: '/home/1/something', result: false },
      { path: '/home/param1/something/param2', result: true },
      {
        path: '/home/param1/something/param2/optional',
        result: true,
      },
      {
        path: 'optional/home/param1/something/param2/optional',
        result: false,
      },
      {
        path: '/home/param1/something/param2?query=param3',
        result: true,
      },
    ].forEach(value => {
      const { path, result } = value;
      it(
        path + ' for ' + pathExpression + ` [${result.toString()}]`,
        function () {
          expect(route.matches(path)).toBe(result);
        }
      );
    });

    [
      {
        pathExpression: '/:param1/:param2/:param3',
        path: '/p1/p2/p3',
        result: true,
      },
      {
        pathExpression: '/:param1/:param2/:param3',
        path: '/home-and-furniture/medium-mattresses/extra-class',
        result: true,
      },
      {
        pathExpression: '/:param1/:param2/:param3',
        path: '/p1/p2',
        result: false,
      },
      {
        pathExpression: '/:param1/:?param2/:?param3',
        path: '/p1/p2',
        result: true,
      },
      {
        pathExpression: '/:param1/:?param2/:?param3',
        path: '/home-and-furniture/medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p2',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1/p2',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1/p2/p3',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1/p2/p3/p4',
        result: false,
      },

      {
        pathExpression: '/:catId-:catName',
        path: '/mattresses',
        result: false,
      },
      {
        pathExpression: '/:catId_:catName',
        path: '/-medium-mattresses',
        result: false,
      },
      {
        pathExpression: '/:catId-:catName',
        path: '/5820-medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/:catId-:catName',
        path: '/5820-',
        result: false,
      },
      {
        pathExpression: '/:catId-:catName',
        path: '/12-sale/top',
        result: false,
      },
      {
        pathExpression: '/:catId-:catName/:paramA',
        path: '/5812-medium-mattresses',
        result: false,
      },
      {
        pathExpression: '/:catId-:catName/:paramA',
        path: '/5812-medium-mattresses/big-sale',
        result: true,
      },
      {
        pathExpression: '/:catId-:catName/:?paramA',
        path: '/5812-medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/:catId-:catName/:?paramA',
        path: '/5812-medium-mattresses/big-sale',
        result: true,
      },

      {
        pathExpression: '/:catId-:catName',
        path: '/5812-medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/:catId-:catName',
        path: '/x-medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/promo/:promoId',
        path: '/promo/2-mattresses?utm_source=seznam&utm_medium=link&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        result: true,
      },
      {
        pathExpression: '/promo/:promoId',
        path: '/promo/3-mattresses/',
        result: true,
      },
      {
        pathExpression: '/:catId_:catName',
        path: '/5812_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/something/:catId_:catName',
        path: '/something/5812_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/something/:catId_:catName/:detailId-:color',
        path: '/something/5812_medium-mattresses/5687710-white',
        result: true,
      },

      {
        pathExpression: '/:?parám1/:?parám2/:?parám3',
        path: '/p1/p2/p3',
        result: false,
      },
      {
        pathExpression: '/something/:catId_:catName/:?detailId-:?color',
        path: '/something/5812_medium-mattresses',
        result: false,
      },

      {
        pathExpression: '/something/:catId_:catName/:?detailId-:?color',
        path: '/something/5812_medium-%C5%A1rot/5687710-white',
        result: true,
      },

      {
        pathExpression:
          '/something/:catId_:catName_:parentCatId/:?detailId-:?color-:?size',
        path: '/something/5812_medium-mattresses_5687/5687710-white-210',
        result: true,
      },
      {
        pathExpression:
          '/something/:catId_:catName_:parentCatId/:?detailId-:?color_:?size',
        path: '/something/5812_medium-mattresses_5687/5687710-white-black_210-65',
        result: true,
      },
      {
        pathExpression: '/something/:catId_:catName/:?detailId-:?color',
        path: '/something/5812_medium-mattresses/5687710-white',
        result: true,
      },
      {
        pathExpression: '/something/:catId_:catName/:?detailId-:?color',
        path: '/something/5812_medium-mattresses/5687710-',
        result: true,
      },
      {
        pathExpression: '/something/:catId_:catName/:?detailId-:?color/:?promo',
        path: '/something/5812_medium-mattresses/5687710-black/WINTER',
        result: true,
      },

      {
        pathExpression: '/:?catId_:catName',
        path: '/5821_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/:?catId_:catName',
        path: '/_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/something/:?catId_:catName',
        path: '/something/5821_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/something/:?catId_:catName',
        path: '/something/_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/something/:?catId_:?catName',
        path: '/something/_medium-mattresses',
        result: true,
      },

      {
        pathExpression: '/:?catId_:?catName',
        path: '/5812_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/:?catId_:?catName',
        path: '/_medium-mattresses',
        result: true,
      },
      {
        pathExpression: '/:?catId_:?catName',
        path: '/_',
        result: true,
      },

      {
        pathExpression: '/:catId-:catName/:sorting',
        path: '/5741-mattresses',
        result: false,
      },
      {
        pathExpression: '/:catId-:catName/:sorting',
        path: '/5741-mattresses/by-price',
        result: true,
      },
      {
        pathExpression: '/:catId-:catName/:sorting/:?promo',
        path: '/5741-mattresses/by-price/AUTUMN',
        result: true,
      },
      {
        pathExpression: '/:userName',
        path: '/ja.T.O.M.I.K',
        result: true,
      },
      { pathExpression: '/:userName', path: '/2002', result: true },

      // invalid subparams definition
      {
        pathExpression: '/:catId:catName',
        path: '/5812medium-mattresses',
        result: false,
      },

      // detect wrong params order (optional and then required parameter)
      {
        pathExpression: '/something/:?catId/:?catName/:detailId/:color/:promo',
        path: '/something/5812/medium-mattresses/5687710/black/WINTER',
        result: false,
      },
      {
        pathExpression: '/:param1/:?param2/:param3',
        path: '/p1/p2',
        result: false,
      },
      {
        pathExpression: '/:?param1/:param2/:?param3',
        path: '/',
        result: false,
      },
      {
        pathExpression: '/:?param1/:param2/:?param3',
        path: '/p1',
        result: false,
      },
      {
        pathExpression: '/:shopSeo/:?sort/:?page',
        path: '/shopper?utm_source=sbazar&utm_medium=email&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        result: true,
      },
      {
        pathExpression: '/:categoryId-:categoryName',
        path: '/shopper?utm_source=sbazar&utm_medium=email&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        result: false,
      },
      {
        pathExpression: '/:categoryId-:categoryName',
        path: '/125-children-up-to-10?utm_source=sbazar&utm_medium=email&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        result: true,
      },
      {
        pathExpression: '/:categoryId-:?categoryName',
        path: '/shopper?utm_source=sbazar&utm_medium=email&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        result: false,
      },
      {
        pathExpression:
          '/:categoryId-:?categoryName/:?locality/:?price/:?sort/:?page',
        path: '/shopper?utm_source=sbazar&utm_medium=email&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        result: false,
      },
      {
        pathExpression:
          '/:categoryId-:?categoryName/:?locality/:?price/:?sort/:?page',
        path: '/rondam/moje-inzeraty/nejlevneji',
        result: false,
      },
    ].forEach(value => {
      const localStaticRoute = new StaticRoute(
        name,
        value.pathExpression,
        controller,
        view,
        options
      );
      const { path, result } = value;

      it(
        path + ' for ' + value.pathExpression + ` [${result.toString()}]`,
        function () {
          expect(localStaticRoute.matches(path)).toBe(result);
        }
      );
    });
  });

  describe('should return true for matched route and false for unmatched route', function () {
    [
      { pathExpression: '/', path: '/', result: true },
      { pathExpression: '/', path: '/something', result: false },
      { pathExpression: '/:param1', path: '/', result: false },
      { pathExpression: '/:param1', path: '/param1', result: true },
      { pathExpression: '/:param1', path: '/param1/', result: true },

      {
        pathExpression: '/:paramA-:paramB',
        path: '/param1',
        result: false,
      },
      {
        pathExpression: '/:paramA-:paramB',
        path: '/param1-param2',
        result: true,
      },
      {
        pathExpression: '/:paramA-some-text-:paramB',
        path: '/param1-some-text-param2',
        result: true,
      },
      {
        pathExpression: '/:?paramA-:paramB',
        path: '/param1-param2',
        result: true,
      },
      {
        pathExpression: '/:?paramA-:?paramB',
        path: '/param1-param2',
        result: true,
      },
      {
        pathExpression: '/:?paramA-:?paramB/:?optParam',
        path: '/param1-param2',
        result: true,
      },
      {
        pathExpression: '/:?paramA-:paramB/:?optParam',
        path: '/param1-param2/another',
        result: true,
      },
      {
        pathExpression: '/:paramA-:paramB/:?optParam',
        path: '/param1-param2/another',
        result: true,
      },

      {
        pathExpression: '/something',
        path: '/something/',
        result: true,
      },
      {
        pathExpression: '/something/:param1',
        path: '/something/param1/',
        result: true,
      },

      {
        pathExpression: '/something/:param1',
        path: '/something/param1?query=query',
        result: true,
      },

      {
        pathExpression: '/something/:param1',
        path: '/something/param1/param2/param3/',
        result: false,
      },
      {
        pathExpression: '/something/:param1/preview/:param2',
        path: '/something/param1/preview/param2',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p2',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1/p2',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1/p2/p3',
        result: true,
      },
      {
        pathExpression: '/:?param1/:?param2/:?param3',
        path: '/p1/p2/p3/p4',
        result: false,
      },

      {
        pathExpression: '/:param1/:?param2/:?param3',
        path: '/p1/p2',
        result: true,
      },
      {
        pathExpression: '/:param1/something/:?param2/:?param3',
        path: '/p1/something/p2/p3',
        result: true,
      },
      {
        pathExpression: '/:param1/something/:?param2/:?param3',
        path: '/p1/something2/p2',
        result: false,
      },
      {
        pathExpression: '/:param1/something/:?param2/:param3',
        path: '/p1/something2/p2',
        result: false,
      },

      // Test wrong params order.
      {
        pathExpression: '/:param1/something/:?param2/:param3',
        path: '/p1/something/p2',
        result: false,
      },
      {
        pathExpression: '/:?param1/:param2/:?param3',
        path: '/',
        result: false,
      },
      {
        pathExpression: '/:?param1/:param2/:?param3',
        path: '/p1',
        result: false,
      },
    ].forEach(value => {
      const { path, result } = value;
      it(
        'for pathExpression ' +
          value.pathExpression +
          ' and path ' +
          path +
          ` [${result.toString()}]`,
        function () {
          const routeLocal = new StaticRoute(
            name,
            value.pathExpression,
            controller,
            view,
            options
          );

          expect(routeLocal.matches(path)).toBe(result);
        }
      );
    });
  });

  describe('should pass helper methods used in _compileToRegExp()', function () {
    [
      {
        path: '/something/:?someId/:?userId',
        clearPathExpr: 'something\\/:\\?someId\\/:\\?userId',
        result: true,
      },
      {
        path: '/:catId-:catName/:param/:?someId/:?anotherId',
        clearPathExpr: ':catId-:catName\\/:param\\/:\\?someId\\/:\\?anotherId',
        result: true,
      },
      {
        path: '/:?userId/something/:someId',
        clearPathExpr: ':\\?userId\\/something\\/:someId',
        result: false,
      },
      {
        path: '/:?someId/:userId',
        clearPathExpr: ':\\?someId\\/:userId',
        result: false,
      },
      {
        path: '/something/:?someId/:userId',
        clearPathExpr: 'something\\/:\\?someId\\/:userId',
        result: false,
      },
    ].forEach(value => {
      const { path, clearPathExpr, result } = value;
      it(`should check parameters order for '${path}' [${result.toString()}]`, function () {
        const localStaticRoute = new StaticRoute(
          name,
          path,
          controller,
          view,
          options
        );

        const isCorrectParamOrder =
          localStaticRoute._checkParametersOrder(clearPathExpr);
        expect(isCorrectParamOrder).toBe(result);
      });
    });

    [
      {
        path: '/:?someId',
        clearPathExpr: ':?someId',
        optionalParams: [':?someId'],
        result: '(?:([^/?]+)?(?=/|$)?)?',
      },
      {
        path: '/something/:?someId',
        clearPathExpr: 'something/:?someId',
        optionalParams: [':?someId'],
        result: 'something/(?:([^/?]+)?(?=/|$)?)?',
      },
    ].forEach(value => {
      const { path, clearPathExpr, optionalParams, result } = value;
      it(`should replace optional parameters in ${path}`, function () {
        const localStaticRoute = new StaticRoute(
          name,
          path,
          controller,
          view,
          options
        );

        const pattern = localStaticRoute._replaceOptionalParametersInPath(
          clearPathExpr,
          optionalParams
        );
        expect(pattern).toBe(result);
      });
    });

    const notLastOptRegEx = '([^-?/]+)?';
    const notLastRegEx = '([^-?/]+)';

    [
      {
        path: '/:someId-:someName',
        clearPathExpr: ':someId-:someName',
        result: `${notLastRegEx}-([^/?]+)`,
      },
      {
        path: '/something/:someId-:someName',
        clearPathExpr: 'something/:someId-:someName',
        result: `something/${notLastRegEx}-([^/?]+)`,
      },
    ].forEach(value => {
      const { path, clearPathExpr, result } = value;
      it(`should replace required subparameters in ${path}`, function () {
        const localStaticRoute = new StaticRoute(
          name,
          path,
          controller,
          view,
          options
        );

        const pattern = localStaticRoute._replaceRequiredSubParametersInPath(
          clearPathExpr,
          clearPathExpr
        );
        expect(pattern).toBe(result);
      });
    });

    [
      {
        path: '/:?someId-:someName',
        clearPathExpr: ':?someId-:someName',
        optionalSubparamsOthers: [':?someId'],
        optionalSubparamsLast: [],
        result: `${notLastOptRegEx}-:someName`,
      },
      {
        path: '/:?someId-:?someName',
        clearPathExpr: ':?someId-:?someName',
        optionalSubparamsOthers: [':?someId'],
        optionalSubparamsLast: [':?someName'],
        result: `${notLastOptRegEx}-:([^/?]+)?`,
      },
      {
        path: '/something/:?someId-:?someName',
        clearPathExpr: 'something/:?someId-:?someName',
        optionalSubparamsOthers: [':?someId'],
        optionalSubparamsLast: [':?someName'],
        result: `something/${notLastOptRegEx}-:([^/?]+)?`,
      },
    ].forEach(value => {
      const {
        path,
        clearPathExpr,
        optionalSubparamsOthers,
        optionalSubparamsLast,
        result,
      } = value;
      it(`should replace optional parameters in ${path} to ${result}`, function () {
        const localStaticRoute = new StaticRoute(
          name,
          path,
          controller,
          view,
          options
        );

        const pattern = localStaticRoute._replaceOptionalSubParametersInPath(
          clearPathExpr,
          optionalSubparamsOthers,
          optionalSubparamsLast
        );
        expect(pattern).toBe(result);
      });
    });
  });

  describe('query string parser', function () {
    let route: StaticRoute;

    beforeEach(function () {
      route = new StaticRoute('foo', '/:first/:second', 'foo', 'bar', options);
    });

    it('should allow query to override path parameters', function () {
      expect(
        route.extractParameters(
          '/abc/def?stuff=value&second=override',
          'https://domain.com/abc/def?stuff=value&second=override'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'override',
        stuff: 'value',
      });
    });

    it('should handle query with parameter value', function () {
      expect(route.matches('/abc/def?foo=bar')).toBeTruthy();
      expect(route.matches('/abc?foo=bar')).toBeFalsy();
      expect(
        route.extractParameters(
          '/abc/def?foo=bar',
          'https://domain.com/abc/def?foo=bar'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'def',
        foo: 'bar',
      });
    });

    it('should handle query without parameter value', function () {
      expect(route.matches('/abc/def?foo')).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def?foo',
          'https://domain.com/abc/def?foo'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'def',
        foo: true,
      });

      expect(route.matches('/abc/def?foo&bar')).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def?foo&bar&second',
          'https://domain.com/abc/def?foo&bar&second'
        )
      ).toStrictEqual({
        first: 'abc',
        second: true,
        foo: true,
        bar: true,
      });
    });

    it('should handle all query parameter pair separators', function () {
      expect(
        route.matches('/abc/def?foo=xy&bar=zz;giz=mo;stuff;geez&huff')
      ).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def?foo=xy&bar=zz;giz=mo;stuff;geez&huff',
          'https://domain.com/abc/def?foo=xy&bar=zz;giz=mo;stuff;geez&huff'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'def',
        foo: 'xy',
        bar: 'zz',
        giz: 'mo',
        stuff: true,
        geez: true,
        huff: true,
      });
    });

    it('should handle query with multiple parameters', function () {
      expect(
        route.matches('/abc/def?stuff=value&second=override')
      ).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def?stuff=value&second=override',
          'https://domain.com/abc/def?stuff=value&second=override'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'override',
        stuff: 'value',
      });
    });

    it('should ignore hash parameters when getting url parameters', function () {
      expect(route.matches('/abc/def#hashParam=value')).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def#hashParam=value',
          'https://domain.com/abc/def#hashParam=value'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'def',
      });
    });

    it('should ignore hash parameters when getting query parameters', function () {
      expect(
        route.matches('/abc/def?stuff=value#hashParam=value')
      ).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def?stuff=value#hashParam=value',
          'https://domain.com/abc/def?stuff=value#hashParam=value'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'def',
        stuff: 'value',
      });
    });

    it('should ignore hash parameters when getting empty query parameters', function () {
      expect(
        route.matches('/abc/def?stuff=value#hashParam=value')
      ).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def?stuff=#hashParam=value',
          'https://domain.com/abc/def?stuff=#hashParam=value'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'def',
        stuff: '',
      });
    });

    it('should handle query with equal sign in parameter value', function () {
      expect(
        route.matches(
          '/abc/def?stuff=value&other=value=with=equal=signs==&thirdParam'
        )
      ).toBeTruthy();
      expect(
        route.extractParameters(
          '/abc/def?stuff=value&other=value=with=equal=signs==&thirdParam',
          'https://domain.com/abc/def?stuff=value&other=value=with=equal=signs==&thirdParam'
        )
      ).toStrictEqual({
        first: 'abc',
        second: 'def',
        stuff: 'value',
        other: 'value=with=equal=signs==',
        thirdParam: true,
      });
    });
  });
});
