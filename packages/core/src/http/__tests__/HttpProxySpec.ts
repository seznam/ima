/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jest/no-conditional-expect */
import { toMockedInstance } from 'to-mock';

import { GenericError } from '../../error/GenericError';
import { UnknownParameters } from '../../types';
import { ClientWindow } from '../../window/ClientWindow';
import { HttpAgentRequestOptions } from '../HttpAgent';
import { HttpProxy } from '../HttpProxy';
import { HttpStatusCode } from '../HttpStatusCode';
import { UrlTransformer } from '../UrlTransformer';

describe('ima.core.http.HttpProxy', () => {
  jest.useFakeTimers();

  const API_URL = 'http://localhost:3001/api/';
  const DATA = {
    something: 'query',
  };

  const mockedUrlTransformer = toMockedInstance(UrlTransformer, {
    transform: (url: string) => url,
  });
  const mockedWindowHelper = new ClientWindow();
  const TIMEOUT_ERROR = 'The HTTP request timed out';

  let defaultOptions: HttpAgentRequestOptions;
  let proxy: HttpProxy;
  let response: Response;

  let fetchResult: Promise<Response>;
  let requestInit: RequestInit;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    proxy = new HttpProxy(mockedUrlTransformer, mockedWindowHelper);
    response = {
      ok: true,
      status: 200,
      // @ts-ignore
      headers: new Map(), // compatible enough with Headers
      // @ts-ignore
      json: () => Promise.resolve({ data: 'json' }),
      // @ts-ignore
      blob: () => Promise.resolve({ data: 'blob' }),
      // @ts-ignore
      text: () => Promise.resolve({ data: 'text' }),
      // @ts-ignore
      arrayBuffer: () => Promise.resolve({ data: 'arrayBuffer' }),
      // @ts-ignore
      formData: () => Promise.resolve({ data: 'formData' }),
      // @ts-ignore
      body: { data: 'some data' },
    };

    fetchResult = Promise.resolve(response);

    global.fetch = jest.fn((_, init) => {
      // @ts-ignore
      requestInit = init;

      return Promise.resolve(fetchResult);
    });

    defaultOptions = {
      ttl: 3600000,
      timeout: 2000,
      repeatRequest: 0,
      fetchOptions: {
        credentials: 'include',
        headers: {},
      },
    } as HttpAgentRequestOptions;
  });

  describe.each(['get', 'head', 'post', 'put', 'delete', 'patch'])(
    'method ${method}',
    method => {
      it('should return promise with response body', async () => {
        try {
          await expect(
            proxy.request(method, API_URL, DATA, defaultOptions)
          ).resolves.toBeDefined();
        } catch (error) {
          expect((error as GenericError).getParams().body).toBeDefined();
        }
      });

      it('should return a "body" field in error object, when promise is rejected', async () => {
        fetchResult = Promise.reject(
          new GenericError('The HTTP request timed out', {
            status: HttpStatusCode.TIMEOUT,
          })
        );

        try {
          await proxy.request(method, API_URL, DATA, defaultOptions);
          expect(false).toBeTruthy();
        } catch (error) {
          expect((error as GenericError).getParams().body).toBeDefined();
        }
      });

      it('should reject promise for Timeout error', async () => {
        fetchResult = Promise.reject(
          new GenericError('The HTTP request timed out', {
            status: HttpStatusCode.TIMEOUT,
          })
        );

        try {
          await proxy.request(method, API_URL, DATA, defaultOptions);
          expect(false).toBeTruthy();
        } catch (error) {
          expect((error as GenericError).getParams().status).toBe(
            HttpStatusCode.TIMEOUT
          );
        }
      });

      it('should be timeouted for longer request then options.timeout', async () => {
        try {
          jest.useFakeTimers();

          await proxy.request(method, API_URL, DATA, defaultOptions);
        } catch (error) {
          expect((error as GenericError).getParams().status).toBe(
            HttpStatusCode.TIMEOUT
          );
        }
      });

      it('should reject promise for Forbidden', async () => {
        Object.assign(response, {
          ok: false,
          status: HttpStatusCode.FORBIDDEN,
        });

        try {
          await proxy.request(method, API_URL, DATA, defaultOptions);
          expect(false).toBeTruthy();
        } catch (error) {
          expect((error as GenericError).getParams().status).toBe(
            HttpStatusCode.FORBIDDEN
          );
        }
      });

      it('should reject promise for Not found', async () => {
        Object.assign(response, {
          ok: false,
          status: HttpStatusCode.NOT_FOUND,
        });

        try {
          await proxy.request(method, API_URL, DATA, defaultOptions);
          expect(false).toBeTruthy();
        } catch (error) {
          expect((error as GenericError).getParams().status).toBe(
            HttpStatusCode.NOT_FOUND
          );
        }
      });

      it('should reject promise for Internal Server Error', async () => {
        Object.assign(response, {
          ok: false,
          status: HttpStatusCode.SERVER_ERROR,
        });

        try {
          await proxy.request(method, API_URL, DATA, defaultOptions);
          expect(false).toBeTruthy();
        } catch (error) {
          expect((error as GenericError).getParams().status).toBe(
            HttpStatusCode.SERVER_ERROR
          );
        }
      });

      it('should reject promise for UNKNOWN', async () => {
        Object.assign(response, {
          ok: false,
          status: null,
        });

        try {
          await proxy.request(method, API_URL, DATA, defaultOptions);
          expect(false).toBeTruthy();
        } catch (error) {
          expect((error as GenericError).getParams().status).toBe(
            HttpStatusCode.SERVER_ERROR
          );
        }
      });

      it('should set credentials to a request', async () => {
        await proxy.request(method, API_URL, DATA, defaultOptions);
        expect(requestInit.credentials).toBe('include');
      });

      it('should set an upper case method to a request', async () => {
        await proxy.request(method, API_URL, DATA, defaultOptions);
        expect(requestInit.method).toBe(method.toUpperCase());
      });

      it('should not set any body to a GET/HEAD request', async () => {
        await proxy.request(method, API_URL, DATA, defaultOptions);

        if (['get', 'head'].includes(method) === true) {
          expect(requestInit.body).toBeUndefined();
        } else {
          expect(requestInit.body).toBeDefined();
        }
      });

      if (['get', 'head'].includes(method) === false) {
        it('should set body and Content-Type: application/json for other requests than GET/HEAD even for an empty object', async () => {
          await proxy.request(method, API_URL, {}, defaultOptions);

          expect(requestInit.body).toBeDefined();
          // expect(requestInit.headers['Content-Type']).toBe('application/json');
        });

        it(`should convert body to query string if header 'Content-Type' is set to 'application/x-www-form-urlencoded'`, async () => {
          const options = Object.assign({}, defaultOptions, {
            fetchOptions: {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          });

          const data = { testKey: 'testValue', testKey2: 'testValue2' };
          await proxy.request(
            method,
            API_URL,
            data,
            options as HttpAgentRequestOptions
          );

          expect(requestInit.body).toBeDefined();
          expect(typeof requestInit.body).toBe('string');
        });

        it(`should convert body to FormData/Object if header 'Content-Type' is set to 'multipart/form-data'`, async () => {
          const options = Object.assign({}, defaultOptions, {
            fetchOptions: {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          });

          const data = { testKey: 'testValue', testKey2: 'testValue2' };
          await proxy.request(
            method,
            API_URL,
            data,
            options as HttpAgentRequestOptions
          );

          expect(requestInit.body).toBeDefined();
          expect(typeof requestInit.body).toBe('object');
        });
      }

      it('should return null body for HTTP status NO_CONTENT', async () => {
        response = Object.assign(response, {
          status: HttpStatusCode.NO_CONTENT,
        });
        const result = (await proxy.request(
          method,
          API_URL,
          DATA,
          defaultOptions
        )) as UnknownParameters;
        expect(result.body).toBeNull();
      });

      it('should call provided abortController.abort on timeout', async () => {
        jest.useFakeTimers();

        const abortController = new AbortController();
        const abortControllerSpy = jest.spyOn(abortController, 'abort');
        const options = { ...defaultOptions, timeout: 1, abortController };

        fetchResult = new Promise(resolve =>
          setTimeout(() => resolve(response), 100000)
        );

        await expect(async () => {
          const result = proxy.request(
            method,
            API_URL,
            DATA,
            options as HttpAgentRequestOptions
          );
          jest.advanceTimersByTime(1000);
          jest.runOnlyPendingTimers();
          await result;
        }).rejects.toThrow(TIMEOUT_ERROR);

        expect(abortControllerSpy).toHaveBeenCalled();
        expect(abortController.signal.aborted).toBeTruthy();
      });

      it('should create AbortController when not provided and abort it on timeout', async () => {
        jest.useFakeTimers();
        const options = { ...defaultOptions, timeout: 1 };

        fetchResult = new Promise(resolve =>
          setTimeout(() => resolve(response), 100000)
        );

        await expect(async () => {
          const result = proxy.request(
            method,
            API_URL,
            DATA,
            options as HttpAgentRequestOptions
          );
          jest.advanceTimersByTime(1000);
          jest.runOnlyPendingTimers();
          await result;
        }).rejects.toThrow(TIMEOUT_ERROR);

        // Check for presence of auto-created AbortController
        expect(options.abortController).toBeInstanceOf(AbortController);
        expect(options.abortController?.signal?.aborted).toBeTruthy();
      });

      it('should redefine abort controller if repeatRequest is > 0', async () => {
        jest.useFakeTimers();
        const options = { ...defaultOptions, timeout: 1, repeatRequest: 1 };

        fetchResult = new Promise(resolve =>
          setTimeout(() => resolve(response), 100000)
        );

        await expect(async () => {
          const result = proxy.request(
            method,
            API_URL,
            DATA,
            options as HttpAgentRequestOptions
          );
          jest.advanceTimersByTime(1000);
          jest.runOnlyPendingTimers();
          await result;
        }).rejects.toThrow(TIMEOUT_ERROR);

        expect(options.abortController).toBeInstanceOf(AbortController);
        expect(options.abortController?.signal?.aborted).toBeFalsy();
        options.repeatRequest--;

        // expect(options.repeatRequest).toBe(0);

        // repeat request
        await expect(async () => {
          const result = proxy.request(
            method,
            API_URL,
            DATA,
            options as HttpAgentRequestOptions
          );
          jest.advanceTimersByTime(1000);
          jest.runOnlyPendingTimers();
          await result;
        }).rejects.toThrow(TIMEOUT_ERROR);

        // This time it should abort
        expect(options.repeatRequest).toBe(0);
        expect(options.abortController?.signal?.aborted).toBeTruthy();
      });

      it('should throw Abort error when aborted externally; with other reason', async () => {
        jest.useFakeTimers();
        const abortController = new AbortController();
        const options = {
          ...defaultOptions,
          fetchOptions: { signal: abortController.signal },
        };

        fetchResult = new Promise(resolve =>
          setTimeout(() => resolve({} as Response), 100000)
        );

        await expect(async () => {
          const result = proxy.request(
            method,
            API_URL,
            DATA,
            options as HttpAgentRequestOptions
          );
          abortController.abort('Aborted');
          jest.runAllTimers();
          await result;
        }).rejects.toThrow();

        expect(abortController.signal.reason).toBe('Aborted');
        expect(abortController.signal.aborted).toBeTruthy();
      });

      it.each([['json'], ['blob'], ['text'], ['arrayBuffer'], ['formData']])(
        'should parse response with given response type',
        async responseType => {
          const result = (await proxy.request(method, API_URL, DATA, {
            ...defaultOptions,
            responseType:
              responseType as HttpAgentRequestOptions['responseType'],
          })) as UnknownParameters;

          expect(result.body).toStrictEqual({ data: responseType });
        }
      );

      it('should parse error content as json no matter the responseType', async () => {
        Object.assign(response, {
          ok: false,
          headers: {
            get: key => {
              if (key.toLowerCase() === 'content-type') {
                return 'application/json';
              }

              return null;
            },
          },
        });

        expect.assertions(1);

        try {
          await proxy.request(method, API_URL, DATA, {
            ...defaultOptions,
            responseType: 'blob',
          });
        } catch (error) {
          expect((error as GenericError).getParams().body).toStrictEqual({
            data: 'json',
          });
        }
      });
    }
  );

  describe('_convertObjectToQueryString', () => {
    it('should create query string representation of given object', () => {
      const testObject = { testKey: 'testValue', testKey2: 'testValue2' };
      const queryString = proxy._convertObjectToQueryString(testObject);

      expect(typeof queryString).toBe('string');
      expect(queryString).toBe('testKey=testValue&testKey2=testValue2');
    });

    it('should properly escape special characters', () => {
      const testObject = {
        testKey: 'test test/test|test?test',
        testKey2: 'test#test$test^test{test}',
      };
      const queryString = proxy._convertObjectToQueryString(testObject);
      expect(typeof queryString).toBe('string');

      // testKey
      expect(queryString?.substr(12, 3)).toBe('%20');
      expect(queryString?.substr(19, 3)).toBe('%2F');
      expect(queryString?.substr(26, 3)).toBe('%7C');
      expect(queryString?.substr(33, 3)).toBe('%3F');

      // testKey2
      expect(queryString?.substr(54, 3)).toBe('%23');
      expect(queryString?.substr(61, 3)).toBe('%24');
      expect(queryString?.substr(68, 3)).toBe('%5E');
      expect(queryString?.substr(75, 3)).toBe('%7B');
    });
  });

  describe('_convertObjectToFormData', () => {
    it('should return either FormData or Object instance', () => {
      const testObject = { testKey: 'testValue', testKey2: 'testValue2' };
      const convertedObject = proxy._convertObjectToFormData(testObject);

      expect(convertedObject).toBeDefined();
      expect(typeof convertedObject).toBe('object');
    });
  });

  describe('_getContentType', () => {
    it('should return custom Content-Type header', () => {
      expect(
        proxy._getContentType('GET', {}, {
          'Content-Type': 'application/xml',
        } as unknown as Record<string, string>)
      ).toBe('application/xml');
    });

    it('should return null for invalid custom content types', () => {
      expect(
        proxy._getContentType('GET', {}, {
          'Content-Type': null,
        } as unknown as Record<string, string>)
      ).toBeNull();
    });

    it('should return null for requests with no body', () => {
      jest.spyOn(proxy, '_shouldRequestHaveBody').mockReturnValue(false);

      expect(
        proxy._getContentType(
          'GET',
          {},
          {} as unknown as Record<string, string>
        )
      ).toBeNull();
    });
  });

  describe('_shouldRequestHaveBody', () => {
    it('should return false for invalid data or unsupported methods', () => {
      expect(proxy._shouldRequestHaveBody('', {})).toBeFalsy();
      expect(proxy._shouldRequestHaveBody('', undefined)).toBeFalsy();
      expect(proxy._shouldRequestHaveBody('GET', { data: 'foo' })).toBeFalsy();
      expect(proxy._shouldRequestHaveBody('HEAD', undefined)).toBeFalsy();
    });

    it('should return true for valid data and supported methods', () => {
      expect(
        proxy._shouldRequestHaveBody('POST', { data: 'foo' })
      ).toBeTruthy();
      expect(proxy._shouldRequestHaveBody('PUT', { bar: 'foo' })).toBeTruthy();
    });
  });
});
