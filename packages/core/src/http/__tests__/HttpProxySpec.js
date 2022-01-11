/* eslint-disable jest/no-conditional-expect */
import HttpProxy from '../HttpProxy';
import StatusCode from '../StatusCode';
import UrlTransformer from '../UrlTransformer';
import { toMockedInstance } from 'to-mock';
import Window from 'src/window/Window';
import GenericError from 'src/error/GenericError';

describe('ima.core.http.HttpProxy', () => {
  const API_URL = 'http://localhost:3001/api/';
  const OPTIONS = {
    ttl: 3600000,
    timeout: 2000,
    repeatRequest: 1,
    headers: {},
    withCredentials: true
  };
  const DATA = {
    something: 'query'
  };

  const mockedUrlTransformer = toMockedInstance(UrlTransformer, {
    transform: url => url
  });
  const mockedWindowHelper = toMockedInstance(Window);

  let proxy;
  let response;
  let fetchResult;
  let requestInit;

  beforeEach(() => {
    proxy = new HttpProxy(mockedUrlTransformer, mockedWindowHelper);
    response = {
      ok: true,
      status: 200,
      headers: new Map(), // compatible enough with Headers
      json() {
        return Promise.resolve(this.body);
      },
      text() {
        return Promise.resolve(this.body);
      },
      body: { data: 'some data' }
    };
    fetchResult = Promise.resolve(response);
    spyOn(proxy, '_getFetchApi').and.callFake(() => (_, init) => {
      requestInit = init;

      return fetchResult;
    });
  });

  ['get', 'head', 'post', 'put', 'delete', 'patch'].forEach(method => {
    describe(`method ${method}`, () => {
      it('should return promise with response body', async done => {
        try {
          expect(
            await proxy.request(method, API_URL, DATA, OPTIONS)
          ).toBeDefined();
          done();
        } catch (error) {
          done.fail(error);
        }
      });

      it('should return a "body" field in error object, when promise is rejected', async done => {
        fetchResult = Promise.reject(
          new GenericError('The HTTP request timed out', {
            status: StatusCode.TIMEOUT
          })
        );

        try {
          await proxy.request(method, API_URL, DATA, OPTIONS);
          done.fail();
        } catch (error) {
          expect(error.getParams().body).toBeDefined();
          done();
        }
      });

      it('should reject promise for Timeout error', async done => {
        fetchResult = Promise.reject(
          new GenericError('The HTTP request timed out', {
            status: StatusCode.TIMEOUT
          })
        );

        try {
          await proxy.request(method, API_URL, DATA, OPTIONS);
          done.fail();
        } catch (error) {
          expect(error.getParams().status).toEqual(StatusCode.TIMEOUT);
          done();
        }
      });

      it('should be timeouted for longer request then options.timeout', async done => {
        jest.useFakeTimers();

        proxy._getFetchApi.and.callFake(() => {
          jest.runOnlyPendingTimers();
        });

        try {
          await proxy.request(method, API_URL, DATA, OPTIONS);
          done.fail();
        } catch (error) {
          expect(error.getParams().status).toEqual(StatusCode.TIMEOUT);
          done();
        }
      });

      it('should reject promise for Forbidden', async done => {
        Object.assign(response, {
          ok: false,
          status: StatusCode.FORBIDDEN
        });

        try {
          await proxy.request(method, API_URL, DATA, OPTIONS);
          done.fail();
        } catch (error) {
          expect(error.getParams().status).toEqual(StatusCode.FORBIDDEN);
          done();
        }
      });

      it('should reject promise for Not found', async done => {
        Object.assign(response, {
          ok: false,
          status: StatusCode.NOT_FOUND
        });

        try {
          await proxy.request(method, API_URL, DATA, OPTIONS);
          done.fail();
        } catch (error) {
          expect(error.getParams().status).toEqual(StatusCode.NOT_FOUND);
          done();
        }
      });

      it('should reject promise for Internal Server Error', async done => {
        Object.assign(response, {
          ok: false,
          status: StatusCode.SERVER_ERROR
        });

        try {
          await proxy.request(method, API_URL, DATA, OPTIONS);
          done.fail();
        } catch (error) {
          expect(error.getParams().status).toEqual(StatusCode.SERVER_ERROR);
          done();
        }
      });

      it('should reject promise for UNKNOWN', async done => {
        Object.assign(response, {
          ok: false,
          status: null
        });

        try {
          await proxy.request(method, API_URL, DATA, OPTIONS);
          done.fail();
        } catch (error) {
          expect(error.getParams().status).toEqual(StatusCode.SERVER_ERROR);
          done();
        }
      });

      it('should set credentials to a request', async () => {
        await proxy.request(method, API_URL, DATA, OPTIONS);
        expect(requestInit.credentials).toBe('include');
      });

      it('should set an upper case method to a request', async () => {
        await proxy.request(method, API_URL, DATA, OPTIONS);
        expect(requestInit.method).toBe(method.toUpperCase());
      });

      it('should not set any body to a GET/HEAD request', async () => {
        await proxy.request(method, API_URL, DATA, OPTIONS);

        // eslint-disable-next-line jest/no-if
        if (['get', 'head'].includes(method) === true) {
          expect(requestInit.body).not.toBeDefined();
        } else {
          expect(requestInit.body).toBeDefined();
        }
      });

      if (['get', 'head'].includes(method) === false) {
        it('should set body and Content-Type: application/json for other requests than GET/HEAD even for an empty object', async () => {
          await proxy.request(method, API_URL, {}, OPTIONS);

          expect(requestInit.body).toBeDefined();
          expect(requestInit.headers['Content-Type']).toBe('application/json');
        });

        it(`should convert body to query string if header 'Content-Type' is set to 'application/x-www-form-urlencoded'`, async () => {
          const options = Object.assign({}, OPTIONS, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          const data = { testKey: 'testValue', testKey2: 'testValue2' };
          await proxy.request(method, API_URL, data, options);

          expect(requestInit.body).toBeDefined();
          expect(typeof requestInit.body).toEqual('string');
        });

        it(`should convert body to FormData/Object if header 'Content-Type' is set to 'multipart/form-data'`, async () => {
          const options = Object.assign({}, OPTIONS, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          const data = { testKey: 'testValue', testKey2: 'testValue2' };
          await proxy.request(method, API_URL, data, options);

          expect(requestInit.body).toBeDefined();
          expect(typeof requestInit.body).toEqual('object');
        });
      }

      it('should return null body for HTTP status NO_CONTENT', async () => {
        response.status = StatusCode.NO_CONTENT;
        const result = await proxy.request(method, API_URL, DATA, OPTIONS);
        expect(result.body).toBeNull();
      });
    });
  });

  describe('_convertObjectToQueryString', () => {
    it('should create query string representation of given object', () => {
      const testObject = { testKey: 'testValue', testKey2: 'testValue2' };
      const queryString = proxy._convertObjectToQueryString(testObject);

      expect(typeof queryString).toEqual('string');
      expect(queryString).toEqual('testKey=testValue&testKey2=testValue2');
    });

    it('should properly escape special characters', () => {
      const testObject = {
        testKey: 'test test/test|test?test',
        testKey2: 'test#test$test^test{test}'
      };
      const queryString = proxy._convertObjectToQueryString(testObject);
      expect(typeof queryString).toEqual('string');

      // testKey
      expect(queryString.substr(12, 3)).toEqual('%20');
      expect(queryString.substr(19, 3)).toEqual('%2F');
      expect(queryString.substr(26, 3)).toEqual('%7C');
      expect(queryString.substr(33, 3)).toEqual('%3F');

      // testKey2
      expect(queryString.substr(54, 3)).toEqual('%23');
      expect(queryString.substr(61, 3)).toEqual('%24');
      expect(queryString.substr(68, 3)).toEqual('%5E');
      expect(queryString.substr(75, 3)).toEqual('%7B');
    });
  });

  describe('_convertObjectToFormData', () => {
    it('should return either FormData or Object instance', () => {
      const testObject = { testKey: 'testValue', testKey2: 'testValue2' };
      const convertedObject = proxy._convertObjectToFormData(testObject);

      expect(convertedObject).toBeDefined();
      expect(typeof convertedObject).toEqual('object');
    });
  });

  describe('_getContentType', () => {
    it('should return custom Content-Type header', () => {
      expect(
        proxy._getContentType(
          'GET',
          {},
          { headers: { 'Content-Type': 'application/xml' } }
        )
      ).toBe('application/xml');
    });

    it('should return null for invalid custom content types', () => {
      expect(
        proxy._getContentType('GET', null, {
          headers: { 'Content-Type': null }
        })
      ).toBeNull();
    });

    it('should return null for requests with no body', () => {
      spyOn(proxy, '_shouldRequestHaveBody').and.returnValue(false);

      expect(proxy._getContentType('GET', null, { headers: {} })).toBeNull();
    });
  });

  describe('_shouldRequestHaveBody', () => {
    it('should return false for invalid data or unsupported methods', () => {
      expect(proxy._shouldRequestHaveBody('', null)).toBeFalsy();
      expect(proxy._shouldRequestHaveBody('', undefined)).toBeFalsy();
      expect(proxy._shouldRequestHaveBody('GET', { data: 'foo' })).toBeFalsy();
      expect(proxy._shouldRequestHaveBody('HEAD')).toBeFalsy();
    });

    it('should return true for valid data and supported methods', () => {
      expect(
        proxy._shouldRequestHaveBody('POST', { data: 'foo' })
      ).toBeTruthy();
      expect(proxy._shouldRequestHaveBody('PUT', { bar: 'foo' })).toBeTruthy();
    });
  });
});
