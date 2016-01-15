import ns from 'imajs/client/core/namespace';
import WindowInterface from 'imajs/client/core/interface/window';

ns.namespace('Core.Window');

/**
 * Server-side implementation of the {@code Core.Interface.Window} utility API.
 *
 * @class Server
 * @implements ns.Core.Interface.Window
 * @namespace Core.Window
 * @module Core
 * @submodule Core.Window
 */
export default class Server extends WindowInterface {

	/**
	 * @inheritDoc
	 * @override
	 * @method isClient
	 * @return {boolean}
	 */
	isClient() {
		return false;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method isCookieEnabled
	 * @return {boolean}
	 */
	isCookieEnabled() {
		return false;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method hasSessionStorage
	 * @return {boolean}
	 */
	hasSessionStorage() {
		return false;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method hasWebSocket
	 * @return {boolean}
	 */
	hasWebSocket() {
		return false;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method hasHistoryAPI
	 * @return {boolean}
	 */
	hasHistoryAPI() {
		return false;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setTitle
	 * @param {string} title
	 */
	setTitle(title) {}

	/**
	 * @inheritDoc
	 * @override
	 * @method getWebSocket
	 * @return {function(new: WebSocket)}
	 */
	getWebSocket() {
		class DummyWebSocket {
			open() {}
			close() {}
			send() {}
		}

		return DummyWebSocket;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getWindow
	 * @return {(undefined|Window)}
	 */
	getWindow() {
		return undefined;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getScrollX
	 * @return {number}
	 */
	getScrollX() {
		return 0;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getScrollY
	 * @return {number}
	 */
	getScrollY() {
		return 0;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} x
	 * @param {number} y
	 */
	scrollTo(x, y) {}

	/**
	 *  @inheritDoc
	 * @override
	 * @method getDomain
	 * @return {string}
	 */
	getDomain() {
		return '';
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getHost
	 * @return {string}
	 */
	getHost() {
		return '';
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		return '';
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getUrl
	 * @return {string}
	 */
	getUrl() {
		return '';
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getBody
	 * @return {(undefined|HTMLBodyElement)}
	 */
	getBody() {
		return undefined;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getElementById
	 * @param {string} id
	 * @return {?HTMLElement}
	 */
	getElementById(id) {
		return null;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method querySelector
	 * @param {string} selector
	 * @return {?HTMLElement}
	 */
	querySelector(selector) {
		return null;
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method querySelectorAll
	 * @param {string} selector
	 * @return {NodeList}
	 */
	querySelectorAll(selector) {
		class DummyNodeList {
			constructor() {
				this.length = 0;
			}

			item() {
				return null;
			}
		}

		return new DummyNodeList();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method redirect
	 * @param {string} url
	 */
	redirect(url) {}

	/**
	 * @inheritDoc
	 * @override
	 * @method pushState
	 * @param {Object<string, *>} state
	 * @param {string} title
	 * @param {string} url
	 */
	pushState(state, title, url) {}

	/**
	 * @inheritDoc
	 * @override
	 * @method replaceState
	 * @param {Object<string, *>} state
	 * @param {string} title
	 * @param {string} url
	 */
	replaceState(state, title, url) {}

	/**
	 * @inheritDoc
	 * @override
	 * @method createCustomEvent
	 * @param {string} name
	 * @param {Object<string, *>} options
	 * @return {CustomEvent}
	 */
	createCustomEvent(name, options) {
		var dummyCustomEvent = { initCustomEvent: () => {}, detail: {} };

		return Object.assign(dummyCustomEvent, options);
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
	bindEventListener(eventTarget, event, listener, useCapture = false) {}

	/**
	 * @inheritDoc
	 * @override
	 * @method unbindEventListener
	 * @param {EventTarget} eventTarget
	 * @param {string} event
	 * @param {function(Event)} listener
	 * @param {boolean=} [useCapture=false]
	 */
	unbindEventListener(eventTarget, event, listener, useCapture = false) {}

	/**
	 * @inheritDoc
	 * @override
	 * @method preventDefault
	 * @param {Event} event
	 */
	preventDefault(event) {}
}

ns.Core.Window.Server = Server;
