import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Page.Render');

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 *
 * @class Client
 * @extends Core.Abstract.PageRender
 * @namespace Core.Page.Render
 * @module Core
 * @submodule Core.Page
 */
class Client extends ns.Core.Abstract.PageRender {

	/**
	 * Initializes the client-side page renderer.
	 *
	 * @method constructor
	 * @constructor
	 * @param {Vendor.Helper} Helper The IMA.js helper methods.
	 * @param {Vendor.React} React React framework instance to use to render the
	 *        page.
	 * @param {Object<string, *>} settings The application setting for the
	 *        current application environment.
	 * @param {Core.Interface.Window} window Helper for manipulating the global
	 *        object ({@code window}) regardless of the client/server-side
	 *        environment.
	 */
	constructor(Helper, React, settings, window) {
		super(Helper, React, settings);

		/**
		 * Flag signalling that the page is being rendered for the first time.
		 *
		 * @property _firsTime
		 * @private
		 * @type {boolean}
		 * @default true
		 */
		this._firstTime = true;

		/**
		 * Helper for manipulating the global object ({@code window}) regardless of
		 * the client/server-side environment.
		 *
		 * @property _window
		 * @private
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * @property _viewContainer
		 * @private
		 * @type {HTMLElement}
		 */
		this._viewContainer = this._window
				.getElementById(this._settings.$Page.$Render.masterElementId);

	}

	/**
	 * Renders the page using the provided controller and view. The method
	 * attempts to re-use the markup sent by the server if possible.
	 *
	 * @override
	 * @method mount
	 * @param {Core.Abstract.Controller} controller
	 * @param {Vendor.React.Component} view
	 * @return {Promise}
	 */
	mount(controller, view) {
		var loadedData = controller.load();
		var separatedData = this._separatePromisesAndValues(loadedData);
		var defaultPageState = separatedData.values;
		var loadedPromises = separatedData.promises;

		if (this._firstTime === false) {
			controller.setState(defaultPageState);
			this._renderToDOM(controller, view);

			for (let resourceName of Object.keys(loadedPromises)) {
				loadedPromises[resourceName]
					.then((resource) => {
						controller.patchState({
							[resourceName]: resource
						});
					});
			}
		}

		return (
			this._Helper
				.allPromiseHash(loadedPromises)
				.then((fetchedResources) => {

					if (this._firstTime === true) {
						Object.assign(defaultPageState, fetchedResources);
						controller.setState(defaultPageState);
						this._renderToDOM(controller, view);
						this._firstTime = false;
					}

					controller.setMetaParams(fetchedResources);
					this._updateMetaAttributes(controller.getMetaManager());

					controller.activate();
				})
		);
	}

	/**
	 * Unmount view from the DOM.
	 *
	 * @override
	 * @method unmount
	 */
	unmount() {
		if (this._reactiveView) {
			this._React.unmountComponentAtNode(this._viewContainer);
			this._reactiveView = null;
		}
	}

	/**
	 * Render React element to DOM.
	 *
	 * @method _renderToDOM
	 * @private
	 * @param {Core.Abstract.Controller} controller
	 * @param {Vendor.React.Component} view
	 *
	 */
	_renderToDOM(controller, view) {
		var reactElementView = this._React.createElement(view, controller.getState());

		this._reactiveView = this._React.render(
			reactElementView,
			this._viewContainer
		);
	}

	/**
	 * Separate promises and values from provided data map. Values will be use for
	 * default page state. Promises will be patched to state after their resolve.
	 *
	 * @method _separatePromisesAndValues
	 * @private
	 * @param {Object<string, *>} dataMap A map of data.
	 * @return {{promises: Promise, values: *}} Return separated promises and other values.
	 */
	_separatePromisesAndValues(dataMap) {
		var promises = {};
		var values = {};

		for (var field of Object.keys(dataMap)) {
			var value = dataMap[field];

			if (value instanceof Promise) {
				promises[field] = value;
			} else {
				values[field] = value;
			}
		}

		return {promises, values};
	}

	/**
	 * Updates the title and the contents of the meta elements used for SEO.
	 *
	 * @method _updateMetaAttributes
	 * @private
	 * @param {Core.Interface.MetaManager} metaManager meta attributes storage providing the new
	 *        values for page meta elements and title.
	 */
	_updateMetaAttributes(metaManager) {
		var metaTagKey = null;
		var metaTag = null;
		this._window.setTitle(metaManager.getTitle());

		for (metaTagKey of metaManager.getMetaNames()) {
			metaTag = this._window.querySelector(`meta[name="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = metaManager.getMetaName(metaTagKey);
			}
		}

		for (metaTagKey of metaManager.getMetaProperties().keys()) {
			metaTag = this._window.querySelector(`meta[property="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = metaManager.getMetaProperty(metaTagKey);
			}
		}
	}
}

ns.Core.Page.Render.Client = Client;
