import Request from 'src/router/Request';
import Response from 'src/router/Response';
import ServerWindow from 'src/window/ServerWindow';
import CookieStorage from '../CookieStorage';

describe('ima.storage.CookieStorage', () => {
  let cookieString =
    'cok1=hello;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello2;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  let setCookieString =
    'cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  let setCookieStringWithFirstLetterUppercase =
    'Cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  let setCookieStringWithDomain =
    'cok3=hello3; Path=/; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
  let setCookieStringWithComplex =
    'cok3="hello3"; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT; HttpOnly; Secure; Path=/; SameSite=Lax';
  let setCookieStringWithMaxAge =
    'cok3="hello3"; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT; Max-Age=5; HttpOnly; Secure; Path=/';
  let cookiesStringForCookieHeader = 'cok1=hello; cok2=hello2';

  let request = null;
  let response = null;
  let cookie = null;
  let win = null;
  let transformFunction = {
    encode: function (s) {
      return s;
    },
    decode: function (s) {
      return s;
    }
  };

  beforeEach(() => {
    request = new Request();
    response = new Response();
    win = new ServerWindow();
    cookie = new CookieStorage(win, request, response);

    request.init({});
    response.init({}, transformFunction);

    jest.spyOn(request, 'getCookieHeader').mockReturnValue(cookieString);

    jest.spyOn(response, 'setCookie').mockImplementation();

    cookie.init({ secure: false }, transformFunction);
  });

  it('should be parse exist cookies', () => {
    expect(request.getCookieHeader).toHaveBeenCalled();
    expect(cookie._storage.size).toEqual(2);
  });

  it('should be has method, which return true for exist cookie other false', () => {
    expect(cookie.has('cok1')).toBe(true);
    expect(cookie.has('cok2')).toBe(true);
    expect(cookie.has('cok3')).toBe(false);
  });

  it('should be get value from cookie', () => {
    expect(cookie.get('cok1')).toEqual('hello');
    expect(cookie.get('cok2')).toEqual('hello2');
    expect(cookie.get('cok3')).toBeUndefined();
  });

  it('should be set value to cookie', () => {
    cookie.set('cok3', 'hello3');

    expect(response.setCookie).toHaveBeenCalled();
  });

  it('should be delete value from cookie', () => {
    cookie.delete('cok2');

    expect(response.setCookie).toHaveBeenCalled();
    expect(cookie._storage.size).toEqual(1);
  });

  it('should be delete value from cookie with options', () => {
    cookie.delete('cok2', { domain: 'localhost' });

    expect(response.setCookie).toHaveBeenCalled();
    expect(cookie._storage.size).toEqual(1);
  });

  it('should be delete all cookies', () => {
    cookie.clear();

    expect(response.setCookie.mock.calls.length).toEqual(2);
    expect(cookie._storage.size).toEqual(0);
  });

  it('should be get cookies string', () => {
    jest.spyOn(cookie._transformFunction, 'encode');

    expect(cookie.getCookiesStringForCookieHeader()).toEqual(
      cookiesStringForCookieHeader
    );
    expect(cookie._transformFunction.encode.mock.calls.length).toEqual(2);
  });

  describe('set method', () => {
    it('should set cookie as expired for undefined value', () => {
      jest.spyOn(cookie, '_getExpirationAsDate').mockImplementation();

      cookie.set('cok2');

      expect(cookie._getExpirationAsDate).toHaveBeenCalledWith(-1);
    });

    it('should prefer maxAge before expires', () => {
      jest.spyOn(cookie, '_getExpirationAsDate').mockImplementation();

      cookie.set('cok2', 'val2', { expires: new Date(), maxAge: 5 });

      expect(cookie._getExpirationAsDate).toHaveBeenCalledWith(5);
    });

    it('should set session cookie', () => {
      jest.spyOn(cookie, '_getExpirationAsDate').mockImplementation();

      cookie.set('cok2', 'val2');

      expect(cookie._getExpirationAsDate).not.toHaveBeenCalled();
    });
  });

  describe('parseFromSetCookieHeader method', () => {
    it('should parse cookie from Set-Cookie header string', () => {
      jest.spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieString);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/'
      });
    });

    it('should parse cookie from Set-Cookie header string for cookie name with first letter uppercase', () => {
      jest.spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithFirstLetterUppercase);

      expect(cookie.set).toHaveBeenCalledWith('Cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/'
      });
    });

    it('should parse cookie from Set-Cookie header string with defined domain', () => {
      jest.spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithDomain);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/',
        domain: 'localhost:3001'
      });
    });

    it('should parse cookie from Set-Cookie header string with complex options', () => {
      jest.spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithComplex);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        httpOnly: true,
        secure: true,
        path: '/',
        domain: 'localhost:3001',
        sameSite: 'Lax'
      });
    });

    it('should parse cookie from Set-Cookie header string with Max-Age option', () => {
      jest.spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithMaxAge);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        maxAge: 5,
        httpOnly: true,
        secure: true,
        path: '/',
        domain: 'localhost:3001'
      });
    });
  });

  describe('should get expires date', () => {
    using(
      [
        1,
        2,
        1000,
        Infinity,
        null,
        'Fri, 31 Dec 2000 23:59:59 GMT',
        new Date('Fri, 31 Dec 2000 23:59:59 GMT')
      ],
      value => {
        it('for value ' + value, () => {
          expect(cookie._getExpirationAsDate(value) instanceof Date).toEqual(
            true
          );
        });
      }
    );
  });

  describe('_sanitizeCookieValue method', () => {
    beforeEach(() => {
      $Debug = false;
    });

    afterEach(() => {
      $Debug = true;
    });

    using(
      [
        { value: '1', sanitizedValue: '1' },
        { value: '7|AABBCCD===', sanitizedValue: '7|AABBCCD===' },
        { value: '7|AABBCCD=== ', sanitizedValue: '7|AABBCCD===' },
        { value: undefined + '', sanitizedValue: 'undefined' }
      ],
      item => {
        it(
          'should return ' + item.sanitizedValue + 'for value ' + item.value,
          () => {
            expect(cookie._sanitizeCookieValue(item.value)).toEqual(
              item.sanitizedValue
            );
          }
        );
      }
    );
  });

  describe('_recomputeCookieMaxAgeAndExpires', () => {
    it('should compute expires as date', () => {
      let options = { maxAge: 10 };

      cookie._recomputeCookieMaxAgeAndExpires(options);

      expect(options.expires).toEqual(expect.any(Date));
    });

    it('should compute maxAge as number', () => {
      let options = { expires: new Date() };

      cookie._recomputeCookieMaxAgeAndExpires(options);

      expect(options.maxAge).toEqual(expect.any(Number));
    });

    it('should compute maxAge as number and expires as date', () => {
      let options = { expires: 60 };

      cookie._recomputeCookieMaxAgeAndExpires(options);

      expect(options.maxAge).toEqual(expect.any(Number));
      expect(options.expires).toEqual(expect.any(Date));
    });
  });
});
