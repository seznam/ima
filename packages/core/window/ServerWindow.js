// @server-side

import ns from '../namespace';
import Window from './Window';

ns.namespace('ima.window');

/**
 * Server-side implementation of the {@code Window} utility API.
 *
 * @class ServerWindow
 * @implements Window
 * @namespace ima.window
 * @module ima
 * @submodule ima.window
 */
export default class ServerWindow extends Window {

	/**
	 * @inheritdoc
	 * @method isClient
	 */
	isClient() {
		return false;
	}

	/**
	 * @inheritdoc
	 * @method isCookieEnabled
	 */
	isCookieEnabled() {
		return false;
	}

	/**
	 * @inheritdoc
	 * @method hasSessionStorage
	 */
	hasSessionStorage() {
		return false;
	}

	/**
	 * @inheritdoc
	 * @method hasWebSocket
	 */
	hasWebSocket() {
		return false;
	}

	/**
	 * @inheritdoc
	 * @method hasHistoryAPI
	 */
	hasHistoryAPI() {
		return false;
	}

	/**
	 * @inheritdoc
	 * @method setTitle
	 */
	setTitle(title) {}

	/**
	 * @inheritdoc
	 * @method getWebSocket
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
	 * @inheritdoc
	 * @method getWindow
	 */
	getWindow() {
		return undefined;
	}

	/**
	 * @inheritdoc
	 * @method getScrollX
	 */
	getScrollX() {
		return 0;
	}

	/**
	 * @inheritdoc
	 * @method getScrollY
	 */
	getScrollY() {
		return 0;
	}

	/**
	 * @inheritdoc
	 * @method scrollTo
	 */
	scrollTo(x, y) {}

	/**
	 * @inheritdoc
	 * @method getDomain
	 */
	getDomain() {
		return '';
	}

	/**
	 * @inheritdoc
	 * @method getHost
	 */
	getHost() {
		return '';
	}

	/**
	 * @inheritdoc
	 * @method getPath
	 */
	getPath() {
		return '';
	}

	/**
	 * @inheritdoc
	 * @method getUrl
	 */
	getUrl() {
		return '';
	}

	/**
	 * @inheritdoc
	 * @method getBody
	 */
	getBody() {
		return undefined;
	}

	/**
	 * @inheritdoc
	 * @method getElementById
	 */
	getElementById(id) {
		return null;
	}

	/**
	 * @inheritdoc
	 * @method querySelector
	 */
	querySelector(selector) {
		return null;
	}

	/**
	 * @inheritdoc
	 * @method querySelectorAll
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
	 * @inheritdoc
	 * @method redirect
	 */
	redirect(url) {}

	/**
	 * @inheritdoc
	 * @method pushState
	 */
	pushState(state, title, url) {}

	/**
	 * @inheritdoc
	 * @method replaceState
	 */
	replaceState(state, title, url) {}

	/**
	 * @inheritdoc
	 * @method createCustomEvent
	 */
	createCustomEvent(name, options) {
		var dummyCustomEvent = { initCustomEvent: () => {}, detail: {} };

		return Object.assign(dummyCustomEvent, options);
	}

	/**
	 * @inheritdoc
	 * @method bindEventListener
	 */
	bindEventListener(eventTarget, event, listener, useCapture = false) {}

	/**
	 * @inheritdoc
	 * @method unbindEventListener
	 */
	unbindEventListener(eventTarget, event, listener, useCapture = false) {}
}

ns.ima.window.ServerWindow = ServerWindow;
