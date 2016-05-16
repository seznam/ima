// @server-side

import ns from 'ima/namespace';
import IMAError from 'ima/error/GenericError';
import AbstractPageRenderer from 'ima/page/renderer/AbstractPageRenderer';

ns.namespace('ima.page.renderer');

/**
 * Server-side page renderer. The renderer renders the page into the HTML
 * markup and sends it to the client.
 *
 * @class ServerPageRenderer
 * @extends ima.page.renderer.AbstractPageRenderer
 * @namespace ima.page.renderer
 * @module ima
 * @submodule ima.page
 */
export default class ServerPageRenderer extends AbstractPageRenderer {

	/**
	 * Initializes the server-side page renderer.
	 *
	 * @method contructor
	 * @constructor
	 * @param {ima.page.renderer.PageRendererFactory} factory Factory for receive $Utils to
	 *        view.
	 * @param {vendor.$Helper} Helper The IMA.js helper methods.
	 * @param {vendor.ReactDOMServer} ReactDOMServer React framework instance
	 *        to use to render the page on the server side.
	 * @param {Object<string, *>} settings Application setting for the current
	 *        application environment.
	 * @param {ima.router.Response} response Utility for sending the page
	 *        markup to the client as a response to the current HTTP request.
	 * @param {ima.cache.Cache} cache Resource cache caching the results
	 *        of HTTP requests made by services used by the rendered page.
	 */
	constructor(factory, Helper, ReactDOMServer, settings, response, cache) {
		super(factory, Helper, ReactDOMServer, settings);

		/**
		 * Utility for sending the page markup to the client as a response to
		 * the current HTTP request.
		 *
		 * @private
		 * @property _response
		 * @type {ima.router.Response}
		 */
		this._response = response;

		/**
		 * The resource cache, caching the results of all HTTP requests made by
		 * the services using by the rendered page. The state of the cache will
		 * then be serialized and sent to the client to re-initialize the page
		 * at the client side.
		 *
		 * @private
		 * @property _cache
		 * @type {ima.cache.Cache}
		 */
		this._cache = cache;

	}

	/**
	 * @inheritdoc
	 * @abstract
	 * @method mount
	 */
	mount(controller, view, pageResources) {
		if (this._response.isResponseSent()) {
			return Promise.resolve(this._response.getResponseParams());
		}

		return (
			this._Helper
				.allPromiseHash(pageResources)
				.then((fetchedResources) => {
					return this._renderPage(controller, view, fetchedResources);
				})
		);
	}

	/**
	 * @inheritdoc
	 * @method update
	 */
	update(controller, resourcesUpdate) {
		return Promise.reject(new IMAError(
			'The update() is denied on server side.'
		));
	}

	/**
	 * @inheritdoc
	 * @method unmount
	 */
	unmount() {
		// nothing to do
	}

	/**
	 * The javascript code will include a settings the "revival" data for the
	 * application at the client-side.
	 *
	 * @private
	 * @method _getRevivalSettings
	 * @return {string} The javascript code to include into the
	 *         rendered page.
	 */
	_getRevivalSettings() {
		return (
			`
			(function(root) {
				root.$IMA = root.$IMA || {};
				$IMA.Cache = ${this._cache.serialize()};
				$IMA.$Language = "${this._settings.$Language}";
				$IMA.$Env = "${this._settings.$Env}";
				$IMA.$Debug = ${this._settings.$Debug};
				$IMA.$Version = "${this._settings.$Version}";
				$IMA.$App = ${JSON.stringify(this._settings.$App)};
				$IMA.$Protocol = "${this._settings.$Protocol}";
				$IMA.$Host = "${this._settings.$Host}";
				$IMA.$Root = "${this._settings.$Root}";
				$IMA.$LanguagePartPath = "${this._settings.$LanguagePartPath}";
			})(typeof window !== 'undefined' && window !== null ? window : global);

			(function(root) {
				root.$IMA = root.$IMA || {};
				root.$IMA.Runner = root.$IMA.Runner || {
					scripts: [],
					loadedScripts: [],
					load: function(script) {
						this.loadedScripts.push(script.src);
						if (this.scripts.length === this.loadedScripts.length) {
							this.run();
						}
					},
					run: function() {
						root.$IMA.Loader.initAllModules()
							.then(function() {
								return root.$IMA.Loader.import("app/main");
							})
							.catch(function(error) {
								console.error(error);
							});
					}
				};
			})(typeof window !== 'undefined' && window !== null ? window : global);
			`
		);
	}

	/**
	 * Creates a copy of the provided data map object that has the values of
	 * its fields wrapped into Promises.
	 *
	 * The the values that are already Promises will referenced directly
	 * without wrapping then into another Promise.
	 *
	 * @protected
	 * @method _wrapEachKeyToPromise
	 * @param {Object<string, *>=} [dataMap={}] A map of data that should have
	 *        its values wrapped into Promises.
	 * @return {Object<string, Promise>} A copy of the provided data map that
	 *         has all its values wrapped into promises.
	 */
	_wrapEachKeyToPromise(dataMap = {}) {
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

	/**
	 * Render page after all promises from loaded resources is resolved.
	 *
	 * @private
	 * @method _renderPage
	 * @param {ima.controller.AbstractController} controller
	 * @param {React.Component} view
	 * @param {Object<string, *>} fetchedResources
	 * @return {{content: string, status: number}}
	 */
	_renderPage(controller, view, fetchedResources) {
		if (!this._response.isResponseSent()) {
			controller.setState(fetchedResources);
			controller.setMetaParams(fetchedResources);

			this._response
				.status(controller.getHttpStatus())
				.send(this._renderPageContentToString(controller, view));
		}

		return this._response.getResponseParams();
	}

	/**
	 * Render page content to a string containing HTML markup.
	 *
	 * @private
	 * @method _renderPageContentToString
	 * @param {ima.controller.AbstractController} controller
	 * @param {React.Component} view
	 * @return {string}
	 */
	_renderPageContentToString(controller, view) {
		var props = this._generateViewProps(view, controller.getState());
		var wrappedPageViewElement = this._factory.wrapView(props);
		var pageMarkup = this._ReactDOM.renderToString(wrappedPageViewElement);

		var documentView = this._factory.getDocumentView(this._settings.$Page.$Render.documentView);
		var documentViewFactory = this._factory.reactCreateFactory(documentView);
		var appMarkup = this._ReactDOM.renderToStaticMarkup(documentViewFactory({
			page: pageMarkup,
			revivalSettings: this._getRevivalSettings(),
			metaManager: controller.getMetaManager(),
			$Utils: this._factory.getUtils()
		}));

		return '<!doctype html>\n' + appMarkup;
	}
}

ns.ima.page.renderer.ServerPageRenderer = ServerPageRenderer;
