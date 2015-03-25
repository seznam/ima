import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Interface for window helper.
 *
 * @class Window
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Window {

	/**
	 * Return true if is client side code.
	 *
	 * @method isClient
	 */
	isClient() {
	}


	/**
	 * Return true if is session storage supported.
	 *
	 * @method hasSessionStorage
	 */
	hasSessionStorage() {
	}

	/**
	 * Return true if websocket is supported.
	 *
	 * @method hasWebSocket
	 */
	hasWebSocket() {
	}

	/**
	 * Return true if history API is supported.
	 *
	 * @method hasHistoryAPI
	 */
	hasHistoryAPI() {
	}

	/**
	 * Set new page title.
	 *
	 * @method setTitle
	 */
	setTitle() {
	}

	/**
	 * Get WebSocket interface.
	 *
	 * @method getWebSocket
	 */
	getWebSocket() {
	}

	/**
	 * Return object window.
	 *
	 * @method getWindow
	 */
	getWindow() {
	}

	/**
	 * Return current domain.
	 *
	 * @method getDomain
	 */
	getDomain() {
	}

	/**
	 * Return current path.
	 *
	 * @method getPath
	 */
	getPath() {
	}

	/**
	 * Return current url.
	 *
	 * @method getUrl
	 */
	getUrl() {
	}

	/**
	 * Return body element.
	 *
	 * @method getBody
	 */
	getBody() {
	}
	
	/**
	 * Return element by id.
	 *
	 * @method getElementById
	 */
	getElementById() {
	}
	
	/**
	 * Returns the first element within the document that matches the specified group of selectors.
	 *
	 * @method querySelector
	 */
	querySelector() {
	}
	
	/**
	 * Returns a list of the elements within the document that match the specified group of selectors.
	 *
	 * @method querySelectorAll
	 */
	querySelectorAll() {
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 */
	redirect() {
	}
	
	/**
	 * Push state to history API.
	 *
	 * @method pushStateToHistoryAPI
	 */
	pushStateToHistoryAPI() {
	}

	/**
	 * Add event listener.
	 *
	 * @method addEventListener
	 */
	addEventListener() {
	}

	/**
	 * Remove event listener.
	 *
	 * @method removeEventListener
	 */
	removeEventListener() {
	}

	/**
	 * PreventDefault action.
	 *
	 * @method preventDefault
	 */
	preventDefault() {
	}

}

ns.Core.Interface.Window = Window;