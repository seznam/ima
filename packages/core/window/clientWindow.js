// @client-side

import ns from 'ima/namespace';
import WindowInterface from 'ima/window/window';

ns.namespace('ima.window');

/**
 * Client-side implementation of the {@code ima.window.Window} utility API.
 *
 * @class ClientWindow
 * @implements ima.window.Window
 * @namespace ima.window
 * @module ima
 * @submodule ima.window
 */
export default class ClientWindow extends WindowInterface {

	/**
	 * @inheritdoc
	 * @method isClient
	 */
	isClient() {
		return true;
	}

	/**
	 * @inheritdoc
	 * @method isCookieEnabled
	 */
	isCookieEnabled() {
		return navigator.cookieEnabled;
	}

	/**
	 * @inheritdoc
	 * @method hasSessionStorage
	 */
	hasSessionStorage() {
		if (window.sessionStorage) {
			var sessionKey = 'IMA.jsTest';

			try {
				sessionStorage.setItem(sessionKey, 1);
				sessionStorage.removeItem(sessionKey);
			} catch (e) {
				return false;
			}

			return true;
		}
		return false;
	}

	/**
	 * @inheritdoc
	 * @method hasWebSocket
	 */
	hasWebSocket() {
		return window.WebSocket;
	}

	/**
	 * @inheritdoc
	 * @method hasHistoryAPI
	 */
	hasHistoryAPI() {
		return !!window.history && !!window.history.pushState;
	}

	/**
	 * @inheritdoc
	 * @method setTitle
	 */
	setTitle(title) {
		document.title = title;
	}

	/**
	 * @inheritdoc
	 * @method getWebSocket
	 */
	getWebSocket() {
		return window.WebSocket;
	}

	/**
	 * @inheritdoc
	 * @method getWindow
	 */
	getWindow() {
		return window;
	}

	/**
	 * @inheritdoc
	 * @method getScrollX
	 */
	getScrollX() {
		var pageOffsetSupported = window.pageXOffset !== undefined;
		var isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

		return pageOffsetSupported ? window.pageXOffset :
				(
					isCSS1Compatible ?
					document.documentElement.scrollLeft :
					document.body.scrollLeft
				);
	}

	/**
	 * @inheritdoc
	 * @method getScrollY
	 */
	getScrollY() {
		var pageOffsetSupported = window.pageYOffset !== undefined;
		var isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

		return pageOffsetSupported ? window.pageYOffset :
				(
					isCSS1Compatible ?
					document.documentElement.scrollTop :
					document.body.scrollTop
				);
	}

	/**
	 * @inheritdoc
	 * @method scrollTo
	 */
	scrollTo(x, y) {
		window.scrollTo(x, y);
	}

	/**
	 * @inheritdoc
	 * @method getDomain
	 */
	getDomain() {
		return window.location.protocol + '//' + window.location.host;
	}

	/**
	 * @inheritdoc
	 * @method getHost
	 */
	getHost() {
		return window.location.host;
	}

	/**
	 * @inheritdoc
	 * @method getPath
	 */
	getPath() {
		return window.location.pathname + window.location.search;
	}

	/**
	 * @inheritdoc
	 * @method getUrl
	 */
	getUrl() {
		return window.location.href;
	}

	/**
	 * @inheritdoc
	 * @method getBody
	 */
	getBody() {
		return document.body;
	}

	/**
	 * @inheritdoc
	 * @method getElementById
	 */
	getElementById(id) {
		return document.getElementById(id);
	}

	/**
	 * @inheritdoc
	 * @method querySelector
	 */
	querySelector(selector) {
		return document.querySelector(selector);
	}

	/**
	 * @inheritdoc
	 * @method querySelectorAll
	 */
	querySelectorAll(selector) {
		return document.querySelectorAll(selector);
	}

	/**
	 * @inheritdoc
	 * @method redirect
	 */
	redirect(url) {
		window.location.href = url;
	}

	/**
	 * @inheritdoc
	 * @method pushState
	 */
	pushState(state, title, url) {
		if (window.history.pushState) {
			window.history.pushState(state, title, url);
		}
	}

	/**
	 * @inheritdoc
	 * @method replaceState
	 */
	replaceState(state, title, url) {
		if (window.history.replaceState) {
			window.history.replaceState(state, title, url);
		}
	}

	/**
	 * @inheritdoc
	 * @method createCustomEvent
	 */
	createCustomEvent(name, options) {
		return new CustomEvent(name, options);
	}

	/**
	 * @inheritdoc
	 * @method bindEventListener
	 */
	bindEventListener(eventTarget, event, listener, useCapture = false) {
		if (eventTarget.addEventListener) {
			eventTarget.addEventListener(event, listener, useCapture);
		}
	}

	/**
	 * @inheritdoc
	 * @method unbindEventListener
	 */
	unbindEventListener(eventTarget, event, listener, useCapture = false) {
		if (eventTarget.removeEventListener) {
			eventTarget.removeEventListener(event, listener, useCapture);
		}
	}
}

ns.ima.window.ClientWindow = ClientWindow;
