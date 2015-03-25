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

		/**
		 * @property META_NAME_TAGS
		 * @const
		 * @type {Array}
		 * @default ['description', 'keywords']
		 */
		this.META_NAME_TAGS = ['description', 'keywords'];

		/**
		 * @property META_PROPERTY_TAGS
		 * @const
		 * @type {Array}
		 * @default ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']
		 */
		this.META_PROPERTY_TAGS = ['og:title', 'og:description', 'og:url', 'og:image', 'og:type'];

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
					this._changeSeoParamsOnPage(controller.getSeoParams());

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
	 * @param {Object} seoParams
	 */
	_changeSeoParamsOnPage(seoParams) {
		this._window.setTitle(seoParams.get('title'));

		for (var metaTag of this.META_NAME_TAGS) {
			this._window.querySelector(`meta[name="${metaTag}"]`).content = seoParams.get(metaTag);
		}

		for (var metaTag of this.META_PROPERTY_TAGS) {
			this._window.querySelector(`meta[property="${metaTag}"]`).content = seoParams.get(metaTag);
		}
	}
}

ns.Core.PageRender.Client = Client;