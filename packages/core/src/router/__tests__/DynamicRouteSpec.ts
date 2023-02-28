import { StringParameters } from '../../types';
import { DynamicRoute, RoutePathExpression } from '../DynamicRoute';
import { RouteOptions } from '../Router';

describe('ima.core.router.DynamicRoute', function () {
  let route: DynamicRoute;
  const name = 'home';
  const controller = 'controler-mock';
  const view = 'view-mock';
  const options = {
    onlyUpdate: false,
    autoScroll: true,
    documentView: null,
    managedRootView: null,
    viewAdapter: null,
  };

  const matcher = /^\/([\w-]+)?\/?([\w-]+)?\/article\/(\w+-\d+)$/i;
  const toPath = (params: StringParameters) => {
    const { section, subsection, slug, ...restParams } = params;
    const query = new URLSearchParams(restParams).toString();

    if (!slug || !section) {
      return 'invalid-route';
    }

    return [section, subsection, 'article', slug]
      .filter(v => !['object', 'undefined'].includes(typeof v))
      .join('/') + query
      ? `?${query}`
      : '';
  };
  const extractParameters = (path: string) => {
    const parsedPath = matcher.exec(path);

    if (!parsedPath) {
      return {};
    }

    return {
      section: parsedPath[1],
      subsection: parsedPath[2],
      slug: parsedPath[3],
    };
  };

  beforeEach(function () {
    route = new DynamicRoute(
      name,
      {
        matcher,
        toPath,
        extractParameters,
      } as RoutePathExpression,
      controller,
      view,
      options as unknown as RouteOptions
    );
  });

  describe('should create correct path', () => {
    it.each([
      [
        '/section/subsection/article/article-1234',
        {
          section: 'section',
          subsection: 'subsection',
          slug: 'article-1234',
        },
      ],
      [
        '/sport/article/article-145',
        {
          section: 'sport',
          slug: 'article-145',
        },
      ],
      [
        '/invalid-route',
        {
          section: 'sport',
          subsection: 'hockey',
        },
      ],
      [
        '/politics/article/article-145?additional=params&should=be&parsedAS=0&queryParams=true',
        {
          section: 'politics',
          slug: 'article-145',
          additional: 'params',
          should: 'be',
          parsedAS: 0,
          queryParams: true,
        },
      ],
    ])(
      'should create correct path "%s" from params: "%j"',
      (result, params) => {
        expect(route.toPath(params)).toStrictEqual(result);
      }
    );
  });

  describe('should parse params correctly', () => {
    it.each([
      [
        {
          section: 'section',
          subsection: 'subsection',
          slug: 'article-1234',
        },
        '/section/subsection/article/article-1234',
      ],
      [
        {
          section: 'politics',
          subsection: 'elections',
          slug: 'slug-009242',
        },
        '/politics/elections/article/slug-009242/',
      ],
      [
        {
          section: 'sport',
          slug: 'article-145',
          subsection: undefined,
        },
        '/sport/article/article-145/',
      ],
      [{}, '/article/article-145'],
    ])(`should return "%j" after parsing "%s" path`, (result, path) => {
      expect(route.extractParameters(path)).toStrictEqual(result);
    });
  });

  describe('should match routes correctly', () => {
    it.each([
      [true, '/section/subsection/article/article-1234'],
      [true, '/politics/elections/article/slug-009242/'],
      [true, '/sport/article/article-145/'],
      [false, '/article/article-145'],
      [false, ''],
      [false, '/different/route/post/slug-125125'],
      [false, '///sport/article/article-145'],
      [false, '/invalid-route'],
    ])(`should result in "%s" for matching "%s" path`, (result, path) => {
      expect(route.matches(path)).toBe(result);
    });
  });
});
