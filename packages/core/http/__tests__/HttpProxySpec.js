import HttpProxy from 'http/HttpProxy';
import StatusCode from 'http/StatusCode';
import UrlTransformer from 'http/UrlTransformer';
import Window from 'window/Window';
import GenericError from "../../error/GenericError";

describe('ima.http.HttpProxy', () => {

	let proxy = null;
	let apiUrl = 'http://localhost:3001/api/';
	let superAgent = null;
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

			xit('should reject promise for Timeout error', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback({ timeout: options.timeout });
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.status).toEqual(StatusCode.TIMEOUT);
						done();
					});
			});

			xit('should be timeouted for longer request then options.timeout', (done) => {
				jest.useFakeTimers();

				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						superAgent.funcError = callback;
						jest.runOnlyPendingTimers();
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.status).toEqual(StatusCode.TIMEOUT);
						done();
					});
			});

			xit('should reject promise for CORS', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback({ crossDomain: true });
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.status).toEqual(StatusCode.FORBIDDEN);
						done();
					});
			});

			xit('should reject promise for Forbidden', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback({ status: 403 });
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.status).toEqual(StatusCode.FORBIDDEN);
						done();
					});
			});

			xit('should reject promise for Not found', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback({ status: 404 });
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.status).toEqual(StatusCode.NOT_FOUND);
						done();
					});
			});

			xit('should reject promise for Internal Server Error', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback({ status: 500 });
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.status).toEqual(StatusCode.SERVER_ERROR);
						done();
					});
			});

			xit('should reject promise for UNKNOWN', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback({});
					});

				proxy.request(method, apiUrl, data, options)
					.then(() => {}, (error) => {
						expect(error.status).toEqual(StatusCode.SERVER_ERROR);
						done();
					});
			});

			xit('should set credentials to request', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback(null, response);
					});

				spyOn(proxy, '_setCredentials')
					.and
					.returnValue(proxy);

				proxy.request(method, apiUrl, data, options)
					.then((result) => {
						expect(proxy._setCredentials).toHaveBeenCalled();
						done();
					})
					.catch((error) => {
						console.log(error);
						done();
					});
			});

			xit('should call private method _setListeners for each request', (done) => {
				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback(null, response);
					});

				spyOn(proxy, '_setListeners')
					.and
					.returnValue(proxy);

				proxy.request(method, apiUrl, data, options)
					.then(() => {
						expect(proxy._setListeners).toHaveBeenCalled();
						done();
					});
			});

			xit('should add listener for "progress" to request', (done) => {
				spyOn(superAgent, 'on')
					.and
					.stub();

				spyOn(superAgent, 'end')
					.and
					.callFake((callback) => {
						return callback(null, response);
					});

				function dummy() {}
				let reqOptions = Object.assign({}, options, { 'listeners': { 'progress': dummy } });

				proxy.request(method, apiUrl, data, reqOptions)
					.then(() => {
						expect(superAgent.on).toHaveBeenCalledWith('progress', dummy);
						expect(superAgent.on.calls.count()).toEqual(1);
						done();
					});
			});
		});
	});
});
