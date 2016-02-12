import ns from 'imajs/client/core/namespace';
import AbstractRouter from 'imajs/client/core/abstract/router';

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
	 * Name of the event produced when the user clicks the page using the
	 * mouse, or touches the page and the touch event is not stopped.
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
	 * Address bar manipulation mode in which the current URL in the address
	 * bar is being udpated using the session history management API.
	 *
	 * @const
	 * @property MODES.HISTORY
	 * @type {string}
	 */
	HISTORY: 'history',

	/**
	 * Address bar manipulation mode in which the current URL in the address
	 * bar is being udpated by modifying the {@code hash} part.
	 *
	 * @const
	 * @property MODES.HASH
	 * @type {string}
	 */
	HASH: 'hash'
});

/**
 * The number used as the index of the mouse left button in DOM
 * {@code MouseEvent}s.
 *
 * @const
 * @property MOUSE_LEFT_BUTTON
 * @type {number}
 */
const MOUSE_LEFT_BUTTON = 0;

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
export default class Client extends AbstractRouter {

	/**
	 * Initializes the client-side router.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Interface.PageManager} pageManager The page manager
	 *        handling UI rendering, and transitions between pages if at the
	 *        client side.
	 * @param {Core.Router.Factory} factory Factory for routes.
	 * @param {Core.Interface.Dispatcher} dispatcher Dispatcher fires events to
	 *        app.
	 * @param {{ROUTE_NAMES: Object<string, string>, EVENTS: Object<string, string>}} ROUTER_CONSTANTS
	 *        The internal router constants. The {@code ROUTE_NAMES}
	 *        contains internal route names. The {@code EVENTS} contains name
	 *        of events which are fired with {@code Core.Interface.Dispatcher}.
	 * @param {Core.Interface.Window} window The current global client-side
	 *        APIs provider.
	 */
	constructor(pageManager, factory, dispatcher, ROUTER_CONSTANTS, window) {
		super(pageManager, factory, dispatcher, ROUTER_CONSTANTS);

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
	 * @inheritdoc
	 * @method init
	 */
	init(config) {
		super.init(config);
		this._mode = this._window.hasHistoryAPI() ? MODES.HISTORY : MODES.HASH;
		this._host = config.$Host || this._window.getHost();

		return this;
	}

	/**
	 * @inheritdoc
	 * @method getUrl
	 */
	getUrl() {
		return this._window.getUrl();
	}

	/**
	 * @inheritdoc
	 * @method getPath
	 */
	getPath() {
		return this._extractRoutePath(this._window.getPath());
	}

	/**
	 * @inheritdoc
	 * @method listen
	 */
	listen() {
		var nativeWindow = this._window.getWindow();

		this._setAddressBar(this.getUrl());
		let eventName = EVENTS.POP_STATE;
		this._window.bindEventListener(nativeWindow, eventName, (event) => {

			if (event.state) {
				this.route(this.getPath())
					.then(() => {
						var scroll = event.state.scroll;

						if (scroll) {
							this._pageManager.scrollTo(scroll.x, scroll.y);
						}
					});
			}
		});

		this._window.bindEventListener(nativeWindow, EVENTS.CLICK, (event) => {
			this._handleClick(event);
		});

		return this;
	}

	/**
	 * @inheritdoc
	 * @method redirect
	 */
	redirect(url = '', options = {}) {
		if (this._isSameDomain(url) && this._mode === MODES.HISTORY) {
			var path = url.replace(this.getDomain(), '');
			path = this._extractRoutePath(path);

			this._saveScrollHistory();
			this._setAddressBar(url);
			this.route(path, options);
		} else {
			this._window.redirect(url);
		}
	}

	/**
	 * @inheritdoc
	 * @method route
	 */
	route(path, options = {}) {
		return (
			super
				.route(path, options)
				.catch((error) => {
					return this.handleError({ error });
				})
				.catch((error) => {
					this._handleFatalError(error);
				})
		);
	}

	/**
	 * @inheritdoc
	 * @method handleError
	 */
	handleError(params, options = {}) {
		if ($Debug) {
			console.error(params.error);
		}

		if (this.isClientError(params.error)) {
			return this.handleNotFound(params, options);
		}

		if (this.isRedirection(params.error)) {
			options.httpStatus = params.error.getHttpStatus();
			this.redirect(params.error.getParams().url, options);
			return Promise.resolve({
				content: null,
				status: options.httpStatus,
				error: params.error
			});
		}

		return (
			super
				.handleError(params, options)
				.catch((error) => {
					this._handleFatalError(error);
				})
		);
	}

	/**
	 * @inheritdoc
	 * @method handleNotFound
	 */
	handleNotFound(params, options = {}) {
		return (
			super
				.handleNotFound(params, options)
				.catch((error) => {
					return this.handleError({ error });
				})
		);
	}

	/**
	 * Handle a fatal error application state. IMA handle fatal error when IMA
	 * handle error.
	 *
	 * @private
	 * @method _handleFatalError
	 * @param {Error} error
	 */
	_handleFatalError(error) {
		if ($IMA && typeof $IMA.fatalErrorHandler === 'function') {
			$IMA.fatalErrorHandler(error);
		} else {

			if ($Debug) {
				console.warn('You must implement $IMA.fatalErrorHandler in ' +
						'services.js');
			}
		}
	}

	/**
	 * Handles a click event. The method performs navigation to the target
	 * location of the anchor (if it has one).
	 *
	 * The navigation will be handled by the router if the protocol and domain
	 * of the anchor's target location (href) is the same as the current,
	 * otherwise the method results in a hard redirect.
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
		var isDefinedTargetHref = anchorHref !== undefined &&
				anchorHref !== null;
		var isSetTarget = anchorElement.getAttribute('target') !== null;
		var isLeftButton = event.button === MOUSE_LEFT_BUTTON;
		var isSameDomain = this._isSameDomain(anchorHref);
		var isHashLink = this._isHashLink(anchorHref);
		var isLinkPrevented = event.defaultPrevented;

		if (!isDefinedTargetHref ||
				isSetTarget ||
				!isLeftButton ||
				!isSameDomain ||
				isHashLink ||
				isLinkPrevented) {
			return;
		}

		this._window.preventDefault(event);
		this.redirect(anchorHref);
	}

	/**
	 * The method determines whether an anchor element or a child of an anchor
	 * element has been clicked, and if it was, the method returns anchor
	 * element else null.
	 *
	 * @private
	 * @method _getAnchorElement
	 * @param {Node} target
	 * @return {?Node}
	 */
	_getAnchorElement(target) {
		var self = this;

		while (target && !hasReachedAnchor(target)) {
			target = target.parentNode;
		}

		function hasReachedAnchor(nodeElement) {
			return nodeElement.parentNode &&
					nodeElement !== self._window.getBody() &&
					nodeElement.href !== undefined &&
					nodeElement.href !== null;
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
	 * Sets the provided URL to the browser's address bar by pushing a new
	 * state to the history.
	 *
	 * The state object pushed to the history will be an object with the
	 * following structure: {@code {url: string}}. The {@code url} field will
	 * be set to the provided URL.
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
		var state = { url, scroll };

		this._window.pushState(state, null, url);
	}

	/**
	 * Save user's scroll state to history.
	 *
	 * Replace scroll values in current state for actual scroll values in
	 * document.
	 *
	 * @method _saveScrollHistory
	 */
	_saveScrollHistory() {
		var url = this.getUrl();
		var scroll = {
			x: this._window.getScrollX(),
			y: this._window.getScrollY()
		};
		var state = { url, scroll };

		this._window.replaceState(state, null, url);
	}

	/**
	 * Tests whether the the protocol and domain of the provided URL are the
	 * same as the current.
	 *
	 * @private
	 * @method _isSameDomain
	 * @param {string} [url=''] The URL.
	 * @return {boolean} {@code true} if the protocol and domain of the
	 *         provided URL are the same as the current.
	 */
	_isSameDomain(url = '') {
		return !!url.match(this.getBaseUrl());
	}
}

ns.Core.Router.Client = Client;
