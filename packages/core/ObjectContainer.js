import ns from './namespace';

ns.namespace('ima');

/**
 * The Object Container is an enhanced dependency injector with support for
 * aliases and constants, and allowing to reference classes in the application
 * namespace by specifying their fully qualified names.
 */
export default class ObjectContainer {

	/**
	 * Initializes the object container.
	 *
	 * @param {ima.Namespace} namespace The namespace container, used to
	 *        access classes and values using their fully qualified names.
	 */
	constructor(namespace) {

		/**
		 * The namespace container, used to access classes and values using
		 * their fully qualified names.
		 *
		 * @type {ima.Namespace}
		 */
		this._namespace = namespace;

		/**
		 * Map of bound aliases to their classes and the dependencies bound
		 * with the alias.
		 *
		 * @type {Map<string, Entry<*>>}
		 */
		this._aliases = new Map();

		/**
		 * Map of constant names to getter function entries for retrieving the
		 * constant values.
		 *
		 * @type {Map<string, Entry<function(): *>>}
		 */
		this._constants = new Map();

		/**
		 * Registry of classes and factory functions to their entries
		 * specifying their default dependencies.
		 *
		 * @type {Map<(function(new: *, ...*)|function(...*): *), Entry<*>>}
		 */
		this._registry = new Map();

		/**
		 * Map of interfaces to entries representing the default implementation
		 * providers (classes) and their constructor dependencies.
		 *
		 * @type {Map<function(new: *), Entry<*>>}
		 */
		this._providers = new Map();

		/**
		 * The number of calling {@linkcode lock()} and {@linkcode unlock()}
		 * methods.
		 *
		 * The {@linkcode lock()} method may be called only if this field is
		 * {@code 0}, while the {@linkcode unlock()} method may be called only
		 * if this field is set to {@code 1}.
		 *
		 * @type {number}
		 */
		this._lockCounter = 0;
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
	 * @template T
	 * @param {string} name Alias name.
	 * @param {(function(new: T, ...*)|function(...*): T)} classConstructor The
	 *        class constructor or a factory function.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor or factory function.
	 * @return {ObjectContainer} This object container.
	 */
	bind(name, classConstructor, dependencies = []) {
		if ($Debug) {
			if (this.isLocked()) {
				throw new Error(`ima.ObjectContainer:bind Object container ` +
						`is locked. You do not have the permission to ` +
						`create a new alias named ${name}.`);
			}

			if (typeof classConstructor !== 'function') {
				throw new Error(`ima.ObjectContainer:bind The second ` +
						`argument has to be a class constructor function, ` +
						`but ${classConstructor} was provided. Fix alias ` +
						`${name} for your bind.js file.`);
			}
		}

		if (dependencies.length === 0) {
			if (this._registry.has(classConstructor)) {
				let registryEntry = this._registry.get(classConstructor);
				this._aliases.set(name, registryEntry);

				return this;
			}

			if (this._providers.has(classConstructor)) {
				let providerEntry = this._providers.get(classConstructor);
				this._aliases.set(name, providerEntry);

				return this;
			}
		}

		let newEntry = this._createEntry(classConstructor, dependencies);
		this._aliases.set(name, newEntry);

		return this;
	}

	/**
	 * Defines a new constant registered with this object container. Note that
	 * this is the only way of passing {@code string} values to constructors
	 * because the object container treats strings as class, interface, alias
	 * or constant names.
	 *
	 * @param {string} name The constant name.
	 * @param {*} value The constant value.
	 * @return {ObjectContainer} This object container.
	 */
	constant(name, value) {
		if ($Debug) {
			if (this._constants.has(name) || !!this._getEntryFromConstant(name)) {
				throw new Error(`ima.ObjectContainer:constant The ${name} ` +
						`constant has already been declared and cannot be ` +
						`redefined.`);
			}
		}

		let constantEntry = this._createEntry(() => value);
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
	 * @template T
	 * @param {function(new: T, ...*)} classConstructor The class constructor.
	 * @param {*[]} dependencies The dependencies to pass into the
	 *        constructor function.
	 * @return {ObjectContainer} This object container.
	 */
	inject(classConstructor, dependencies) {
		if ($Debug) {
			if (typeof classConstructor !== 'function') {
				throw new Error(`ima.ObjectContainer:inject The first ` +
						`argument has to be a class constructor function, ` +
						`but ${classConstructor} was provided. Fix your ` +
						`bind.js file.`);
			}

			if (this._registry.has(classConstructor) && !this.isLocked()) {
				throw new Error(`ima.ObjectContainer:inject The ` +
						`${classConstructor.name} has already had its ` +
						`default dependencies configured, and the object ` +
						`container is currently locked, therefore the ` +
						`dependency configuration cannot be override. The ` +
						`dependencies of the provided class must be ` +
						`overridden from the application's bind.js ` +
						`configuration file.`);
			}
		}

		let aliasEntries = Array.from(this._aliases.values())
			.filter((entry) => {
				return this._hasEntrySameValues(
					entry,
					classConstructor,
					dependencies
				);
			});

		if (aliasEntries.length) {
			this._registry.set(classConstructor, aliasEntries[0]);
		} else {
			let newEntry = this._createEntry(classConstructor, dependencies);
			this._registry.set(classConstructor, newEntry);
		}

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
	 * @template {Interface}
	 * @template {Implementation} extends Interface
	 * @param {function(new: Interface)} interfaceConstructor The constructor
	 *        of the interface representing the service.
	 * @param {function(new: Implementation, ...*)} implementationConstructor
	 *        The constructor of the class implementing the service interface.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor function.
	 * @return {ObjectContainer} This object container.
	 */
	provide(interfaceConstructor, implementationConstructor,
			dependencies = []) {
		if ($Debug) {
			if (this._providers.has(interfaceConstructor)) {
				throw new Error('ima.ObjectContainer:provide The ' +
						'implementation of the provided interface ' +
						`(${interfaceConstructor.name}) has already been ` +
						`configured and cannot be overridden.`);
			}

			// check that implementation really extends interface
			let prototype = implementationConstructor.prototype;
			if (!(prototype instanceof interfaceConstructor)) {
				throw new Error('ima.ObjectContainer:provide The specified ' +
						`class (${implementationConstructor.name}) does not ` +
						`implement the ${interfaceConstructor.name} ` +
						`interface.`);
			}
		}

		let newEntry = this._createEntry(
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
	 * @param {(string|function(new: T, ...*)|function(...*): T)} name The name
	 *        of the alias, class, interface, or the class, interface or a
	 *        factory function.
	 * @return {T} The shared instance or value.
	 */
	get(name) {
		let entry = this._getEntry(name);

		if (entry.sharedInstance === null) {
			entry.sharedInstance = this._createInstanceFromEntry(entry);
		}

		return entry.sharedInstance;
	}

	/**
	 * Returns the class constructor function of the specified class.
	 *
	 * @template T
	 * @param {string|function(new: T, ...*)} name The name by which the class
	 *        is registered with this object container.
	 * @return {function(new: T, ...*)} The constructor function.
	 */
	getConstructorOf(name) {
		let entry = this._getEntry(name);

		return entry.classConstructor;
	}

	/**
	 * Returns {@code true} if the specified object, class or resource is
	 * registered with this object container.
	 *
	 * @template T
	 * @param {string|function(new: T, ...*)} name The resource name.
	 * @return {boolean} {@code true} if the specified object, class or
	 *         resource is registered with this object container.
	 */
	has(name) {
		return this._constants.has(name) ||
				this._aliases.has(name) ||
				this._registry.has(name) ||
				this._providers.has(name) ||
				!!this._getEntryFromConstant(name) ||
				!!this._getEntryFromNamespace(name) ||
				!!this._getEntryFromClassConstructor(name);
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
	 * @param {(string|function(new: T, ...*)|function(...*): T)} name The name
	 *        of the alias, class, interface, or the class, interface or a
	 *        factory function to use.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor or factory function.
	 * @return {T} Created instance or generated value.
	 */
	create(name, dependencies = []) {
		let entry = this._getEntry(name);

		return this._createInstanceFromEntry(entry, dependencies);
	}

	/**
	 * Clears all entries from this object container and resets the locking
	 * mechanism of this object container.
	 *
	 * @return {ObjectContainer} This object container.
	 */
	clear() {
		this._constants.clear();
		this._aliases.clear();
		this._registry.clear();
		this._providers.clear();
		this._lockCounter = 0;

		return this;
	}

	/**
	 * Returns {@code true} if this object container is locked.
	 *
	 * When the object container is locked, it is impossible to register new
	 * aliases using the {@linkcode bind()} method, or override the
	 * default class dependencies of any already-configured class using the
	 * {@linkcode inject()} method (classes that were not configured yet may be
	 * configured using the {@linkcode inject()} method).
	 *
	 * This prevents the unpriviledged code (e.g. 3rd party plugins) from
	 * overriding the default dependency configuration provided by ima, or
	 * overriding the configuration of a 3rd party plugin by another 3rd party
	 * plugin.
	 *
	 * The application itself has always access to the unlocked object
	 * container.
	 *
	 * @return {boolean} {@code true} if the Object container is currently
	 *         locked and no aliases can be created nor the default class
	 *         dependencies can be reconfigured.
	 */
	isLocked() {
		return !!(this._lockCounter % 2);
	}

	/**
	 * Locks the object container, preventing creation of new aliases and
	 * overriding the default dependencies of already configured classes.
	 *
	 * @return {ObjectContainer} This object container.
	 * @see #isLocked()
	 */
	lock() {
		if (this.isLocked() || (this._lockCounter !== 0)) {
			throw new Error(
				`ima.ObjectContainer:lock The lock() method has to be ` +
				`called only by the bootstrap script. Other calls are now ` +
				`allowed.`
			);
		}

		this._lockCounter++;

		return this;
	}

	/**
	 * Unlocks the object container, allowing the creation of new aliases and
	 * overriding the default dependencies of already configured classes again.
	 *
	 * @return {ObjectContainer} This object container.
	 */
	unlock() {
		if (!this.isLocked() || (this._lockCounter !== 1)) {
			throw new Error(
				`ima.ObjectContainer:unlock The unlock() method has to be ` +
				`called only by the bootstrap script. Other calls are not ` +
				`allowed.`
			);
		}

		this._lockCounter++;

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
	 * @template T
	 * @param {string|function(new: T, ...*)} name Name of a constant or alias,
	 *        factory function, class or interface constructor, or a fully
	 *        qualified namespace path.
	 * @return {?Entry<T>} The retrieved entry.
	 * @throws {Error} If no such constant, alias, registry, interface
	 *         implementation is known to this object container.
	 */
	_getEntry(name) {
		let entry = this._constants.get(name) ||
				this._aliases.get(name) ||
				this._registry.get(name) ||
				this._providers.get(name) ||
				this._getEntryFromConstant(name) ||
				this._getEntryFromNamespace(name) ||
				this._getEntryFromClassConstructor(name);

		if ($Debug) {
			if (!entry) {
				throw new Error(
					`ima.ObjectContainer:_getEntry There is no constant, ` +
					`alias, registered class, registered interface with ` +
					`configured implementation or namespace entry ` +
					`identified as ${name}. Check your bind.js file for ` +
					`typos or register ${name} with the object container.`
				);
			}
		}

		return entry;
	}

	/**
	 * Creates a new entry for the provided class or factory function and the
	 * provided dependencies.
	 *
	 * @template T
	 * @param {(function(new: T, ...*)|function(...*): T)} classConstructor The
	 *        class constructor or factory function.
	 * @param {*[]} [dependencies=[]] The dependencies to pass into the
	 *        constructor or factory function.
	 * @return {T} Created instance or generated value.
	 */
	_createEntry(classConstructor, dependencies = []) {
		if (
			(dependencies.length === 0) &&
			Array.isArray(classConstructor.$dependencies)
		) {
			dependencies = classConstructor.$dependencies;
		}

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
	 * @template T
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

			for (let dependency of entry.dependencies) {
				if (['function', 'string'].indexOf(typeof dependency) > -1) {
					dependencies.push(this.get(dependency));
				} else {
					dependencies.push(dependency);
				}
			}
		}
		let constructor = entry.classConstructor;

		return new constructor(...dependencies);
	}

	/**
	 * Retrieves the constant value denoted by the provided fully qualified
	 * composition name.
	 *
	 * The method returns the entry for the constant if the constant is registered
	 * with this object container, otherwise return {@code null}.
	 *
	 * Finally, if the constant composition name does not resolve to value,
	 * the method return {@code null}.
	 *
	 * @param {string} compositionName
	 * @return {?Entry<*>} An entry representing the value at the specified
	 *         composition name in the constants. The method returns {@code null}
	 *         if the specified composition name does not exist in the constants.
	 */
	_getEntryFromConstant(compositionName) {
		if (typeof compositionName !== 'string') {
			return null;
		}

		let objectProperties = compositionName.split('.');
		let constantValue = this._constants.has(objectProperties[0]) ?
				this._constants.get(objectProperties[0]).sharedInstance :
				null;

		let pathLength = objectProperties.length;
		for (let i = 1; (i < pathLength) && constantValue; i++) {
			constantValue = constantValue[objectProperties[i]];
		}

		if (constantValue !== undefined && constantValue !== null) {
			let entry = this._createEntry(() => constantValue);
			entry.sharedInstance = constantValue;

			return entry;
		}

		return null;
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
	 * Alternatively, if a constructor function is passed in instead of a
	 * namespace path, the method returns {@code null}.
	 *
	 * @template T
	 * @param {(string|function(new: T, ...*))} path Namespace path pointing to
	 *        a class or a value in the application namespace, or a constructor
	 *        function.
	 * @return {?Entry<T>} An entry representing the value or class at the
	 *         specified path in the namespace. The method returns {@code null}
	 *         if the specified path does not exist in the namespace.
	 */
	_getEntryFromNamespace(path) {
		if ((typeof path !== 'string') || !this._namespace.has(path)) {
			return null;
		}

		let namespaceValue = this._namespace.get(path);

		if (typeof namespaceValue === 'function') {
			if (this._registry.has(namespaceValue)) {
				return this._registry.get(namespaceValue);
			}

			if (this._providers.has(namespaceValue)) {
				return this._providers.get(namespaceValue);
			}

			return this._createEntry(namespaceValue);
		}

		let entry = this._createEntry(() => namespaceValue);
		entry.sharedInstance = namespaceValue;
		return entry;
	}

	/**
	 * Retrieves the class denoted by the provided class constructor.
	 *
	 * The method then checks whether there are defined {@code $dependecies}
	 * property for class. Then the class is registered to this object
	 * container.
	 *
	 * The method returns the entry for the class if the specified class
	 * does not have defined {@code $dependencies} property return
	 * {@code null}.
	 *
	 * @template T
	 * @param {function(new: T, ...*)} classConstructor
	 * @return {?Entry<T>} An entry representing the value at the specified
	 *         classConstructor. The method returns {@code null}
	 *         if the specified classConstructor does not have defined
	 *         {@code $dependencies}.
	 */
	_getEntryFromClassConstructor(classConstructor) {
		if (
			(typeof classConstructor === 'function') &&
			Array.isArray(classConstructor.$dependencies)
		) {
			this.inject(classConstructor, classConstructor.$dependencies);

			return this._registry.get(classConstructor);
		}

		return null;
	}

	/**
	 * Returns true if the defined entry has same classConstructor and
	 * dependecies with provided classConstructor and dependecies.
	 *
	 * @private
	 * @template T
	 * @param {Entry<function(): *>>} entry
	 * @param {function(new: T, ...*)} classConstructor
	 * @param {*[]} dependencies
	 * @return {boolean}
	 */
	_hasEntrySameValues(entry, classConstructor, dependencies) {
		return entry.classConstructor === classConstructor &&
			entry.dependencies.length === dependencies.length &&
			entry.dependencies.every((entryDependency, dependencyIndex) => {
				let testedDependency = dependencies[dependencyIndex];

				return entryDependency === testedDependency;
			});
	}
}

ns.ima.ObjectContainer = ObjectContainer;

/**
 * Object container entry, representing either a class, interface, constant or
 * an alias.
 *
 * @template T
 */
class Entry {

	/**
	 * Initializes the entry.
	 *
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
		 * @type {(function(new: T, ...*)|function(...*): T)}
		 */
		this.classConstructor = classConstructor;

		/**
		 * Dependencies of the class constructor of the class represented by
		 * this entry.
		 *
		 * @type {*[]}
		 */
		this.dependencies = dependencies;

		/**
		 * The shared instance of the class represented by this entry.
		 *
		 * @type {T}
		 */
		this.sharedInstance = null;
	}
}
