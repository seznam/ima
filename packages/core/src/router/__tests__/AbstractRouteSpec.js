import AbstractRoute from '../AbstractRoute';

describe('ima.core.router.AbstractRoute', function () {
  let route = null;
  const name = 'home';
  const controller = function () {};
  const view = function () {};
  const pathExpression = '/home/:userId/something/:somethingId/:?optional';
  const options = {
    onlyUpdate: false,
    autoScroll: true,
    allowSPA: true,
    documentView: null,
    managedRootView: null,
    viewAdapter: null,
    middlewares: []
  };

  beforeEach(function () {
    route = new AbstractRoute(name, pathExpression, controller, view, options);
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

  it('should return route controller', function () {
    expect(route.getController()).toStrictEqual(controller);
  });

  it('should return route view', function () {
    expect(route.getView()).toStrictEqual(view);
  });

  it('should parse query', function () {
    expect(
      AbstractRoute.decodeURIParameter(encodeURIComponent('á/b?č#d:ě%25'))
    ).toBe('á/b?č#d:ě%25');
  });

  it('should return empty string for query that cant be parsed', function () {
    expect(AbstractRoute.decodeURIParameter('p%F8%EDrodn%ED')).toBe('');
  });

  describe('pairsToQuery() static method', () => {
    it.each([
      [
        [
          [1, true],
          ['hello', 'world']
        ],
        '?1=true&hello=world'
      ],
      [
        [
          [{}, []],
          ['test', () => {}],
          [null, 'world'],
          ['str', 123]
        ],
        '?str=123'
      ],
      [
        [
          [2, undefined],
          ['p', null],
          ['š+', -1]
        ],
        '?%C5%A1%2B=-1'
      ],
      [[[]], '']
    ])('should parse query pairs %j into "%s"', (pairs, result) => {
      expect(AbstractRoute.pairsToQuery(pairs)).toBe(result);
    });
  });

  describe('paramsToQuery() static method', () => {
    it.each([
      [
        {
          1: true,
          hello: 'world'
        },
        '?1=true&hello=world'
      ],
      [
        {
          test: () => {},
          key: null,
          str: 123
        },
        '?str=123'
      ],
      [
        {
          2: undefined,
          p: null,
          'š+': -1
        },
        '?%C5%A1%2B=-1'
      ],
      [[[]], '']
    ])('should parse %j into "%s"', (pairs, result) => {
      expect(AbstractRoute.paramsToQuery(pairs)).toBe(result);
    });
  });
});
