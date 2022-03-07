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
  let requestGetCookieHeaderSpy = null;
  let response = null;
  let cookie = null;
  let win = null;
  let transformFunction = {
    encode: function (s) {
      return s;
    },
    decode: function (s) {
      return s;
    },
  };

  beforeEach(() => {
    request = new Request();
    response = new Response();
    win = new ServerWindow();
    cookie = new CookieStorage(win, request, response);

    request.init({});
    response.init({}, transformFunction);

    requestGetCookieHeaderSpy = spyOn(request, 'getCookieHeader');
    requestGetCookieHeaderSpy.and.returnValue(cookieString);

    spyOn(response, 'setCookie').and.stub();

    cookie.init({ secure: false }, transformFunction);
  });

  it('should be parse exist cookies', () => {
    expect(request.getCookieHeader).toHaveBeenCalled();
    expect(cookie._storage.size).toBe(2);
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
    expect(cookie._storage.size).toBe(1);
  });

  it('should be delete value from cookie with options', () => {
    cookie.delete('cok2', { domain: 'localhost' });

    expect(response.setCookie).toHaveBeenCalled();
    expect(cookie._storage.size).toBe(1);
  });

  it('should be delete all cookies', () => {
    cookie.clear();

    expect(response.setCookie.calls.count()).toBe(2);
    expect(cookie._storage.size).toBe(0);
  });

  it('should be get cookies string', () => {
    spyOn(cookie._transformFunction, 'encode').and.callThrough();

    expect(cookie.getCookiesStringForCookieHeader()).toBe(
      cookiesStringForCookieHeader
    );
    expect(cookie._transformFunction.encode.calls.count()).toBe(2);
  });

  describe('parse method', () => {
    it('should delete cookie from storage, which were deleted in document.cookie', () => {
      let cookieStringWithDeletedCok1 =
        'cok2=hello2;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';

      requestGetCookieHeaderSpy.and.returnValue(cookieStringWithDeletedCok1);

      cookie._parse();

      expect(cookie._storage.size).toBe(1);
    });

    it('should change value of stored cookie if in document.cookie it has different value', () => {
      let cookieStringWithNewValues =
        'cok1=hello3;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello4;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';

      requestGetCookieHeaderSpy.and.returnValue(cookieStringWithNewValues);

      cookie._parse();

      expect(cookie._storage.get('cok1').value).toBe('hello3');
      expect(cookie._storage.get('cok2').value).toBe('hello4');
    });

    it('should change options if it is different in document.cookie', () => {
      let cookieStringWithNewOptions =
        'cok1=hello3;Path=/someDir;Domain=localhost:3001;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello4;Path=/differetDir;Expires=Fri, 31 Dec 9999 23:59:59 GMT';

      requestGetCookieHeaderSpy.and.returnValue(cookieStringWithNewOptions);

      cookie._parse();

      expect(cookie._storage.get('cok1').options.path).toBe('/someDir');
      expect(cookie._storage.get('cok1').options.domain).toBe('localhost:3001');
      expect(cookie._storage.get('cok2').options.path).toBe('/differetDir');
    });

    it('should not overwrite already set options, when none is parsed from document.cookie', () => {
      let cookieStringWithNoOptions = 'cok1=hello3; cok2=hello4;';

      requestGetCookieHeaderSpy.and.returnValue(cookieStringWithNoOptions);

      cookie._parse();

      expect(cookie._storage.get('cok1').options.path).toBe('/');
      expect(cookie._storage.get('cok1').options.expires).not.toBeNull();
      expect(cookie._storage.get('cok1').options.sameSite).toBe('Lax');
      expect(cookie._storage.get('cok2').options.path).toBe('/');
    });
  });

  describe('set method', () => {
    it('should set cookie as expired for undefined value', () => {
      spyOn(cookie, '_getExpirationAsDate').and.stub();

      cookie.set('cok2');

      expect(cookie._getExpirationAsDate).toHaveBeenCalledWith(-1);
    });

    it('should prefer maxAge before expires', () => {
      spyOn(cookie, '_getExpirationAsDate').and.stub();

      cookie.set('cok2', 'val2', { expires: new Date(), maxAge: 5 });

      expect(cookie._getExpirationAsDate).toHaveBeenCalledWith(5);
    });

    it('should set session cookie', () => {
      spyOn(cookie, '_getExpirationAsDate').and.stub();

      cookie.set('cok2', 'val2');

      expect(cookie._getExpirationAsDate).not.toHaveBeenCalled();
    });
  });

  describe('parseFromSetCookieHeader method', () => {
    it('should parse cookie from Set-Cookie header string', () => {
      spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieString);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/',
      });
    });

    it('should parse cookie from Set-Cookie header string for cookie name with first letter uppercase', () => {
      spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithFirstLetterUppercase);

      expect(cookie.set).toHaveBeenCalledWith('Cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/',
      });
    });

    it('should parse cookie from Set-Cookie header string with defined domain', () => {
      spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithDomain);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        path: '/',
        domain: 'localhost:3001',
      });
    });

    it('should parse cookie from Set-Cookie header string with complex options', () => {
      spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithComplex);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        httpOnly: true,
        secure: true,
        path: '/',
        domain: 'localhost:3001',
        sameSite: 'Lax',
      });
    });

    it('should parse cookie from Set-Cookie header string with Max-Age option', () => {
      spyOn(cookie, 'set');

      cookie.parseFromSetCookieHeader(setCookieStringWithMaxAge);

      expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {
        expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
        maxAge: 5,
        httpOnly: true,
        secure: true,
        path: '/',
        domain: 'localhost:3001',
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
        new Date('Fri, 31 Dec 2000 23:59:59 GMT'),
      ],
      value => {
        it('for value ' + value, () => {
          expect(
            cookie._getExpirationAsDate(value) instanceof Date
          ).toBeTruthy();
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
        { value: undefined + '', sanitizedValue: 'undefined' },
      ],
      item => {
        it(
          'should return ' + item.sanitizedValue + 'for value ' + item.value,
          () => {
            expect(cookie._sanitizeCookieValue(item.value)).toBe(
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

      expect(options.expires).toStrictEqual(expect.any(Date));
    });

    it('should compute maxAge as number', () => {
      let options = { expires: new Date() };

      cookie._recomputeCookieMaxAgeAndExpires(options);

      expect(options.maxAge).toStrictEqual(expect.any(Number));
    });

    it('should compute maxAge as number and expires as date', () => {
      let options = { expires: 60 };

      cookie._recomputeCookieMaxAgeAndExpires(options);

      expect(options.maxAge).toStrictEqual(expect.any(Number));
      expect(options.expires).toStrictEqual(expect.any(Date));
    });
  });
});
