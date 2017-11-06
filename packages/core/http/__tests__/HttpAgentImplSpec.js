import toMock from 'to-mock';

import Cache from 'cache/Cache';
import GenericError from 'error/GenericError';
import HttpAgentImpl from 'http/HttpAgentImpl';
import HttpAgentProxy from 'http/HttpProxy';
import CookieStorage from 'storage/CookieStorage';

describe('ima.http.HttpAgentImpl', () => {
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
					'Accept-Language': 'en'
				},
				cache: true,
				postProcessor: agentResponse => agentResponse
			},
			cacheOptions: {
				prefix: 'http.'
			}
		};
		http = new HttpAgentImpl(proxy, cache, cookie, httpConfig);

		options = {
			ttl: httpConfig.defaultRequestOptions.ttl,
			timeout: httpConfig.defaultRequestOptions.timeout,
			repeatRequest: httpConfig.defaultRequestOptions.repeatRequest,
			headers: {},
			cache: true,
			withCredentials: true,
			postProcessor: httpConfig.defaultRequestOptions.postProcessor,
			language: httpConfig.defaultRequestOptions.language
		};

		data = {
			status: 200,
			body: 111,
			params: {
				url: 'url',
				data: {},
				options: options
			},
			header: {
				'set-cookie': ['cookie1=cookie1', 'cookie2=cookie2']
			}
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

				http[method](
					data.params.url,
					data.params.data,
					data.params.options
				)
					.then(response => {
						let agentResponse = {
							status: data.status,
							params: data.params,
							body: data.body,
							headers: data.header,
							cached: false
						};

						expect(response).toEqual(agentResponse);
						done();
					})
					.catch(e => {
						console.error(e.message, e.stack);
						done();
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
						expect(proxy.request.calls.count()).toEqual(2);
						done();
					}
				);
			});

			it('should be set cookie', done => {
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
					expect(
						cookie.parseFromSetCookieHeader.calls.count()
					).toEqual(2);
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
					expect(
						data.params.options.postProcessor
					).toHaveBeenCalled();
					done();
				});
			});
		});
	});
});
