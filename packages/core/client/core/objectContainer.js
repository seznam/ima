import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core');

/**
 * The Object Container ({@code Oc}) is a dependency injector and global
 * registry.
 *
 * The Object Container, in general, keeps singleton instances of services,
 * global constants, named references to factory or constructor functions or
 * other values registered with the object container.
 *
 * Constructor functions can be registered with the Object Container with a
 * list of their dependencies, which can be specified either as values or names
 * of values available in the Object Container registry. When asked to create a
 * new instance, the Object Container will retrieve the specified values from
 * its registry and pass them in the same order to the constructor function of
 * the requested class.
 *
 * The Object Container can be configured using its {@code bind} method used to
 * specify the names, by which the registered constructors, factories or values
 * can be referred to, and their dependencies.
 *
 * Additionally, the object container is aware of the namespace, allowing the
 * use of fully qualified names to refer to classes and values. For example,
 * the {@code ns.Core.ObjectContainer} reference can be specified as
 * {@code 'Core.ObjectContainer'}.
 *
 * @class ObjectContainer
 * @namespace Core
 * @module Core
 */
class ObjectContainer {

	/**
	 * Initializes the Object Container.
	 *
	 * @constructor
	 * @private
	 * @method constructor
	 * @param {Ns} namespace The namespace container, used to access classes and
	 *        values using their fully qualified names.
	 * @example
	 *    ns.oc.bind('Dictionary', ns.Core.Dictionary.Handler);
	 *    ns.oc.bind('Router', ns.Core.Router.Handler, ['Singleton', 'Dictionary']);
	 * 	  ns.oc.make('Router', ['Dictionary']);
	 * @example
	 *    ns.oc.get('Singleton');
	 * @example
	 *    ns.oc.bind('Singleton', ns.oc.create('ns.Singleton.Handler', param1, param2, param3));
	 */
	constructor(namespace) {
		/**
		 * A tree of objects representing the registry of registered values. The
		 * keys (object fields) are strings - names of the referenced namespace
		 * within the registry, or the name of the value within the current
		 * namespace.
		 *
		 * The root and inner nodes are therefore of the
		 * {@code Object<string, *|registry object>} type (the inner nodes may
		 * also refer to leaf values), while the leaf registry nodes are of the
		 * {@codeObject<string, *>} type.
		 *
		 * Note that this registry contains only references to the registered
		 * values, it does not manage the dependecies of class constructors - those
		 * are stored in the {@code _dependencyRegistry} field.
		 *
		 * @property _registry
		 * @private
		 * @type {Object}
		 */
		this._registry = {};

		/**
		 * A tree of objects representing the registry of dependencies of
		 * registered constructor functions (or values, but those usually have an
		 * empty list of dependencies).
		 *
		 * The root and inner nodes are therefore of the
		 * {@code Object<string, string[]|registry object>} type (the inner nodes
		 * may also refer to leaf values), while the leaf registry nodes are of the
		 * {@code Object<string, *>} type.
		 *
		 * The structure of this dependency registry matches the structure of the
		 * {@code _registry} value registry, but this registry only holds the
		 * information about dependencies of the custructor functions registered in
		 * the {@code _registry} registry.
		 *
		 * @property _dependencyRegistry
		 * @private
		 * @type {Object}
		 */
		this._dependencyRegistry = {};

		/**
		 * The namespace container, used to access classes and values using their
		 * fully qualified names.
		 *
		 * @property _namespace
		 * @private
		 * @type {Core.Namespace.Ns}
		 */
		this._namespace = namespace;
	}

	/**
	 * Creates a new instance of the specified class, passing the provided
	 * dependencies to its constructor. If no dependencies are provided, the
	 * method will use the dependencies specified when the class was registered
	 * with this Object Container using the {@code bind} method.
	 *
	 * The class can be referenced either using the name by which it was bound to
	 * this object container, or by its fully qualified name in the namespace
	 * (without the {@code ns.} prefix).
	 *
	 * The dependencies passed to the constructor functions can be either strings
	 * or any other values. String values are processed as class names by the
	 * {@code make} method recursively, using the dependency information with
	 * which they were bound to this Object Container. Values other than strings
	 * are passed to the constructor function without further processing.
	 *
	 * In order to pass a string value to the constructor being called, bind the
	 * string to this Object Container using an appropriate name (names used for
	 * constants are recommended), and then use the binding name as the
	 * dependency.
	 *
	 * This method does not keep track of already created instances, repeated
	 * calls with the same arguments result in multiple instances of the same
	 * class.
	 *
	 * @method make
	 * @param {string} name - The name of the class to instantiate, indentifying
	 *        the class in either the Object Container's registry or in the
	 *        namespace.
	 * @param {*[]} [DI=[]] - The dependencies to pass into the constructor
	 *        function. Leave empty to use the dependencies registered in this
	 *        Object Container.
	 * @return {Object} The created instance of the specified class.
	 * @throws {Error} Thrown if the automatic dependency injection fails, or the
	 *         specified class was not found in either the internal registry nor
	 *         the namespace.
	 */
	make(name, DI = []) {
		if (this.has(name)) {
			var [object, DIBind] = this._get(name);
			var arrayObjectDependencies = [null];

			if (DI.length === 0) {
				DI = DIBind;
			}

			if (typeof object === 'function') {
				for (var di of DI) {
					try {
						if (typeof di === 'string') {
							arrayObjectDependencies.push(this.make(di.trim()));
						} else {
							arrayObjectDependencies.push(di);
						}
					} catch(e) {
						throw new Error(`Core.ObjectContainer:make method hasn't object ` +
						`with name ${name} for auto dependency injection. Bind ` +
						`${name} to config. Error message: ${e.message}.`);
					}
				}

				return (
					new (Function.prototype.bind.apply(object, arrayObjectDependencies))
				);
			} else {
				return object;
			}
		} else {
			throw new Error(`Core.ObjectContainer:make method hasnt object with ` +
			`name ${name}. Bind ${name} to config.`);
		}
	}

	/**
	 * Binds the specified value, instance or class to the specified name in this
	 * Object Store.
	 *
	 * @method bind
	 * @param {string} name - The name by which the provided value, instance or
	 *        class will be identified in this Object Store.
	 * @param {*} value - The value to bind to this Object Store's registry.
	 * @param {(*|string)[]} [dependencies=[]] If the value is a constructor
	 *        function, use this parameter to specify the dependencies to pass to
	 *        the constructor when creating an instance of the registered class.
	 *        See the {@code make} method for more details about passing
	 *        dependencies to class constructors.
	 * @return {*} The binded value.
	 */
	bind(name, value, dependencies = []) {
		var object = this._registry;
		var di = this._dependencyRegistry;
		var levels = name.split('.');

		for (var i = 0; i < levels.length; i++) {
			if (typeof(object[levels[i]]) === 'undefined') {
				object[levels[i]] = {};
				di[levels[i]] = {};
			}

			if (i === levels.length - 1) {
				object[levels[i]] = value;
				di[levels[i]] = dependencies;
				object = object[levels[i]];
			} else {
				object = object[levels[i]];
				di = di[levels[i]];
			}
		}

		return object;
	}

	/**
	 * Returns the value, instance or class constructor registered by the
	 * specified name.
	 *
	 * The method searches the internal registry (populated by the
	 * {@code bind} method) first, and the namespace second.
	 *
	 * The method returns {@code undefined} if no value of such name is found in
	 * either the internal registry or the namespace.
	 *
	 * @method get
	 * @param {string} name - namespace or alias
	 * @return {*} The value identified by the specified name, or
	 *         {@code undefined} if no value of such name has been found.
	 */
	get(name) {
		var [object] = this._get(name);

		return object;
	}

	/**
	 * Returns an array containing the following elements:
	 * - the value, instance or class constructor registered by the specified
	 *   name
	 * - the list of dependencies to pass to the constructor if the first element
	 *   is a class constructor
	 *
	 * The method searches the internal registry (populated by the {@code bind}
	 * method) first, and the namespace second.
	 *
	 * The method returns {@code undefined} as the first element of the returned
	 * array if no value of such name is found in either the internal registry or
	 * the namespace.
	 *
	 * @method _get
	 * @private
	 * @param {string} name - namespace or alias
	 * @return {(*|*[])[]} - An array containing the value and its dependencies.
	 */
	_get(name) {
		var object = this._registry;
		var di = this._dependencyRegistry;
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
	 * Retrieves the value, instance or class identified by the specified name
	 * within this Object Container or the namespace (searched in respective
	 * order).
	 *
	 * If the method retrieves a class constructor, the method will create a new
	 * instance of the retrieved class and return the instance.
	 *
	 * Create new instance of class with defines params. If we bind instance as
	 * singleton then return singleton.
	 *
	 * @method create
	 * @param {string} name - Name identifying the value, instance or class in
	 *        this Object Container or namespace.
	 * @param {*[] [...args=[]] - The arguments to pass to the class constructor.
	 * @return {*} The value or instance identified by the specified name, or a
	 *         new instance of the class identified by the specified name.
	 */
	create(name, ...args) {
		if (this.has(name)) {
			var object = this.get(name);

			if (typeof(object) === 'function') {
				return new (Function.prototype.bind.apply(object, arguments));
			} else {
				return object;
			}
		} else {
			throw new Error(`Core.ObjectContainer:create hasn't object with name ` +
			`${name}. Bind ${name} to config.`);
		}
	}

	/**
	 * Returns {@code true} if there is a value different from {@code undefined}
	 * defined with the specified name in this Object Container or namespace.
	 *
	 * @method has
	 * @param {string} name - The name identifying the value.
	 * @return {boolean} {@code true} if the name referes to an existing value,
	 *         instance or class registered with this Object Container or
	 *         namespace.
	 */
	has(name) {
		return typeof(this.get(name)) !== 'undefined';
	}

	/**
	 *
	 * @method clear
	 */
	clear() {
		this._dependencyRegistry = {};
		this._registry = {};
	}
}

var oc = new ObjectContainer(ns);
/*
var oc = null;
if (!ns.has('oc')) {
	oc = new ObjectContainer(ns);
	ns.oc = oc;
}
*/

ns.Core.ObjectContainer = ObjectContainer;

export default oc;
