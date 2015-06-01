import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Page.Render');

/**
 * Server-side page renderer. The renderer renders the page into the HTML
 * markup and sends it to the client.
 *
 * @class Server
 * @extends Core.Abstract.PageRender
 * @namespace Core.Page.Render
 * @module Core
 * @submodule Core.Page
 */
class Server extends ns.Core.Abstract.PageRender {

	/**
	 * Initializes the server-side page renderer.
	 *
	 * @method contructor
	 * @constructor
	 * @param {Vendor.Helper} Helper The IMA.js helper methods.
	 * @param {Vendor.React} React React framework instance to use to render the
	 *        page.
	 * @param {Object<string, *>} settings Application setting for the current
	 *        application environment.
	 * @param {Core.Router.Response} response Utility for sending the page markup
	 *        to the client as a response to the current HTTP request.
	 * @param {Core.Interface.Cache} cache Resource cache caching the results of
	 *        HTTP requests made by services used by the rendered page.
	 */
	constructor(Helper, React, settings, response, cache) {
		super(Helper, React, settings);

		/**
		 * Utility for sending the page markup to the client as a response to the
		 * current HTTP request.
		 *
		 * @property _response
		 * @private
		 * @type {Core.Router.Response}
		 */
		this._response = response;

		/**
		 * The resource cache, caching the results of all HTTP requests made by the
		 * services using by the rendered page. The state of the cache will then be
		 * serialized and sent to the client to re-initialize the page at the
		 * client side.
		 *
		 * @property _cache
		 * @private
		 * @type {Core.Interface.Cache}
		 */
		this._cache = cache;
	}

	/**
	 * Renders the page into HTML markup and sends it to the client using the
	 * response utility provided by router.
	 *
	 * @method mount
	 * @param {Core.Abstract.Controller} controller
	 * @param {Vendor.React.Component} view
	 * @return {Promise}
	 */
	mount(controller, view) {
		var loadPromises = this._wrapEachKeyToPromise(controller.load());

		return (
			this._Helper
				.allPromiseHash(loadPromises)
				.then((fetchedResources) => {
					controller.setState(fetchedResources);
					controller.setMetaParams(fetchedResources);

					var reactElementView = this._React.createElement(view, controller.getState());
					var pageMarkup = this._React.renderToString(reactElementView);

					var documentView = ns.get(this._settings.$Page.$Render.documentView);
					var appMarkup = this._React.renderToStaticMarkup(documentView({
						page: pageMarkup,
						scripts: this._getScripts(),
						metaManager: controller.getMetaManager()
					}));

					this._response
						.status(controller.getHttpStatus())
						.send('<!doctype html>\n' + appMarkup);
				})
		);
	}

	/**
	 * Unmount view from th DOM.
	 *
	 * @override
	 * @method unmount
	 * @abstract
	 */
	unmount() {
		if (this._reactiveView) {
			this._reactiveView = null;
		}
	}

	/**
	 * Generates the HTML code concontaining all scripts elements to include into
	 * the rendered page. THe HTML code will include the scripts specified in
	 * page renderer's settings and a script settings the "rehydration" data for
	 * the application at the client-side.
	 *
	 * @method _getScripts
	 * @private
	 * @return {string} HTML code containing all scripts elements to include into
	 *         the rendered page.
	 */
	_getScripts() {
		var scripts = [];
		var html = '';

		scripts = this._settings.$Page.$Render.scripts
			.map(script => `<script src="${script}"></script>`);

		scripts.push(
			'<script>' +
			' window.$IMA = window.$IMA || {};' +
			' window.$IMA.Cache = ' + (this._cache.serialize()) + ';' +
			' window.$IMA.$Language = "' + (this._settings.$Language) + '";' +
			' window.$IMA.$Env = "' + (this._settings.$Env) + '";' +
			' window.$IMA.$Debug = "' + (this._settings.$Debug) + '";' +
			' window.$IMA.$Protocol = "' + (this._settings.$Protocol) + '";' +
			' window.$IMA.$Domain = "' + (this._settings.$Domain) + '";' +
			' window.$IMA.$Root = "' + (this._settings.$Root) + '";' +
			' window.$IMA.$LanguagePartPath = "' + (this._settings.$LanguagePartPath) + '";' +
			'</script>'
		);
		html = scripts.join('');

		return html;
	}

	/**
	 * Creates a copy of the provided data map object that has the values of its
	 * fields wrapped into Promises.
	 *
	 * The the values that are already Promises will referenced directly without
	 * wrapping then into another Promise.
	 *
	 * @method _wrapEachKeyToPromise
	 * @protected
	 * @param {Object<string, *>} dataMap A map of data that should have its
	 *        values wrapped into Promises.
	 * @return {Object<string, Promise>} A copy of the provided data
	 *         map that has all its values wrapped into promises.
	 */
	_wrapEachKeyToPromise(dataMap) {
		var copy = {};

		for (var field of Object.keys(dataMap)) {
			var value = dataMap[field];

			if (value instanceof Promise) {
				copy[field] = value;
			} else {
				copy[field] = Promise.resolve(value);
			}
		}

		return copy;
	}
}

ns.Core.Page.Render.Server = Server;
