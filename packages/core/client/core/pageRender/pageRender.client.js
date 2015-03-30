import ns from 'core/namespace/ns.js';

ns.namespace('Core.PageRender');

/**
 * @class Client
 * @extends Core.Abstract.PageRender
 * @namespace Core.PageRender
 * @module Core
 * @submodule Core.PageRender
 */
class Client extends ns.Core.Abstract.PageRender {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Vendor.Rsvp} rsvp
	 * @param {Vendor.React} react
	 * @param {Core.Animate.Handler} animate
	 * @param {Object} setting
	 * @param {Core.Interface.Window} window
	 */
	constructor(rsvp, react, animate, setting, window) {
		super(rsvp, react, animate, setting);

		/**
		 * Flag for first rendering page.
		 *
		 * @property _firsTime
		 * @private
		 * @type {Boolean}
		 * @default true
		 */
		this._firstTime = true;

		/**
		 * @property _window
		 * @type {Core.Interface.Window}
		 * @default window
		 */
		this._window = window;
	}

	/**
	 * Render page for controller with params.
	 *
	 * @method render
	 * @param {Core.Abstract.Controller} controller
	 * @param {Object} params
	 */
	render(controller, params) {
		super.render(controller, params);

		var loadPromises = this._wrapEachKeyToPromise(controller.load());
		var reactiveView = null;

		for (var service of Object.keys(loadPromises)) {
			var promise = loadPromises[service];
			this._resolvePromise(controller, service, promise);
		}

		if (this._firstTime === false) {
			reactiveView = this._react.render(controller.getReactView(), this._window.getElementById(this._setting.$PageRender.masterElementId));
			controller.setReactiveView(reactiveView);
		}

		return (
			this._rsvp
				.hash(loadPromises)
				.then((resolvedPromises) => {

					if (this._firstTime === true) {
						reactiveView = this._react.render(controller.getReactView(), this._window.getElementById(this._setting.$PageRender.masterElementId));
						controller.setReactiveView(reactiveView);
						this._firstTime = false;
					}

					controller.setSeoParams(resolvedPromises, this._setting);
					this._changeSeoParamsOnPage(controller.getSeoHandler());

					controller.activate();
				})
		);
	}

	/**
	 * Resolve each promise.
	 *
	 * @method _resolvePromise
	 * @private
	 * @param {Core.Abstract.Controller} controller
	 * @param {String} service
	 * @param {Promise} promise
	 */
	_resolvePromise(controller, service, promise) {
		promise
			.then((serviceData) => {
				var state = controller.getState();
				state[service] = serviceData;

				controller.setState(state);

			});
	}

	/**
	 * Change SEO params on page.
	 *
	 * @method _changeSeoParamsOnPage
	 * @private
	 * @param {Core.Interface.Seo} seo
	 */
	_changeSeoParamsOnPage(seo) {
		this._window.setTitle(seo.getPageTitle());

		for (var metaTagKey of seo.getMetaNameStorage().keys()) {
			var metaTag = this._window.querySelector(`meta[name="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = seo.getMetaName(metaTagKey);
			}
		}

		for (var metaTag of seo.getMetaPropertyStorage().keys()) {
			var metaTag = this._window.querySelector(`meta[property="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = seo.getMetaProperty(metaTagKey);
			}
		}
	}
}

ns.Core.PageRender.Client = Client;