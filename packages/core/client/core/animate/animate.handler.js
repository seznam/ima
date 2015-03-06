import ns from 'core/namespace/ns.js';

ns.namespace('Core.Animate');

/**
 * Handler for making animation on current page and between different pages.
 *
 * @class Handler
 * @extends Core.Interface.Animate
 * @namespace Core.Animate
 * @module Core
 * @submodule Core.Animate
 *
 * @uses Core.Dispatcher.Handler
 * @uses Core.Storage.Cookie
 * @uses Core.Interface.WindowHelper
 * */
class Handler extends ns.Core.Interface.Animate {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Dispatcher.Handler} dispatcher
	 * @param {Promise} promise
	 * @param {Core.Interface.WindowHelper} window
	 * @param {Core.Storage.Cookie} cookie
	 * @param {Object} state
	 * */
	constructor(dispatcher, promise, window, cookie, state) {
		super();

		/**
		 * @property _dispatcher
		 * @private
		 * @type {Core.Dispatcher.Handler}
		 * @default dispatcher
		 * */
		this._dispatcher = dispatcher;

		/**
		 * @property _promise
		 * @private
		 * @type {Promise}
		 * @default promise
		 * */
		this._promise = promise;

		/**
		 * @property _window
		 * @private
		 * @type {Core.Interface.WindowHelper}
		 * @default window
		 * */
		this._window = window;

		/**
		 * @property _cookie
		 * @private
		 * @type {Core.Storage.Cookie}
		 * @default cookie
		 * */
		this._cookie = cookie;

		/**
		 * @property _state
		 * @private
		 * @type {Object}
		 * @default state
		 * */
		this._state = state;

		/**
		 * @property _transition
		 * @private
		 * @type {Object}
		 * @default {}
		 * */
		this._transition = {};
		
		/**
		 * @property COOKIE_TRANSITION
		 * @const
		 * @type {String}
		 * @default 'animateTransition'
		 * */
		this.COOKIE_TRANSITION = 'animateTransition';
		
		/**
		 * @property ANIMATE_EVENT
		 * @const
		 * @type {String}
		 * @default 'animate.update'
		 * */
		this.ANIMATE_EVENT = 'animate.update';
		

	}

	/**
	 * Set new animate state.
	 *
	 * @method set
	 * @param {String} key
	 * @param {Boolean} [value=true]
	 * @param {Boolean} [transition=false]
	 * @return {Promise}
	 * */
	set(key, value, transition = false) {

		if (transition) {
			this._transition[key] = value;
			this._cookie.set(this.COOKIE_TRANSITION, transition);

			return this._promise.resolve(key);
		} else {
			this._state[key] = value;
			
			return(
				new this._promise((resolve, reject) => {
					
					setTimeout(() => {
						this._dispatcher.fire(this.ANIMATE_EVENT, this._state);
					}, 0);

					var window = this._window.getWindow();
					var timer = setTimeout(() => {
						reject(ns.oc.create('Error', `Core.Animate.Handler:set is timeouted animation ${key}.`));
					}, 5000);

					this._window.addEventListener(window, 'transitionend', this._transitionEndHandler.bind(resolve, timer));
					this._window.addEventListener(window, 'mozTransitionEnd', this._transitionEndHandler.bind(resolve, timer));
					this._window.addEventListener(window, 'webkitTransitionEnd', this._transitionEndHandler.bind(resolve, timer));
					this._window.addEventListener(window, 'oTransitionEnd', this._transitionEndHandler.bind(resolve, timer));
				})
			);
		}
	}

	/**
	 * Handler for event transition end.
	 *
	 * @method _transitionEndHandler
	 *
	 * */
	_transitionEndHandler(e, fun, timer) {
		console.log('E', e);
		console.log('FN', fun);
		console.log('timer', timer);
	}


}

ns.Core.Animate.Handler = Handler;