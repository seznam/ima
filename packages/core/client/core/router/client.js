import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Router');

/**
 * @class ClientHandler
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class ClientHandler extends ns.Core.Abstract.Router {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.PageManager} pageManager
	 * @param {Core.Router.Factory} factory
	 * @param {Promise} Promise
	 * @param {Core.Interface.Window} window
	 */
	constructor(pageManager, factory, Promise, window) {
		super(pageManager, factory, Promise);

		/**
		 * @property _window
		 * @private
		 * @type {Core.Interface.Window}
		 * @default window
		 */
		this._window = window;

		/**
		 * @property MOUSE_MIDDLE_BUTTON
		 * @const
		 * @type {Number}
		 * @default 1
		 */
		this.MOUSE_MIDDLE_BUTTON = 1;

		/**
		 * @property POP_STATE_EVENT
		 * @const
		 * @type {string}
		 * @default 'popstate'
		 */
		this.POP_STATE_EVENT = 'popstate';

	}

	/**
	 * Initialization router.
	 *
	 * @method init
	 * @chainable
	 * @param {Object} config
	 * @return {this}
	 */
	init(config = {}) {
		super.init(config);
		this._mode = this._window.hasHistoryAPI() ? this.MODE_HISTORY : this.MODE_HASH;
		this._domain = config.domain || this._window.getDomain();

		return this;
	}

	/**
	 * Get current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return this._extractRoutePath(this._window.getPath());
	}

	/**
	 * Attach event to window.
	 *
	 * @method listen
	 * @chainable
	 * @return {this}
	 */
	listen() {
		var windowElement = this._window.getWindow();

		this._window.addEventListener(windowElement, this.POP_STATE_EVENT, (event) => {
			if (event.state) {
				this.route(this.getPath());
			}
		});

		this._window.addEventListener(windowElement, 'click', (e)=> {
			this._handleClick(e);
		});

		return this;
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 * @param {string} [url='']
	 */
	redirect(url = '') {

		if (this._isSameDomain(url) && this._mode === this.MODE_HISTORY) {
			var path = url.replace(this._protocol + '//' + this._domain, '');

			path = this._extractRoutePath(path);
			this.route(path);
			this._setAddressBar(url);
		} else {
			this._window.redirect(url);
		}

	}

	/**
	 * Handle path by router.
	 *
	 * @method route
	 * @param {string} path
	 */
	route(path) {
		return (
			super
				.route(path)
				.catch((error) => {
					if (this.isClientError(error)) {
						return this.handleNotFound(error);
					}

					return this.handleError(error);
				})
		);
	}

	/**
	 * Handle Error that call 'error' controller with params.
	 *
	 * @method handleError
	 * @param {Object} params
	 * @return {Promise}
	 */
	handleError(params) {
		return (
			super
				.handleError(params)
				.catch((fatalError) => {
					var window = this._window.getWindow();
					var isIMA = window.$IMA;
					var isFunction = window.$IMA.fatalErrorHandler;

					if (window && isIMA && typeof isFunction === 'function') {
						window.$IMA.fatalErrorHandler(fatalError);
					}
				})
		);
	}

	/**
	 * Handle Not Found path that call 'notFound' controller with params.
	 *
	 * @method handleNotFound
	 * @param {Object} params
	 * @return {Promise}
	 */
	handleNotFound(params) {
		return (
			super
				.handleNotFound(params)
				.catch((error) => {
					return this.handleError(error);
				})
		);
	}
	
	/**
	 * Handle click event.
	 *
	 * @method _handleClick
	 * @param {MouseEvent} event
	 */
	_handleClick(event) {
		var target = event.target || event.srcElement;
		var targetHref = target.href;

		//find close a element with href
		while(target && target.parentNode && (target !== this._window.getBody()) && (typeof targetHref === 'undefined' || targetHref === null)) {
			target = target.parentNode;
			targetHref = target.href;
		}

		var isDefinedTargetHref = typeof targetHref !== 'undefined' && targetHref !== null;
		var isNotMiddleButton = event.button !== this.MOUSE_MIDDLE_BUTTON;
		var isSameDomain = this._isSameDomain(targetHref);

		if (isDefinedTargetHref && isNotMiddleButton && isSameDomain) {
			this._window.preventDefault(event);
			this.redirect(targetHref);
		}
	}

	/**
	 * Normalize path by clear slashes.
	 *
	 * @method _clearSlashes
	 * @private
	 * @param {string} path
	 */
	_clearSlashes(path) {
		return path.toString().replace(/\/$/, '').replace(/^\//, '');
	}

	/**
	 * Set address bar.
	 *
	 * @method _setAddressBar
	 * @private
	 * @param {string} [url='']
	 */
	_setAddressBar(url = '') {
		var state = {url};
		this._window.pushStateToHistoryAPI(state, null, url);
	}

	/**
	 * Return true if url is same domain as app domain.
	 *
	 * @method _isSameDomain
	 * @private
	 * @param {string} [url='']
	 * @return {boolean}
	 */
	_isSameDomain(url = '') {
		return url.match(this._getBaseUrl());
	}
}

ns.Core.Router.ClientHandler = ClientHandler;
