import ns from 'ima/namespace';

ns.namespace('Ima');

/**
 * The Object Container is an enhanced dependency injector with support for
 * aliases and constants, and allowing to reference classes in the application
 * namespace by specifying their fully qualified names.
 *
 * @class ObjectContainer
 * @namespace Ima
 * @module Ima
 * @requires Ima.Namespace
 */
export default class ObjectContainer {

	/**
	 * Initializes the object container.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Ima.Namespace} namespace The namespace container, used to
	 *        access classes and values using their fully qualified names.
	 */
	constructor(namespace) {

		/**
		 * The namespace container, used to access classes and values using
		 * their fully qualified names.
		 *
		 * @private
		 * @property _namespace
		 * @type {Ima.Namespace}
		 */
		this._namespace = namespace;

		/**
		 * Map of bound aliases to their classes and the dependencies bound
		 * with the alias.
		 *
		 * @private
		 * @property _aliases
		 * @type {Map<string, Entry<*>>}
		 */
		this._aliases = new Map();

		/**
		 * Map of constant names to getter function entries for retrieving the
		 * constant values.
		 *
		 * @private
		 * @property _constants
		 * @type {Map<string, Entry<function(): *>>}
		 */
		this._constants = new Map();

		/**
		 * Registry of classes and factory functions to their entries
		 * specifying their default dependencies.
		 *
		 * @private
		 * @property _registry
		 * @type {Map<(function(new: *, ...*)|function(...*): *), Entry<*>>}
		 */
		this._registry = new Map();

		/**
		 * Map of interfaces to entries representing the default implementation
		 * providers (classes) and their constructor dependencies.
		 *
		 * @private
		 * @property _providers
		 * @type {Map<function(new: *), Entry<*>>}
		 */
		this._providers = new Map();
	}

	/**
	 * Binds the specified class or factory function and dependencies to the
	 * specified alias. Binding a class or factory function to an alias allows
	 * the class or function to be specied as a dependency by specifying the
	 * alias and creating new instances by referring to the class or function
	 * by the alias.
	 *
	 * Also note that the same class or function may be bound to several
	 * aliases and each may use different dependencies.
	 *
	 * The alias will use the default dependencies bound for the class if no
	 * dependencies are provided.
	 *
	 * @chainable
	 * @method bind
	 * @param {string} name Alias name.
	 * @param {(function(new: T, ...*)|function(...*): T)} classConstructor The
	 *        class constructor or a factory function.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor or factory function.
	 * @return {Ima.ObjectContainer} This object container.
	 */
	bind(name, classConstructor, dependencies = []) {
		if ($Debug) {
			if (typeof classConstructor !== 'function') {
				throw new Error(`Ima.ObjectContainer:bind method has to ` +
						`have the second parameter type of function for ` +
						`alias name ${name}. You give type of ` +
						`${typeof classConstructor}. Fix your bind.js file.`);
			}
		}

		if (dependencies.length === 0) {
			if (this._registry.has(classConstructor)) {
				var registryEntry = this._registry.get(classConstructor);
				this._aliases.set(name, registryEntry);

				return this;
			}

			if (this._providers.has(classConstructor)) {
				var providerEntry = this._providers.get(classConstructor);
				this._aliases.set(name, providerEntry);

				return this;
			}
		}

		var newEntry = this._createEntry(classConstructor, dependencies);
		this._aliases.set(name, newEntry);

		return this;
	}

	/**
	 * Defines a new constant registered with this object container. Note that
	 * this is the only way of passing {@code string} values to constructors
	 * because the object container treats strings as class, interface, alias
	 * or constant names.
	 *
	 * @chainable
	 * @method constant
	 * @param {string} name The constant name.
	 * @param {*} value The constant value.
	 * @return {Ima.ObjectContainer} This object container.
	 */
	constant(name, value) {
		if ($Debug) {
			if (this._constants.has(name)) {
				throw new Error(`Ima.ObjectContainer:constant method has ` +
						`already registered name ${name}. Constant method ` +
						`may be call only once for one name.`);
			}
		}

		var constantEntry = this._createEntry(() => value);
		constantEntry.sharedInstance = value;
		this._constants.set(name, constantEntry);

		return this;
	}

	/**
	 * Configures the object loader with the specified default dependencies for
	 * the specified class.
	 *
	 * New instances of the class created by this object container will receive
	 * the provided dependencies into constructor unless custom dependencies
	 * are provided.
	 *
	 * @chainable
	 * @method inject
	 * @template T
	 * @param {function(new: T, ...*)} classConstructor The class constructor.
	 * @param {*[]} dependencies The dependencies to pass into the
	 *        constructor function.
	 * @return {Ima.ObjectContainer} This object container.
	 */
	inject(classConstructor, dependencies) {
		if ($Debug) {
			if (typeof classConstructor !== 'function') {
				throw new Error(`Ima.ObjectContainer:bind method has to ` +
						`have the first parameter type of function. You ` +
						`give type of ${typeof classConstructor}. Fix your ` +
						`bind.js file.`);
			}

			if (this._registry.has(classConstructor)) {
				throw new Error(`Ima.ObjectContainer:inject method has ` +
						`already registered class ${classConstructor.name}. ` +
						`Inject method may be call only once for one class. ` +
						`If you need more different implementation use ` +
						`method bind.`);
			}
		}

		var newEntry = this._createEntry(classConstructor, dependencies);
		this._registry.set(classConstructor, newEntry);

		return this;
	}

	/**
	 * Configures the default implementation of the specified interface to use
	 * when an implementation provider of the specified interface is requested
	 * from this object container.
	 *
	 * The implementation constructor will obtain the provided default
	 * dependencies or the dependencies provided to the {@codelink create()}
	 * method.
	 *
	 * @chainable
	 * @template {Interface}
	 * @template {Implementation} extends Interface
	 * @method provide
	 * @param {function(new: Interface)} interfaceConstructor The constructor
	 *        of the interface representing the service.
	 * @param {function(new: Implementation, ...*)} implementationConstructor
	 *        The constructor of the class implementing the service interface.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor function.
	 * @return {Ima.ObjectContainer} This object container.
	 */
	provide(interfaceConstructor, implementationConstructor,
			dependencies = []) {
		if ($Debug) {
			if (this._providers.has(interfaceConstructor)) {
				throw new Error('Ima.ObjectContainer:provide The specified' +
						` interface (${interfaceConstructor.name}) is ` +
						`already provided with the object container.`);
			}

			// check that implementation really extends interface
			var prototype = implementationConstructor.prototype;
			while (prototype && prototype !== interfaceConstructor.prototype) {
				prototype = Object.getPrototypeOf(prototype);
			}
			if (!prototype) {
				throw new Error('The specified class ' +
						`(${implementationConstructor.name}) does not ` +
						`implement the ${interfaceConstructor.name} ` +
						`interface.`);
			}
		}

		var newEntry = this._createEntry(
			implementationConstructor,
			dependencies
		);
		this._providers.set(interfaceConstructor, newEntry);

		return this;
	}

	/**
	 * Retrieves the shared instance or value of the specified constant, alias,
	 * class or factory function, interface, or fully qualified namespace path
	 * (the method checks these in this order in case of a name clash).
	 *
	 * The instance or value is created lazily the first time it is requested.
	 *
	 * @template T
	 * @method get
	 * @param {(string|function(new: T, ...*)|function(...*): T)} name The name
	 *        of the alias, class, interface, or the class, interface or a
	 *        factory function.
	 * @return {T} The shared instance or value.
	 */
	get(name) {
		var entry = this._getEntry(name);

		if (entry.sharedInstance === null) {
			entry.sharedInstance = this._createInstanceFromEntry(entry);
		}

		return entry.sharedInstance;
	}

	/**
	 * Returns the class constructor function of the specified class.
	 *
	 * @template T
	 * @method getConstructorOf
	 * @param {string|function(new: T, ...*)} name The name by which the class
	 *        is registered with this object container.
	 * @return {function(new: T, ...*)} The constructor function.
	 */
	getConstructorOf(name) {
		var entry = this._getEntry(name);

		return entry.classConstructor;
	}

	/**
	 * Returns {@code true} if the specified object, class or resource is
	 * registered with this object container.
	 *
	 * @template T
	 * @method has
	 * @param {string|function(new: T, ...*)} name The resource name.
	 * @return {boolean} {@code true} if the specified object, class or
	 *         resource is registered with this object container.
	 */
	has(name) {
		return this._constants.has(name) ||
				this._aliases.has(name) ||
				this._registry.has(name) ||
				this._providers.has(name) ||
				!!this._getEntryFromNamespace(name);
	}

	/**
	 * Creates a new instance of the class or retrieves the value generated by
	 * the factory function identified by the provided name, class, interface,
	 * or factory function, passing in the provided dependencies.
	 *
	 * The method uses the dependencies specified when the class, interface or
	 * factory function has been registered with the object container if no
	 * custom dependencies are provided.
	 *
	 * @template T
	 * @method create
	 * @param {(string|function(new: T, ...*)|function(...*): T)} name The name
	 *        of the alias, class, interface, or the class, interface or a
	 *        factory function to use.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor or factory function.
	 * @return {T} Created instance or generated value.
	 */
	create(name, dependencies = []) {
		var entry = this._getEntry(name);

		return this._createInstanceFromEntry(entry, dependencies);
	}

	/**
	 * Clears all entries from this object container.
	 *
	 * @chainable
	 * @method clear
	 * @return {Ima.ObjectContainer} This object container.
	 */
	clear() {
		this._constants.clear();
		this._aliases.clear();
		this._registry.clear();
		this._providers.clear();

		return this;
	}

	/**
	 * Retrieves the entry for the specified constant, alias, class or factory
	 * function, interface, or fully qualified namespace path (the method
	 * checks these in this order in case of a name clash).
	 *
	 * The method retrieves an existing entry even if a qualified namespace
	 * path is provided (if the target class or interface has been configured
	 * in this object container).
	 *
	 * The method throws an {@codelink Error} if no such constant, alias,
	 * registry, interface implementation is known to this object container and
	 * the provided identifier is not a valid namespace path specifying an
	 * existing class, interface or value.
	 *
	 * @private
	 * @template T
	 * @method _getEntry
	 * @param {string|function(new: T, ...*)} name Name of a constant or alias,
	 *        factory function, class or interface constructor, or a fully
	 *        qualified namespace path.
	 * @return {?Entry<T>} The retrieved entry.
	 * @throws {Error} If no such constant, alias, registry, interface
	 *         implementation is known to this object container.
	 */
	_getEntry(name) {
		var entry = this._constants.get(name) ||
				this._aliases.get(name) ||
				this._registry.get(name) ||
				this._providers.get(name) ||
				this._getEntryFromNamespace(name);

		if ($Debug) {
			if (!entry) {
				throw new Error(`Ima.ObjectContainer:_getEntry method has ` +
						`not constant, alias, registered class, provided ` +
						`interface and namespace name for name ${name}. ` +
						`Check your bind.js file and add implementation for ` +
						`name ${name}.`);
			}
		}

		return entry;
	}

	/**
	 * Creates a new entry for the provided class or factory function and the
	 * provided dependencies.
	 *
	 * @private
	 * @template T
	 * @method _createEntry
	 * @param {(function(new: T, ...*)|function(...*): T)} classConstructor The
	 *        class constructor or factory function.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor or factory function.
	 * @return {T} Created instance or generated value.
	 */
	_createEntry(classConstructor, dependencies = []) {
		return new Entry(classConstructor, dependencies);
	}

	/**
	 * Creates a new instance of the class or retrieves the value generated by
	 * the factory function represented by the provided entry, passing in the
	 * provided dependencies.
	 *
	 * The method uses the dependencies specified by the entry if no custom
	 * dependencies are provided.
	 *
	 * @private
	 * @template T
	 * @method _createInstanceFromEntry
	 * @param {Entry<T>} entry The entry representing the class that should
	 *        have its instance created or factory faction to use to create a
	 *        value.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor or factory function.
	 * @return {T} Created instance or generated value.
	 */
	_createInstanceFromEntry(entry, dependencies = []) {
		if (dependencies.length === 0) {
			dependencies = [];

			for (var dependency of entry.dependencies) {
				if (['function', 'string'].indexOf(typeof dependency) > -1) {
					dependencies.push(this.get(dependency));
				} else {
					dependencies.push(dependency);
				}
			}
		}
		var constructor = entry.classConstructor;

		return new constructor(...dependencies);
	}

	/**
	 * Retrieves the class denoted by the provided fully qualified name within
	 * the application namespace.
	 *
	 * The method then checks whether there are dependecies configured for the
	 * class, no matter whether the class is an implementation class or an
	 * "interface" class.
	 *
	 * The method returns the entry for the class if the class is registered
	 * with this object container, otherwise an unregistered entry is created
	 * and returned.
	 *
	 * Finally, if the namespace path does not resolve to a class, the method
	 * return an unregistered entry resolved to the value denoted by the
	 * namespace path.
	 *
	 * Alternativelly, if a constructor function is passed in instead of a
	 * namespace path, the method returns {@code null}.
	 *
	 * @private
	 * @template T
	 * @method _getEntryFromNamespace
	 * @param {(string|function(new: T, ...*))} path Namespace path pointing to
	 *        a class or a value in the application namespace, or a constructor
	 *        function.
	 * @return {?Entry<T>} An entry representing the value or class at the
	 *         specified path in the namespace. The method returns {@code null}
	 *         if the specified path does not exist in the namespace.
	 */
	_getEntryFromNamespace(path) {
		if (typeof path === 'string' && this._namespace.has(path)) {
			var namespaceValue = this._namespace.get(path);

			if (typeof namespaceValue === 'function') {
				if (this._registry.has(namespaceValue)) {
					return this._registry.get(namespaceValue);
				}

				if (this._providers.has(namespaceValue)) {
					return this._providers.get(namespaceValue);
				}

				return this._createEntry(namespaceValue);
			} else {
				var entry = this._createEntry(() => namespaceValue);
				entry.sharedInstance = namespaceValue;
				return entry;
			}
		}

		return null;
	}
}

ns.Ima.ObjectContainer = ObjectContainer;

/**
 * Object container entry, representing either a class, interface, constant or
 * an alias.
 *
 * @class Entry
 * @namespace Ima
 * @module Ima
 * @template T
 */
class Entry {

	/**
	 * Initializes the entry.
	 *
	 * @method constructor
	 * @param {(function(new: T, ...*)|function(...*): T)} classConstructor The
	 *        class constructor or constant value getter.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor function.
	 */
	constructor(classConstructor, dependencies) {

		/**
		 * The constructor of the class represented by this entry, or the
		 * getter of the value of the constant represented by this entry.
		 *
		 * @property classConstructor
		 * @type {(function(new: T, ...*)|function(...*): T)}
		 */
		this.classConstructor = classConstructor;

		/**
		 * Dependencies of the class constructor of the class represented by
		 * this entry.
		 *
		 * @property dependencies
		 * @type {*[]}
		 */
		this.dependencies = dependencies;

		/**
		 * The shared instance of the class represented by this entry.
		 *
		 * @property sharedInstance
		 * @type {T}
		 */
		this.sharedInstance = null;
	}
}
