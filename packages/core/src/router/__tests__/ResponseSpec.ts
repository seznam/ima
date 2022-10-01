import Response from '../Response';
import { toMockedInstance } from 'to-mock';

describe('ima.core.router.Response', () => {
  let response = toMockedInstance(Response);

  beforeEach(() => {
    response = new Response();
  });

  it('should convert cookie maxAge to ms for Express', () => {
    const options = { maxAge: 1 };
    const expressOptions = response._prepareCookieOptionsForExpress(options);
    expect(options.maxAge).toBe(1);
    expect(expressOptions.maxAge).toBe(1000);
  });

  it('should remove cookie maxAge: null for Express', () => {
    // Because Express converts null to 0, which is not intended.
    const options = { maxAge: null };
    const expressOptions = response._prepareCookieOptionsForExpress(options);
    expect(options.maxAge).toBeNull();
    expect(expressOptions.maxAge).toBeUndefined();
  });

  describe('redirect', () => {
    it('should set cookies, headers, and redirect', () => {
      response['_response'] = {
        cookie: jest.fn(),
        redirect: jest.fn(),
        set: jest.fn(),
      };
      response._internalCookieStorage = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3'],
      ]);

      const url = 'some/url/or/other';
      const headers = {
        'Custom-header': 'Some value',
      };

      response.redirect(url, 303, headers);

      expect(response._response.set).toHaveBeenCalledWith(headers);
      expect(response._response.cookie).toHaveBeenCalledTimes(3);
      expect(response._response.redirect).toHaveBeenCalledWith(303, url);
    });
  });
});
