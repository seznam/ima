import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core');

/**
 * ObjectContainer.
 *
 * @class Handler
 * @namespace Core
 * @module Core
 * @requires Core.Namespace
 */
export default class ObjectContainer {

	/**
	 * Initializes the object container.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Namespace} namespace The namespace container, used to access classes and
	 *        values using their fully qualified names.
	 */
	constructor(namespace) {
		/**
		 * The namespace container, used to access classes and values using their
		 * fully qualified names.
		 *
		 * @property _namespace
		 * @private
		 * @type {Core.Namespace}
		 */
		this._namespace = namespace;

		/**
		 * @property _aliases
		 * @private
		 * @type {Map}
		 */
		this._aliases = new Map();

		/**
		 * @property _constants
		 * @private
		 * @type {Map}
		 */
		this._constants = new Map();

		/**
		 * @property _registry
		 * @private
		 * @type {Map}
		 */
		this._registry = new Map();

		/**
		 * @property _providers
		 * @private
		 * @type {Map}
		 */
		this._providers = new Map();

	}

	/**
	 *
	 *
	 * @method bind
	 * @chainable
	 * @param {String} name
	 * @param {function(new: T, ...*)} classConstructor The class constructor.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the constructor
	 *        function.
	 */
	bind(name, classConstructor, dependencies = []) {
		if (typeof classConstructor !== 'function') {
			throw new Error(`Core.ObjectContainer:bind method has to have the second parameter type of function for alias name ${name}. You give type of ${typeof classConstructor}. Fix your bind.js file.`);
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
	 * constant
	 *
	 * @method constant
	 * @chainable
	 * @param {String} name
	 * @param {*} value
	 */
	constant(name, value) {
		var constantEntry = this._createEntry(() => value);
		constantEntry.sharedInstance = value;
		this._constants.set(name, constantEntry);

		return this;
	}

	/**
	 *
	 *
	 * @method inject
	 * @chainable
	 * @param {function(new: T, ...*)} classConstructor The class constructor.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the constructor
	 *        function.
	 */
	inject(classConstructor, dependencies = []) {
		if (typeof classConstructor !== 'function') {
			throw new Error(`Core.ObjectContainer:bind method has to have the first parameter type of function. You give type of ${typeof classConstructor}. Fix your bind.js file.`);
		}

		if (this._registry.has(classConstructor)) {
			throw new Error(`Core.ObjectContainer:inject method has already registered class ${classConstructor.name}. Inject method may be call only once for one class. If you need more different implementation use method bind.`);
		}
		var newEntry = this._createEntry(classConstructor, dependencies);
		this._registry.set(classConstructor, newEntry);

		return this;
	}

	/**
	 *
	 *
	 * @method provide
	 * @chainable
	 * @param {function(new: Interface)} interfaceConstructor The constructor of
	 *        the interface representing the service.
	 * @param {function(new: Implemetation, ...*)} implementationConstructor The
	 *        constructor of the class implementing the service interface.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the constructor
	 *        function.
	 */
	provide(interfaceConstructor, implementationConstructor, dependencies = []) {
		if (this._providers.has(interfaceConstructor)) {
			throw new Error('Core.ObjectContainer:provide The specified interface ' +
			`(${interfaceConstructor.name}) is already provided with the object container.`);
		}

		// check that implementation really extends interface
		var prototype = implementationConstructor.prototype;
		while (prototype && (prototype !== interfaceConstructor.prototype)) {
			prototype = Object.getPrototypeOf(prototype);
		}
		if (!prototype) {
			throw new Error('The specified class ' +
			`(${implementationConstructor.name}) does not implement the ` +
			`${interfaceConstructor.name} interface.`);
		}

		var newEntry = this._createEntry(implementationConstructor, dependencies);
		this._providers.set(interfaceConstructor, newEntry);

		return this;
	}

	/**
	 *
	 *
	 * @method get
	 * @param {String|function(new: T, ...*)} name
	 * @return {*}
	 */
	get(name) {
		var entry = this._getEntry(name);

		if (!entry.sharedInstance) {
			entry.sharedInstance = this._createInstanceOfEntry(entry);
		}

		return entry.sharedInstance;
	}

	/**
	 *
	 *
	 * @method getConstructorOf
	 * @param {String|function(new: T, ...*)} name
	 * @return {function(new: T, ...*)}
	 */
	getConstructorOf(name) {
		var entry = this._getEntry(name);

		return entry.classConstructor;
	}

	/**
	 *
	 *
	 * @method has
	 * @param {String|function(new: T, ...*)} name
	 * @return {boolean}
	 */
	has(name) {
		return this._constants.has(name) ||
			this._aliases.has(name) ||
			this._registry.has(name) ||
			this._providers.has(name) ||
			!!this._getEntryFromNamespace(name);
	}

	/**
	 *
	 *
	 * @method create
	 * @param {String|function(new: T, ...*)} name
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the constructor
	 *        function.
	 * @return {T}
	 */
	create(name, dependencies = []) {
		var entry = this._getEntry(name);

		return this._createInstanceOfEntry(entry, dependencies);
	}

	/**
	 *
	 *
	 * @method clear
	 * @chainable
	 */
	clear() {
		this._constants.clear();
		this._aliases.clear();
		this._registry.clear();
		this._providers.clear();

		return this;
	}

	/**
	 *
	 *
	 * @method _createEntry
	 * @private
	 * @param {function(new: T, ...*)} classConstructor The class constructor.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the constructor
	 *        function.
	 */
	_createEntry(classConstructor, dependencies = []) {
		return new Entry(classConstructor, dependencies);
	}

	/**
	 *
	 *
	 * @method _getEntry
	 * @param {String|function(new: T, ...*)} name
	 * @return {Entry}
	 */
	_getEntry(name) {
		var entry = this._constants.get(name) ||
			this._aliases.get(name) ||
			this._registry.get(name) ||
			this._providers.get(name) ||
			this._getEntryFromNamespace(name);

		if (!entry) {
			throw new Error(`Core.ObjectContainer:_getEntry method has not constant, alias, registered class, provided interface and namespace name for name ${name}. Check your bind.js file and add implementation for name ${name}.`);
		}

		return entry;
	}

	/**
	 *
	 *
	 * @method _createInstanceOfEntry
	 * @private
	 * @param {Core.ObjectContainer.Entry} entry
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the constructor
	 *        function.
	 */
	_createInstanceOfEntry(entry, dependencies = []) {
		if (dependencies.length === 0) {
			dependencies = [];

			for (var dependency of entry.dependencies) {
				if (typeof dependency === 'function' || typeof dependency === 'string') {
					dependencies.push(this.get(dependency));
				} else {
					dependencies.push(dependency);
				}
			}
		}
		var Constructor = entry.classConstructor;

		return new Constructor(...dependencies);
	}

	/**
	 *
	 *
	 * @method _getEntryFromNamespace
	 * @private
	 * @param {String|function(new: T, ...*)} name
	 * @return {Core.ObjectContainer.Entry|undefined}
	 */
	_getEntryFromNamespace(name) {
		if (typeof name === 'string' && this._namespace.has(name)) {
			var namespaceValue = this._namespace.get(name);

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

		return undefined;
	}
}

ns.Core.ObjectContainer = ObjectContainer;

/**
 * @class Entry
 */
class Entry {

	/**
	 *
	 * @method constructor
	 * @param {function(new: T, ...*)} classConstructor The class constructor.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor function.
	 */
	constructor(classConstructor, dependencies) {

		/**
		 * The constructor of the class represented by this entry.
		 *
		 * @property classConstructor
		 * @type {function(new: T, ...*)}
		 */
		this.classConstructor = classConstructor;

		/**
		 * Dependencies of the class constructor of the class represented by this
		 * entry.
		 *
		 * @property dependencies
		 * @type {*[]}
		 */
		this.dependencies = dependencies;

		/**
		 * The shared instance of the class represented by this entry.
		 *
		 * @property sharedInstance
		 * @type {*}
		 */
		this.sharedInstance = null;
	}
}
