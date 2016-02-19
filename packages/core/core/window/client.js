import ns from 'imajs/client/core/namespace';
import WindowInterface from 'imajs/client/core/interface/window';

ns.namespace('Core.Window');

/**
 * Client-side implementation of the {@code Core.Interface.Window} utility API.
 *
 * @class Client
 * @implements Core.Interface.Window
 * @namespace Core.Window
 * @module Core
 * @submodule Core.Window
 */
export default class Client extends WindowInterface {

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
		return window.WebSocket || window.MozWebSocket;
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
		return window.WebSocket || window.MozWebSocket;
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
		} else {
			if (eventTarget.attachEvent) {
				eventTarget.attachEvent(`on${event}`, listener);
			}
		}
	}

	/**
	 * @inheritdoc
	 * @method unbindEventListener
	 */
	unbindEventListener(eventTarget, event, listener, useCapture = false) {
		if (eventTarget.removeEventListener) {
			eventTarget.removeEventListener(event, listener, useCapture);
		} else {
			if (eventTarget.detachEvent) {
				eventTarget.detachEvent(`on${event}`, listener);
			}
		}
	}

	/**
	 * @inheritdoc
	 * @method preventDefault
	 */
	preventDefault(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	}
}

ns.Core.Window.Client = Client;
