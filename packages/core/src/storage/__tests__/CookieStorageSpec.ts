import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { Request } from '../../router/Request';
import { Response } from '../../router/Response';
import { ServerWindow } from '../../window/ServerWindow';
import { CookieStorage, Cookie } from '../CookieStorage';

describe('ima.storage.CookieStorage', () => {
  const cookieString =
    'cok1=hello;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello2;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  const setCookieString =
    'cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  const setCookieStringWithFirstLetterUppercase =
    'Cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  const setCookieStringWithDomain =
    'cok3=hello3; Path=/; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  const setCookieStringWithComplex =
    'cok3="hello3"; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT; HttpOnly; Secure; Partitioned; Path=/; SameSite=lax';
  const setCookieStringWithMaxAge =
    'cok3="hello3"; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT; Max-Age=5; HttpOnly; Partitioned; Secure; Path=/';
  const cookiesStringForCookieHeader = 'cok1=hello; cok2=hello2';

  let request: Request;
  let requestGetCookieHeaderSpy: jest.SpyInstance;
  let response: Response;
  let cookie: CookieStorage;
  let win: ServerWindow;
  const transformFunction = {
    encode: function (s: string) {
      return s;
    },
    decode: function (s: string) {
      return s;
    },
  };

  beforeEach(() => {
    request = new Request();
    response = new Response();
    win = new ServerWindow();
    cookie = new CookieStorage(win, request, response);

    request.init({} as ExpressRequest);
    response.init({} as ExpressResponse, transformFunction);

    requestGetCookieHeaderSpy = jest.spyOn(request, 'getCookieHeader');
    requestGetCookieHeaderSpy.mockReturnValue(cookieString);

    jest.spyOn(response, 'setCookie').mockImplementation();

    cookie.init({ secure: false }, transformFunction);
  });

  it('should be parse exist cookies', () => {
    expect(request.getCookieHeader).toHaveBeenCalled();
    expect(cookie['_storage'].size).toBe(2);
  });

  it('should be has method, which return true for exist cookie other false', () => {
    expect(cookie.has('cok1')).toBe(true);
    expect(cookie.has('cok2')).toBe(true);
    expect(cookie.has('cok3')).toBe(false);
  });

  it('should be get value from cookie', () => {
    expect(cookie.get('cok1')).toBe('hello');
    expect(cookie.get('cok2')).toBe('hello2');
    expect(cookie.get('cok3')).toBeUndefined();
  });

  it('should be set value to cookie', () => {
    cookie.set('cok3', 'hello3');

    expect(response.setCookie).toHaveBeenCalled();
  });

  it('should be delete value from cookie', () => {
    cookie.delete('cok2');

    expect(response.setCookie).toHaveBeenCalled();
    expect(cookie['_storage'].size).toBe(1);
  });

  it('should be delete value from cookie with options', () => {
    cookie.delete('cok2', { domain: 'localhost' });

    expect(response.setCookie).toHaveBeenCalled();
    expect(cookie['_storage'].size).toBe(1);
  });

  it('should be delete all cookies', () => {
    cookie.clear();

    expect(response.setCookie).toHaveBeenCalledTimes(2);
    expect(cookie['_storage'].size).toBe(0);
  });

  it('should be get cookies string', () => {
    jest.spyOn(cookie['_transformFunction'], 'encode');

    expect(cookie.getCookiesStringForCookieHeader()).toBe(
      cookiesStringForCookieHeader
    );
    expect(cookie['_transformFunction'].encode).toHaveBeenCalledTimes(2);
  });

  describe('parse method', () => {
    it('should delete cookie from storage, which were deleted in document.cookie', () => {
      const cookieStringWithDeletedCok1 =
        'cok2=hello2;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';

      requestGetCookieHeaderSpy.mockReturnValue(cookieStringWithDeletedCok1);

      cookie.parse();

      expect(cookie['_storage'].size).toBe(1);
    });

    it('should change value of stored cookie if in document.cookie it has different value', () => {
      const cookieStringWithNewValues =
        'cok1=hello3;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello4;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';

      requestGetCookieHeaderSpy.mockReturnValue(cookieStringWithNewValues);

      cookie.parse();

      expect((cookie['_storage'].get('cok1') as Cookie).value).toBe('hello3');
      expect((cookie['_storage'].get('cok2') as Cookie).value).toBe('hello4');
    });

    it('should change options if it is different in document.cookie', () => {
      const cookieStringWithNewOptions =
        'cok1=hello3;Path=/someDir;Domain=localhost:3001;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello4;Path=/differetDir;Expires=Fri, 31 Dec 9999 23:59:59 GMT';

      requestGetCookieHeaderSpy.mockReturnValue(cookieStringWithNewOptions);

      cookie.parse();

      expect((cookie['_storage'].get('cok1') as Cookie).options.path).toBe(
        '/someDir'
      );
      expect((cookie['_storage'].get('cok1') as Cookie).options.domain).toBe(
        'localhost:3001'
      );
      expect((cookie['_storage'].get('cok2') as Cookie).options.path).toBe(
        '/differetDir'
      );
    });

    it('should not overwrite already set options, when none is parsed from document.cookie', () => {
      const cookieStringWithNoOptions = 'cok1=hello3; cok2=hello4;';

      requestGetCookieHeaderSpy.mockReturnValue(cookieStringWithNoOptions);

      cookie.parse();

      expect((cookie['_storage'].get('cok1') as Cookie).options.path).toBe('/');
      expect(
        (cookie['_storage'].get('cok1') as Cookie).options.expires
      ).not.toBeNull();
      expect((cookie['_storage'].get('cok1') as Cookie).options.sameSite).toBe(
        'lax'
      );
      expect((cookie['_storage'].get('cok2') as Cookie).options.path).toBe('/');
    });
  });

  describe('set method', () => {
    it('should set cookie as expired for undefined value', () => {
      jest.spyOn(cookie, 'getExpirationAsDate').mockImplementation();

      cookie.set('cok2', undefined);

      expect(cookie.getExpirationAsDate).toHaveBeenCalledWith(-1);
    });

    it('should prefer maxAge before expires', () => {
      jest.spyOn(cookie, 'getExpirationAsDate').mockImplementation();

      cookie.set('cok2', 'val2', { expires: new Date(), maxAge: 5 });

      expect(cookie.getExpirationAsDate).toHaveBeenCalledWith(5);
    });

    it('should set session cookie', () => {
      jest.spyOn(cookie, 'getExpirationAsDate').mockImplementation();

      cookie.set('cok2222', 'val2');

      expect(cookie.getExpirationAsDate).not.toHaveBeenCalled();
    });
  });

  describe('parseFromSetCookieHeader method', () => {
    it('should parse cookie from Set-Cookie header string', () => {
      jest.spyOn(cookie, 'set').mockImplementation();

      cookie.parseFromSetCookieHeader(setCookieString);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/',
      });
    });

    it('should parse cookie from Set-Cookie header string for cookie name with first letter uppercase', () => {
      jest.spyOn(cookie, 'set').mockImplementation();

      cookie.parseFromSetCookieHeader(setCookieStringWithFirstLetterUppercase);

      expect(cookie.set).toHaveBeenCalledWith('Cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/',
      });
    });

    it('should parse cookie from Set-Cookie header string with defined domain', () => {
      jest.spyOn(cookie, 'set').mockImplementation();

      cookie.parseFromSetCookieHeader(setCookieStringWithDomain);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/',
        domain: 'localhost:3001',
      });
    });

    it('should parse cookie from Set-Cookie header string with complex options', () => {
      jest.spyOn(cookie, 'set').mockImplementation();

      cookie.parseFromSetCookieHeader(setCookieStringWithComplex);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        httpOnly: true,
        secure: true,
        path: '/',
        domain: 'localhost:3001',
        sameSite: 'lax',
        partitioned: true,
      });
    });

    it('should parse cookie from Set-Cookie header string with Max-Age option', () => {
      jest.spyOn(cookie, 'set').mockImplementation();

      cookie.parseFromSetCookieHeader(setCookieStringWithMaxAge);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        maxAge: 5,
        httpOnly: true,
        secure: true,
        path: '/',
        domain: 'localhost:3001',
        partitioned: true,
      });
    });
  });

  describe('should get expires date', () => {
    [
      1,
      2,
      1000,
      Infinity,
      'Fri, 31 Dec 2000 23:59:59 GMT',
      new Date('Fri, 31 Dec 2000 23:59:59 GMT'),
    ].forEach(value => {
      it('for value ' + value, () => {
        expect(cookie.getExpirationAsDate(value) instanceof Date).toBeTruthy();
      });
    });
  });

  describe('sanitizeCookieValue method', () => {
    beforeEach(() => {
      $Debug = false;
    });

    afterEach(() => {
      $Debug = true;
    });

    [
      { value: '1', sanitizedValue: '1' },
      { value: '7|AABBCCD===', sanitizedValue: '7|AABBCCD===' },
      { value: '7|AABBCCD=== ', sanitizedValue: '7|AABBCCD===' },
      { value: undefined + '', sanitizedValue: 'undefined' },
    ].forEach(item => {
      it(
        'should return ' + item.sanitizedValue + 'for value ' + item.value,
        () => {
          expect(cookie.sanitizeCookieValue(item.value)).toBe(
            item.sanitizedValue
          );
        }
      );
    });
  });

  describe('recomputeCookieMaxAgeAndExpires', () => {
    it('should compute expires as date', () => {
      const options = { maxAge: 10, expires: undefined };

      cookie.recomputeCookieMaxAgeAndExpires(options);

      expect(options.expires).toStrictEqual(expect.any(Date));
    });

    it('should compute maxAge as number', () => {
      const options = { expires: new Date(), maxAge: undefined };

      cookie.recomputeCookieMaxAgeAndExpires(options);

      expect(options.maxAge).toStrictEqual(expect.any(Number));
    });

    it('should compute maxAge as number and expires as date', () => {
      const options = { expires: 60, maxAge: undefined };

      cookie.recomputeCookieMaxAgeAndExpires(options);

      expect(options.maxAge).toStrictEqual(expect.any(Number));
      expect(options.expires).toStrictEqual(expect.any(Date));
    });
  });

  describe('parse method after clear', () => {
    it('should return fill storage', () => {
      const cookieStringWithNoOptions = 'cok1=hello3; cok2=hello4;';

      requestGetCookieHeaderSpy.mockReturnValue(cookieStringWithNoOptions);

      cookie.clear();
      expect(cookie['_storage'].size).toBe(0);
      cookie.parse();
      expect(cookie['_storage'].size).toBe(2);
    });
  });

  describe('validateCookieSecurity', () => {
    it('should return true for a cookie with matching domain and path', () => {
      const cookie = {
        value: 'test',
        options: { domain: 'example.com', path: '/' },
      };
      const url = 'http://example.com/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
    });

    it('should return true for a cookie with matching subdomain', () => {
      const cookie = {
        value: 'test',
        options: { domain: '.example.com', path: '/' },
      };
      const url = 'http://sub.example.com/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
    });

    it('should return false for a cookie with non-matching domain', () => {
      const cookie = {
        value: 'test',
        options: { domain: 'example.com', path: '/' },
      };
      const url = 'http://otherdomain.com/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(false);
    });

    it('should return false for a secure cookie on non-https URL', () => {
      const cookie = {
        value: 'test',
        options: { domain: 'example.com', path: '/', secure: true },
      };
      const url = 'http://example.com/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(false);
    });

    it('should return true for a secure cookie on https URL', () => {
      const cookie = {
        value: 'test',
        options: { domain: 'example.com', path: '/', secure: true },
      };
      const url = 'https://example.com/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
    });

    it('should return false for a cookie with non-matching path', () => {
      const cookie = {
        value: 'test',
        options: { domain: 'example.com', path: '/app' },
      };
      const url = 'http://example.com/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(false);
    });

    it('should return true for a cookie with matching path prefix', () => {
      const cookie = {
        value: 'test',
        options: { domain: 'example.com', path: '/app' },
      };
      const url = 'http://example.com/app/subpath';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
    });

    it('should return true for a cookie without domain restriction', () => {
      const cookie = {
        value: 'test',
        options: { path: '/' },
      };
      const url = 'http://example.com/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
    });

    it('should return false for a cookie with ip address domain on non-matching ip', () => {
      const cookie = {
        value: 'test',
        options: { domain: '192.168.1.1', path: '/' },
      };
      const url = 'http://192.168.1.2/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(false);
    });

    it('should return true for a cookie with ip address domain on matching ip', () => {
      const cookie = {
        value: 'test',
        options: { domain: '192.168.1.1', path: '/' },
      };
      const url = 'http://192.168.1.1/';

      expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
    });

    describe('options that do not affect validation', () => {
      it('should return true regardless of httpOnly flag', () => {
        const cookie: Cookie = {
          value: 'test',
          options: {
            domain: 'example.com',
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
          },
        };
        const url = 'http://example.com/';

        expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);

        cookie.options.httpOnly = false;
        expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
      });

      it('should return true regardless of sameSite value', () => {
        const cookie: Cookie = {
          value: 'test',
          options: {
            domain: 'example.com',
            path: '/',
            sameSite: 'strict',
          },
        };
        const url = 'http://example.com/';

        expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);

        cookie.options.sameSite = 'lax';
        expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);

        cookie.options.sameSite = 'none';
        expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
      });

      it('should return true regardless of partitioned flag', () => {
        const cookie = {
          value: 'test',
          options: {
            domain: 'example.com',
            path: '/',
            partitioned: true,
          },
        };
        const url = 'http://example.com/';

        expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);

        cookie.options.partitioned = false;
        expect(CookieStorage.validateCookieSecurity(cookie, url)).toBe(true);
      });
    });

    describe('complex combinations', () => {
      it('should validate multiple security attributes together', () => {
        const cookie: Cookie = {
          value: 'test',
          options: {
            domain: 'example.com',
            path: '/app',
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          },
        };

        // Should fail - wrong protocol
        expect(
          CookieStorage.validateCookieSecurity(cookie, 'http://example.com/app')
        ).toBe(false);

        // Should fail - wrong path
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'https://example.com/other'
          )
        ).toBe(false);

        // Should fail - wrong domain
        expect(
          CookieStorage.validateCookieSecurity(cookie, 'https://other.com/app')
        ).toBe(false);

        // Should pass - all conditions met
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'https://example.com/app'
          )
        ).toBe(true);
      });

      it('should handle subdomain with path and secure combinations', () => {
        const cookie: Cookie = {
          value: 'test',
          options: {
            domain: '.example.com',
            path: '/api',
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          },
        };

        // Should fail - not secure
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'http://sub.example.com/api'
          )
        ).toBe(false);

        // Should fail - wrong path
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'https://sub.example.com/app'
          )
        ).toBe(false);

        // Should pass - subdomain with correct path and protocol
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'https://sub.example.com/api'
          )
        ).toBe(true);

        // Should pass - main domain with correct path and protocol
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'https://example.com/api'
          )
        ).toBe(true);
      });

      it('should validate path hierarchy correctly', () => {
        const cookie = {
          value: 'test',
          options: {
            domain: 'example.com',
            path: '/api',
          },
        };

        // Should pass - exact path match
        expect(
          CookieStorage.validateCookieSecurity(cookie, 'http://example.com/api')
        ).toBe(true);

        // Should pass - subpath
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'http://example.com/api/users'
          )
        ).toBe(true);

        // Should fail - different path
        expect(
          CookieStorage.validateCookieSecurity(cookie, 'http://example.com/app')
        ).toBe(false);

        // Should fail - partial path match but not at boundary
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'http://example.com/api-docs'
          )
        ).toBe(false);
      });

      it('should handle root path with various domains', () => {
        const cookie = {
          value: 'test',
          options: {
            domain: '.example.com',
            path: '/',
          },
        };

        // Should pass - root domain
        expect(
          CookieStorage.validateCookieSecurity(cookie, 'http://example.com/')
        ).toBe(true);

        // Should pass - subdomain with any path
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'http://sub.example.com/any/path'
          )
        ).toBe(true);

        // Should pass - deeper subdomain
        expect(
          CookieStorage.validateCookieSecurity(
            cookie,
            'http://deep.sub.example.com/'
          )
        ).toBe(true);

        // Should fail - different domain
        expect(
          CookieStorage.validateCookieSecurity(cookie, 'http://example.org/')
        ).toBe(false);
      });
    });
  });
});
