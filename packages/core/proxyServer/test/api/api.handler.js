/**
 * @class Handler
 * @namespace Server.Test.Api
 * */
class Handler {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Node.Http} http
	 * @param {Promise} promise
	 * */
	constructor(http, promise) {
		/**
		 * @property _http
		 * @private
		 * @type {Node.Http}
		 * @default http
		 * */
		this._http = http;


		/**
		 * @property _promise
		 * @private
		 * @type {Promise}
		 * @default promise
		 * */
		this._promise = promise;

	}


	/**
	 * Make request to specific url.
	 *
	 * @method request
	 * @param {Object} options - {method, port, path, host, headers, preProcessor, processor}
	 * @return {Promise}
	 * */
	request(options) {
		return new this._promise((resolve, reject) => {
			var timeStart = Date.now();

			var req = this._http.request(options, (res) => {
				var body = '';
				res.setEncoding('utf8');

				res.on('data', (chunk) => {
					body += chunk;
				});

				res.on('end', () => {
					var respond = {
						status: res.statusCode,
						options: options,
						headers: JSON.stringify(res.headers),
						body: body,
						time: Date.now() - timeStart
					};
					var isThrowErrorForUndefinedStatus = (respond.status >= 400 && !respond.options.status);
					var isThrowErrorForDefinedStatus = (respond.options.status && respond.options.status !== respond.status);

					if (isThrowErrorForUndefinedStatus || isThrowErrorForDefinedStatus) {
						reject(new Error(`API test for ${options.method}: ${options.host}${options.path} return status ${respond.status}.`));
					}

					if (typeof options.preProcessor === 'function') {
						respond = options.preProcessor(respond);
					}

					if (typeof options.processor === 'function') {
						try{
							options.processor(respond, options);
						} catch(e) {
							respond.error = e;
						}
					}

					if (respond.error) {
						reject(respond.error);
					} else {
						resolve(respond);
					}

				});
			});

			req.on('error', (e) => {
				reject(e);
			});

			req.setTimeout(options.timeout || 5000, () => {
				reject(new Error(`Request for url ${options.host}${options.path} is timeouted.`));
			});

			if (options.method !== 'GET' && options.data) {
				req.write(options.data);
			}

			req.end();
		});
	}
}

module.exports = Handler;