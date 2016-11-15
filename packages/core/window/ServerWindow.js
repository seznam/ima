import ns from '../namespace';
import Window from './Window';

ns.namespace('ima.window');

/**
 * Server-side implementation of the {@code Window} utility API.
 */
export default class ServerWindow extends Window {

	static get $dependencies() {
		return [];
	}

	/**
	 * @inheritdoc
	 */
	isClient() {
		return false;
	}

	/**
	 * @inheritdoc
	 */
	isCookieEnabled() {
		return false;
	}

	/**
	 * @inheritdoc
	 */
	hasSessionStorage() {
		return false;
	}

	/**
	 * @inheritdoc
	 */
	hasWebSocket() {
		console.warn(
			'DEPRECATION WARNING: All browsers currently supported by ' +
			'IMA.js support web sockets and the web sockets should not be ' +
			'used at the server-side unless polyfilled.'
		);
		return false;
	}

	/**
	 * @inheritdoc
	 */
	hasHistoryAPI() {
		console.warn(
			'DEPRECATION WARNING: The history API should never be ' +
			'manipulated directly in an IMA.js application, and all ' +
			'browsers supported by IMA.js support the history API. The ' +
			'history API should not be used at the server-side anyway.'
		);
		return false;
	}

	/**
	 * @inheritdoc
	 */
	setTitle(title) {}

	/**
	 * @inheritdoc
	 */
	getWebSocket() {
		console.warn(
			'DEPRECATION WARNING: All browsers currently supported by ' +
			'IMA.js support web sockets, this helper should not be used. ' +
			'When used at the server-side, this method should fail unless ' +
			'web sockets are polyfilled by a 3rd party library, but it ' +
			'always returns a dummy web socket-like object.'
		);

		class DummyWebSocket {
			open() {}
			close() {}
			send() {}
		}

		return DummyWebSocket;
	}

	/**
	 * @inheritdoc
	 */
	getWindow() {
		return undefined;
	}

	/**
	 * @inheritdoc
	 */
	getDocument() {
		return undefined;
	}

	/**
	 * @inheritdoc
	 */
	getScrollX() {
		return 0;
	}

	/**
	 * @inheritdoc
	 */
	getScrollY() {
		return 0;
	}

	/**
	 * @inheritdoc
	 */
	scrollTo(x, y) {}

	/**
	 * @inheritdoc
	 */
	getDomain() {
		return '';
	}

	/**
	 * @inheritdoc
	 */
	getHost() {
		return '';
	}

	/**
	 * @inheritdoc
	 */
	getPath() {
		return '';
	}

	/**
	 * @inheritdoc
	 */
	getUrl() {
		return '';
	}

	/**
	 * @inheritdoc
	 */
	getBody() {
		return undefined;
	}

	/**
	 * @inheritdoc
	 */
	getElementById(id) {
		return null;
	}

	/**
	 * @inheritdoc
	 */
	querySelector(selector) {
		return null;
	}

	/**
	 * @inheritdoc
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
	 */
	redirect(url) {}

	/**
	 * @inheritdoc
	 */
	pushState(state, title, url) {}

	/**
	 * @inheritdoc
	 */
	replaceState(state, title, url) {}

	/**
	 * @inheritdoc
	 */
	createCustomEvent(name, options) {
		let dummyCustomEvent = { initCustomEvent: () => {}, detail: {} };

		return Object.assign(dummyCustomEvent, options);
	}

	/**
	 * @inheritdoc
	 */
	bindEventListener(eventTarget, event, listener, useCapture = false) {}

	/**
	 * @inheritdoc
	 */
	unbindEventListener(eventTarget, event, listener, useCapture = false) {}
}

ns.ima.window.ServerWindow = ServerWindow;
