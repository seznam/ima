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
		var loadPromises = this._wrapEachKeyToPromise(controller.load());

		for (let resourceName of Object.keys(loadPromises)) {
			loadPromises[resourceName]
				.then((resource) => {
					controller.patchState({
						[resourceName]: resource
					})
				})
		}

		if (this._firstTime === false) {
			var reactElementView = this._React.createElement(view, controller.getState());

			this._reactiveView = this._React.render(
				reactElementView,
				this._viewContainer
			);
		}

		return (
			this._Helper
				.allPromiseHash(loadPromises)
				.then((fetchedResources) => {
					controller.setState(fetchedResources);
					var reactElementView = this._React.createElement(view, controller.getState());

					if (this._firstTime === true) {
						this._reactiveView = this._React.render(
							reactElementView,
							this._viewContainer
						);
						this._firstTime = false;
					}

					controller.setSeoParams(fetchedResources);
					this._updateSeoAttributes(controller.getSeoManager());

					controller.activate();
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
			this._React.unmountComponentAtNode(this._viewContainer);
			this._reactiveView = null;
		}
	}

	/**
	 * Updates the title and the contents of the meta elements used for SEO.
	 *
	 * @method _updateSeoAttributes
	 * @private
	 * @param {Core.Interface.Seo} seo SEO attributes storage providing the new
	 *        values for page meta elements and title.
	 */
	_updateSeoAttributes(seo) {
		this._window.setTitle(seo.getTitle());

		for (var metaTagKey of seo.getMetaNames()) {
			var metaTag = this._window.querySelector(`meta[name="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = seo.getMetaName(metaTagKey);
			}
		}

		for (var metaTagKey of seo.getMetaProperties().keys()) {
			var metaTag;
			metaTag = this._window.querySelector(`meta[property="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = seo.getMetaProperty(metaTagKey);
			}
		}
	}
}

ns.Core.Page.Render.Client = Client;