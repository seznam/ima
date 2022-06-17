import toMock from 'to-mock';
import Helper from '@ima/helpers';

import Cache from 'src/cache/Cache';
import GenericError from 'src/error/GenericError';
import HttpAgentImpl from '../HttpAgentImpl';
import HttpAgentProxy from '../HttpProxy';
import CookieStorage from 'src/storage/CookieStorage';

describe('ima.core.http.HttpAgentImpl', () => {
  let MockedCache = toMock(Cache);
  let MockedHttpAgentProxy = toMock(HttpAgentProxy);
  let MockedCookieStorage = toMock(CookieStorage);

  let proxy = null;
  let http = null;
  let cache = null;
  let cookie = null;
  let options = null;
  let data = null;
  let httpConfig = null;

  beforeEach(() => {
    cache = new MockedCache();
    proxy = new MockedHttpAgentProxy();
    cookie = new MockedCookieStorage();
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
        postProcessor: agentResponse => agentResponse,
      },
      cacheOptions: {
        prefix: 'http.',
      },
    };
    http = new HttpAgentImpl(proxy, cache, cookie, Helper, httpConfig);

    options = {
      ttl: httpConfig.defaultRequestOptions.ttl,
      timeout: httpConfig.defaultRequestOptions.timeout,
      repeatRequest: httpConfig.defaultRequestOptions.repeatRequest,
      headers: {},
      cache: true,
      withCredentials: true,
      postProcessor: httpConfig.defaultRequestOptions.postProcessor,
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
        'set-cookie': ['cookie1=cookie1', 'cookie2=cookie2'],
      },
      headersRaw: new Map(
        Object.entries({
          'set-cookie': ['cookie1=cookie1', 'cookie2=cookie2'],
        })
      ),
    };
  });

  using(['get', 'post', 'put', 'patch', 'delete'], method => {
    describe(method + ' method', () => {
      beforeEach(() => {
        data.params.method = method;
      });

      it('should be return resolved promise with data', done => {
        spyOn(proxy, 'request').and.callFake(() => {
          return Promise.resolve(data);
        });

        spyOn(proxy, 'haveToSetCookiesManually').and.returnValue(false);

        http[method](data.params.url, data.params.data, data.params.options)
          .then(response => {
            let agentResponse = {
              status: data.status,
              params: data.params,
              body: data.body,
              headers: data.headers,
              headersRaw: data.headersRaw,
              cached: false,
            };

            expect(response).toStrictEqual(agentResponse);
            done();
          })
          .catch(e => {
            console.error(e.message, e.stack);
            done(e);
          });
      });

      it('should be rejected with error', done => {
        spyOn(proxy, 'request').and.callFake(() => {
          return Promise.reject(new GenericError('', data.params));
        });

        http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(
          () => {},
          error => {
            expect(error instanceof GenericError).toBe(true);
            expect(proxy.request.calls.count()).toBe(2);
            done();
          }
        );
      });

      it('should be set cookie to response', done => {
        spyOn(proxy, 'request').and.callFake(() => {
          return Promise.resolve(data);
        });
        spyOn(proxy, 'haveToSetCookiesManually').and.returnValue(true);
        spyOn(cookie, 'parseFromSetCookieHeader');

        http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(cookie.parseFromSetCookieHeader.calls.count()).toBe(2);
          done();
        });
      });

      it('should call postProcessor function', done => {
        spyOn(proxy, 'request').and.callFake(() => {
          return Promise.resolve(data);
        });
        spyOn(data.params.options, 'postProcessor').and.callThrough();

        http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(data.params.options.postProcessor).toHaveBeenCalled();
          done();
        });
      });

      it('should not set Cookie header only for request with withCredentials option set to false', done => {
        spyOn(proxy, 'request').and.callFake(() => {
          return Promise.resolve(data);
        });
        spyOn(cookie, 'getCookiesStringForCookieHeader').and.callThrough();

        http[method](
          data.params.url,
          data.params.data,
          Object.assign({}, data.params.options, { withCredentials: false })
        ).then(() => {
          expect(cookie.getCookiesStringForCookieHeader).not.toHaveBeenCalled();
          done();
        });
      });

      it('should clone result from _internalCacheOfPromises', done => {
        spyOn(proxy, 'request').and.callFake(() => {
          return Promise.resolve(data);
        });

        spyOn(Helper, 'clone').and.stub();

        //the first call without a response in the _internalCacheOfPromises
        http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(Helper.clone).not.toHaveBeenCalled();
        });

        //the second call from the _internalCacheOfPromises is cloned
        http[method](
          data.params.url,
          data.params.data,
          data.params.options
        ).then(() => {
          expect(Helper.clone).toHaveBeenCalled();
          done();
        });
      });
    });
  });
});
