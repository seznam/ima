jest.mock('path', () => ({
  resolve: jest.fn().mockImplementation(() => './__mocks__/ima.config.js'),
}));

const urlParserFactory = require('../urlParserFactory.js');

const HOST = 'local.domain.cz';
const HOST2 = 'domain.cz';
const HOST3 = 'may2018.cz';
const HOST4 = 'brno2018.org';

const ENVIRONMENT = {
  $Language: {
    [`//${HOST}/en`]: 'en',
    [`//${HOST}/de`]: 'de',
    [`//${HOST}/cs`]: 'cs',
    [`//${HOST}/:language`]: 'it',
    [`//${HOST2}`]: 'cs',
    [`//${HOST3}`]: 'en',
    '//*:*': 'cs',
  },
};

const REQUEST_GET_BOOK = Object.freeze({
  host: HOST,
});

describe('urlParserFactory', () => {
  let { urlParser } = urlParserFactory({
    environment: ENVIRONMENT,
    applicationFolder: '.',
  });

  function getMethod(requestGetBook, key) {
    // eslint-disable-next-line no-prototype-builtins
    return requestGetBook.hasOwnProperty(key) ? requestGetBook[key] : '';
  }

  const REQ = Object.freeze({
    originalUrl: '/',
    protocol: 'http',
    get: getMethod.bind(null, REQUEST_GET_BOOK),
  });

  const RES = Object.freeze({
    locals: {},
    redirect: jest.fn(),
  });

  const defaultRes = Object.assign({}, RES);

  beforeEach(() => {
    RES.redirect.mockReset();
  });

  describe("method's behavior", () => {
    const expectedKeys = [
      'language',
      'languagePartPath',
      'host',
      'path',
      'protocol',
      'root',
    ];

    const usedRes = Object.assign({}, RES);
    const usedReq = Object.assign({}, REQ, {
      get: getMethod.bind(null, { host: HOST3 }),
    });

    urlParser({
      req: usedReq,
      res: usedRes,
    });

    expectedKeys.forEach(key => {
      it(`should create key '${key}' in results object`, () => {
        expect(typeof usedRes.locals[key]).toBe('string');
      });
    });
  });

  describe('host Detection', () => {
    afterAll(() => {
      defaultRes.locals = {};
    });

    const hosts = [
      {
        host: 'my-domain-is-here.eu',
        originalUrl: '/',
        expected: 'my-domain-is-here.eu',
      },
      {
        host: HOST,
        originalUrl: '/en',
        expected: HOST,
      },
      {
        host: HOST2,
        originalUrl: '/advert/adv-456/show',
        expected: HOST2,
      },
      {
        header: { 'X-Forwarded-Host': HOST3 },
        originalUrl: '/en/some-article-name/read-me',
        expected: HOST3,
      },
      {
        host: HOST2,
        header: { 'X-Forwarded-Host': HOST3 },
        originalUrl: '/en/some-article-name/double-headers',
        expected: HOST3,
      },
      {
        host: HOST4,
        originalUrl: '/',
        expected: HOST4,
      },
    ];

    function getHost(originalUrl, header, host) {
      const getCodeBook = {
        host: host || '',
      };

      // eslint-disable-next-line jest/no-if
      if (header) {
        const [headerKey, headerValue] = Object.entries(header)[0];
        getCodeBook[headerKey] = headerValue;
      }

      const usedRes = Object.assign({}, RES);
      const usedReq = Object.assign({}, REQ, {
        originalUrl,
        get: getMethod.bind(null, getCodeBook),
      });

      urlParser({
        req: usedReq,
        res: usedRes,
      });

      return usedRes.locals.host;
    }

    hosts.forEach(({ originalUrl, header, host, expected }) => {
      it(`should get host for ${originalUrl}`, () => {
        expect(getHost(originalUrl, header, host)).toBe(expected);
      });

      it(`should always use environment.$Server.host, when defined for ${originalUrl}`, () => {
        ENVIRONMENT.$Server = {
          host: 'environment-host',
        };

        expect(getHost(originalUrl, header, host)).toBe('environment-host');

        ENVIRONMENT.$Server = {};
      });
    });
  });

  describe('invalid URLs', () => {
    let usedRes = {};

    beforeEach(() => {
      usedRes = Object.assign({}, defaultRes);
    });

    afterEach(() => {
      defaultRes.locals = {};
    });

    const invalidUrls = [
      {
        protocol: '?',
        host: 'test',
        originalUrl: '',
      },
      {
        protocol: 'http',
        host: '/',
        originalUrl: '',
      },
      {
        protocol: '',
        host: '.',
        originalUrl: '',
      },
      {
        protocol: '',
        host: '',
        originalUrl: '?qty=50',
      },
      {
        protocol: 'https',
        host: '',
        originalUrl: '?utm_name=tolik&utm_campaign=mobile',
      },
    ];

    invalidUrls.forEach(({ originalUrl, protocol, host }) => {
      const fullUrl = `${protocol}://${host}${originalUrl}`;

      it(`should return exception for invalid URL ${fullUrl}`, () => {
        const usedReq = Object.assign({}, REQ, {
          originalUrl,
          protocol,
          get: getMethod.bind(null, { host }),
        });

        try {
          urlParser({
            req: usedReq,
            res: usedRes,
          });
        } catch (exception) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(exception.name).toMatch(/^TypeError/);
        }

        const result = usedRes.locals;
        expect(result).toStrictEqual({});
      });
    });
  });

  describe('protocol Detection', () => {
    let usedRes = {};

    beforeEach(() => {
      usedRes = Object.assign({}, defaultRes);
    });

    afterEach(() => {
      defaultRes.locals = {};
    });

    const protocols = [
      {
        protocol: 'http',
        originalUrl: '/pacholek',
        expected: 'http:',
      },
      {
        protocol: 'https',
        originalUrl: '/http/frankovka.palava.2016',
        expected: 'https:',
      },
      {
        protocol: 'http',
        originalUrl: '/https/mobile+phone+dock+station?search=https',
        expected: 'http:',
      },
      {
        protocol: 'http',
        originalUrl:
          '/https/mobile+phone+dock+station?redirect=https://dreams.co.uk',
        expected: 'http:',
      },
      {
        protocol: 'http',
        originalUrl:
          '//https.com/mobile+phone+dock+station?redirect=https://dreams.co.uk',
        expected: 'http:',
      },
      {
        protocol: 'https',
        originalUrl:
          '//http.com/mobile+phone+dock+station?redirect=http://dreams.org',
        expected: 'https:',
      },
    ];

    function getProtocol(originalUrl, protocol) {
      const usedReq = Object.assign({}, REQ, {
        originalUrl,
        protocol,
        get: getMethod.bind(null, { host: HOST3 }),
      });

      const result = usedRes.locals;

      urlParser({
        req: usedReq,
        res: usedRes,
      });

      return result.protocol;
    }

    protocols.forEach(({ originalUrl, protocol, expected }) => {
      it(`should set protocol in results object for URL ${originalUrl}`, () => {
        expect(getProtocol(originalUrl, protocol)).toBe(expected);
      });

      it(`should always use environment.$Server.protocol, when defined for ${originalUrl}`, () => {
        ENVIRONMENT.$Server = {
          protocol: 'http',
        };

        expect(getProtocol(originalUrl, protocol)).toBe('http:');

        ENVIRONMENT.$Server = {};
      });
    });

    const protocolHeaders = [
      {
        header: { Forwarded: 'for=142.0.5.67;proto=http;by=2a02:598:a::79:53' },
        expected: 'http:',
      },
      {
        header: {
          Forwarded: 'for=2a02:598:a::79:100;proto=https;by=2a02:598:a::79:53',
        },
        expected: 'https:',
      },
      {
        header: { 'Front-End-Https': 'ON' },
        expected: 'https:',
      },
      {
        header: { 'Front-End-Https': 'on' },
        expected: 'https:',
      },
      {
        header: {},
        expected: 'http:',
      },
      {
        header: { 'X-Forwarded-Proto': 'http' },
        expected: 'http:',
      },
      {
        header: { 'X-Forwarded-Proto': 'https' },
        expected: 'https:',
      },
    ];

    function getHeadersProtocol(header, headerKey) {
      const getCodeBook = {
        host: HOST2,
      };

      // eslint-disable-next-line jest/no-if
      if (headerKey) {
        getCodeBook[headerKey] = header[headerKey];
      }

      const usedReq = Object.assign({}, REQ, {
        get: getMethod.bind(null, getCodeBook),
      });

      urlParser({
        req: usedReq,
        res: usedRes,
      });

      const result = usedRes.locals;

      return result.protocol;
    }

    protocolHeaders.forEach(({ header, expected }) => {
      const [headerKey = ''] = Object.keys(header);

      it(`should read protocol from header key '${headerKey}'`, () => {
        expect(getHeadersProtocol(header, headerKey)).toBe(expected);
      });

      it(`should always use environment.$Server.protocol, when defined for header key '${headerKey}'`, () => {
        ENVIRONMENT.$Server = {
          protocol: 'http',
        };

        expect(getHeadersProtocol(header, headerKey)).toBe('http:');

        ENVIRONMENT.$Server = {};
      });
    });
  });

  describe('language Detection', () => {
    let usedRes = {};

    beforeEach(() => {
      usedRes = Object.assign({}, defaultRes);
    });

    afterEach(() => {
      defaultRes.locals = {};
    });

    // Note: Check constant ENVIRONMENT for expected results
    const languageUrls = [
      {
        host: HOST,
        originalUrl: '/',
        expected: { redirectTo: 'http://local.domain.cz/it' },
      },
      {
        host: HOST2,
        originalUrl: '/',
        expected: {
          language: 'cs',
          root: '',
          languagePartPath: '',
        },
      },
      {
        host: HOST3,
        originalUrl: '/',
        expected: {
          language: 'en',
          root: '',
          languagePartPath: '',
        },
      },
      // Note: HOST4 is not defined in ENVIRONMENT.$Language
      {
        host: HOST4,
        originalUrl: '/',
        expected: {
          language: 'cs',
          root: '',
          languagePartPath: '',
        },
      },
      {
        host: HOST,
        originalUrl: '/cs/autori/20-stoleti',
        expected: {
          language: 'cs',
          root: '/cs',
          languagePartPath: '',
        },
      },
      {
        host: HOST,
        originalUrl: '/ru',
        expected: { redirectTo: 'http://local.domain.cz/it' },
      },
      {
        host: HOST,
        originalUrl: '/italian',
        expected: { redirectTo: 'http://local.domain.cz/it' },
      },
      {
        host: HOST,
        originalUrl: `/en/authors/20-century`,
        expected: {
          language: 'en',
          root: '/en',
          languagePartPath: '',
        },
      },
      {
        host: HOST,
        originalUrl: '/de/autoren/20-jahrhundert',
        expected: {
          language: 'de',
          root: '/de',
          languagePartPath: '',
        },
      },
      {
        host: HOST,
        originalUrl: '/en',
        expected: {
          language: 'en',
          root: '/en',
          languagePartPath: '',
        },
      },
      {
        host: HOST,
        originalUrl: '/de',
        expected: {
          language: 'de',
          root: '/de',
          languagePartPath: '',
        },
      },
      {
        host: HOST,
        originalUrl: '/cs',
        expected: {
          language: 'cs',
          root: '/cs',
          languagePartPath: '',
        },
      },
    ];

    languageUrls.forEach(({ originalUrl, expected, host }) => {
      const usedReq = Object.assign({}, REQ, {
        originalUrl,
        get: getMethod.bind(null, { host }),
      });

      const fullUrl = `//${host}${originalUrl}`;
      const { redirectTo = '' } = expected;

      if (redirectTo) {
        it(`should redirect from ${fullUrl} to ${redirectTo}`, () => {
          expect.assertions(2);

          try {
            urlParser({
              req: usedReq,
              res: usedRes,
            });
          } catch (error) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(usedRes.locals).toStrictEqual({});
            // eslint-disable-next-line jest/no-conditional-expect
            expect(error.getParams()).toStrictEqual({
              status: 302,
              url: redirectTo,
            });
          }
        });
      } else {
        it(`should detect language for URL ${fullUrl}`, () => {
          urlParser({
            req: usedReq,
            res: usedRes,
          });
          const result = usedRes.locals;

          expect(result.root).toBe(expected.root);
          expect(result.language).toBe(expected.language);
          expect(result.languagePartPath).toBe(expected.languagePartPath);
        });
      }
    });
  });

  describe('parsing URL', () => {
    let usedRes = {};

    beforeEach(() => {
      usedRes = Object.assign({}, defaultRes);
    });

    const urls = [
      {
        originalUrl: '/',
        expected: {
          path: '',
        },
      },
      {
        originalUrl: '/frankovka/detail/26562985-hadry',
        expected: {
          path: '/frankovka/detail/26562985-hadry',
        },
      },
      {
        originalUrl: '/zuzza',
        expected: {
          path: '/zuzza',
        },
      },
      {
        originalUrl: '/82-services?utm_name=robot&utm_campaign=follow',
        expected: {
          path: '/82-services?utm_name=robot&utm_campaign=follow',
        },
      },
      {
        originalUrl: '/search/cheap+mobile+phone',
        expected: {
          path: '/search/cheap+mobile+phone',
        },
      },
      {
        originalUrl: '/27-sport/cela-cr/cena-neomezena/nejnovejsi/11',
        expected: {
          path: '/27-sport/cela-cr/cena-neomezena/nejnovejsi/11',
        },
      },
      {
        originalUrl:
          '/21-desks/subcategory/all-rices?utm_source=sbazar&utm_medium=email&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        expected: {
          path: '/21-desks/subcategory/all-rices?utm_source=sbazar&utm_medium=email&utm_campaign=email-reply-confirm&utm_content=seller-link-box',
        },
      },
      // Note: Problematic URLs (having '//')
      {
        originalUrl: '/img//big/90/3916290_1.jpg',
        expected: {
          path: '/img//big/90/3916290_1.jpg',
        },
      },
      {
        originalUrl:
          '/img//big/90/3916290_1.jpg?redirect=http://favorite.baradios.cz/radios/g90/listen',
        expected: {
          path: '/img//big/90/3916290_1.jpg?redirect=http://favorite.baradios.cz/radios/g90/listen',
        },
      },
      {
        originalUrl:
          '//img//big/80/3916290_1.jpg?redirect=http://favorite.baradios.cz/radios/g80/listen',
        expected: {
          path: '//img//big/80/3916290_1.jpg?redirect=http://favorite.baradios.cz/radios/g80/listen',
        },
      },
    ];

    urls.forEach(({ originalUrl, expected }) => {
      it(`should correct parse URL ${originalUrl}`, () => {
        const usedReq = Object.assign({}, REQ, {
          originalUrl,
          get: getMethod.bind(null, { host: HOST2 }),
        });

        urlParser({
          req: usedReq,
          res: usedRes,
        });

        const result = usedRes.locals;

        expect(result.path).toBe(expected.path);
        expect(result.root).toBe('');
        expect(result.host).toBe(HOST2);
      });
    });
  });
});
