/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Helper from '@ima/helpers';

import Cache from '../../cache/CacheImpl';
import GenericError from '../../error/GenericError';
import HttpAgentImpl from '../HttpAgentImpl';
import { HttpAgentResponse } from '../HttpAgent';
import HttpAgentProxy from '../HttpProxy';
import CookieStorage from '../../storage/CookieStorage';
import { toMockedInstance } from 'to-mock';

describe('ima.core.http.HttpAgentImpl', () => {
  let http: HttpAgentImpl;
  const proxy = toMockedInstance(HttpAgentProxy);
  const cache = toMockedInstance(Cache);
  const cookie = toMockedInstance(CookieStorage);
  let options = null;
  let data: HttpAgentResponse;
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
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
        },
        cache: true,
        postProcessor: (agentResponse: Response) => agentResponse,
      },
      cacheOptions: {
        prefix: 'http.',
      },
    };
    http = new HttpAgentImpl(proxy, cache, cookie, helper, httpConfig);

    options = {
      ttl: httpConfig.defaultRequestOptions.ttl,
      timeout: httpConfig.defaultRequestOptions.timeout,
      repeatRequest: httpConfig.defaultRequestOptions.repeatRequest,
      headers: {},
      cache: true,
      fetchOptions: {},
      withCredentials: true,
      postProcessor: httpConfig.defaultRequestOptions.postProcessor,
      // @ts-ignore
      language: httpConfig.defaultRequestOptions.language,
    };

    data = {
      status: 200,
      body: 111,
      params: {
        url: 'url',
        data: {},
        options: options,
      },
      headers: {
        // @ts-ignore
        'set-cookie': ['cookie1=cookie1', 'cookie2=cookie2'],
      },
      // @ts-ignore
      headersRaw: new Map(
        Object.entries({
          'set-cookie': ['cookie1=cookie1', 'cookie2=cookie2'],
        })
      ),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  ['get', 'post', 'put', 'patch', 'delete'].forEach(method => {
    describe(method + ' method', () => {
      beforeEach(() => {
        data.params.method = method;
      });

      it('should be return resolved promise with data', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });

        jest.spyOn(proxy, 'haveToSetCookiesManually').mockReturnValue(false);

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        )
          .then((response: HttpAgentResponse) => {
            const agentResponse = {
              status: data.status,
              params: data.params,
              body: data.body,
              headers: data.headers,
              headersRaw: data.headersRaw,
              cached: false,
            };

            // eslint-disable-next-line jest/no-conditional-expect
            expect(response).toStrictEqual(agentResponse);
          })
          // @ts-ignore
          .catch(e => {
            console.error(e.message, e.stack);
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
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
          // @ts-ignore
          error => {
            expect(error instanceof GenericError).toBe(true);
            expect(proxy.request.mock.calls).toHaveLength(2);
          }
        );
      });

      // eslint-disable-next-line jest/no-focused-tests
      it('should be set cookie to response', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });
        jest.spyOn(proxy, 'haveToSetCookiesManually').mockReturnValue(true);
        jest
          .spyOn(cookie, 'parseFromSetCookieHeader')
          // eslint-disable-next-line @typescript-eslint/no-empty-function
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

      it('should call postProcessor function', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });
        jest.spyOn(data.params.options, 'postProcessor');

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(data.params.options.postProcessor).toHaveBeenCalled();
        });
      });

      it('should not set Cookie header only for request with withCredentials option set to false', async () => {
        jest.spyOn(proxy, 'request').mockImplementation(() => {
          return Promise.resolve(data);
        });
        jest.spyOn(cookie, 'getCookiesStringForCookieHeader');

        // @ts-ignore
        await http[method](
          data.params.url,
          data.params.data,
          Object.assign({}, data.params.options, { withCredentials: false })
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
    });
  });
});
