import ns from 'core/namespace/ns.js';

ns.namespace('Core.Router');

/**
 * @class ClientHandler
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class ClientHandler extends ns.Core.Abstract.Router {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.PageRender} pageRender
	 * @param {Core.Interface.Window} window
	 */
	constructor(pageRender, window) {
		super(pageRender);

		/**
		 * @property _window
		 * @type {Core.Interface.Window}
		 * @default window
		 */
		this._window = window;

	}

	/**
	 * Initialization router.
	 *
	 * @method init
	 * @chainable
	 * @param {Object} config
	 * @return {this}
	 */
	init(config = {}) {
		this._mode = config.mode === this.MODE_HISTORY && this._window.hasHistoryAPI() ? this.MODE_HISTORY : this.MODE_HASH;
		this._domain = config.domain || this._window.getDomain();

		return this;
	}

	/**
	 * Get current path.
	 *
	 * @method getPath
	 * @return {string}
	 */
	getPath() {
		var path = '';

		switch(this._mode) {
			case this.MODE_HISTORY:
				path = decodeURI(window.location.pathname + window.location.search);
				break;

			case this.MODE_HASH:
				var match = this._window.getUrl().match(/#!\/(.*)$/);
				path = match ? match[1] : '/';
				break;
		}

		return path;
	}

	/**
	 * Attach event to window.
	 *
	 * @method listen
	 * @chainable
	 * @return {this}
	 */
	listen() {
		var window = this._window.getWindow();

		if (this._mode === this.MODE_HISTORY) {
			this._window.addEventListener(window, 'popstate', () => {
				this.route(this.getPath());
			});
		}

		if (this._mode === this.MODE_HASH) {
			this._window.addEventListener(window, 'hashchange', () => {
				this.route(this.getPath());
			});
		}

		this._window.addEventListener(window, 'click', (e)=> {
			var target = e.target || e.srcElement;
			var targetHref = target.href;

			//find close a element with href
			while(target && target.parentNode && (target !== this._window.getBody()) && (typeof targetHref === 'undefined' || targetHref === null)) {
				target = target.parentNode;
				targetHref = target.href;
			}

			if (typeof targetHref !== 'undefined' && targetHref !== null) {
				var isSameDomain = targetHref.match(this._domain);

				if (isSameDomain) {
					this._window.preventDefault(e);
					var path = targetHref.replace(this._domain, '');
					this._navigate(path);
				}
			}
		});

		return this;
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 * @param {string} url
	 */
	redirect(url) {
		var isSameDomain = url.match(this._domain);

		if (isSameDomain) {
			var redirectPath = url.replace(this._domain, '');
			this._navigate(redirectPath);
		} else {
			this._window.redirect(url);
		}
	}

	/**
	 * Normalize path by clear slashes.
	 *
	 * @method _clearSlashes
	 * @param {string} path
	 */
	_clearSlashes(path) {
		return path.tostring().replace(/\/$/, '').replace(/^\//, '');
	}

	/**
	 * Set path to url in address bar and change state for path.
	 *
	 * @method _navigate
	 * @private
	 * @param {string} [path='']
	 */
	_navigate(path = '') {
		this.route(path)
			.catch((error) => {
				this.handleError(error);
			});

		path = `/${this._clearSlashes(path)}`;

		if (this._mode === this.MODE_HISTORY) {
			this._window.pushStateToHistoryAPI(null, null, this._domain + path);
		} else {
			this._window.redirect(`${this._domain}/#!${path}`);
		}
	}
}

ns.Core.Router.ClientHandler = ClientHandler;
