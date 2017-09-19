import HttpProxy from 'http/HttpProxy';
import StatusCode from 'http/StatusCode';
import UrlTransformer from 'http/UrlTransformer';
import Window from 'window/Window';
import GenericError from "../../error/GenericError";

describe('ima.http.HttpProxy', () => {

	let proxy = null;
	let apiUrl = 'http://localhost:3001/api/';
	let response;

	let data = {};
	let fetchResult;
	let options = { ttl: 3600000, timeout: 2000, repeatRequest: 1, headers: [], withCredentials: true };
	let urlTransformer = new UrlTransformer();
	let windowHelper = new Window();

	const fetchApiMock = () => {
		return fetchResult;
	};

	beforeEach(() => {
		proxy = new HttpProxy(urlTransformer, windowHelper);
		response = {
			ok: true,
			status: 200,
			headers: new Map(), // compatible enough with Headers
			json() {
				return Promise.resolve(this.body);
			},
			body: {
				data: 'some data'
			}
		};
		fetchResult = Promise.resolve(response);
	});

	using([
		'get',
		'post',
		'put',
		'delete',
		'patch'
	], (method) => {
		describe('method ' + method, () => {
			it('should return promise with response body', (done) => {
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => fetchApiMock);

				proxy.request(method, apiUrl, data, options)
					.then((result) => {
						expect(result.body).toEqual(response.body);
						done();
					})
					.catch((error) => {
						console.log(error);
						done();
					});
			});

			it('should return a "body" field in error object, when promise is rejected', (done) => {
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => fetchApiMock);
				fetchResult = Promise.reject(
					new GenericError('The HTTP request timed out', {
						status: StatusCode.TIMEOUT
					})
				);

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.getParams().body).toBeDefined();
						done();
					});
			});

			it('should reject promise for Timeout error', (done) => {
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => fetchApiMock);
				fetchResult = Promise.reject(
					new GenericError('The HTTP request timed out', {
						status: StatusCode.TIMEOUT
					})
				);

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.getParams().status).toEqual(StatusCode.TIMEOUT);
						done();
					});
			});

			it('should be timeouted for longer request then options.timeout', (done) => {
				jest.useFakeTimers();

				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => {
						jest.runOnlyPendingTimers();
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.getParams().status).toEqual(StatusCode.TIMEOUT);
						done();
					});
			});

			it('should reject promise for Forbidden', (done) => {
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => fetchApiMock);
				response = {
					ok: false,
					status: StatusCode.FORBIDDEN,
					headers: new Map(), // compatible enough with Headers
					json() {
						return Promise.resolve(this.body);
					},
					body: {
						data: 'some data'
					}
				};
				fetchResult = Promise.resolve(response);

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.getParams().status).toEqual(StatusCode.FORBIDDEN);
						done();
					});
			});

			it('should reject promise for Not found', (done) => {
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => fetchApiMock);
				response = {
					ok: false,
					status: StatusCode.NOT_FOUND,
					headers: new Map(), // compatible enough with Headers
					json() {
						return Promise.resolve(this.body);
					},
					body: {
						data: 'some data'
					}
				};
				fetchResult = Promise.resolve(response);

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.getParams().status).toEqual(StatusCode.NOT_FOUND);
						done();
					});
			});

			it('should reject promise for Internal Server Error', (done) => {
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => fetchApiMock);
				response = {
					ok: false,
					status: StatusCode.SERVER_ERROR,
					headers: new Map(), // compatible enough with Headers
					json() {
						return Promise.resolve(this.body);
					},
					body: {
						data: 'some data'
					}
				};
				fetchResult = Promise.resolve(response);

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.getParams().status).toEqual(StatusCode.SERVER_ERROR);
						done();
					});
			});

			it('should reject promise for UNKNOWN', (done) => {
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => fetchApiMock);
				response = {
					ok: false,
					status: null,
					headers: new Map(), // compatible enough with Headers
					json() {
						return Promise.resolve(this.body);
					},
					body: {
						data: 'some data'
					}
				};
				fetchResult = Promise.resolve(response);

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.getParams().status).toEqual(StatusCode.SERVER_ERROR);
						done();
					});
			});

			it('should set credentials to request', (done) => {
				let passedOptions;
				spyOn(proxy, '_getFetchApi')
					.and
					.callFake(() => (_, options) => {
						passedOptions = options;
						return fetchApiMock();
					});

				proxy.request(method, apiUrl, data, options)
					.then((result) => {
						expect(passedOptions.credentials).toBe('include');
						done();
					})
					.catch((error) => {
						console.log(error);
						done();
					});
			});
		});
	});
});
