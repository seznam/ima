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
	 * Returns true if is client side code.
	 *
	 * @method isClient
	 */
	isClient() {
	}

	/**
	 * Returns true if cookie is enabled.
	 *
	 * @method isCookieEnabled
	 * @return {boolean}
	 */
	isCookieEnabled() {
	}


	/**
	 * Returns true if is session storage supported.
	 *
	 * @method hasSessionStorage
	 */
	hasSessionStorage() {
	}

	/**
	 * Returns true if websocket is supported.
	 *
	 * @method hasWebSocket
	 */
	hasWebSocket() {
	}

	/**
	 * Returns true if history API is supported.
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
	 * Returns object window.
	 *
	 * @method getWindow
	 */
	getWindow() {
	}

	/**
	 * Returns current domain.
	 *
	 * @method getDomain
	 */
	getDomain() {
	}

	/**
	 * Returns current path.
	 *
	 * @method getPath
	 */
	getPath() {
	}

	/**
	 * Returns current url.
	 *
	 * @method getUrl
	 */
	getUrl() {
	}

	/**
	 * Returns body element.
	 *
	 * @method getBody
	 */
	getBody() {
	}
	
	/**
	 * Returns element by id.
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