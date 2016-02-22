import ns from 'ima/namespace';
import WindowInterface from 'ima/window/window';

ns.namespace('Ima.Window');

/**
 * Server-side implementation of the {@code Ima.Window.Window} utility API.
 *
 * @class ServerWindow
 * @implements ns.Ima.Window.Window
 * @namespace Ima.Window
 * @module Ima
 * @submodule Ima.Window
 */
export default class ServerWindow extends WindowInterface {

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

	/**
	 * @inheritdoc
	 * @method preventDefault
	 */
	preventDefault(event) {}
}

ns.Ima.Window.ServerWindow = ServerWindow;
