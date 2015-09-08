import ns from 'imajs/client/core/namespace';

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
export default class Client extends ns.Core.Interface.Window {

	/**
	 * @inheritDoc
	 * @override
	 * @method isClient
	 * @return {boolean}
	 */
	isClient() {
		return true;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method isCookieEnabled
	 * @return {boolean}
	 */
	isCookieEnabled() {
		return navigator.cookieEnabled;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method hasSessionStorage
	 * @return {boolean}
	 */
	hasSessionStorage() {
		if (window.sessionStorage) {
			var sessionKey = 'IMA.jsTest';

			try {
				sessionStorage.setItem(sessionKey, 1);
				sessionStorage.removeItem(sessionKey);
			} catch(e) {
				return false;
			}

			return true;
		}
		return false;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method hasWebSocket
	 * @return {boolean}
	 */
	hasWebSocket() {
		return window.WebSocket || window.MozWebSocket;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method hasHistoryAPI
	 * @return {boolean}
	 */
	hasHistoryAPI() {
		return !!window.history && !!window.history.pushState;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setTitle
	 * @param {string} title
	 */
	setTitle(title) {
		document.title = title;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getWebSocket
	 * @return {function(new: WebSocket)}
	 */
	getWebSocket() {
		return window.WebSocket || window.MozWebSocket;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getWindow
	 * @return {(undefined|Window)}
	 */
	getWindow() {
		return window;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getScrollX
	 * @return {number}
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
	 * @inheritDoc
	 * @override
	 * @method getScrollY
	 * @return {number}
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
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} x
	 * @param {number} y
	 */
	scrollTo(x, y) {
		window.scrollTo(x, y);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getDomain
	 * @return {string}
	 */
	getDomain() {
		return window.location.protocol + '//' + window.location.host;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getHost
	 * @return {string}
	 */
	getHost() {
		return window.location.host;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return window.location.pathname + window.location.search;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getUrl
	 * @return {string}
	 */
	getUrl() {
		return window.location.href;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getBody
	 * @return {(undefined|HTMLBodyElement)}
	 */
	getBody() {
		return document.body;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getElementById
	 * @param {string} id
	 * @return {?HTMLElement}
	 */
	getElementById(id) {
		return document.getElementById(id);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method querySelector
	 * @param {string} selector
	 * @return {?HTMLElement}
	 */
	querySelector(selector) {
		return document.querySelector(selector);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method querySelectorAll
	 * @param {string} selector
	 * @return {NodeList}
	 */
	querySelectorAll(selector) {
		return document.querySelectorAll(selector);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method redirect
	 * @param {string} url
	 */
	redirect(url) {
		window.location.href = url;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method pushState
	 * @param {Object<string, *>} state
	 * @param {string} title
	 * @param {string} url
	 */
	pushState(state, title, url) {
		window.history.pushState(state, title, url);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method replaceState
	 * @param {Object<string, *>} state
	 * @param {string} title
	 * @param {string} url
	 */
	replaceState(state, title, url) {
		window.history.replaceState(state, title, url);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method createCustomEvent
	 * @param {string} name
	 * @param {Object<string, *>} options
	 * @return {CustomEvent}
	 */
	createCustomEvent(name, options) {
		return new CustomEvent(name, options);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method bindEventListener
	 * @param {EventTarget} eventTarget
	 * @param {string} event
	 * @param {function(Event)} listener
	 * @param {boolean=} [useCapture=false]
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
	 * @inheritDoc
	 * @override
	 * @method unbindEventListener
	 * @param {EventTarget} eventTarget
	 * @param {string} event
	 * @param {function(Event)} listener
	 * @param {boolean=} [useCapture=false]
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
	 * @inheritDoc
	 * @override
	 * @method preventDefault
	 * @param {Event} event
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
