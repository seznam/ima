import ns from 'core/namespace/ns.js';

ns.namespace('Core.Router');

/**
 * @class Handler
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 * */
class Handler {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.PageRender} pageRender
	 * @param {Core.Router.Request} request
	 * @param {Core.Router.Respond} respond
	 * @example
	 *      router.link('article', {articleId: 1});
	 * @example
	 *      router.redirect('article', {articleId: 1});
	 * */
	constructor(pageRender, request, respond) {

		/**
		 * Keep all routes.
		 *
		 * @property _routes
		 * @private
		 * @type {Array}
		 * @default []
		 * */
		this._routes = [];

		/**
		 * Flag for _mode.
		 *
		 * @property mode
		 * @private
		 * @type {String}
		 * @default null
		 * */
		this._mode = null;

		/**
		 * Current domain.
		 *
		 * @property _domain
		 * @private
		 * @type {String}
		 * @default null
		 * */
		this._domain = null;

		/**
		 * @property _pageRender
		 * @private
		 * @type {Core.Base.PageRender}
		 * @default pageRender
		 * */
		this._pageRender = pageRender;

		/**
		 * @property _request
		 * @private
		 * @type {Core.Router.Request}
		 * @default request
		 * */
		this._request = request;

		/**
		 * @property _respond
		 * @private
		 * @type {Core.Router.Respond}
		 * @default respond
		 * */
		this._respond = respond;

		/**
		 * @property MOD_HISTORY
		 * @const
		 * @type {String}
		 * @default 'history'
		 * */
		this.MOD_HISTORY = 'history';

		/**
		 * @property MOD_HASH
		 * @const
		 * @type {String}
		 * @default 'hash'
		 * */
		this.MOD_HASH = 'hash';

		/**
		 * @property MOD_SERVER
		 * @const
		 * @type {String}
		 * @default 'server'
		 * */
		this.MOD_SERVER = 'server';

		this.clear();
	}

	/**
	 * Initialization router.
	 *
	 * @method init
	 * @chainable
	 * @param {Object} [config={}]
	 * @return {this}
	 * */
	init(config = {}) {
		this.config = config;

		if (this.config.mode === this.MOD_SERVER) {
			this._mode = this.MOD_SERVER;
			this._domain = this.config.domain;
		} else {
			this._mode = this.config.mode === this.MOD_HISTORY && !!(history) && !!(history.pushState) ? this.MOD_HISTORY : this.MOD_HASH;
			this._domain = this.config.domain || window.location.protocol + '//' + window.location.host;
		}

		return this;
	}

	/**
	 * Clear all setting in router.
	 * 
	 * @method clear
	 * @chainable
	 * @return {this}
	 * */
	clear() {
		this._routes = [];
		this._mode = null;
		this._domain = null;

		return this;
	}

	/**
	 * Add route to router.
	 *
	 * @method add
	 * @chainable
	 * @param {String} name
	 * @param {String} path
	 * @param {String} controller
	 * @return {this}
	 * */
	add(name, path, controller) {
		this._routes.push(ns.oc.create('$Route', name, path, controller));

		return this;
	}

	/**
	 * Remove path from router.
	 *
	 * @method remove
	 * @chainable
	 * @param {String} path
	 * @return {this}
	 * */
	remove(path) {
		for (var i = 0; i < this._routes.length; i++) {

			if (this._routes[i].getPath() === path) {
				this._routes.splice(i, 1);
				return this;
			}
		}

		return this;
	}

	/**
	 * Get route by name.
	 *
	 * @method getRouteByName
	 * @param {String} routeName
	 * @return {Core.Router.Data|null}
	 * */
	getRouteByName(routeName) {
		for (var i = 0; i < this._routes.length; i++) {
			var route = this._routes[i];

			if (route.getName() === routeName) {
				return route;
			}
		}

		return null;
	}

	/**
	 * Get current path.
	 *
	 * @method getPath
	 * @return {String}
	 * */
	getPath() {
		var path = '';

		switch(this._mode) {
			case this.MOD_SERVER:
				path = this._request.isEnabled() ? this._request.getPath() : '';
				break;

			case this.MOD_HISTORY:
				path = decodeURI(window.location.pathname + window.location.search);
				break;

			case this.MOD_HASH:
				var match = window.location.href.match(/#!\/(.*)$/);
				path = match ? match[1] : '/';
				break;
		}

		return path;
	}

	/**
	 * Get current all url.
	 *
	 * @method getUrl
	 * */
	getUrl() {
		return this._domain + this.getPath();
	}

	/**
	 * Attach event to window.
	 *
	 * @method listen
	 * @chainable
	 * @return {this}
	 * */
	listen() {

		if (this._mode === this.MOD_HISTORY) {
			this._addEventListener(window, 'popstate', ()=> {
				this.route(this.getPath());
			});
		}

		if (this._mode === this.MOD_HASH) {
			this._addEventListener(window, 'hashchange', ()=> {
				this.route(this.getPath());
			});
		}

		if (this._mode !== this.MOD_SERVER) {
			this._addEventListener(window, 'click', (e)=> {
				var target = e.target || e.srcElement;
				var targetHref = target.href;

				//find close a element with href
				while(target && target.parentNode && (target !== document.body) && (typeof targetHref === 'undefined' || targetHref === null)) {
					target = target.parentNode;
					targetHref = target.href;
				}

				if (typeof targetHref !== 'undefined' && targetHref !== null) {
					var isOurDomain = targetHref.match(this._domain);

					if (isOurDomain) {
						this._preventDefault(e);
						var path = targetHref.replace(this._domain, '');
						this._navigate(path);
					}
				}
			});
		}
		
		return this;
	}

	/**
	 * Redirect to route's name with params.
	 *
	 * @method redirect
	 * @param {String} routeName - alias for route
	 * @param {Object} [params={}]
	 * */
	redirect(routeName, params = {}) {
		var redirectPath = this.link(routeName, params);

		if (this._respond.isEnabled()) {
			this._respond.redirect(this._domain + redirectPath);
		} else {
			this._navigate(redirectPath);
		}

	}

	/**
	 * Return link for route's name with params.
	 *
	 * @method link
	 * @param {String} routeName - alias for route
	 * @param {Object} params
	 * @return {String}
	 * */
	link(routeName, params) {
		var route = this.getRouteByName(routeName);

		if (!route) {
			throw new Error(`Core.Router:link has undefined route with name ${routeName}. Add new route with that name.`);
		}

		return route.createPath(params);
	}

	/**
	 * Handle path by router.
	 *
	 * @method route
	 * @param {String} path
	 * */
	route(path) {
		var routeForPath = this._getRouteByPath(path);
		var params = null;

		if (routeForPath) {
			var controller = routeForPath.getController();
			params = routeForPath.getParams(path);

			this._pageRender.render(controller, params, this._request , this._respond);
		} else {
			params = {path};

			this.handleNotFound(params);
		}
	}

	/**
	 * Handle Error that call 'error' controller with params.
	 *
	 * @method handleError
	 * @param {Object} params
	 * */
	handleError(params) {
		this._handle('error', params);
	}
	
	/**
	 * Handle Not Found path that call 'notFound' controller with params.
	 *
	 * @method handleNotFound
	 * @param {Object} params
	 * */
	handleNotFound(params) {
		this._handle('notFound', params);
	}

	/**
	 * Handle route's name with params.
	 *
	 * @method _handle
	 * @private
	 * @param {String} routeName - route alias
	 * @param {Object} params
	 * */
	_handle(routeName, params) {
		var handleRoute = this.getRouteByName(routeName);

		if (!handleRoute) {
			throw new Error(`Core.Router:_handle has undefined route. Add new route with name '${routeName}'.`);
		}
		var controller = handleRoute.getController();

		this._pageRender.render(controller, params, this._request, this._respond);
	}


	/**
	 * Set path to url in address bar and change state for path. 
	 *
	 * @method _navigate
	 * @private
	 * @param {String} [path='']
	 * */
	_navigate(path = '') {
		this.route(path);

		path = `/${this._clearSlashes(path)}`;

		if (this._mode === this.MOD_HISTORY) {
			history.pushState(null, null, this._domain + path);
		} else {
			window.location.href = `${window.location.href.replace(/#!(.*)$/, '')}#!${path}`;
		}
	}

	/**
	 * Normalize path by clear slashes.
	 *
	 * @method _clearSlashes
	 * @param {String} path
	 * */
	_clearSlashes(path) {
		return path.toString().replace(/\/$/, '').replace(/^\//, '');
	}

	/**
	 * Return Route by path.
	 *
	 * @method _getRouteByPath
	 * @param {String} path
	 * @return {Core.Router.Data|null}
	 * */
	_getRouteByPath(path) {
		for (var i = this._routes.length - 1; i >= 0; i--) {
			var route = this._routes[i];

			if (route.isMatch(path)) {
				return route;
			}
		}

		return null;
	}

	/**
	 * Polyfill for addEventListener.
	 *
	 * @method _addEventListener
	 * @private
	 * @param {DOMElement} element
	 * @param {String} event
	 * @param {Function} handler
	 * */
	_addEventListener(element, event, handler) {
		if (element.addEventListener) {
			element.addEventListener(event, handler);
		} else {
			element.attachEvent(`on${event}`, handler);
		}
	}

	/**
	 * Polyfill for preventDefault.
	 *
	 * @method _preventDefault
	 * @param {Event} e
	 * */
	_preventDefault(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
}

ns.Core.Router.Handler = Handler;
