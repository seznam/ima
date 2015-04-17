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
	 * @param {Vendor.Rsvp} Rsvp The RSVP implementation of the Promise API with
	 *        helpers.
	 * @param {Vendor.React} React React framework instance to use to render the
	 *        page.
	 * @param {Object<string, *>} setting The application setting for the
	 *        current application environment.
	 * @param {Core.Interface.Window} window Helper for manipulating the global
	 *        object ({@code window}) regardless of the client/server-side
	 *        environment.
	 */
	constructor(Rsvp, React, setting, window) {
		super(Rsvp, React, setting);

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
	}

	/**
	 * Renders the page using the provided controller and parameters. The method
	 * attempts to re-use the markup sent by the server if possible.
	 *
	 * @override
	 * @method render
	 * @param {Core.Abstract.Controller} controller The page controller that
	 *        should have its view rendered.
	 * @param {Vendor.React.Component} view
	 * @return {Promise}
	 */
	render(controller, view) {
		var loadPromises = this._wrapEachKeyToPromise(controller.load());
		var reactiveView = null;
		var masterElementId = this._setting.$Page.$Render.masterElementId;
		var viewContainer = this._window.getElementById(masterElementId);

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

			reactiveView = this._React.render(
				reactElementView,
				viewContainer
			);
			controller.setReactiveView(reactiveView);
		}

		return (
			this._Rsvp
				.hash(loadPromises)
				.then((fetchedResources) => {
					controller.setState(fetchedResources);
					var reactElementView = this._React.createElement(view, controller.getState());

					if (this._firstTime === true) {
						reactiveView = this._React.render(
							reactElementView,
							viewContainer
						);
						controller.setReactiveView(reactiveView);
						this._firstTime = false;
					}

					controller.setSeoParams(fetchedResources);
					this._updateSeoAttributes(controller.getSeoManager());

					controller.activate();
				})
		);
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

		for (var metaTagKey of seo.getMetaNameStorage().keys()) {
			var metaTag = this._window.querySelector(`meta[name="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = seo.getMetaName(metaTagKey);
			}
		}

		for (var metaTagKey of seo.getMetaPropertyStorage().keys()) {
			var metaTag;
			metaTag = this._window.querySelector(`meta[property="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = seo.getMetaProperty(metaTagKey);
			}
		}
	}
}

ns.Core.Page.Render.Client = Client;