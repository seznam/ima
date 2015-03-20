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

		var loadPromises = controller.load();

		for (var service of Object.keys(loadPromises)) {
			var promise = loadPromises[service];
			this._resolvePromise(controller, service, promise);
		}

		var reactiveView = null;

		if (this._firstTime === false) {
			reactiveView = this._react.render(controller.getView(), document.getElementById(this._setting.$PageRender.masterElementId));
			controller.setReactiveView(reactiveView);
		}

		return (
			this._rsvp
				.hash(loadPromises)
				.then((resolvedPromises) => {

					if (this._firstTime === true) {
						reactiveView = this._react.render(controller.getView(), document.getElementById(this._setting.$PageRender.masterElementId));
						controller.setReactiveView(reactiveView);
						this._firstTime = false;
					}

					controller.setSeoParams(resolvedPromises);
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
		document.title = seoParams.get('title');
		document.querySelector('meta[name="description"]').content = seoParams.get('description');
		document.querySelector('meta[name="keywords"]').content = seoParams.get('keywords');
		document.querySelector('meta[property="og:title"]').content = seoParams.get('title');
		document.querySelector('meta[property="og:description"]').content = seoParams.get('description');
		document.querySelector('meta[property="og:url"]').content = seoParams.get('url');
		document.querySelector('meta[property="og:image"]').content = seoParams.get('image');
		document.querySelector('meta[property="og:type"]').content = seoParams.get('type');
	}
}

ns.Core.PageRender.Client = Client;