/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Helper from '@ima/helpers';
import { toMockedInstance } from 'to-mock';

import { CacheImpl } from '../../cache/CacheImpl';
import { GenericError } from '../../error/GenericError';
import { CookieStorage } from '../../storage/CookieStorage';
import { HttpAgentRequestOptions, HttpAgentResponse } from '../HttpAgent';
import { HttpAgentImpl } from '../HttpAgentImpl';
import { HttpProxy } from '../HttpProxy';

describe('ima.core.http.HttpAgentImpl', () => {
  let http: HttpAgentImpl;
  const proxy = toMockedInstance(HttpProxy);
  const cache = toMockedInstance(CacheImpl);
  const cookie = toMockedInstance(CookieStorage);
  let options: HttpAgentRequestOptions;
  let data: HttpAgentResponse<unknown>;
  // @ts-ignore
  let httpConfig = null;
  const helper = {
    ...Helper,
    clone: jest.fn(),
  };

  beforeEach(() => {
    httpConfig = {
      defaultRequestOptions: {
        timeout: 7000,
        repeatRequest: 1,
        ttl: 0,
        cache: true,
        fetchOptions: {
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'en',
          },
          credentials: 'include',
        },
        postProcessors: [
          jest
            .fn()
            .mockImplementation(
              (agentResponse: HttpAgentResponse<unknown>) => agentResponse
            ),
        ],
        keepSensitiveHeaders: false,
      } as HttpAgentRequestOptions,
      cacheOptions: {
        prefix: 'http.',
      },
    };
    http = new HttpAgentImpl(proxy, cache, cookie, httpConfig, helper);

    options = {
      ...httpConfig.defaultRequestOptions,
    };

    data = {
      status: 200,
      body: 111,
      params: {
        url: 'url',
        transformedUrl: 'url',
        method: 'get',
        data: {},
        options,
      },
      headers: {
        // @ts-ignore
        'set-cookie': ['cookie1=cookie1', 'cookie2=cookie2'],
      },
      // @ts-ignore
      headersRaw: new Headers({
        'set-cookie': ['cookie1=cookie1', 'cookie2=cookie2'],
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe.each([['get', 'post', 'put', 'patch', 'delete']])(
    '%s method',
    method => {
      beforeEach(() => {
        data.params.method = method;
      });

      it('should return resolved promise with data', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });

        jest.spyOn(proxy, 'haveToSetCookiesManually').mockReturnValue(false);

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then((response: HttpAgentResponse<unknown>) => {
          const { postProcessors, ...restOptions } = data.params.options;
          restOptions.fetchOptions.headers = {}; // HttpAgentImpl._cleanResponse() removes headers
          const agentResponse = {
            status: data.status,
            params: {
              ...data.params,
              options: {
                ...restOptions,
              },
            },
            body: data.body,
            headers: {},
            cached: false,
          };

          expect(response).toStrictEqual(agentResponse);
        });
      });

      it('should be rejected with error', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.reject(new GenericError('', data.params));
        });

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(
          // @ts-ignore

          () => {},
          // @ts-ignore
          error => {
            expect(error instanceof GenericError).toBe(true);
            expect(proxy.request.mock.calls).toHaveLength(2);
          }
        );
      });

      it('should not repeat request when aborted', async () => {
        data.params.options.repeatRequest = 10;
        data.params.options.abortController = new AbortController();

        jest.spyOn(proxy, 'request').mockImplementation(() => {
          data.params.options?.abortController?.abort();

          return Promise.reject(new GenericError('', data.params));
        });

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(
          // @ts-ignore

          () => {},
          // @ts-ignore
          error => {
            expect(error instanceof GenericError).toBe(true);
            expect(proxy.request).toHaveBeenCalledTimes(1);
          }
        );
      });

      it('should set cookie to response', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });
        jest.spyOn(proxy, 'haveToSetCookiesManually').mockReturnValue(true);
        jest
          .spyOn(cookie, 'parseFromSetCookieHeader')

          .mockImplementation(() => {});

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(cookie.parseFromSetCookieHeader).toHaveBeenCalled();
        });
      });

      it('should compose fetchOptions correctly from defaults and options', async () => {
        const proxyMock = jest
          .spyOn(proxy, 'request')
          .mockImplementation(() => {
            return Promise.resolve(data);
          });

        jest
          .spyOn(cookie, 'getCookiesStringForCookieHeader')
          .mockImplementation(() => 'someCookie=value');

        const customOptions = {
          ...data.params.options,
          fetchOptions: {
            mode: 'cors',
            referrerPolicy: 'no-referrer-when-downgrade',
            headers: {
              'Accept-Language': 'cs',
            },
          },
        };

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          customOptions
        ).then(() => {
          const mockCall = proxyMock.mock.lastCall || [];
          expect(mockCall[3]).toMatchObject({
            fetchOptions: {
              credentials: 'include',
              referrerPolicy: 'no-referrer-when-downgrade',
              headers: {
                'Accept-Language': 'cs',
                Cookie: 'someCookie=value',
              },
              mode: 'cors',
            },
          });
        });
      });

      it('should call postProcessors function', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });

        data.params.options.postProcessors =
          // @ts-ignore
          httpConfig.defaultRequestOptions.postProcessors;

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(data.params.options.postProcessors?.[0]).toHaveBeenCalled();
        });
      });

      it('should call clear response from postProcessors and abortController', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });

        data.params.options.postProcessors =
          // @ts-ignore
          httpConfig.defaultRequestOptions.postProcessors;
        data.params.options.abortController = new AbortController();

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then((response: HttpAgentResponse<unknown>) => {
          expect(response.params.options.abortController).toBeUndefined();
          expect(response.params.options.postProcessors).toBeUndefined();
        });
      });

      it('should not set Cookie header if request fetchOptions.credentials is not "include"', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });
        jest.spyOn(cookie, 'getCookiesStringForCookieHeader');

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          Object.assign({}, data.params.options, {
            fetchOptions: { credentials: 'omit' },
          })
        ).then(() => {
          expect(cookie.getCookiesStringForCookieHeader).not.toHaveBeenCalled();
        });
      });

      /* eslint-disable jest/no-done-callback */
      it('should clone result from _internalCacheOfPromises', done => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });

        //the first call without a response in the _internalCacheOfPromises
        // @ts-ignore
        http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(helper.clone).not.toHaveBeenCalled();
        });

        //the second call from the _internalCacheOfPromises is cloned
        // @ts-ignore
        http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(helper.clone).toHaveBeenCalled();
          done();
        });
      });
      /* eslint-enable jest/no-done-callback */
    }
  );

  describe('Failed request caching', () => {
    beforeEach(() => {
      options.cacheFailedRequest = true;
      options.ttl = 1000;
    });

    describe.each([['get', 'post', 'put', 'patch', 'delete']])(
      '%s method with caching of failed request',
      method => {
        let error: GenericError;

        beforeEach(() => {
          error = new GenericError('Request failed', data.params);
        });

        it('should cache failed request', async () => {
          let result;

          jest.spyOn(proxy, 'request').mockImplementation(() => {
            return Promise.reject(error);
          });
          jest.spyOn(cache, 'set');

          // @ts-ignore
          await http[method](data.params.url, data.params.data, options).catch(
            (rejectedError: any) => {
              result = rejectedError;
            }
          );
          expect(result).toBeInstanceOf(GenericError);
          expect(cache.set).toHaveBeenCalledWith(
            expect.stringContaining('http.'),
            expect.any(GenericError),
            options.ttl
          );
        });

        it('should return cached error', async () => {
          let result;

          const cacheKey = http.getCacheKey(
            'get',
            data.params.url,
            data.params.data
          );
          jest.spyOn(cache, 'has').mockReturnValue(true);
          jest.spyOn(cache, 'get').mockReturnValue(error);

          // @ts-ignore
          await http[method](data.params.url, data.params.data, options).catch(
            (rejectedError: any) => {
              result = rejectedError;
            }
          );
          expect(result).toBe(error);
          expect(cache.has).toHaveBeenCalledWith(cacheKey);
          expect(cache.get).toHaveBeenCalledWith(cacheKey);
        });
      }
    );
  });
});
