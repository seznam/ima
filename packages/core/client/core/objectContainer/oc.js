import ns from 'core/namespace/ns.js';

ns.namespace('Core.ObjectContainer');

/**
 * Object container keep all instance of class and class.
 *
 * @class Oc
 * @namespace Core.ObjectContainer
 * @module Core
 * @submodule Core.ObjectContainer
 * */

class Oc{

	/**
	 * @method constructor
	 * @constructor
	 * @param {Ns} namespace
	 * @example
	 * 		ns.oc.bind('Dictionary', ns.Core.Dictionary.Handler);
	 * 		ns.oc.bind('Router', ns.Core.Router.Handler, ['Singleton', 'Dictionary']);
	 * 		ns.oc.make('Router', ['Dictionary']);
	 * @example
	 * 		ns.oc.get('Singleton');
	 * @example
	 * 		ns.oc.bind('Singleton', ns.oc.create('ns.Singleton.Handler', param1, param2, param3));
	 */
	constructor(namespace) {
		/**
		 * Keep instance of class and class.
		 *
		 * @property _object
		 * @private
		 * @type {Object}
		 * @default {}
		 * */
		this._object = {};

		/**
		 * Keep defined DI over bind function for all classes.
		 *
		 * @property _DI
		 * @private
		 * @type {Object}
		 * @default {}
		 * */
		this._DI = {};

		/**
		 * @property _namespace
		 * @private
		 * @type {Core.Namespace.Ns}
		 * */
		this._namespace = namespace;
	}

	/**
	 * Make new instance of class with auto dependency injection.
	 *
	 * @method make
	 * @param {String} name - namepsace or alias for returned instance
	 * @param {Array} [DI=Array()]
	 * */
	make(name, DI = []) {

		if (this.has(name)) {
			var [object, DIBind] = this._get(name);
			var arrayObjectDependencies = [null];

			if (DI.length === 0) {
				DI = DIBind;
			}

			if (typeof object === 'function') {

				for (var di of DI) {
					try{

						if (typeof di === 'string') {
							arrayObjectDependencies.push(this.make(di.trim()));
						}else{
							arrayObjectDependencies.push(di);
						}

					}catch(e) {
						throw new Error(`Core.ObjectContainer:make method hasn't object with name ${name} for auto dependency injection. Bind ${name} to config. Error message: ${e.message}.`);
					}
				}

				return new (Function.prototype.bind.apply(object, arrayObjectDependencies));
			} else {

				return object;
			}

		} else {
			throw new Error(`Core.ObjectContainer:make method hasnt object with name ${name}. Bind ${name} to config.`);
		}
	}

	/**
	 * Bind instance or class to container for defined name.
	 *
	 * @method bind
	 * @param {String} name - namespace or alias
	 * @param {Mixed} mixed - object, which sore
	 * @param {Array} [dependency=Array()]
	 * */
	bind(name, mixed, dependency = []) {
		var object = this._object;
		var di = this._DI;
		var levels = name.split('.');

		for (var i = 0; i < levels.length; i++) {

			if (typeof(object[levels[i]]) === 'undefined') {
				object[levels[i]] = {};
				di[levels[i]] = {};
			}

			if (i === levels.length - 1) {
				object[levels[i]] = mixed;
				di[levels[i]] = dependency;
				object = object[levels[i]];
			} else {
				object = object[levels[i]];
				di = di[levels[i]];
			}
		}

		return object;
	}

	/**
	 * Return class or instance for name.
	 *
	 * @method get
	 * @param {String} name - namespace or alias
	 * @return {Mixed}
	 * */
	get(name) {
		var [object] = this._get(name);

		return object;
	}

	/**
	 * @method _get
	 * @private
	 * @param {String} name - namespace or alias
	 * @return {Object} - {object, di}
	 * */
	_get(name) {
		var object = this._object;
		var di = this._DI;
		var levels = name.split('.');

		for (var i = 0; i < levels.length; i++) {

			if (typeof(object[levels[i]]) === 'undefined') {

				if (this._namespace.has(name)) {

					return [this._namespace.namespace(name), []];
				} else {

					return [undefined, []];
				}
			}

			object = object[levels[i]];
			di = di[levels[i]];
		}

		return [object, di];
	}

	/**
	 * Create new instance of class with defines params. If we bind instance as singleton then return singleton.
	 *
	 * @method create
	 * @param {String} name - namespace or alias
	 * @param {Array} [...=Array]
	 * @return {Mixed}
	 * */
	create(name) {
		if (this.has(name)) {
			var object = this.get(name);

			if (typeof(object) === 'function') {

				return new (Function.prototype.bind.apply(object, arguments));
			} else {

				return object;
			}
		} else {
			throw new Error(`Core.ObjectContainer:create hasn't object with name ${name}. Bind ${name} to config.`);
		}
	}

	/**
	 * Return true for valid namespace or alias.
	 *
	 * @method has
	 * @param {String} name - namespace or alias
	 * @return {Boolean}
	 * */
	has(name) {
		return typeof(this.get(name)) !== 'undefined';
	}
}

if (!ns.has('oc')) {
	ns.oc = new Oc(ns);
}

ns.Core.ObjectContainer.Oc = Oc;