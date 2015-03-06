import ns from 'core/namespace/ns.js';

ns.namespace('Core.File');

/**
 * File uploader.
 *
 * @class Uploader
 * @namespace Core.File
 * @module Core
 * @submodule Core.File
 * */
class Uploader {
	/**
	 * @constructor
	 * @method constructor
	 * @param {XMLHttpRequest} xhr
	 * @param {Promise} promise
	 */
	constructor(xhr, promise) {
		this._xhr = xhr;
		this._promise = promise;
	}

	/**
	 * Uploads a file to a server.
	 *
	 * @method uploadFile
	 * @param {Object} options Options:
	 *   - [method=POST]: POST or GET
	 *   - [url='/']: URL address of the processing script
	 *   - [async=true]: Asynchronous transfer flag
	 *   - data: File data
	 * @return {Promise}
	 */
	uploadFile(options) {
		var opts = {
			method: 'POST',
			url: '/',
			async: true,
			data: '',
			onprogress: null
		};
		Object.assign(opts, options);

		var xhr = this._xhr;
		xhr.open(opts.method, opts.url, opts.async);

		return new this._promise((resolve, reject) => {
			xhr.onload = (ev) => {
				if (xhr.status === 200) {
					resolve(xhr.response);
				} else {
					reject(xhr.status);
				}
			};

			xhr.onerror =
			xhr.onabort =
			xhr.ontimeout = (ev) => {
				reject(xhr.status);
			};

			if (opts.onprogress) {
				xhr.upload.onprogress = (ev) => {
					opts.onprogress(ev.loaded, ev.total, ev);
				};
			}

			xhr.send(opts.data);
		});
	}
}

ns.Core.File.Uploader = Uploader;