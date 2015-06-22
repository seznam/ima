import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Router');

/**
 * Names of the DOM events the router responds to.
 *
 * @const
 * @property EVENTS
 * @type {Object<string, string>}
 */
const EVENTS = Object.freeze({
	/**
	 * Name of the event produced when the user clicks the page using the mouse,
	 * or touches the page and the touch event is not stopped.
	 *
	 * @const
	 * @property
	 * @type {string}
	 */
	CLICK: 'click',

	/**
	 * Name of the event fired when the user navigates back in the history.
	 *
	 * @const
	 * @property EVENTS.POP_STATE
	 * @type {string}
	 */
	POP_STATE: 'popstate'
});

/**
 * Address bar content manipulation modes.
 *
 * @const
 * @property MODES
 * @type {Object<string, string>}
 */
const MODES = Object.freeze({
	/**
	 * Address bar manipulation mode in which the current URL in the address bar
	 * is being udpated using the session history management API.
	 *
	 * @const
	 * @property MODES.HISTORY
	 * @type {string}
	 */
	HISTORY: 'history',

	/**
	 * Address bar manipulation mode in which the current URL in the address bar
	 * is being udpated by modifying the {@code hash} part.
	 *
	 * @const
	 * @property MODES.HASH
	 * @type {string}
	 */
	HASH: 'hash'
});

/**
 * The number used as the index of the mouse middle button in DOM
 * {@code MouseEvent}s.
 *
 * @const
 * @property MOUSE_MIDDLE_BUTTON
 * @type {number}
 */
const MOUSE_MIDDLE_BUTTON = 1;

/**
 * The client-side implementation of the {@codelink Core.Interface.Router}
 * interface.
 *
 * @class Client
 * @extends Core.Abstract.Router
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
export default class Client extends ns.Core.Abstract.Router {

	/**
	 * Initializes the client-side router.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Interface.PageManager} pageManager The page manager handling
	 *        UI rendering, and transitions between pages if at the client side.
	 * @param {Core.Router.Factory} factory Factory for routes.
	 * @param {Object<string, string>} ROUTE_NAMES The internal route names.
	 * @param {Core.Interface.Window} window
	 */
	constructor(pageManager, factory, ROUTE_NAMES, window) {
		super(pageManager, factory, ROUTE_NAMES);

		/**
		 * Helper for accessing the native client-side APIs.
		 *
		 * @private
		 * @property _window
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * Current address bar manipulation mode, specified as one of the
		 * {@code MODES.*} constants..
		 *
		 * @private
		 * @property mode
		 * @type {string}
		 * @default null
		 */
		this._mode = null;
	}

	/**
	 * Initializes the router with the provided configuration.
	 *
	 * @method init
	 * @param {{$Protocol: string, $Domain: string, $Root: string, $LanguagePartPath: string}} config
	 *        Router configuration.
	 *        The {@code $Protocol} field must be the current protocol used to
	 *        access the application, terminated by a collon (for example
	 *        {@code https:}).
	 *        The {@code $Domain} field must be the application's domain in the
	 *        following form: {@code `${protocol}//${host}`}.
	 *        The {@code $Root} field must specify the URL path pointing to the
	 *        application's root.
	 *        The {@code $LanguagePartPath} field must be the URL path fragment
	 *        used as a suffix to the {@code $Root} field that specifies the
	 *        current language.
	 */
	init(config) {
		super.init(config);
		this._mode = this._window.hasHistoryAPI() ? MODES.HISTORY : MODES.HASH;
		this._domain = config.$Domain || this._window.getDomain();

		return this;
	}

	/**
	 * Ruturns current path part of the current URL, including the query string
	 * (if any).
	 *
	 * @inheritDoc
	 * @override
	 * @method getPath
	 * @return {string} The path and query parts of the current URL.
	 */
	getPath() {
		return this._extractRoutePath(this._window.getPath());
	}

	/**
	 * Registers event listeners at the client side window object allowing the
	 * router to capture user's history (history pop state - going "back") and
	 * page (clicking links) navigation.
	 *
	 * The router will start processing the navigation internally, handling the
	 * user's navigation to display the page related to the URL resulting from
	 * the user's action.
	 *
	 * Note that the router will not prevent forms from being submitted to the
	 * server.
	 *
	 * The effects of this method cannot be reverted. This method has no effect
	 * at the server side.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method listen
	 * @return {Core.Interface.Router} This router.
	 */
	listen() {
		var nativeWindow = this._window.getWindow();

		this._setAddressBar(this.getUrl());
		this._window.bindEventListener(nativeWindow, EVENTS.POP_STATE, (event) => {

			if (event.state) {
				this.route(this.getPath())
					.then(() => {
						var scroll = event.state.scroll;

						if (scroll) {
							this._asyncWindowScroll(scroll.x, scroll.y);
						}
					})
			}
		});

		this._window.bindEventListener(nativeWindow, EVENTS.CLICK, (event) => {
			this._handleClick(event);
		});

		return this;
	}

	/**
	 * Redirects the client to the specified location.
	 *
	 * At the server side the method results in responsing to the client with a
	 * redirect HTTP status code and the {@code Location} header.
	 *
	 * At the client side the method updates the current URL by manipulating the
	 * browser history (if the target URL is at the same domain and protocol as
	 * the current one) or performs a hard redirect (if the target URL points to
	 * a different protocol or domain).
	 *
	 * The method will result in the router handling the new URL and routing the
	 * client to the related page if the URL is set at the client side and points
	 * to the same domain and protocol.
	 *
	 * @inheritDoc
	 * @override
	 * @method redirect
	 * @param {string} url The URL to which the client should be redirected.
	 */
	redirect(url = '') {
		if (this._isSameDomain(url) && this._mode === MODES.HISTORY) {
			var path = url.replace(this.getProtocol() + '//' + this._domain, '');
			path = this._extractRoutePath(path);

			this._saveScrollHistory();
			this._setAddressBar(url);
			this._window.scrollTo(0, 0);
			this.route(path);
		} else {
			this._window.redirect(url);
		}
	}

	/**
	 * Routes the application to the route matching the providing path, renders
	 * the route page and sends the result to the client.
	 *
	 * @inheritDoc
	 * @override
	 * @method route
	 * @param {string} path The URL path part received from the client, with
	 *        optional query.
	 * @return {Promise<undefined>} A promise resolved when the error has been
	 *         handled and the response has been sent to the client, or displayed
	 *         if used at the client side.
	 */
	route(path) {
		return (
			super
				.route(path)
				.catch((error) => {
					if (this.isClientError(error)) {
						return this.handleNotFound(error);
					}

					if (this.isRedirection(error)) {
						this.redirect(error.getParams().url);
						return Promise.resolve();
					}

					return this.handleError(error);
				})
		);
	}

	/**
	 * Handles an internal server error by responding with the appropriate
	 * "internal server error" error page.
	 *
	 * @inheritDoc
	 * @override
	 * @method handleError
	 * @param {Object<string, string>} params Parameters extracted from the
	 *        current URL path and query.
	 * @return {Promise<undefined>} A promise resolved when the error has been
	 *         handled and the response has been sent to the client, or displayed
	 *         if used at the client side.
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
	 * Handles a "not found" error by responsing with the appropriate "not found"
	 * error page.
	 *
	 * @inheritDoc
	 * @override
	 * @method handleNotFound
	 * @param {Object<string, string>} params Parameters extracted from the
	 *        current URL path and query.
	 * @return {Promise<undefined>} A promise resolved when the error has been
	 *         handled and the response has been sent to the client, or displayed
	 *         if used at the client side.
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
	 * Handles a click event. The method performs navigation to the target
	 * location of the anchor (if it has one).
	 *
	 * The navigation will be handled by the router if the protocol and domain of
	 * the anchor's target location (href) is the same as the current, otherwise
	 * the method results in a hard redirect.
	 *
	 * @private
	 * @method _handleClick
	 * @param {MouseEvent} event The click event.
	 */
	_handleClick(event) {
		var target = event.target || event.srcElement;
		var anchorElement = this._getAnchorElement(target);

		if (!anchorElement) {
			return;
		}

		var anchorHref = anchorElement.href;
		var isDefinedTargetHref = (anchorHref !== undefined) &&
				(anchorHref !== null);
		var isMiddleButton = event.button === MOUSE_MIDDLE_BUTTON;
		var isSameDomain = this._isSameDomain(anchorHref);
		var isHashLink = this._isHashLink(anchorHref);
		var isLinkPrevented = event.defaultPrevented;

		if (!isDefinedTargetHref ||
				isMiddleButton ||
				!isSameDomain ||
				isHashLink ||
				isLinkPrevented) {
			return;
		}

		this._window.preventDefault(event);
		this.redirect(anchorHref);
	}

	/**
	 * The method determines whether an anchor element or
	 * a child of an anchor element has been clicked, and if it was, the method
	 * returns anchor element else null.
	 *
	 * @private
	 * @method _getAnchorElement
	 * @param {Node} target
	 * @return {Node|null}
	 */
	_getAnchorElement(target) {
		var self = this;

		while (target && !hasReachedAnchor(target)) {
			target = target.parentNode;
		}

		function hasReachedAnchor(nodeElement) {
			return nodeElement.parentNode &&
				(nodeElement !== self._window.getBody()) &&
				(nodeElement.href !== undefined) &&
				(nodeElement.href !== null);
		}

		return target;
	}

	/**
	 * Tests whether the provided target URL contains only an update of the
	 * hash fragment of the current URL.
	 *
	 * @private
	 * @method _isHashLink
	 * @param {string} targetUrl The target URL.
	 * @return {boolean} {@code true} if the navigation to target URL would
	 *         result only in updating the hash fragment of the current URL.
	 */
	_isHashLink(targetUrl) {
		if (targetUrl.indexOf('#') === -1) {
			return false;
		}

		var currentUrl = this._window.getUrl();
		var trimmedCurrentUrl = currentUrl.indexOf('#') === -1 ? currentUrl :
				currentUrl.substring(0, currentUrl.indexOf('#'));
		var trimmedTargetUrl = targetUrl.substring(0, targetUrl.indexOf('#'));

		return trimmedTargetUrl === trimmedCurrentUrl;
	}

	/**
	 * Sets the provided URL to the browser's address bar by pushing a new state
	 * to the history.
	 *
	 * The state object pushed to the history will be an object with the follwing
	 * structure: {@code {url: string}}. The {@code url} field will be set to the
	 * provided URL.
	 *
	 * @private
	 * @method _setAddressBar
	 * @param {string} url The URL.
	 */
	_setAddressBar(url) {
		var scroll = {
			x: 0,
			y: 0
		};
		var state = {url, scroll};

		this._window.pushState(state, null, url);
	}

	/**
	 * Save user's scroll state to history.
	 *
	 * Replace scroll values in current state for actual scroll values in document.
	 *
	 * @method _saveScrollHistory
	 */
	_saveScrollHistory() {
		var url = this.getUrl();
		var scroll = {
			x: this._window.getScrollX(),
			y: this._window.getScrollY()
		};
		var state = {url, scroll};

		this._window.replaceState(state, null, url);
	}

	/**
	 * Asynchronous window scroll to defined vertical and horizontal values.
	 *
	 * @private
	 * @method _asyncWindowScroll
	 * @param {number} x is the pixel along the horizontal axis of the document
	 * @param {number} y is the pixel along the vertical axis of the document
	 */
	_asyncWindowScroll(x, y) {
		setTimeout(() => {
			this._window.scrollTo(x, y);
		}, 0);
	}

	/**
	 * Tests whether the the protocol and domain of the provided URL are the
	 * same as the current.
	 *
	 * @private
	 * @method _isSameDomain
	 * @param {string} [url=''] The URL.
	 * @return {boolean} {@code true} if the protocol and domain of the provided
	 *         URL are the same as the current.
	 */
	_isSameDomain(url = '') {
		return !!url.match(this._getBaseUrl());
	}
}

ns.Core.Router.Client = Client;
