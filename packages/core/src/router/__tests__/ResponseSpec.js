import Response from '../Response';

describe('ima.core.router.Response', () => {
  var response = null;

  beforeEach(() => {
    response = new Response();
  });

  it('should convert cookie maxAge to ms for Express', () => {
    let options = { maxAge: 1 };
    let expressOptions = response._prepareCookieOptionsForExpress(options);
    expect(options.maxAge).toEqual(1);
    expect(expressOptions.maxAge).toEqual(1000);
  });

  it('should remove cookie maxAge: null for Express', () => {
    // Because Express converts null to 0, which is not intended.
    let options = { maxAge: null };
    let expressOptions = response._prepareCookieOptionsForExpress(options);
    expect(options.maxAge).toEqual(null);
    expect(expressOptions.maxAge).toBeUndefined();
  });

  describe('redirect', () => {
    it('should set cookies, headers, and redirect', () => {
      response._response = {
        cookie: jest.fn(),
        redirect: jest.fn(),
        set: jest.fn()
      };
      response._internalCookieStorage = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3']
      ]);

      const url = 'some/url/or/other';
      const headers = {
        'Custom-header': 'Some value'
      };

      response.redirect(url, 303, headers);

      expect(response._response.set).toHaveBeenCalledWith(headers);
      expect(response._response.cookie).toHaveBeenCalledTimes(3);
      expect(response._response.redirect).toHaveBeenCalledWith(303, url);
    });
  });
});
