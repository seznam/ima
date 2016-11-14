// @client-side

import ns from '../namespace';
import AbstractRouter from './AbstractRouter';
import RouteFactory from './RouteFactory';
import Router from './Router';
import Dispatcher from '../event/Dispatcher';
import PageManager from '../page/manager/PageManager';
import Window from '../window/Window';

ns.namespace('ima.router');

/**
 * Names of the DOM events the router responds to.
 *
 * @enum {string}
 * @type {Object<string, string>}
 */
const Events = Object.freeze({
	/**
	 * Name of the event produced when the user clicks the page using the
	 * mouse, or touches the page and the touch event is not stopped.
	 *
	 * @const
	 * @type {string}
	 */
	CLICK: 'click',

	/**
	 * Name of the event fired when the user navigates back in the history.
	 *
	 * @const
	 * @type {string}
	 */
	POP_STATE: 'popstate'
});

/**
 * Address bar content manipulation modes.
 *
 * @enum {string}
 * @type {Object<string, string>}
 */
const Modes = Object.freeze({
	/**
	 * Address bar manipulation mode in which the current URL in the address
	 * bar is being udpated using the session history management API.
	 *
	 * @const
	 * @type {string}
	 */
	HISTORY: 'history',

	/**
	 * Address bar manipulation mode in which the current URL in the address
	 * bar is being udpated by modifying the {@code hash} part.
	 *
	 * @const
	 * @type {string}
	 */
	HASH: 'hash'
});

/**
 * The number used as the index of the mouse left button in DOM
 * {@code MouseEvent}s.
 *
 * @const
 * @type {number}
 */
const MOUSE_LEFT_BUTTON = 0;

/**
 * The client-side implementation of the {@codelink Router} interface.
 */
export default class ClientRouter extends AbstractRouter {

	static get $dependencies() {
		return [PageManager, RouteFactory, Dispatcher, Window];
	}

	/**
	 * Initializes the client-side router.
	 *
	 * @param {PageManager} pageManager The page manager handling UI rendering,
	 *        and transitions between pages if at the client side.
	 * @param {RouteFactory} factory Factory for routes.
	 * @param {Dispatcher} dispatcher Dispatcher fires events to app.
	 * @param {Window} window The current global client-side APIs provider.
	 */
	constructor(pageManager, factory, dispatcher, window) {
		super(pageManager, factory, dispatcher);

		/**
		 * Helper for accessing the native client-side APIs.
		 *
		 * @type {Window}
		 */
		this._window = window;
	}

	/**
	 * @inheritdoc
	 */
	init(config) {
		super.init(config);
		this._host = config.$Host || this._window.getHost();

		return this;
	}

	/**
	 * @inheritdoc
	 */
	getUrl() {
		return this._window.getUrl();
	}

	/**
	 * @inheritdoc
	 */
	getPath() {
		return this._extractRoutePath(this._window.getPath());
	}

	/**
	 * @inheritdoc
	 */
	listen() {
		let nativeWindow = this._window.getWindow();

		this._saveScrollHistory();
		let eventName = Events.POP_STATE;
		this._window.bindEventListener(nativeWindow, eventName, (event) => {
			if (event.state) {
				this.route(this.getPath())
					.then(() => {
						let scroll = event.state.scroll;

						if (scroll) {
							this._pageManager.scrollTo(scroll.x, scroll.y);
						}
					});
			}
		});

		this._window.bindEventListener(nativeWindow, Events.CLICK, (event) => {
			this._handleClick(event);
		});

		return this;
	}

	/**
	 * @inheritdoc
	 */
	redirect(url = '', options = {}) {
		if (this._isSameDomain(url)) {
			let path = url.replace(this.getDomain(), '');
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
	 * @param {MouseEvent} event The click event.
	 */
	_handleClick(event) {
		let target = event.target || event.srcElement;
		let anchorElement = this._getAnchorElement(target);

		if (!anchorElement) {
			return;
		}

		let anchorHref = anchorElement.href;
		let isDefinedTargetHref = anchorHref !== undefined &&
				anchorHref !== null;
		let isSetTarget = anchorElement.getAttribute('target') !== null;
		let isLeftButton = event.button === MOUSE_LEFT_BUTTON;
		let isCtrlPlusLeftButton = event.ctrlKey && isLeftButton;
		let isCMDPlusLeftButton = event.metaKey && isLeftButton;
		let isSameDomain = this._isSameDomain(anchorHref);
		let isHashLink = this._isHashLink(anchorHref);
		let isLinkPrevented = event.defaultPrevented;

		if (!isDefinedTargetHref ||
				isSetTarget ||
				!isLeftButton ||
				!isSameDomain ||
				isHashLink ||
				isCtrlPlusLeftButton ||
				isCMDPlusLeftButton ||
				isLinkPrevented) {
			return;
		}

		event.preventDefault();
		this.redirect(anchorHref);
	}

	/**
	 * The method determines whether an anchor element or a child of an anchor
	 * element has been clicked, and if it was, the method returns anchor
	 * element else null.
	 *
	 * @param {Node} target
	 * @return {?Node}
	 */
	_getAnchorElement(target) {
		let self = this;

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
	 * @param {string} targetUrl The target URL.
	 * @return {boolean} {@code true} if the navigation to target URL would
	 *         result only in updating the hash fragment of the current URL.
	 */
	_isHashLink(targetUrl) {
		if (targetUrl.indexOf('#') === -1) {
			return false;
		}

		let currentUrl = this._window.getUrl();
		let trimmedCurrentUrl = currentUrl.indexOf('#') === -1 ? currentUrl :
				currentUrl.substring(0, currentUrl.indexOf('#'));
		let trimmedTargetUrl = targetUrl.substring(0, targetUrl.indexOf('#'));

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
	 * @param {string} url The URL.
	 */
	_setAddressBar(url) {
		let scroll = {
			x: 0,
			y: 0
		};
		let state = { url, scroll };

		this._window.pushState(state, null, url);
	}

	/**
	 * Save user's scroll state to history.
	 *
	 * Replace scroll values in current state for actual scroll values in
	 * document.
	 */
	_saveScrollHistory() {
		let url = this.getUrl();
		let scroll = {
			x: this._window.getScrollX(),
			y: this._window.getScrollY()
		};
		let state = { url, scroll };

		this._window.replaceState(state, null, url);
	}

	/**
	 * Tests whether the the protocol and domain of the provided URL are the
	 * same as the current.
	 *
	 * @param {string=} [url=''] The URL.
	 * @return {boolean} {@code true} if the protocol and domain of the
	 *         provided URL are the same as the current.
	 */
	_isSameDomain(url = '') {
		return !!url.match(this.getBaseUrl());
	}
}

ns.ima.router.ClientRouter = ClientRouter;
