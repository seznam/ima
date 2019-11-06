'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var $Helper = _interopDefault(require('ima-helpers'));
var classnames = _interopDefault(require('classnames'));
var React = _interopDefault(require('react'));
var ReactDOM = _interopDefault(require('react-dom'));
var memoizeOne = _interopDefault(require('memoize-one'));

/**
 * Utility for linking vendor node modules with the application by exporting
 * them to the IMA loader's modules.
 */
class VendorLinker {
  /**
   * Initializes the vendor linker.
   */
  constructor() {
    /**
     * Internal storage of loaded modules.
     *
     * @type {Map<string, Object<string, *>>}
     */
    this._modules = new Map();

    /**
     * Internal storage of loaded IMA plugins.
     *
     * @type {Object<string, *>[]}
     */
    this._plugins = [];
  }

  /**
   * Sets the provided vendor node module to the internal registry of this
   * vendor linker, and registers an IMA loader module of the same name,
   * exporting the same values.
   *
   * @param {string} moduleName The name of the module.
   * @param {Object<string, *>} moduleValues Values exported from the module.
   */
  set(moduleName, moduleValues) {
    this._modules.set(moduleName, moduleValues);

    if (typeof moduleValues.$registerImaPlugin === 'function') {
      this._plugins.push({ name: moduleName, module: moduleValues });
    }

    $IMA.Loader.register(moduleName, [], exports => ({
      setters: [],
      execute: () => {
        // commonjs module compatibility
        exports('default', moduleValues);
        // ES2015 module compatibility
        for (let key of Object.keys(moduleValues)) {
          exports(key, moduleValues[key]);
        }
      }
    }));
  }

  /**
   * Returns the provided vendor node module from the internal registry of this
   * vendor linker.
   *
   * @param {string} moduleName The name of the module.
   * @param {?boolean} [imaInternalModule]
   * @return {Object<string, *>} moduleValues Values exported from the module.
   */
  get(moduleName, imaInternalModule) {
    if (!this._modules.has(moduleName) && !imaInternalModule) {
      throw new Error(
        `The module '${moduleName}' is not registered.` +
          `Add the module to vendors in build.js`
      );
    }

    return this._modules.get(moduleName);
  }

  /**
   * Clears all loaded modules and plugins from this vendor linker.
   *
   * @return {VendorLinker} This vendor linker.
   */
  clear() {
    this._modules.clear();
    this._plugins = [];

    return this;
  }

  /**
   * Binds the vendor modules loaded in this vendor linker to the
   * {@code Vendor} sub-namespace of the provided namespace.
   *
   * @param {Namespace} ns The namespace to which the vendor modules should
   *        be bound.
   */
  bindToNamespace(ns) {
    let nsVendor = ns.namespace('vendor');
    for (let name of this._modules.keys()) {
      let lib = this._modules.get(name);

      if (typeof lib.$registerImaPlugin === 'function') {
        lib.$registerImaPlugin(ns);
      }

      nsVendor[name] = lib;
    }
  }

  /**
   * Returns the loaded IMA plugins as an array of export objects.
   *
   * @return {Array<Object<string, *>>} The loaded IMA plugins.
   */
  getImaPlugins() {
    return this._plugins;
  }
}

var vendorLinker = new VendorLinker();

//let namespaceWarningEmitted = false;

/**
 * Namespace creation, manipulation and traversal utility. This utility is used
 * to create semi-global shared namespaces for registering references to
 * interfaces, classes and constants of the application to provide access to
 * each other more easily than by using the ES6 import/export mechanism.
 *
 * @deprecated
 */
class Namespace {
  /**
   * Initializes the namespace provider.
   *
   * This is a private constructor, you should use the exported {@code ns}
   * instance to create and use namespaces (see the examples).
   *
   * @private
   * @example
   *        import ns from 'ima/namespace/ns.js';
   *        ns.namespace('ima');
   *        ns.has('ima');
   */
  constructor() {}

  /**
   * Verifies that the specified path in namespace exists, creates it if it
   * does not, and returns the value at the specified path in the namespace.
   *
   * The method recursively creates all path parts in the namespaces as empty
   * plain objects for all path parts that do not exist yet, including the
   * last one. This means, that if called with a non-existing namespace path
   * as an argument, the return value will be the last created namespace
   * object.
   *
   * @deprecated
   * @param {string} path The namespace path.
   * @return {*} The value at the specified path in the namespace.
   */
  namespace(path) {
    /*if (
			(typeof $Debug !== 'undefined') &&
			$Debug &&
			/^app./i.test(path) &&
			!namespaceWarningEmitted
		) {
			console.warn(
				'DEPRECATION WARNING: Your application seems to be using ' +
				`namespaces (attempted to create the ${path} namespace), ` +
				'but namespaces were deprecated since IMA 0.12.0. Please ' +
				'switch to ES6 imports as the support for namespaces will ' +
				'be removed in an upcoming version of IMA.js.'
			);
			namespaceWarningEmitted = true;
		}*/

    let self = this;
    let levels = path.split('.');

    for (let levelName of levels) {
      if (!Object.prototype.hasOwnProperty.call(self, levelName)) {
        self[levelName] = {};
      }

      self = self[levelName];
    }

    return self;
  }

  /**
   * Verifies that the specified namespace path point to an existing
   * namespace or terminal value.
   *
   * @param {string} path The namespace path to test.
   * @return {boolean} {@code true} if the namespace or terminal value exists
   *         at the specified path.
   */
  has(path) {
    return typeof this.get(path) !== 'undefined';
  }

  /**
   * Return value for the specified namespace path point.
   *
   * @param {string} path The namespace path to test.
   * @return {*} The value at the specified path in the namespace.
   */
  get(path) {
    let self = this;
    let levels = path.split('.');

    for (let level of levels) {
      if (!self[level]) {
        return undefined;
      }

      self = self[level];
    }

    return self;
  }

  /**
   * Set value for the specified namespace path point.
   *
   * @param {string} path The namespace path to set.
   * @param {*} value
   */
  set(path, value) {
    let levels = path.split('.');
    const lastKey = levels.pop();
    let namespace = this.namespace(levels.join('.'));

    namespace[lastKey] = value;
  }
}

var ns = new Namespace();

ns.namespace('ima');

/**
 * The Object Container is an enhanced dependency injector with support for
 * aliases and constants, and allowing to reference classes in the application
 * namespace by specifying their fully qualified names.
 */
class ObjectContainer {
  /**
   * Returns constant for plugin binding state.
   *
   * When the object container is in plugin binding state, it is impossible
   * to register new aliases using the {@linkcode bind()} method and register
   * new constant using the {@linkcode constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@linkcode inject()} method (classes that were not configured yet may be
   * configured using the {@linkcode inject()} method or {@linkcode provide()}
   * method).
   *
   * This prevents the unpriviledged code (e.g. 3rd party plugins) from
   * overriding the default dependency configuration provided by ima, or
   * overriding the configuration of a 3rd party plugin by another 3rd party
   * plugin.
   *
   * The application itself has always access to the unlocked object
   * container.
   *
   * @return {string} The plugin binding state.
   */
  static get PLUGIN_BINDING_STATE() {
    return 'plugin';
  }

  /**
   * Returns constant for IMA binding state.
   *
   * When the object container is in ima binding state, it is possible
   * to register new aliases using the {@linkcode bind()} method and register
   * new constant using the {@linkcode constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@linkcode inject()} method (classes that were not configured yet may be
   * configured using the {@linkcode inject()} method or {@linkcode provide()}
   * method).
   *
   * @return {string} The IMA binding state.
   */
  static get IMA_BINDING_STATE() {
    return 'ima';
  }

  /**
   * Returns constant for app binding state.
   *
   * When the object container is in app binding state, it is possible
   * to register new aliases using the {@linkcode bind()} method and register
   * new constant using the {@linkcode constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@linkcode inject()} method (classes that were not configured yet may be
   * configured using the {@linkcode inject()} method or {@linkcode provide()}
   * method).
   *
   * @return {string} The app binding state.
   */
  static get APP_BINDING_STATE() {
    return 'app';
  }

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
     *
     * @type {Map<(string|function(new: *, ...*)|function(...*): *), Entry<*>>}
     */
    this._entries = new Map();

    /**
     * The current binding state.
     *
     * The {@linkcode setBindingState()} method may be called for changing
     * object container binding state only by the bootstrap script.
     *
     * @type {?string}
     */
    this._bindingState = null;

    /**
     * The current plugin binding to OC.
     *
     * The {@linkcode setBindingState()} method may be called for changing
     * object container binding state only by the bootstrap script.
     *
     * @type {?string}
     */
    this._bindingPlugin = null;
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
   * @param {?*[]} [dependencies] The dependencies to pass into the
   *        constructor or factory function.
   * @return {ObjectContainer} This object container.
   */
  bind(name, classConstructor, dependencies) {
    if ($Debug) {
      if (this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE) {
        throw new Error(
          `ima.ObjectContainer:bind Object container ` +
            `is locked. You do not have the permission to ` +
            `create a new alias named ${name}.`
        );
      }

      if (typeof classConstructor !== 'function') {
        throw new Error(
          `ima.ObjectContainer:bind The second ` +
            `argument has to be a class constructor function, ` +
            `but ${classConstructor} was provided. Fix alias ` +
            `${name} for your bind.js file.`
        );
      }
    }

    let classConstructorEntry = this._entries.get(classConstructor);
    let nameEntry = this._entries.get(name);
    let entry = classConstructorEntry || nameEntry;

    if (classConstructorEntry && !nameEntry && dependencies) {
      let entry = this._createEntry(classConstructor, dependencies);
      this._entries.set(name, entry);

      return this;
    }

    if (entry) {
      this._entries.set(name, entry);

      if (dependencies) {
        this._updateEntryValues(entry, classConstructor, dependencies);
      }
    } else {
      let entry = this._createEntry(classConstructor, dependencies);
      this._entries.set(classConstructor, entry);
      this._entries.set(name, entry);
    }

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
      if (this._entries.has(name) || !!this._getEntryFromConstant(name)) {
        throw new Error(
          `ima.ObjectContainer:constant The ${name} ` +
            `constant has already been declared and cannot be ` +
            `redefined.`
        );
      }

      if (this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE) {
        throw new Error(
          `ima.ObjectContainer:constant The ${name} ` +
            `constant can't be declared in plugin. ` +
            `The constant must be define in app/config/bind.js file.`
        );
      }
    }

    let constantEntry = this._createEntry(() => value, [], {
      writeable: false
    });
    constantEntry.sharedInstance = value;
    this._entries.set(name, constantEntry);

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
   * @param {?*[]} dependencies The dependencies to pass into the
   *        constructor function.
   * @return {ObjectContainer} This object container.
   */
  inject(classConstructor, dependencies) {
    if ($Debug) {
      if (typeof classConstructor !== 'function') {
        throw new Error(
          `ima.ObjectContainer:inject The first ` +
            `argument has to be a class constructor function, ` +
            `but ${classConstructor} was provided. Fix your ` +
            `bind.js file.`
        );
      }

      if (
        this._entries.has(classConstructor) &&
        this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE
      ) {
        throw new Error(
          `ima.ObjectContainer:inject The ` +
            `${classConstructor.name} has already had its ` +
            `default dependencies configured, and the object ` +
            `container is currently locked, therefore the ` +
            `dependency configuration cannot be override. The ` +
            `dependencies of the provided class must be ` +
            `overridden from the application's bind.js ` +
            `configuration file.`
        );
      }
    }

    let classConstructorEntry = this._entries.get(classConstructor);
    if (classConstructorEntry) {
      if (dependencies) {
        this._updateEntryValues(
          classConstructorEntry,
          classConstructor,
          dependencies
        );
      }
    } else {
      classConstructorEntry = this._createEntry(classConstructor, dependencies);
      this._entries.set(classConstructor, classConstructorEntry);
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
   * @param {?*[]} dependencies The dependencies to pass into the
   *        constructor function.
   * @return {ObjectContainer} This object container.
   */
  provide(interfaceConstructor, implementationConstructor, dependencies) {
    if ($Debug) {
      if (
        this._entries.has(interfaceConstructor) &&
        this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE
      ) {
        throw new Error(
          'ima.ObjectContainer:provide The ' +
            'implementation of the provided interface ' +
            `(${interfaceConstructor.name}) has already been ` +
            `configured and cannot be overridden.`
        );
      }

      // check that implementation really extends interface
      let prototype = implementationConstructor.prototype;
      if (!(prototype instanceof interfaceConstructor)) {
        throw new Error(
          'ima.ObjectContainer:provide The specified ' +
            `class (${implementationConstructor.name}) does not ` +
            `implement the ${interfaceConstructor.name} ` +
            `interface.`
        );
      }
    }

    let classConstructorEntry = this._entries.get(implementationConstructor);
    if (classConstructorEntry) {
      this._entries.set(interfaceConstructor, classConstructorEntry);

      if (dependencies) {
        this._updateEntryValues(
          classConstructorEntry,
          implementationConstructor,
          dependencies
        );
      }
    } else {
      classConstructorEntry = this._createEntry(
        implementationConstructor,
        dependencies
      );
      this._entries.set(implementationConstructor, classConstructorEntry);
      this._entries.set(interfaceConstructor, classConstructorEntry);
    }

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
    return (
      this._entries.has(name) ||
      !!this._getEntryFromConstant(name) ||
      !!this._getEntryFromNamespace(name) ||
      !!this._getEntryFromClassConstructor(name)
    );
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
   * @param {?*[]} dependencies The dependencies to pass into the
   *        constructor or factory function.
   * @return {T} Created instance or generated value.
   */
  create(name, dependencies) {
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
    this._entries.clear();
    this._bindingState = null;
    this._bindingPlugin = null;

    return this;
  }

  /**
   *
   * @param {?string} bindingState
   * @param {?string} bindingPluginName
   */
  setBindingState(bindingState, bindingPluginName = null) {
    if (this._bindingState === ObjectContainer.APP_BINDING_STATE) {
      throw new Error(
        `ima.ObjectContainer:setBindingState The setBindingState() ` +
          `method  has to be called only by the bootstrap script. Other ` +
          `calls are not allowed.`
      );
    }

    this._bindingState = bindingState;
    this._bindingPlugin =
      bindingState === ObjectContainer.PLUGIN_BINDING_STATE
        ? bindingPluginName
        : null;
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
    let entry =
      this._entries.get(name) ||
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
   * The method update classConstructor and dependencies for defined entry.
   * The entry throw Error for constants and if you try override dependencies
   * more than once.
   *
   * @template T
   * @param {(function(new: T, ...*)|function(...*): T)} classConstructor The
   *        class constructor or factory function.
   * @param {Entry} entry The entry representing the class that should
   *        have its instance created or factory faction to use to create a
   *        value.
   * @param {*[]} dependencies The dependencies to pass into the
   *        constructor or factory function.
   */
  _updateEntryValues(entry, classConstructor, dependencies) {
    entry.classConstructor = classConstructor;
    entry.dependencies = dependencies;
  }

  /**
   * Creates a new entry for the provided class or factory function, the
   * provided dependencies and entry options.
   *
   * @template T
   * @param {(function(new: T, ...*)|function(...*): T)} classConstructor The
   *        class constructor or factory function.
   * @param {?*[]} [dependencies] The dependencies to pass into the
   *        constructor or factory function.
   * @param {{ writeable: boolean }} options
   * @return {T} Created instance or generated value.
   */
  _createEntry(classConstructor, dependencies, options) {
    if (
      (!dependencies || dependencies.length === 0) &&
      Array.isArray(classConstructor.$dependencies)
    ) {
      dependencies = classConstructor.$dependencies;
    }

    let referrer = this._bindingState;

    if (this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE) {
      referrer = this._bindingPlugin;
    }

    return new Entry(classConstructor, dependencies, referrer, options);
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
    //TODO entries must be
    if (typeof compositionName !== 'string') {
      return null;
    }

    let objectProperties = compositionName.split('.');
    let constantValue = this._entries.has(objectProperties[0])
      ? this._entries.get(objectProperties[0]).sharedInstance
      : null;

    let pathLength = objectProperties.length;
    for (let i = 1; i < pathLength && constantValue; i++) {
      constantValue = constantValue[objectProperties[i]];
    }

    if (constantValue !== undefined && constantValue !== null) {
      let entry = this._createEntry(() => constantValue, [], {
        writeable: false
      });
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
    if (typeof path !== 'string' || !this._namespace.has(path)) {
      return null;
    }

    let namespaceValue = this._namespace.get(path);

    if (typeof namespaceValue === 'function') {
      if (this._entries.has(namespaceValue)) {
        return this._entries.get(namespaceValue);
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
      typeof classConstructor === 'function' &&
      Array.isArray(classConstructor.$dependencies)
    ) {
      let entry = this._createEntry(
        classConstructor,
        classConstructor.$dependencies
      );
      this._entries.set(classConstructor, entry);

      return entry;
    }

    return null;
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
   * @param {?string} referrer Reference to part of application that created
   *        this entry.
   * @param {?{ writeable: boolean }} [options] The Entry options.
   */
  constructor(classConstructor, dependencies, referrer, options) {
    /**
     * The constructor of the class represented by this entry, or the
     * getter of the value of the constant represented by this entry.
     *
     * @type {(function(new: T, ...*)|function(...*): T)}
     */
    this.classConstructor = classConstructor;

    /**
     * The shared instance of the class represented by this entry.
     *
     * @type {T}
     */
    this.sharedInstance = null;

    /**
     * The Entry options.
     *
     * @type {{ writeable: boolean }}
     */
    this._options = options || {
      writeable: true
    };

    /**
     * Reference to part of application that created
     * this entry.
     *
     * @type {string}
     */
    this._referrer = referrer;

    /**
     * Dependencies of the class constructor of the class represented by
     * this entry.
     *
     * @type {*[]}
     */
    this._dependencies = dependencies || [];

    /**
     * The override counter
     *
     * @type {number}
     */
    this._overrideCounter = 0;
  }

  set dependencies(dependencies) {
    if ($Debug) {
      if (!this.writeable) {
        throw new Error(
          `The entry is constant and you ` +
            `can't redefined their dependencies ${dependencies}.`
        );
      }

      if (this._overrideCounter >= 1) {
        throw new Error(
          `The dependencies entry can't be overrided more than once.` +
            `Fix your bind.js file for classConstructor ${this.classConstructor.name}.`
        );
      }
    }

    this._dependencies = dependencies;
    this._overrideCounter++;
  }

  get dependencies() {
    return this._dependencies;
  }

  get referrer() {
    return this._referrer;
  }

  get writeable() {
    return this._options.writeable;
  }
}

/**
 * The router manages the application's routing configuration and dispatches
 * controllers and views according to the current URL and the route it matches.
 *
 * @interface
 */
class Router {
  /**
   * Initializes the router with the provided configuration.
   *
   * @param {{
   *          $Protocol: string,
   *          $Root: string,
   *          $LanguagePartPath: string,
   *          $Host: string
   *        }} config Router configuration.
   *        The {@code $Protocol} field must be the current protocol used to
   *        access the application, terminated by a collon (for example
   *        {@code https:}).
   *        The {@code $Root} field must specify the URL path pointing to the
   *        application's root.
   *        The {@code $LanguagePartPath} field must be the URL path fragment
   *        used as a suffix to the {@code $Root} field that specifies the
   *        current language.
   *        The {@code $Host} field must be the application's domain (and the
   *        port number if other than the default is used) in the following
   *        form: {@code `${protocol}//${host}`}.
   */
  init() {}

  /**
   * Adds a new route to router.
   *
   * @param {string} name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param {string} pathExpression A path expression specifying the URL path
   *        part matching this route (must not contain a query string),
   *        optionally containing named parameter placeholders specified as
   *        {@code :parameterName}. The name of the parameter is terminated
   *        by a forward slash ({@code /}) or the end of the path expression
   *        string.
   *        The path expression may also contain optional parameters, which
   *        are specified as {@code :?parameterName}. It is recommended to
   *        specify the optional parameters at the end of the path
   *        expression.
   * @param {string} controller The full name of Object Container alias
   *        identifying the controller associated with this route.
   * @param {string} view The full name or Object Container alias identifying
   *        the view class associated with this route.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          allowSPA: boolean=,
   *          documentView: ?function(new: AbstractDocumentView)=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=
   *        }=} options
   *        Additional route options, specified how the navigation to the
   *        route will be handled.
   *        The {@code onlyUpdate} can be either a flag signalling whether
   *        the current controller and view instances should be kept if they
   *        match the ones used by the previous route; or a callback function
   *        that will receive the previous controller and view identifiers
   *        used in the previously matching route, and returns a
   *        {@code boolean} representing the value of the flag. This flag is
   *        disabled by default.
   *        The {@code autoScroll} flag signals whether the page should be
   *        scrolled to the top when the navigation takes place. This flag is
   *        enabled by default.
   *        The {@code allowSPA} flag can be used to make the route
   *        always served from the server and never using the SPA page even
   *        if the server is overloaded. This is useful for routes that use
   *        different document views (specified by the {@code documentView}
   *        option), for example for rendering the content of iframes.
   * @return {Router} This router.
   * @throws {ImaError} Thrown if a route with the same name already exists.
   */
  add() {}

  /**
   * Removes the specified route from the router's known routes.
   *
   * @param {string} name The route's unique name, identifying the route to
   *        remove.
   * @return {Router} This router.
   */
  remove() {}

  /**
   * Returns the current path part of the current URL, including the query
   * string (if any).
   *
   * @return {string} The path and query parts of the current URL.
   */
  getPath() {}

  /**
   * Returns the current absolute URL (including protocol, host, query, etc).
   *
   * @return {string} The current absolute URL.
   */
  getUrl() {}

  /**
   * Returns the application's absolute base URL, pointing to the public root
   * of the application.
   *
   * @return {string} The application's base URL.
   */
  getBaseUrl() {}

  /**
   * Returns the application's domain in the following form
   * {@code `${protocol}//${host}`}.
   *
   * @return {string} The current application's domain.
   */
  getDomain() {}

  /**
   * Returns application's host (domain and, if necessary, the port number).
   *
   * @return {string} The current application's host.
   */
  getHost() {}

  /**
   * Returns the current protocol used to access the application, terminated
   * by a colon (for example {@code https:}).
   *
   * @return {string} The current application protocol used to access the
   *         application.
   */
  getProtocol() {}

  /**
   * Returns the information about the currently active route.
   *
   * @return {{
   *           route: Route,
   *           params: Object<string, string>,
   *           path: string
   *         }} The information about the current route.
   * @throws {ImaError} Thrown if a route is not define for current path.
   */
  getCurrentRouteInfo() {}

  /**
   * Registers event listeners at the client side window object allowing the
   * router to capture user's history (history pop state - going "back") and
   * page (clicking links) navigation.
   *
   * The router will start processing the navigation internally, handling the
   * user's navigation to display the page related to the URL resulting from
   * the user's action.
   *
   * Note that the router will not prevent forms from being submitted to the
   * server.
   *
   * The effects of this method cannot be reverted. This method has no effect
   * at the server side.
   *
   * @return {Router} This router.
   */
  listen() {}

  /**
   * Redirects the client to the specified location.
   *
   * At the server side the method results in responding to the client with a
   * redirect HTTP status code and the {@code Location} header.
   *
   * At the client side the method updates the current URL by manipulating
   * the browser history (if the target URL is at the same domain and
   * protocol as the current one) or performs a hard redirect (if the target
   * URL points to a different protocol or domain).
   *
   * The method will result in the router handling the new URL and routing
   * the client to the related page if the URL is set at the client side and
   * points to the same domain and protocol.
   *
   * @param {string} url The URL to which the client should be redirected.
   * @param {{
   *          httpStatus: number=,
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          allowSPA: boolean=,
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=
   *        }} [options={}] The options overrides route options defined in
   *        the {@code routes.js} configuration file.
   * @param {{ type: string, payload: Object|Event }} [action] An action object
   *        describing what triggered this routing.
   */
  redirect() {}

  /**
   * Generates an absolute URL (including protocol, domain, etc) for the
   * specified route by substituting the route's parameter placeholders with
   * the provided parameter values.
   *
   * @param {string} routeName The unique name of the route, identifying the
   *        route to use.
   * @param {Object<string, string>} params Parameter values for the route's
   *        parameter placeholders. Extraneous parameters will be added as
   *        URL query.
   * @return {string} An absolute URL for the specified route and parameters.
   */
  link() {}

  /**
   * Routes the application to the route matching the providing path, renders
   * the route page and sends the result to the client.
   *
   * @param {string} path The URL path part received from the client, with
   *        optional query.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          allowSPA: boolean=,
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=
   *        }} [options={}] The options overrides route options defined in
   *        the {@code routes.js} configuration file.
   * @param {{ type: string, event: Event|null, url: string|null }} [action] An action object
   *        describing what triggered this routing.
   * @return {Promise<Object<string, *>>} A promise resolved
   *         when the error has been handled and the response has been sent
   *         to the client, or displayed if used at the client side.
   */
  route() {}

  /**
   * Handles an internal server error by responding with the appropriate
   * "internal server error" error page.
   *
   * @param {Object<string, (Error|string)>} params Parameters extracted from
   *        the current URL path and query.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          serverSPA: boolean=,
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=
   *        }} [options={}] The options overrides route options defined in
   *        the {@code routes.js} configuration file.
   * @return {Promise<Object<string, *>>} A promise resolved when the error
   *         has been handled and the response has been sent to the client,
   *         or displayed if used at the client side.
   */
  handleError() {}

  /**
   * Handles a "not found" error by responding with the appropriate "not
   * found" error page.
   *
   * @param {Object<string, (Error|string)>} params Parameters extracted from
   *        the current URL path and query.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          allowSPA: boolean=,
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component),
   *          viewAdapter: ?function(new: React.Component)
   *        }} [options={}] The options overrides route options defined in
   *        the {@code routes.js} configuration file.
   * @return {Promise<Object<string, *>>} A promise resolved
   *         when the error has been handled and the response has been sent
   *         to the client, or displayed if used at the client side.
   */
  handleNotFound() {}

  /**
   * Tests, if possible, whether the specified error was caused by the
   * client's action (for example wrong URL or request encoding) or by a
   * failure at the server side.
   *
   * @param {(ImaError|Error)} reason The encountered error.
   * @return {boolean} {@code true} if the error was caused the action of the
   *         client.
   */
  isClientError() {}

  /**
   * Tests, if possible, whether the specified error lead to redirection.
   *
   * @param {(ImaError|Error)} reason The encountered error.
   * @return {boolean} {@code true} if the error was caused the action of the
   *         redirection.
   */
  isRedirection() {}
}

ns.namespace('ima');

/**
 * Environment name value in the production environment.
 *
 * @const
 * @type {string}
 */
const PRODUCTION_ENVIRONMENT = 'prod';

/**
 * Application bootstrap used to initialize the environment and the application
 * itself.
 */
class Bootstrap {
  /**
   * Initializes the bootstrap.
   *
   * @param {ObjectContainer} oc The application's object container to use
   *        for managing dependencies.
   */
  constructor(oc) {
    /**
     * The object container used to manage dependencies.
     *
     * @type {ObjectContainer}
     */
    this._oc = oc;

    /**
     * Application configuration.
     *
     * @type {Object<string, *>}
     */
    this._config = {};
  }

  /**
   * Initializes the application by running the bootstrap sequence. The
   * sequence initializes the components of the application in the following
   * order:
   * - application settings
   * - constants, service providers and class dependencies configuration
   * - services
   * - UI components
   * - routing
   *
   * @param {Object<string, *>} config The application environment
   *        configuration for the current environment.
   */
  run(config) {
    this._config = config;

    this._initSettings();
    this._bindDependencies();
    this._initServices();
    this._initRoutes();
  }

  /**
   * Initializes the application settings. The method loads the settings for
   * all environments and then pics the settings for the current environment.
   *
   * The method also handles using the values in the production environment
   * as default values for configuration items in other environments.
   */
  _initSettings() {
    let currentApplicationSettings = {};

    let plugins = this._config.plugins.concat([
      { name: ObjectContainer.APP_BINDING_STATE, module: this._config }
    ]);

    plugins
      .filter(plugin => typeof plugin.module.initSettings === 'function')
      .forEach(plugin => {
        let allPluginSettings = plugin.module.initSettings(
          ns,
          this._oc,
          this._config.settings
        );
        let environmentPluginSetting = $Helper.resolveEnvironmentSetting(
          allPluginSettings,
          this._config.settings.$Env
        );

        $Helper.assignRecursivelyWithTracking(plugin.name)(
          currentApplicationSettings,
          environmentPluginSetting
        );
      });

    this._config.bind = Object.assign(
      this._config.bind || {},
      currentApplicationSettings,
      this._config.settings
    );
  }

  /**
   * Returns setting for current environment where base values are from production
   * environment and other environments override base values.
   *
   * @return {Object<string, *>}
   */
  _getEnvironmentSetting(allSettings) {
    let environment = this._config.settings.$Env;
    let environmentSetting = allSettings[environment] || {};

    if (environment !== PRODUCTION_ENVIRONMENT) {
      let productionSettings = allSettings[PRODUCTION_ENVIRONMENT];
      $Helper.assignRecursively(productionSettings, environmentSetting);
      environmentSetting = productionSettings;
    }

    return environmentSetting;
  }

  /**
   * Binds the constants, service providers and class dependencies to the
   * object container.
   */
  _bindDependencies() {
    this._oc.setBindingState(ObjectContainer.IMA_BINDING_STATE);
    this._config.initBindIma(
      ns,
      this._oc,
      this._config.bind,
      ObjectContainer.IMA_BINDING_STATE
    );

    this._config.plugins
      .filter(plugin => typeof plugin.module.initBind === 'function')
      .forEach(plugin => {
        this._oc.setBindingState(
          ObjectContainer.PLUGIN_BINDING_STATE,
          plugin.name
        );
        plugin.module.initBind(ns, this._oc, this._config.bind, plugin.name);
      });

    this._oc.setBindingState(ObjectContainer.APP_BINDING_STATE);
    this._config.initBindApp(
      ns,
      this._oc,
      this._config.bind,
      ObjectContainer.APP_BINDING_STATE
    );
  }

  /**
   * Initializes the routes.
   */
  _initRoutes() {
    let router = this._oc.get(Router);
    this._config.initRoutes(ns, this._oc, this._config.routes, router);
  }

  /**
   * Initializes the basic application services.
   */
  _initServices() {
    this._config.initServicesIma(ns, this._oc, this._config.services);

    this._config.plugins
      .filter(plugin => typeof plugin.module.initServices === 'function')
      .forEach(plugin => {
        plugin.module.initServices(ns, this._oc, this._config.services);
      });

    this._config.initServicesApp(ns, this._oc, this._config.services);
  }
}

ns.ima.Bootstrap = Bootstrap;

/**
 * The cache provides a temporary storage for expirable information. The
 * primary use of a cache is caching information obtained via costly means
 * (CPU-heavy computation or networking) to speed up the application's
 * performance when the same information needs to be retrieved multiple times.
 *
 * @interface
 */
class Cache {
  /**
   * Clears the cache by deleting all entries.
   */
  clear() {}

  /**
   * Tests whether the cache contains a fresh entry for the specified key. A
   * cache entry is fresh if the has not expired its TTL (time to live).
   *
   * The method always returns `false` if the cache is currently disabled.
   *
   * @param {string} key The identifier of the cache entry.
   * @return {boolean} `true` if the cache is enabled, the entry exists and has
   *         not expired yet.
   */
  has() {}

  /**
   * Returns the value of the entry identified by the specified key.
   *
   * The method returns `null` if the specified entry does not exist, has
   * already expired, or the cache is currently disabled.
   *
   * @param {string} key The identifier of the cache entry.
   * @return {*} The value of the specified cache entry, or `null` if the entry
   *         is not available.
   */
  get() {}

  /**
   * Sets the cache entry identified by the specified key to the provided
   * value. The entry is created if it does not exist yet.
   *
   * The method has no effect if the cache is currently disabled.
   *
   * @param {string} key The identifier of the cache entry.
   * @param {*} value The cache entry value.
   * @param {?number=} ttl Cache entry time to live in milliseconds. The
   *        entry will expire after the specified amount of milliseconds. Use
   *        `null` or omit the parameter to use the default TTL of this cache.
   */
  set() {}

  /**
   * Deletes the specified cache entry. The method has no effect if the entry
   * does not exist.
   *
   * @param {string} key The identifier of the cache entry.
   */
  delete() {}

  /**
   * Disables the cache, preventing the retrieval of any cached entries and
   * reporting all cache entries as non-existing. Disabling the cache does
   * not however prevent modifying the existing or creating new cache
   * entries.
   *
   * Disabling the cache also clears all of its current entries.
   *
   * The method has no effect if the cache is already disabled.
   */
  disable() {}

  /**
   * Enables the cache, allowing the retrieval of cache entries.
   *
   * The method has no effect if the cache is already enabled.
   */
  enable() {}

  /**
   * Exports the state of this cache to an HTML-safe JSON string. The data
   * obtained by parsing the result of this method are compatible with the
   * {@link Cache#deserialize} method.
   *
   * @return {string} A JSON string containing an object representing of the
   *         current state of this cache.
   */
  serialize() {}

  /**
   * Loads the provided serialized cache data into this cache. Entries
   * present in this cache but not specified in the provided data will remain
   * in this cache intact.
   *
   * @param {Object<string, {value: *, ttl: number}>} serializedData An
   *        object representing the state of the cache to load, obtained by
   *        parsing the JSON string returned by the {@link Cache#serialize}
   *        method.
   */
  deserialize() {}
}

/**
 * The cache entry is a typed container of cache data used to track the
 * creation and expiration of cache entries.
 */
class CacheEntry {
  /**
   * Initializes the cache entry.
   *
   * @param {*} value The cache entry value.
   * @param {number} ttl The time to live in milliseconds.
   */
  constructor(value, ttl) {
    /**
     * Cache entry value.
     *
     * @type {*}
     */
    this._value = value;

    /**
     * The time to live in milliseconds. The cache entry is considered
     * expired after this time.
     *
     * @type {number}
     */
    this._ttl = ttl;

    /**
     * The timestamp of creation of this cache entry.
     *
     * @type {number}
     */
    this._created = Date.now();
  }

  /**
   * Returns `true` if this entry has expired.
   *
   * @return {boolean} `true` if this entry has expired.
   */
  isExpired() {
    let now = Date.now();
    return now > this._created + this._ttl;
  }

  /**
   * Exports this cache entry into a JSON-serializable object.
   *
   * @return {{value: *, ttl: number}} This entry exported to a
   *         JSON-serializable object.
   */
  serialize() {
    return { value: this._value, ttl: this._ttl };
  }

  /**
   * Returns the entry value.
   *
   * @return {*} The entry value.
   */
  getValue() {
    return this._value;
  }
}

/**
 * Factory for creating instances of {@link CacheEntry}.
 */
class CacheFactory {
  static get $dependencies() {
    return [];
  }

  /**
   * Create a new instance of {@link CacheEntry} with value and ttl.
   *
   * @param {*} value The cache entry value.
   * @param {?number=} ttl Cache entry time to live in milliseconds. The
   *        entry will expire after the specified amount of milliseconds.
   * @return {CacheEntry} The created cache entry.
   */
  createCacheEntry(value, ttl) {
    return new CacheEntry(value, ttl);
  }
}

/**
 * Configurable generic implementation of the {@link Cache} interface.
 *
 * @example
 * if (cache.has('model.articles')) {
 *   return cache.get('model.articles');
 * } else {
 *   let articles = getArticlesFromStorage();
 *   // cache for an hour
 *   cache.set('model.articles', articles, 60 * 60 * 1000);
 * }
 * @extends Cache
 */
class CacheImpl extends Cache {
  /**
   * Initializes the cache.
   *
   * @param {Storage} cacheStorage The cache entry storage to use.
   * @param {CacheFactory} factory Which create new instance of cache entry.
   * @param {vendor.$Helper} Helper The IMA.js helper methods.
   * @param {{ttl: number, enabled: boolean}} [config={ttl: 30000, enabled: false}]
   *        The cache configuration.
   */
  constructor(
    cacheStorage,
    factory,
    Helper,
    config = { ttl: 30000, enabled: false }
  ) {
    super();

    /**
     * Cache entry storage.
     *
     * @type {Storage}
     */
    this._cache = cacheStorage;

    /**
     * @type {CacheFactory}
     */
    this._factory = factory;

    /**
     * Tha IMA.js helper methods.
     *
     * @type {vendor.$Helper}
     */
    this._Helper = Helper;

    /**
     * Default cache entry time to live in milliseconds.
     *
     * @type {number}
     */
    this._ttl = config.ttl;

    /**
     * Flag signalling whether the cache is currently enabled.
     *
     * @type {boolean}
     */
    this._enabled = config.enabled;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._cache.clear();
  }

  /**
   * @inheritdoc
   */
  has(key) {
    if (!this._enabled || !this._cache.has(key)) {
      return false;
    }

    let cacheEntry = this._cache.get(key);
    if (cacheEntry && !cacheEntry.isExpired()) {
      return true;
    }

    this.delete(key);

    return false;
  }

  /**
   * @inheritdoc
   */
  get(key) {
    if (this.has(key)) {
      let value = this._cache.get(key).getValue();

      return this._clone(value);
    }

    return null;
  }

  /**
   * @inheritdoc
   */
  set(key, value, ttl = null) {
    if (!this._enabled) {
      return;
    }

    let cacheEntry = this._factory.createCacheEntry(
      this._clone(value),
      ttl || this._ttl
    );

    this._cache.set(key, cacheEntry);
  }

  /**
   * @inheritdoc
   */
  delete(key) {
    this._cache.delete(key);
  }

  /**
   * @inheritdoc
   */
  disable() {
    this._enabled = false;
    this.clear();
  }

  /**
   * @inheritdoc
   */
  enable() {
    this._enabled = true;
  }

  /**
   * @inheritdoc
   */
  serialize() {
    let dataToSerialize = {};

    for (let key of this._cache.keys()) {
      const currentValue = this._cache.get(key);

      if (currentValue instanceof CacheEntry) {
        const serializeEntry = currentValue.serialize();

        if (serializeEntry.ttl === Infinity) {
          serializeEntry.ttl = 'Infinity';
        }

        if ($Debug) {
          if (!this._canSerializeValue(serializeEntry.value)) {
            throw new Error(
              `ima.cache.CacheImpl:serialize An ` +
                `attempt to serialize ` +
                `${serializeEntry.value.toString()}, stored ` +
                `using the key ${key}, was made, but the value ` +
                `cannot be serialized. Remove this entry from ` +
                `the cache or change its type so that can be ` +
                `serialized using JSON.stringify().`
            );
          }
        }

        dataToSerialize[key] = serializeEntry;
      }
    }

    return JSON.stringify(dataToSerialize).replace(/<\/script/gi, '<\\/script');
  }

  /**
   * @inheritdoc
   */
  deserialize(serializedData) {
    for (let key of Object.keys(serializedData)) {
      let cacheEntryItem = serializedData[key];

      if (cacheEntryItem.ttl === 'Infinity') {
        cacheEntryItem.ttl = Infinity;
      }

      this.set(key, cacheEntryItem.value, cacheEntryItem.ttl);
    }
  }

  /**
   * Tests whether the provided value can be serialized into JSON.
   *
   * @param {*} value The value to test whether or not it can be serialized.
   * @return {boolean} `true` if the provided value can be serialized into JSON,
   *         `false` otherwise.
   */
  _canSerializeValue(value) {
    if (
      value instanceof Date ||
      value instanceof RegExp ||
      value instanceof Promise ||
      typeof value === 'function'
    ) {
      console.warn('The provided value is not serializable: ', value);

      return false;
    }

    if (!value) {
      return true;
    }

    if (value.constructor === Array) {
      for (let element of value) {
        if (!this._canSerializeValue(element)) {
          console.warn('The provided array is not serializable: ', value);

          return false;
        }
      }
    }

    if (typeof value === 'object') {
      for (let propertyName of Object.keys(value)) {
        if (!this._canSerializeValue(value[propertyName])) {
          console.warn(
            'The provided object is not serializable due to the ' +
              'following property: ',
            propertyName,
            value
          );

          return false;
        }
      }
    }

    return true;
  }

  /**
   * Attempts to clone the provided value, if possible. Values that cannot be
   * cloned (e.g. promises) will be simply returned.
   *
   * @param {*} value The value to clone.
   * @return {*} The created clone, or the provided value if the value cannot be
   *         cloned.
   */
  _clone(value) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Promise)
    ) {
      return this._Helper.clone(value);
    }

    return value;
  }
}

/**
 * Interface defining the common API of page controllers. A page controller is
 * used to manage the overall state and view of a single application page, and
 * updates the page state according to the events submitted to it by components
 * on the page (or other input).
 *
 * @interface
 */
class Controller {
  /**
   * Callback for initializing the controller after the route parameters have
   * been set on this controller.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  init() {}

  /**
   * Finalization callback, called when the controller is being discarded by
   * the application. This usually happens when the user navigates to a
   * different URL.
   *
   * This method is the lifecycle counterpart of the {@link Controller#init}
   * method.
   *
   * The controller should release all resources obtained in the
   * {@link Controller#init} method. The controller must release any resources
   * that might not be released automatically when the controller's instance
   * is destroyed by the garbage collector.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  destroy() {}

  /**
   * Callback for activating the controller in the UI. This is the last
   * method invoked during controller initialization, called after all the
   * promises returned from the {@link Controller#load} method have been
   * resolved and the controller has configured the meta manager.
   *
   * The controller may register any React and DOM event listeners in this
   * method. The controller may start receiving event bus event after this
   * method completes.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  activate() {}

  /**
   * Callback for deactivating the controller in the UI. This is the first
   * method invoked during controller deinitialization. This usually happens
   * when the user navigates to a different URL.
   *
   * This method is the lifecycle counterpart of the
   * {@link Controller#activate} method.
   *
   * The controller should deregister listeners registered and release all
   * resources obtained in the {@link Controller#activate} method.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  deactivate() {}

  /**
   * Callback the controller uses to request the resources it needs to render
   * its view. This method is invoked after the {@link Controller#init}
   * method.
   *
   * The controller should request all resources it needs in this method, and
   * represent each resource request as a promise that will resolve once the
   * resource is ready for use (these can be data fetched over HTTP(S),
   * database connections, etc).
   *
   * The method must return a plain flat object. The field names of the
   * object identify the resources being fetched and prepared, each value
   * must be either the resource (e.g. view configuration or a value
   * retrieved synchronously) or a Promise that will resolve to the resource.
   *
   * The IMA will use the object to set the state of the controller.
   *
   * If at the server side, the IMA will wait for all the promises to
   * resolve, replaces the promises with the resolved values and sets the
   * resulting object as the controller's state.
   *
   * If at the client side, the IMA will first set the controller's state to
   * an object containing only the fields of the returned object that were
   * not promises. IMA will then update the controller's state every time a
   * promise of the returned object resolves. IMA will update the state by
   * adding the resolved resource to the controller's state.
   *
   * Any returned promise that gets rejected will redirect the application to
   * the error page. The error page that will be used depends on the status
   * code of the error.
   *
   * @return {(Promise<Object<string, (Promise|*)>>|Object<string, (Promise|*)>)}
   *         A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  load() {}

  /**
   * Callback for updating the controller after a route update. This method
   * is invoked if the current route has the `onlyUpdate` flag set to `true` and
   * the current controller and view match those used by the previously active
   * route, or, the `onlyUpdate` option of the current route is a callback and
   * returned `true`.
   *
   * The method must return an object with the same semantics as the result
   * of the {@link Controller#load} method. The controller's state will only
   * be patched by the returned object instead of replacing it completely.
   *
   * The other controller lifecycle callbacks ({@link Controller#init},
   * {@link Controller#load}, {@link Controller#activate},
   * {@link Controller#deactivate}, {@link Controller#deinit}) are not call
   * in case this method is used.
   *
   * @param {Object<string, string>=} [prevParams={}] Previous route
   *         parameters.
   * @return {(Promise<Object<string, (Promise|*)>>|Object<string, (Promise|*)>)}
   *         A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  update() {}

  /**
   * Patches the state of this controller using the provided object by
   * copying the provided patch object fields to the controller's state
   * object.
   *
   * You can use this method to modify the state partially or add new fields
   * to the state object.
   *
   * Note that the state is not patched recursively but by replacing the
   * values of the top-level fields of the state object.
   *
   * Once the promises returned by the {@link Controller#load} method are
   * resolved, this method is called with the an object containing the
   * resolved values. The field names of the passed object will match the
   * field names in the object returned from the {@link Controller#load}
   * method.
   *
   * @param {Object<string, *>} statePatch Patch of the controller's state to
   *        apply.
   */
  setState() {}

  /**
   * Returns the controller's current state.
   *
   * @return {Object<string, *>} The current state of this controller.
   */
  getState() {}

  /**
   * Adds the provided extension to this controller. All extensions should be
   * added to the controller before the {@link Controller#init} method is
   * invoked.
   *
   * @param {Extension} extension The extension to add to this controller.
   * @return {Controller} This controller.
   */
  addExtension() {}

  /**
   * Returns the controller's extensions.
   *
   * @return {Extension[]} The extensions added to this controller.
   */
  getExtensions() {}

  /**
   * Callback used to configure the meta attribute manager. The method is
   * called after the the controller's state has been patched with the all
   * loaded resources and the view has been rendered.
   *
   * @param {Object<string, *>} loadedResources A plain object representing a
   *        map of resource names to resources loaded by the
   *        {@link Controller#load} method. This is the same object as the one
   *        passed to the {@link Controller#setState} method.
   * @param {MetaManager} metaManager Meta attributes manager to configure.
   * @param {Router} router The current application router.
   * @param {Dictionary} dictionary The current localization dictionary.
   * @param {Object<string, *>} settings The application settings for the
   *        current application environment.
   */
  setMetaParams() {}

  /**
   * Sets the current route parameters. This method is invoked before the
   * {@link Controller#init} method.
   *
   * @param {Object<string, string>} [params={}] The current route parameters.
   */
  setRouteParams() {}

  /**
   * Returns the current route parameters.
   *
   * @return {Object<string, string>} The current route parameters.
   */
  getRouteParams() {}

  /**
   * Sets the page state manager. The page state manager manages the
   * controller's state. The state manager can be set to `null` if this
   * controller loses the right to modify the state of the current page (e.g.
   * the user has navigated to a different route using a different
   * controller).
   *
   * @param {?PageStateManager} pageStateManager The current state manager to
   *        use.
   */
  setPageStateManager() {}

  /**
   * Returns the HTTP status code to send to the client, should the
   * controller be used at the server-side.
   *
   * @return {number} The HTTP status code to send to the client.
   */
  getHttpStatus() {}
}

/**
 * Decorator for page controllers. The decorator manages references to the meta
 * attributes manager and other utilities so these can be easily provided to
 * the decorated page controller when needed.
 *
 * @extends Controller
 */
class ControllerDecorator extends Controller {
  /**
   * Initializes the controller decorator.
   *
   * @param {Controller} controller The controller being decorated.
   * @param {MetaManager} metaManager The meta page attributes manager.
   * @param {Router} router The application router.
   * @param {Dictionary} dictionary Localization phrases dictionary.
   * @param {Object<string, *>} settings  Application settings for the
   *        current application environment.
   */
  constructor(controller, metaManager, router, dictionary, settings) {
    super();

    /**
     * The controller being decorated.
     *
     * @type {Controller}
     */
    this._controller = controller;

    /**
     * The meta page attributes manager.
     *
     * @type {MetaManager}
     */
    this._metaManager = metaManager;

    /**
     * The application router.
     *
     * @type {Router}
     */
    this._router = router;

    /**
     * Localization phrases dictionary.
     *
     * @type {Dictionary}
     */
    this._dictionary = dictionary;

    /**
     * Application settings for the current application environment.
     *
     * @type {Object<string, *>}
     */
    this._settings = settings;
  }

  /**
   * @inheritdoc
   */
  init() {
    this._controller.init();
  }

  /**
   * @inheritdoc
   */
  destroy() {
    this._controller.destroy();
  }

  /**
   * @inheritdoc
   */
  activate() {
    this._controller.activate();
  }

  /**
   * @inheritdoc
   */
  deactivate() {
    this._controller.deactivate();
  }

  /**
   * @inheritdoc
   */
  load() {
    return this._controller.load();
  }

  /**
   * @inheritdoc
   */
  update(params = {}) {
    return this._controller.update(params);
  }

  /**
   * @inheritdoc
   */
  setReactiveView(reactiveView) {
    this._controller.setReactiveView(reactiveView);
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
    this._controller.setState(statePatch);
  }

  /**
   * @inheritdoc
   */
  getState() {
    return this._controller.getState();
  }

  /**
   * @inheritdoc
   */
  addExtension(extension) {
    this._controller.addExtension(extension);

    return this;
  }

  /**
   * @inheritdoc
   */
  getExtensions() {
    return this._controller.getExtensions();
  }

  /**
   * @inheritdoc
   */
  setMetaParams(loadedResources) {
    this._controller.setMetaParams(
      loadedResources,
      this._metaManager,
      this._router,
      this._dictionary,
      this._settings
    );
  }

  /**
   * @inheritdoc
   */
  setRouteParams(params = {}) {
    this._controller.setRouteParams(params);
  }

  /**
   * @inheritdoc
   */
  getRouteParams() {
    return this._controller.getRouteParams();
  }

  /**
   * @inheritdoc
   */
  setPageStateManager(pageStateManager) {
    this._controller.setPageStateManager(pageStateManager);
  }

  /**
   * @inheritdoc
   */
  getHttpStatus() {
    return this._controller.getHttpStatus();
  }

  /**
   * Returns the meta attributes manager configured by the decorated
   * controller.
   *
   * @return {MetaManager} The Meta attributes manager configured by the
   *         decorated controller.
   */
  getMetaManager() {
    return this._metaManager;
  }
}

/**
 * The Dictionary is a manager and preprocessor of localization phrases for a
 * single language. The format of the localization phrases depends on the
 * implementation of this interface.
 *
 * @interface
 */
class Dictionary {
  /**
   * Initializes this dictionary with the provided language and localization
   * phrases.
   *
   * @param {Object.<string, *>} config The dictionary configuration.
   * @param {string} config.$Language The language property is an ISO 639-1
   *        language code specifying the language of the provided phrases.
   * @param {*} config.dictionary The dictionary property contains the
   *        localization phrases organized in an implementation-specific way.
   */
  init() {}

  /**
   * Returns the ISO 639-1 language code of the language this dictionary was
   * initialized with.
   *
   * @return {string} The language code representing the language of the
   *         localization phrases in this dictionary.
   */
  getLanguage() {}

  /**
   * Retrieves the localization phrase identified by the specified key,
   * evaluates the phrase's placeholder expressions using the provided
   * parameters and returns the result.
   *
   * @param {string} key The key identifying the localization phrase.
   * @param {Object<string, (boolean|number|string|Date)>=} parameters The
   *        map of parameter names to the parameter values to use.
   *        Defaults to an empty plain object.
   * @return {string} The specified localization phrase with its placeholders
   *         evaluated using the provided parameters.
   */
  get() {}

  /**
   * Tests whether the specified localization phrase exists in the
   * dictionary.
   *
   * @param {string} key The key identifying the localization phrase.
   * @return {boolean} `true` if the key exists and denotes a single
   *                   localization phrase, otherwise `false`.
   */
  has() {}
}

/**
 * Base class of custom error classes, extending the native `Error` class.
 *
 * This class has been introduced to fix the Babel-related issues with
 * extending the native JavaScript (Error) classes.
 *
 * @abstract
 * @class
 * @extends Error
 * @param {string} message The message describing the cause of the error.
 * @param {boolean=} dropInternalStackFrames Whether or not the call stack
 *        frames referring to the constructors of the custom errors should be
 *        excluded from the stack of this error (just like the native platform
 *        call stack frames are dropped by the JS engine).
 *        This flag is enabled by default.
 */
function ExtensibleError(
  message,
  dropInternalStackFrames = true
) {
  if (!(this instanceof ExtensibleError)) {
    throw new TypeError('Cannot call a class as a function');
  }
  if (this.constructor === ExtensibleError) {
    throw new TypeError(
      'The ExtensibleError is an abstract class and ' +
        'must be extended before it can be instantiated.'
    );
  }

  Error.call(this, message); // super-constructor call;

  /**
   * The name of this error, used in the generated stack trace.
   *
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * The message describing the cause of the error.
   *
   * @type {string}
   */
  this.message = message;

  /**
   * Native error instance we use to generate the call stack. For some reason
   * some browsers do not generate call stacks for instances of classes
   * extending the native `Error` class, so we bypass this shortcoming this way.
   *
   * @type {Error}
   */
  this._nativeError = new Error(message);
  this._nativeError.name = this.name;

  // improve compatibility with Gecko
  if (this._nativeError.columnNumber) {
    this.lineNumber = this._nativeError.lineNumber;
    this.columnNumber = this._nativeError.columnNumber;
    this.fileName = this._nativeError.fileName;
  }

  /**
   * The internal cache of the generated stack. The cache is filled upon first
   * access to the {@link ExtensibleError#stack} property.
   *
   * @type {?string}
   */
  this._stack = null;

  /**
   * Whether or not the call stack frames referring to the constructors of
   * the custom errors should be excluded from the stack of this error (just
   * like the native platform call stack frames are dropped by the JS
   * engine).
   *
   * @type {boolean}
   */
  this._dropInternalStackFrames = dropInternalStackFrames;
}

ExtensibleError.prototype = Object.create(Error.prototype);
ExtensibleError.prototype.constructor = ExtensibleError;

/**
 * The call stack captured at the moment of creation of this error. The
 * formatting of the stack is browser-dependant.
 *
 * @var {string} ExtensibleError#stack
 */
Object.defineProperty(ExtensibleError.prototype, 'stack', {
  configurable: true,
  enumerable: false,
  get: function() {
    if (this._stack) {
      return this._stack;
    }

    let stack = this._nativeError.stack;
    if (typeof stack !== 'string') {
      return undefined;
    }

    // drop the stack trace frames referring to the custom error
    // constructors
    if (this._dropInternalStackFrames) {
      let stackLines = stack.split('\n');

      let inheritanceDepth = 1;
      let currentPrototype = Object.getPrototypeOf(this);
      while (currentPrototype !== ExtensibleError.prototype) {
        currentPrototype = Object.getPrototypeOf(currentPrototype);
        inheritanceDepth++;
      }
      stackLines.splice(1, inheritanceDepth);

      this._stack = stackLines.join('\n');
    } else {
      this._stack = stack;
    }

    return this._stack;
  }
});

/**
 * The IMA application error extends the native `Error` with additional details
 * that lead to the error and the HTTP status code to send to the client.
 *
 * Implementation note: This is an interface that extends the abstract class
 * {@link ExtensibleError}, which does not make much sense from the strict
 * OOP standpoint, but is necessary due to limitations of JavaScript, so that
 * IMA errors are instances of both the native errors and of this interface.
 *
 * @interface
 * @extends ExtensibleError
 */
class Error$1 extends ExtensibleError {
  /**
   * Returns the HTTP status to send to the client.
   *
   * If the error has occurred at the client-side, the status code is used to
   * determine the error page to show to the user.
   *
   * This method is a shorthand for the following code snippet:
   * `this.getParams().status || 500`.
   *
   * @return {number} The HTTP status to send to the client.
   * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
   */
  getHttpStatus() {}

  /**
   * Returns the error parameters providing additional details about the
   * error. The structure of the returned object is always
   * situation-dependent, but the returned object usually contains the
   * `status: number` field which represents the HTTP status to send to
   * the client.
   *
   * @return {Object<string, *>} The route parameters of the route at which
   *         the error has occurred.
   * @see Error#getHttpStatus
   */
  getParams() {}
}

/**
 * Implementation of the {@link Error} interface, providing more advanced
 * error API.
 *
 * @extends Error
 */
class GenericError extends Error$1 {
  /**
   * Initializes the generic IMA error.
   *
   * @param {string} message The message describing the cause of the error.
   * @param {Object<string, *>=} [params={}] A data map providing additional
   *        details related to the error. It is recommended to set the
   *        {@code status} field to the HTTP response code that should be sent
   *        to the client.
   * @param {boolean=} dropInternalStackFrames Whether or not the call stack
   *        frames referring to the constructors of the custom errors should
   *        be excluded from the stack of this error (just like the native
   *        platform call stack frames are dropped by the JS engine).
   *        This flag is enabled by default.
   */
  constructor(message, params = {}, dropInternalStackFrames = true) {
    super(message, dropInternalStackFrames);

    /**
     * The data providing additional details related to this error.
     *
     * @type {Object<string, *>}
     */
    this._params = params;
  }

  /**
   * @inheritdoc
   */
  getHttpStatus() {
    return this._params.status || 500;
  }

  /**
   * @inheritdoc
   */
  getParams() {
    return this._params;
  }
}

/**
 * Implementation of the {@link Dictionary} interface that relies on
 * compiled MessageFormat localization messages for its dictionary.
 *
 * @extends Dictionary
 */
class MessageFormatDictionary extends Dictionary {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the dictionary.
   *
   * @example
   * dictionary.get('home.hello', {GENDER: 'UNSPECIFIED'});
   */
  constructor() {
    super();

    /**
     * The language of the phrases in the dictionary, represented as a
     * ISO 639-1 language code.
     *
     * @type {string}
     */
    this._language = null;

    /**
     * Stored dictionary.
     *
     * @type {Object<
     *         string,
     *         Object<
     *           string,
     *           function(Object<string, (number|string)>): string
     *         >
     *       >}
     */
    this._dictionary = null;
  }

  /**
   * Initializes this dictionary with the provided language and localization
   * phrases.
   *
   * @param {Object.<string, *>} config The dictionary configuration.
   * @param {string} config.$Language The language property is an ISO 639-1
   *        language code specifying the language of the provided phrases.
   * @param {Object<string, Object<string, function(Object<string, (number|string)>): string>>}
   *        config.dictionary
   *        The dictionary field contains the localization phrases organized
   *        in a deep plain object map. The top-level key is the name of the
   *        phrase group, the bottom-level key is the phrase key. The
   *        bottom-level value is the localization phrase generator that
   *        takes the phrase placeholder values map as an argument and
   *        produces the localization phrase with its placeholders evaluated
   *        using the provided placeholder values.
   * @inheritdoc
   */
  init(config) {
    this._language = config.$Language;
    this._dictionary = config.dictionary;
  }

  /**
   * @inheritdoc
   */
  getLanguage() {
    return this._language;
  }

  /**
   * Retrieves the localization phrase identified by the specified key,
   * evaluates the phrase's placeholder expressions using the provided
   * parameters and returns the result.
   *
   * @param {string} key The key identifying the localization phrase. The key
   *        consists of at least two parts separated by dots. The first part
   *        denotes the name of the source JSON localization file, while the
   *        rest denote a field path within the localization object within
   *        the given localization file.
   * @param {Object<string, (boolean|number|string|Date)>=} parameters The
   *        map of parameter names to the parameter values to use.
   *        Defaults to an empty plain object.
   * @return {string} The specified localization phrase with its placeholders
   *         evaluated using the provided parameters.
   */
  get(key, parameters = {}) {
    const scope = this._getScope(key);

    if (!scope) {
      throw new GenericError(
        `ima.dictionary.MessageFormatDictionary.get: The ` +
          `localization phrase '${key}' does not exists`,
        { key, parameters }
      );
    }

    return scope(parameters);
  }

  /**
   * Tests whether the specified localization phrase exists in the
   * dictionary.
   *
   * @param {string} key The key identifying the localization phrase. The key
   *        consists of at least two parts separated by dots. The first part
   *        denotes the name of the source JSON localization file, while the
   *        rest denote a field path within the localization object within
   *        the given localization file.
   * @return {boolean} `true` if the key exists and denotes a single
   *                   localization phrase, otherwise `false`.
   */
  has(key) {
    if (!/^[^.]+\.[^.]+$/.test(key)) {
      throw new Error(
        `The provided key (${key}) is not a valid localization ` +
          `phrase key, expecting a "file_name.identifier" notation`
      );
    }

    return !!this._getScope(key);
  }

  /**
   * Retrieves the localization scope denoted by the provided partial key.
   * This may be either an object representing a sub-group of location phrase
   * generators, or a single generator if the provided keys denotes a single
   * localization phrase
   *
   * @private
   * @param {string} key The key identifying the localization phrase. The key
   *        consists of at least two parts separated by dots. The first part
   *        denotes the name of the source JSON localization file, while the
   *        rest denote a field path within the localization object within
   *        the given localization file.
   * @return {?(
   *             function(
   *                 Object<string, (boolean|number|string|Date)>
   *             ): string|
   *             Object<
   *               string,
   *               function(
   *                   Object<string, (boolean|number|string|Date)>
   *               ): string
   *             >
   *         )} The requested localization scope, or `null` if the specified
   *         scope does not exist.
   */
  _getScope(key) {
    let path = key.split('.');
    let scope = this._dictionary;

    for (let scopeKey of path) {
      if (!scope[scopeKey]) {
        return null;
      }

      scope = scope[scopeKey];
    }

    return scope;
  }
}

/**
 * Utility for sending and intercepting wrapped custom DOM events on the DOM or
 * propagating them to the current controller.
 *
 * As with native events, the event fired by this event bus always propagate up
 * the DOM tree until they reach the window.
 *
 * Note that the events fired by this event bus are wrapped in custom DOM
 * events which always bear an obscure name set by the implementation of this
 * interface, preventing custom event name collisions, and allowing observation
 * and capture of all fired events. The actual event name is always consistent
 * by the implementation.
 *
 * @interface
 */
class EventBus {
  /**
   * Fires a new custom event of the specified name, carrying the provided
   * data.
   *
   * Note that this method does not prevent the event listeners to modify the
   * data in any way. The order in which the event listeners will be executed
   * is unspecified and should not be relied upon.
   *
   * Note that the default options are
   * {@code { bubbles: true, cancelable: true }}, which is different from the
   * default values used in the native custom events
   * ({@code { bubbles: false, cancelable: false }}).
   *
   * @param {EventTarget} eventTarget The event target at which the event
   *        will be  dispatched (e.g. element/document/window).
   * @param {string} eventName The name of the event to fire.
   * @param {*} data The data to pass to the event listeners.
   * @param {{bubbles: boolean=, cancelable: boolean=}=} [options={}] The
   *        override of the default options passed to the constructor of the
   *        custom event fired by this event bus.
   *        The default options passed to the custom event constructor are
   *        {@code { bubbles: true, cancelable: true }}.
   * @return {EventBus} This custom event bus.
   * @throws {Error} Thrown if the provided event target cannot be used to
   *         fire the event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
   */
  fire() {}

  /**
   * Registers the provided event listener to be executed when any custom
   * event is fired using the same implementation of the event bus and passes
   * through the specified event target.
   *
   * When the specified event is fired, the event listener will be executed
   * with the event passed as the first argument.
   *
   * The order in which the event listeners will be executed is unspecified
   * and should not be relied upon.
   *
   * @param {EventTarget} eventTarget The event target at which the listener
   *        should listen for all event bus events.
   * @param {function(CustomEvent)} listener The event listener to
   *        register.
   * @return {EventBus} This event bus.
   */
  listenAll() {}

  /**
   * Registers the provided event listener to be executed when the specific
   * custom event is fired by the same implementation of the event bus and
   * passes through the specified event target.
   *
   * When the specified event is fired, the event listener will be executed
   * with the event passed as the first argument.
   *
   * The order in which the event listeners will be executed is unspecified
   * and should not be relied upon.
   *
   * @param {EventTarget} eventTarget The event target at which the listener
   *        should listen for the specified event.
   * @param {string} eventName The name of the event to listen for.
   * @param {function(CustomEvent)} listener The event listener to
   *        register.
   * @return {EventBus} This event bus.
   */
  listen() {}

  /**
   * Removes the provided event listener from the set of event listeners
   * executed when the any custom event fired by the same implementation
   * passes through the specified event target.
   *
   * The method has no effect if the listener is not registered at the
   * specified event target.
   *
   * @param {EventTarget} eventTarget The event target at which the event
   *        listener listens for events.
   * @param {function(CustomEvent)} listener The event listener to
   *        deregister.
   * @return {EventBus} This event bus.
   */
  unlistenAll() {}

  /**
   * Removes the provided event listener from the set of event listeners
   * executed when the specified custom event fired by the same
   * implementation passes through the specified event target.
   *
   * The method has no effect if the listener is not registered for the
   * specified event at the specified event target.
   *
   * @param {EventTarget} eventTarget The event target at which the listener
   *        is listening for the event.
   * @param {string} eventName The name of the event listened for.
   * @param {function(CustomEvent)} listener The event listener to
   *        deregister.
   * @return {EventBus} This event bus.
   */
  unlisten() {}
}

/**
 * The {@codelink Window} interface defines various utility API for easier
 * cross-environment usage of various low-level client-side JavaScript APIs
 * available through various global objects.
 *
 * @interface
 */
class Window {
  /**
   * Returns {@code true} if invoked at the client side.
   *
   * @return {boolean} {@code true} if invoked at the client side.
   */
  isClient() {}

  /**
   * Returns {@code true} if the cookies are set and processed with every
   * HTTP request and response automatically by the environment.
   *
   * @return {boolean} {@code true} if cookies are handled automatically by
   *         the environment.
   */
  isCookieEnabled() {}

  /**
   * Returns {@code true} if the session storage is supported.
   *
   * @return {boolean} {@code true} if the session storage is supported.
   */
  hasSessionStorage() {}

  /**
   * Sets the new page title of the document.
   *
   * @param {string} title The new page title.
   */
  setTitle() {}

  /**
   * Returns the current {@code WebSocket} implementation to use.
   *
   * @deprecated All browsers currently supported by IMA.js support web
   *             sockets, but when used at the server-side, this method
   *             should fail unless web sockets are polyfilled by a 3rd party
   *             library.
   * @return {function(new: WebSocket)} The current {@code WebSocket}
   *         implementation.
   */
  getWebSocket() {}

  /**
   * Returns the native {@code window} object representing the global context
   * at the client-side. The method returns {@code undefined} if used at the
   * server-side.
   *
   * @return {(undefined|Window)} The {@code window} object at the
   *         client-side, or {@code undefined} at the server-side.
   */
  getWindow() {}

  /**
   * Returns the native {@code document} object representing any web page loaded
   * in the browser and serves as an entry point into the web page's content
   * which is the DOM tree at the client-side. The method returns {@code undefined}
   * if used at the server-side.
   *
   * @return {(undefined|Document)} The {@code document} object at the
   *         client-side, or {@code undefined} at the server-side.
   */
  getDocument() {}

  /**
   * Returns the number of pixels the viewport is scrolled horizontally.
   *
   * @return {number} The number of pixels the viewport is scrolled
   *         horizontally.
   */
  getScrollX() {}

  /**
   * Returns the number of pixels the document is scrolled vertically.
   *
   * @return {number} The number of pixels the document is scrolled
   *         vertically.
   */
  getScrollY() {}

  /**
   * Scrolls the viewport to the specified location (if possible).
   *
   * @param {number} x Horizontal scroll offset in pixels.
   * @param {number} y Vertical scroll offset in pixels.
   */
  scrollTo() {}

  /**
   * Returns the domain of the current document's URL as
   * {@code `${protocol}://${host}`}.
   *
   * @return {string} The current domain.
   */
  getDomain() {}

  /**
   * Returns the application's host.
   *
   * @return {string} The current host.
   */
  getHost() {}

  /**
   * Returns the path part of the current URL, including the query string.
   *
   * @return {string} The path and query string parts of the current URL.
   */
  getPath() {}

  /**
   * Returns the current document's URL.
   *
   * @return {string} The current document's URL.
   */
  getUrl() {}

  /**
   * Returns the document's body element. The method returns
   * {@code undefined} if invoked at the server-side.
   *
   * @return {(undefined|HTMLBodyElement)} The document's body element, or
   *         {@code undefined} if invoked at the server side.
   */
  getBody() {}

  /**
   * Returns the HTML element with the specified {@code id} attribute value.
   *
   * @param {string} id The value of the {@code id} attribute to look for.
   * @return {?HTMLElement} The element with the specified id, or
   *         {@code null} if no such element exists.
   */
  getElementById() {}

  /**
   * Returns the history state.
   *
   * @return {Object} The current history state
   */
  getHistoryState() {}

  /**
   * Returns the first element matching the specified CSS 3 selector.
   *
   * @param {string} selector The CSS selector.
   * @return {?HTMLElement} The first element matching the CSS selector or
   *         {@code null} if no such element exists.
   */
  querySelector() {}

  /**
   * Returns a node list of all elements matching the specified CSS 3
   * selector.
   *
   * @param {string} selector The CSS selector.
   * @return {NodeList} A node list containing all elements matching the
   *         specified CSS selector.
   */
  querySelectorAll() {}

  /**
   * Performs a hard redirect (discarding the current JavaScript state) to
   * the specified URL.
   *
   * @param {string} url The URL to which the browser will be redirected.
   */
  redirect() {}

  /**
   * Pushes a new state to the browser history. The method has no effect if
   * the current browser does not support the history API (IE9).
   *
   * @param {Object<string, *>} state A state object associated with the
   *        history item, preferably representing the page state.
   * @param {string} title The page title related to the state. Note that
   *        this parameter is ignored by some browsers.
   * @param {string} url The new URL at which the state is available.
   */
  pushState() {}

  /**
   * Replaces the current history entry. The method has no effect if the
   * current browser does not support the history API (IE9).
   *
   * @param {Object<string, *>} state A state object associated with the
   *        history item, preferably representing the page state.
   * @param {string} title The page title related to the state. Note that
   *        this parameter is ignored by some browsers.
   * @param {string=} [url=null] The new URL at which the state is available.
   */
  replaceState() {}

  /**
   * Create new instance of CustomEvent of the specified name and using the
   * provided options.
   *
   * @param {string} name Custom event's name (sometimes referred to as the
   *        event's type).
   * @param {Object<string, *>} options The custom event's options.
   * @return {CustomEvent} The created custom event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
   */
  createCustomEvent() {}

  /**
   * Registers the provided event listener to be executed when the specified
   * event occurs on the specified event target.
   *
   * Registering the same event listener for the same event on the same event
   * target with the same {@code useCapture} flag value repeatedly has no
   * effect.
   *
   * @param {EventTarget} eventTarget The event target.
   * @param {string} event The name of the event.
   * @param {function(Event)} listener The event listener.
   * @param {boolean=} [useCapture=false] If true, the method initiates event
   *        capture. After initiating capture, all events of the specified
   *        type will be dispatched to the registered listener before being
   *        dispatched to any EventTarget beneath it in the DOM tree. Events
   *        which are bubbling upward through the tree will not trigger a
   *        listener designated to use capture.
   */
  bindEventListener() {}

  /**
   * Deregisters the provided event listener, so it will no longer we
   * executed when the specified event occurs on the specified event target.
   *
   * The method has no effect if the provided event listener is not
   * registered to be executed at the specified event.
   *
   * @param {EventTarget} eventTarget The event target.
   * @param {string} event The name of the event.
   * @param {function(Event)} listener The event listener.
   * @param {boolean=} [useCapture=false] The {@code useCapture} flag value
   *        that was used when the listener was registered.
   */
  unbindEventListener() {}
}

// @client-side

/**
 * Global name of IMA.js custom event.
 *
 * @const
 * @type {string}
 */
const IMA_EVENT = '$IMA.CustomEvent';

/**
 * Helper for custom events.
 *
 * It offers public methods for firing custom events and two methods for
 * catching events (e.g. inside view components).
 */
class EventBusImpl extends EventBus {
  static get $dependencies() {
    return [Window];
  }

  /**
   * Initializes the custom event helper.
   *
   * @param {Window} window The IMA window helper.
   */
  constructor(window) {
    super();

    /**
     * The IMA window helper.
     *
     * @type {Window}
     */
    this._window = window;

    /**
     * Map of listeners provided to the public API of this event bus to a
     * map of event targets to a map of event names to actual listeners
     * bound to the native API.
     *
     * The "listen all" event listeners are not registered in this map.
     *
     * @type {WeakMap<
     *         function(Event),
     *         WeakMap<EventTarget, Map<string, function(Event)>>
     *       >}
     */
    this._listeners = new WeakMap();

    /**
     * Map of event targets to listeners executed on all IMA.js event bus
     * events.
     *
     * @type {WeakMap<EventTarget, WeakSet<function(Event)>>}
     */
    this._allListenersTargets = new WeakMap();
  }

  /**
   * @inheritdoc
   */
  fire(eventTarget, eventName, data, options = {}) {
    var eventInitialization = {};
    var params = { detail: { eventName, data } };
    var defaultOptions = { bubbles: true, cancelable: true };
    Object.assign(eventInitialization, defaultOptions, options, params);

    var event = this._window.createCustomEvent(IMA_EVENT, eventInitialization);

    if (eventTarget && typeof eventTarget.dispatchEvent !== 'undefined') {
      eventTarget.dispatchEvent(event);
    } else {
      throw new GenericError(
        `ima.event.EventBusImpl.fire: The EventSource ` +
          `${eventTarget} is not defined or can not dispatch event ` +
          `'${eventName}' (data: ${data}).`,
        { eventTarget, eventName, data, eventInitialization }
      );
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  listenAll(eventTarget, listener) {
    if (!this._allListenersTargets.has(eventTarget)) {
      this._allListenersTargets.set(eventTarget, new WeakMap());
    }

    var nativeListener = event => {
      if (event.type === IMA_EVENT && event.detail && event.detail.eventName) {
        listener(event);
      }
    };
    this._allListenersTargets.get(eventTarget).set(listener, nativeListener);

    this._window.bindEventListener(eventTarget, IMA_EVENT, nativeListener);

    return this;
  }

  /**
   * @inheritdoc
   */
  listen(eventTarget, eventName, listener) {
    if (!eventTarget) {
      if ($Debug) {
        console.warn(
          `The eventTarget is not defined for event '${eventName}'.`
        );
      }

      return this;
    }

    if (!this._listeners.has(listener)) {
      this._listeners.set(listener, new WeakMap());
    }

    var targetToEventName = this._listeners.get(listener);
    if (!targetToEventName.has(eventTarget)) {
      targetToEventName.set(eventTarget, new Map());
    }

    var eventNameToNativeListener = targetToEventName.get(eventTarget);
    var nativeListener = event => {
      if (
        event.type === IMA_EVENT &&
        event.detail &&
        event.detail.eventName === eventName
      ) {
        listener(event);
      }
    };
    eventNameToNativeListener.set(eventName, nativeListener);

    this._window.bindEventListener(eventTarget, IMA_EVENT, nativeListener);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlistenAll(eventTarget, listener) {
    if (!this._allListenersTargets.has(eventTarget)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not registered on the ' +
            'specified event target'
        );
      }

      return this;
    }

    var listeners = this._allListenersTargets.get(eventTarget);
    if (!listeners.has(listener)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not registered on the ' +
            'specified event target'
        );
      }

      return this;
    }

    var nativeListener = listeners.get(listener);
    this._window.unbindEventListener(eventTarget, IMA_EVENT, nativeListener);

    listeners.delete(listener);
    if (listeners.size) {
      return this;
    }

    this._allListenersTargets.delete(eventTarget);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlisten(eventTarget, eventName, listener) {
    if (!this._listeners.has(listener)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
            'specified event on the specified event target.'
        );
      }

      return this;
    }

    var targets = this._listeners.get(listener);
    if (!targets.has(eventTarget)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
            'specified event on the specified event target.'
        );
      }

      return this;
    }

    var eventNameToNativeListener = targets.get(eventTarget);
    if (!eventNameToNativeListener.has(eventName)) {
      if ($Debug) {
        console.warn(
          'The provided listener is not bound to listen for the ' +
            'specified event on the specified event target.'
        );
      }

      return this;
    }

    var nativeListener = eventNameToNativeListener.get(eventName);
    this._window.unbindEventListener(eventTarget, IMA_EVENT, nativeListener);

    eventNameToNativeListener.delete(eventName);
    if (eventNameToNativeListener.size) {
      return this;
    }

    targets.delete(eventTarget);

    return this;
  }
}

/**
 * A Dispatcher is a utility that manager event listeners registered for events
 * and allows distributing (firing) events to the listeners registered for the
 * given event.
 *
 * The dispatcher provides a single-node event bus and is usually used to
 * propagate events from controllers to UI components when modifying/passing
 * the state is impractical for any reason.
 *
 * @interface
 */
class Dispatcher {
  /**
   * Deregisters all event listeners currently registered with this
   * dispatcher.
   *
   * @return {Dispatcher} This dispatcher.
   */
  clear() {}

  /**
   * Registers the provided event listener to be executed when the specified
   * event is fired on this dispatcher.
   *
   * When the specified event is fired, the event listener will be executed
   * with the data passed with the event as the first argument.
   *
   * The order in which the event listeners will be executed is unspecified
   * and should not be relied upon. Registering the same listener for the
   * same event and with the same scope multiple times has no effect.
   *
   * @param {string} event The name of the event to listen for.
   * @param {function(*)} listener The event listener to register.
   * @param {?Object=} scope The object to which the {@code this} keyword
   *        will be bound in the event listener.
   * @return {Dispatcher} This dispatcher.
   */
  listen() {}

  /**
   * Deregisters the provided event listener, so it will no longer be
   * executed with the specified scope when the specified event is fired.
   *
   * @param {string} event The name of the event for which the listener
   *        should be deregistered.
   * @param {function(*)} listener The event listener to deregister.
   * @param {?Object=} scope The object to which the {@code this} keyword
   *        would be bound in the event listener.
   * @return {Dispatcher} This dispatcher.
   */
  unlisten() {}

  /**
   * Fires a new event of the specified name, carrying the provided data.
   *
   * The method will synchronously execute all event listeners registered for
   * the specified event, passing the provided data to them as the first
   * argument.
   *
   * Note that this method does not prevent the event listeners to modify the
   * data in any way. The order in which the event listeners will be executed
   * is unspecified and should not be relied upon.
   *
   * @param {string} event The name of the event to fire.
   * @param {Object<string, *>} data The data to pass to the event listeners.
   * @param {boolean=} [imaInternalEvent=false] The flag signalling whether
   *        this is an internal IMA event. The fired event is treated as a
   *        custom application event if this flag is not set.
   *        The flag is used only for debugging and has no effect on the
   *        propagation of the event.
   * @return {Dispatcher} This dispatcher.
   */
  fire() {}
}

/**
 * An empty immutable map of event listener to scopes, used for a mismatch in
 * the {@codelink _eventListeners} map.
 *
 * @const
 * @type {Map<function (*), Set<?Object>>}
 */
const EMPTY_MAP = Object.freeze(new Map());

/**
 * An empty immutable set of event listener scopes, used for a mismatch in the
 * {@codelink _eventListeners} map.
 *
 * @const
 * @type {Set<?Object>}
 */
const EMPTY_SET = Object.freeze(new Set());

/**
 * Default implementation of the {@codelink Dispatcher} interface.
 */
class DispatcherImpl extends Dispatcher {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the dispatcher.
   */
  constructor() {
    super();

    /**
     * Map of event names to a map of event listeners to a set of scopes to
     * which the event listener should be bound when being executed due to
     * the event.
     *
     * @type {Map<string, Map<function(*), Set<?Object>>>}
     */
    this._eventListeners = new Map();
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._eventListeners.clear();

    return this;
  }

  /**
   * @inheritdoc
   */
  listen(event, listener, scope = null) {
    if ($Debug) {
      if (!(listener instanceof Function)) {
        throw new GenericError(
          `The listener must be a function, ${listener} provided.`
        );
      }
    }

    if (!this._eventListeners.has(event)) {
      this._createNewEvent(event);
    }
    let listeners = this._getListenersOf(event);

    if (!listeners.has(listener)) {
      this._createNewListener(event, listener);
    }
    this._getScopesOf(event, listener).add(scope);

    return this;
  }

  /**
   * @inheritdoc
   */
  unlisten(event, listener, scope = null) {
    let scopes = this._getScopesOf(event, listener);

    if ($Debug) {
      if (!scopes.has(scope)) {
        console.warn(
          'ima.event.DispatcherImpl.unlisten(): the provided ' +
            `listener '${listener}' is not registered for the ` +
            `specified event '${event}' and scope '${scope}'. Check ` +
            `your workflow.`,
          {
            event: event,
            listener: listener,
            scope: scope
          }
        );
      }
    }

    scopes.delete(scope);
    if (!scopes.size) {
      let listeners = this._getListenersOf(event);
      listeners.delete(listener);

      if (!listeners.size) {
        this._eventListeners.delete(event);
      }
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  fire(event, data, imaInternalEvent = false) {
    let listeners = this._getListenersOf(event);

    if (!listeners.size && !imaInternalEvent) {
      console.warn(
        `There are no event listeners registered for the ${event} ` + `event`,
        {
          event: event,
          data: data
        }
      );
    }

    for (let [listener, scopes] of listeners) {
      for (let scope of scopes) {
        listener.bind(scope)(data);
      }
    }

    return this;
  }

  /**
   * Create new Map storage of listeners for the specified event.
   *
   * @param {string} event The name of the event.
   */
  _createNewEvent(event) {
    let listeners = new Map();
    this._eventListeners.set(event, listeners);
  }

  /**
   * Create new Set storage of scopes for the specified event and listener.
   *
   * @param {string} event The name of the event.
   * @param {function(*)} listener The event listener.
   */
  _createNewListener(event, listener) {
    let scopes = new Set();
    this._eventListeners.get(event).set(listener, scopes);
  }

  /**
   * Retrieves the scopes in which the specified event listener should be
   * executed for the specified event.
   *
   * @param {string} event The name of the event.
   * @param {function(*)} listener The event listener.
   * @return {Set<?Object>} The scopes in which the specified listeners
   *         should be executed in case of the specified event. The returned
   *         set is an unmodifiable empty set if no listeners are registered
   *         for the event.
   */
  _getScopesOf(event, listener) {
    let listenersToScopes = this._getListenersOf(event);

    if (listenersToScopes.has(listener)) {
      return listenersToScopes.get(listener);
    }

    return EMPTY_SET;
  }

  /**
   * Retrieves the map of event listeners to scopes they are bound to.
   *
   * @param {string} event The name of the event.
   * @return {Map<function(*), Set<?Object>>} A map of event listeners to the
   *         scopes in which they should be executed. The returned map is an
   *         unmodifiable empty map if no listeners are registered for the
   *         event.
   */
  _getListenersOf(event) {
    if (this._eventListeners.has(event)) {
      return this._eventListeners.get(event);
    }

    return EMPTY_MAP;
  }
}

/**
 * Options for a request sent using the HTTP agent.
 * @typedef {Object} HttpAgent~RequestOptions
 * @property {number} [timeout] Specifies the request timeout in milliseconds.
 * @property {number} [ttl] Specified how long the request may be cached in
 *           milliseconds.
 * @property {number} [repeatRequest] Specifies the maximum number of tries to
 *           repeat the request if the request fails.
 * @property {Object<string, string>} [headers] Sets the additional request
 *           headers (the keys are case-insensitive header names, the values
 *           are header values).
 * @property {Object<string, *>} [fetchOptions] Sets the fetch request options.
 * @property {boolean} [cache] Flag that enables caching the HTTP request
 *           (enabled by default, also applies to requests in progress).
 * @property {boolean} [withCredentials] Flag that indicates whether the
 *           request should be made using credentials such as cookies or
 *           authorization headers.
 * @property {{progress: function=}} [listeners] Listeners for request events.
 * @property {function(HttpAgent~Response)} [postProcessor] Response
 *           post-processor applied just before the response is stored in the
 *           cache and returned.
 */

/**
 * A response from the server.
 * @typedef {Object} HttpAgent~Response
 * @property {number} status The HTTP response status code.
 * @property {*} body The parsed response body, parsed as JSON.
 * @property {HttpProxy~RequestParams} params The original request params.
 * @property {Object<string, string>} headers The response HTTP headers.
 * @property {boolean} cached Whether or not the response has been cached.
 */

/**
 * The {@codelink HttpAgent} defines unifying API for sending HTTP requests at
 * both client-side and server-side.
 *
 * @interface
 */
class HttpAgent {
  /**
   * Sends an HTTP GET request to the specified URL, sending the provided
   * data as query parameters.
   *
   * @param {string} url The URL to which the request should be made.
   * @param {Object<string, (boolean|number|string)>} data The data to send
   *        to the server as query parameters.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the
   *         response.
   */
  get() {}

  /**
   * Sends an HTTP POST request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param {string} url The URL to which the request should be made.
   * @param {(string|Object<string, *>)} data The data to send to the server
   *        as the request body.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the
   *         response.
   */
  post() {}

  /**
   * Sends an HTTP PUT request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param {string} url The URL to which the request should be made.
   * @param {(string|Object<string, *>)} data The data to send to the server
   *        as the request body.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the
   *         response.
   */
  put() {}

  /**
   * Sends an HTTP PATCH request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param {string} url The URL to which the request should be made.
   * @param {(string|Object<string, *>)} data The data to send to the server
   *        as the request body.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the
   *         response.
   */
  patch() {}

  /**
   * Sends an HTTP DELETE request to the specified URL, sending the provided
   * data as the request body. If an object is provided as the request data,
   * the data will be JSON-encoded. Sending other primitive non-string values
   * as the request body is not supported.
   *
   * @param {string} url The URL to which the request should be made.
   * @param {(string|Object<string, *>)} data The data to send to the server
   *        as the request body.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the
   *         response.
   */
  delete() {}

  /**
   * Generates a cache key to use for identifying a request to the specified
   * URL using the specified HTTP method, submitting the provided data.
   *
   * @param {string} method The HTTP method used by the request.
   * @param {string} url The URL to which the request is sent.
   * @param {Object<string, string>} data The data associated with the
   *        request. These can be either the query parameters or request body
   *        data.
   * @return {string} The key to use for identifying such a request in the
   *         cache.
   */
  getCacheKey() {}

  /**
   * Sets the specified header to be sent with every subsequent HTTP request,
   * unless explicitly overridden by request options.
   *
   * @param {string} header The name of the header.
   * @param {string} value The header value. To provide multiple values,
   *        separate them with commas
   *        (see http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2).
   * @return {HttpAgent} This HTTP agent.
   */
  setDefaultHeader() {}

  /**
   * Clears all configured default headers.
   *
   * @return {HttpAgent} This HTTP agent.
   */
  clearDefaultHeaders() {}
}

/**
 * Implementation of the {@codelink HttpAgent} interface with internal caching
 * of completed and ongoing HTTP requests and cookie storage.
 */
class HttpAgentImpl extends HttpAgent {
  /**
   * Initializes the HTTP handler.
   *
   * @param {HttpProxy} proxy The low-level HTTP proxy for sending the HTTP
   *        requests.
   * @param {Cache} cache Cache to use for caching ongoing and completed
   *        requests.
   * @param {CookieStorage} cookie The cookie storage to use internally.
   * @param {Object<string, *>} config Configuration of the HTTP handler for
   *        the current application environment, specifying the various
   *        default request option values and cache option values.
   * @example
   *      http
   *          .get('url', { data: data }, {
   *              ttl: 2000,
   *              repeatRequest: 1,
   *              withCredentials: true,
   *              timeout: 2000,
   *              accept: 'application/json',
   *              language: 'en',
   *              listeners: { 'progress': callbackFunction }
   *          })
   *          .then((response) => {
   *              //resolve
   *          }
   *          .catch((error) => {
   *             //catch
   *          });
   * @example
   *      http
   *          .setDefaultHeader('Accept-Language', 'en')
   *          .clearDefaultHeaders();
   */
  constructor(proxy, cache, cookie, config) {
    super();

    /**
     * HTTP proxy, used to execute the HTTP requests.
     *
     * @type {HttpProxy}
     */
    this._proxy = proxy;

    /**
     * Internal request cache, used to cache completed request results.
     *
     * @type {Cache}
     */
    this._cache = cache;

    /**
     * Cookie storage, used to keep track of cookies received from the
     * server and send them with the subsequent requests to the server.
     *
     * @type {CookieStorage}
     */
    this._cookie = cookie;

    /**
     * Cache options.
     *
     * @type {Object<string, string>}
     */
    this._cacheOptions = config.cacheOptions;

    /**
     * Default request options.
     *
     * @type {{
     *         timeout: number,
     *         ttl: number,
     *         repeatRequest: number,
     *         headers: Object<string, string>,
     *         cache: boolean,
     *         withCredentials: boolean,
     *         fetchOptions: Object<string, *>,
     *         postProcessor: function(Object<string, *>)
     *       }}
     */
    this._defaultRequestOptions = config.defaultRequestOptions;

    /**
     * Internal request cache, used to cache ongoing requests.
     *
     * @type {Map<string, Promise<{
     *         status: number,
     *         body: *,
     *         params: {
     *           method: string,
     *           url: string,
     *           transformedUrl: string,
     *           data: Object<string, (boolean|number|string)>
     *         },
     *         headers: Object<string, string>,
     *         cached: boolean
     *       }>>}
     */
    this._internalCacheOfPromises = new Map();
  }

  /**
   * @inheritdoc
   */
  get(url, data, options = {}) {
    return this._requestWithCheckCache('get', url, data, options);
  }

  /**
   * @inheritdoc
   */
  post(url, data, options = {}) {
    return this._requestWithCheckCache(
      'post',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritdoc
   */
  put(url, data, options = {}) {
    return this._requestWithCheckCache(
      'put',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritdoc
   */
  patch(url, data, options = {}) {
    return this._requestWithCheckCache(
      'patch',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritdoc
   */
  delete(url, data, options = {}) {
    return this._requestWithCheckCache(
      'delete',
      url,
      data,
      Object.assign({ cache: false }, options)
    );
  }

  /**
   * @inheritdoc
   */
  getCacheKey(method, url, data) {
    return (
      this._cacheOptions.prefix + this._getCacheKeySuffix(method, url, data)
    );
  }

  /**
   * @inheritdoc
   */
  setDefaultHeader(header, value) {
    this._proxy.setDefaultHeader(header, value);

    return this;
  }

  /**
   * @inheritdoc
   */
  clearDefaultHeaders() {
    this._proxy.clearDefaultHeaders();

    return this;
  }

  /**
   * Check cache and if data isnt available then make real request.
   *
   * @param {string} method The HTTP method to use.
   * @param {string} url The URL to which the request should be sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to
   *        send with the request.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the response
   *         with body parsed as JSON.
   */
  _requestWithCheckCache(method, url, data, options) {
    options = this._prepareOptions(options);

    if (options.cache) {
      let cachedData = this._getCachedData(method, url, data);

      if (cachedData) {
        return cachedData;
      }
    }

    return this._request(method, url, data, options);
  }

  /**
   * Tests whether an ongoing or completed HTTP request for the specified URL
   * and data is present in the internal cache and, if it is, the method
   * returns a promise that resolves to the response body parsed as JSON.
   *
   * The method returns {@code null} if no such request is present in the
   * cache.
   *
   * @param {string} method The HTTP method used by the request.
   * @param {string} url The URL to which the request was made.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        to the server with the request.
   * @return {?Promise<HttpAgent~Response>} A promise that will resolve to the
   *         server response with the body parsed as JSON, or {@code null} if
   *         no such request is present in the cache.
   */
  _getCachedData(method, url, data) {
    let cacheKey = this.getCacheKey(method, url, data);

    if (this._internalCacheOfPromises.has(cacheKey)) {
      return this._internalCacheOfPromises.get(cacheKey);
    }

    if (this._cache.has(cacheKey)) {
      let cacheData = this._cache.get(cacheKey);

      return Promise.resolve(cacheData);
    }

    return null;
  }

  /**
   * Sends a new HTTP request using the specified method to the specified
   * url. The request will carry the provided data as query parameters if the
   * HTTP method is GET, but the data will be sent as request body for any
   * other request method.
   *
   * @param {string} method HTTP method to use.
   * @param {string} url The URL to which the request is sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        with the request.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise<HttpAgent~Response>} A promise that resolves to the response
   *         with the body parsed as JSON.
   */
  _request(method, url, data, options) {
    let cacheKey = this.getCacheKey(method, url, data);

    let cachePromise = this._proxy
      .request(method, url, data, options)
      .then(
        response => this._proxyResolved(response),
        error => this._proxyRejected(error)
      );

    this._internalCacheOfPromises.set(cacheKey, cachePromise);

    return cachePromise;
  }

  /**
   * Handles successful completion of an HTTP request by the HTTP proxy.
   *
   * The method also updates the internal cookie storage with the cookies
   * received from the server.
   *
   * @param {HttpAgent~Response} response Server response.
   * @return {HttpAgent~Response} The post-processed server response.
   */
  _proxyResolved(response) {
    let agentResponse = {
      status: response.status,
      body: response.body,
      params: response.params,
      headers: response.headers,
      headersRaw: response.headersRaw,
      cached: false
    };
    let cacheKey = this.getCacheKey(
      agentResponse.params.method,
      agentResponse.params.url,
      agentResponse.params.data
    );

    this._internalCacheOfPromises.delete(cacheKey);

    if (this._proxy.haveToSetCookiesManually()) {
      this._setCookiesFromResponse(agentResponse);
    }

    let { postProcessor, cache } = agentResponse.params.options;
    if (typeof postProcessor === 'function') {
      agentResponse = postProcessor(agentResponse);
    }

    if (cache) {
      this._saveAgentResponseToCache(agentResponse);
    }

    return agentResponse;
  }

  /**
   * Handles rejection of the HTTP request by the HTTP proxy. The method
   * tests whether there are any remaining tries for the request, and if
   * there are any, it attempts re-send the request.
   *
   * The method rejects the internal request promise if there are no tries
   * left.
   *
   * @param {GenericError} error The error provided by the HttpProxy,
   *        carrying the error parameters, such as the request url, data,
   *        method, options and other useful data.
   * @return {Promise<HttpAgent~Response>} A promise that will either resolve to a
   *         server's response (with the body parsed as JSON) if there are
   *         any tries left and the re-tried request succeeds, or rejects
   *         with an error containing details of the cause of the request's
   *         failure.
   */
  _proxyRejected(error) {
    let errorParams = error.getParams();
    let method = errorParams.method;
    let url = errorParams.url;
    let data = errorParams.data;

    if (errorParams.options.repeatRequest > 0) {
      errorParams.options.repeatRequest--;

      return this._request(method, url, data, errorParams.options);
    } else {
      let cacheKey = this.getCacheKey(method, url, data);
      this._internalCacheOfPromises.delete(cacheKey);

      let errorName = errorParams.errorName;
      let errorMessage = `${errorName}: ima.http.Agent:_proxyRejected: ${error.message}`;
      let agentError = new GenericError(errorMessage, errorParams);
      return Promise.reject(agentError);
    }
  }

  /**
   * Prepares the provided request options object by filling in missing
   * options with default values and addding extra options used internally.
   *
   * @param {HttpAgent~RequestOptions} options Optional request options.
   * @return {HttpAgent~RequestOptions} Request options with set filled-in
   *         default values for missing fields, and extra options used
   *         internally.
   */
  _prepareOptions(options) {
    let composedOptions = Object.assign(
      {},
      this._defaultRequestOptions,
      options
    );
    let cookieHeader = {};

    if (composedOptions.withCredentials) {
      cookieHeader = { Cookie: this._cookie.getCookiesStringForCookieHeader() };
    }

    composedOptions.headers = Object.assign(
      cookieHeader,
      this._defaultRequestOptions.headers,
      options.headers || {}
    );

    return composedOptions;
  }

  /**
   * Generates cache key suffix for an HTTP request to the specified URL with
   * the specified data.
   *
   * @param {string} method The HTTP method used by the request.
   * @param {string} url The URL to which the request is sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        with the request.
   * @return {string} The suffix of a cache key to use for a request to the
   *         specified URL, carrying the specified data.
   */
  _getCacheKeySuffix(method, url, data) {
    let dataQuery = '';
    if (data) {
      try {
        dataQuery = JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
      } catch (error) {
        console.warn('The provided data does not have valid JSON format', data);
      }
    }
    return `${method}:${url}?${dataQuery}`;
  }

  /**
   * Sets all cookies from the {@code Set-Cookie} response header to the
   * cookie storage.
   *
   * @param {HttpAgent~Response} agentResponse The response of the server.
   */
  _setCookiesFromResponse(agentResponse) {
    if (agentResponse.headersRaw) {
      let receivedCookies = agentResponse.headersRaw.raw()['set-cookie'];

      if (receivedCookies) {
        if (!Array.isArray(receivedCookies)) {
          receivedCookies = [receivedCookies];
        }
        receivedCookies.forEach(cookieHeader => {
          this._cookie.parseFromSetCookieHeader(cookieHeader);
        });
      }
    }
  }

  /**
   * Saves the server response to the cache to be used as the result of the
   * next request of the same properties.
   *
   * @param {HttpAgent~Response} agentResponse The response of the server.
   */
  _saveAgentResponseToCache(agentResponse) {
    let cacheKey = this.getCacheKey(
      agentResponse.params.method,
      agentResponse.params.url,
      agentResponse.params.data
    );

    agentResponse.cached = true;
    let ttl = agentResponse.params.options.ttl;
    this._cache.set(cacheKey, agentResponse, ttl);
    agentResponse.cached = false;
  }
}

/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @enum {number}
 * @const
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
const StatusCode = Object.freeze({
  /**
   * OK
   *
   * @type {number}
   */
  OK: 200,

  /**
   * No content
   *
   * @type {number}
   */
  NO_CONTENT: 204,

  /**
   * Bad request
   *
   * @type {number}
   */
  BAD_REQUEST: 400,

  /**
   * Unauthorized
   *
   * @type {number}
   */
  UNAUTHORIZED: 401,

  /**
   * Forbidden
   *
   * @type {number}
   */
  FORBIDDEN: 403,

  /**
   * Not found
   *
   * @type {number}
   */
  NOT_FOUND: 404,

  /**
   * Request timeout
   *
   * @type {number}
   */
  TIMEOUT: 408,

  /**
   * Internal Server Error
   *
   * @type {number}
   */
  SERVER_ERROR: 500
});

/**
 * An object representing the complete request parameters used to create and
 * send the HTTP request.
 * @typedef {Object} HttpProxy~RequestParams
 * @property {string} method The HTTP method.
 * @property {string} url The original URL to which to make the request.
 * @property {string} transformedUrl The actual URL to which to make the
 *           request, created by applying the URL transformer to the
 *           original URL.
 * @property {Object<string, (boolean|number|string|Date)>} data The request
 *           data, sent as query or body.
 * @property {HttpAgent~RequestOptions} options The high-level request options
 *           provided by the HTTP agent.
 */

/**
 * An object that describes a failed HTTP request, providing
 * information about both the failure reported by the server and how the
 * request has been sent to the server.
 * @typedef {Object} HttpProxy~ErrorParams
 * @property {string} errorName An error name.
 * @property {number} status The HTTP response status code send by the
 *           server.
 * @property {object} body The body of HTTP error response (detailed
 *           information).
 * @property {Error} cause The low-level cause error.
 * @property {HttpProxy~RequestParams} params An object representing the
 *           complete request parameters used to create and send the HTTP
 *           request.
 */

/**
 * Middleware proxy between {@link HttpAgent} implementations and the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API Fetch API},
 * providing a Promise-oriented API for sending requests.
 */
class HttpProxy {
  /**
   * Initializes the HTTP proxy.
   *
   * @param {UrlTransformer} transformer A transformer of URLs to which
   *        requests are made.
   * @param {Window} window Helper for manipulating the global object `window`
   *        regardless of the client/server-side environment.
   */
  constructor(transformer, window) {
    /**
     * A transformer of URLs to which requests are made.
     *
     * @type {UrlTransformer}
     */
    this._transformer = transformer;

    /**
     * Helper for manipulating the global object `window` regardless of the
     * client/server-side environment.
     *
     * @type {Window}
     */
    this._window = window;

    /**
     * The default HTTP headers to include with the HTTP requests, unless
     * overridden.
     *
     * @type {Map<string, string>}
     */
    this._defaultHeaders = new Map();
  }

  /**
   * Executes a HTTP request to the specified URL using the specified HTTP
   * method, carrying the provided data.
   *
   * @param {string} method The HTTP method to use.
   * @param {string} url The URL to which the request should be made.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to
   *        be send to the server. The data will be included as query
   *        parameters if the request method is `GET` or `HEAD`, and as
   *        a request body for any other request method.
   * @param {HttpAgent~RequestOptions=} options Optional request options.
   * @return {Promise.<HttpAgent~Response>} A promise that resolves to the server
   *         response.
   */
  request(method, url, data, options) {
    const requestParams = this._composeRequestParams(
      method,
      url,
      data,
      options
    );

    return new Promise((resolve, reject) => {
      let requestTimeoutId;

      if (options.timeout) {
        requestTimeoutId = setTimeout(() => {
          reject(
            new GenericError('The HTTP request timed out', {
              status: StatusCode.TIMEOUT
            })
          );
        }, options.timeout);
      }

      const fetch = this._getFetchApi();
      fetch(
        this._composeRequestUrl(
          url,
          !this._shouldRequestHaveBody(method, data) ? data : {}
        ),
        this._composeRequestInit(method, data, options)
      )
        .then(response => {
          if (requestTimeoutId) {
            clearTimeout(requestTimeoutId);
          }

          const contentType = response.headers.get('content-type');

          if (response.status === StatusCode.NO_CONTENT) {
            return Promise.resolve([response, null]);
          } else if (contentType && contentType.includes('application/json')) {
            return response.json().then(body => [response, body]);
          } else {
            return response.text().then(body => [response, body]);
          }
        })
        .then(([response, responseBody]) =>
          this._processResponse(requestParams, response, responseBody)
        )
        .then(resolve, reject);
    }).catch(fetchError => {
      throw this._processError(fetchError, requestParams);
    });
  }

  /**
   * Sets the specified default HTTP header. The header will be sent with all
   * subsequent HTTP requests unless reconfigured using this method,
   * overridden by request options, or cleared by
   * {@link HttpProxy#clearDefaultHeaders} method.
   *
   * @param {string} header A header name.
   * @param {string} value A header value.
   */
  setDefaultHeader(header, value) {
    this._defaultHeaders.set(header, value);
  }

  /**
   * Clears all defaults headers sent with all requests.
   */
  clearDefaultHeaders() {
    this._defaultHeaders.clear();
  }

  /**
   * Gets an object that describes a failed HTTP request, providing
   * information about both the failure reported by the server and how the
   * request has been sent to the server.
   *
   * @param {string} method The HTTP method used to make the request.
   * @param {string} url The URL to which the request has been made.
   * @param {Object<string, (boolean|number|string|Date)>} data The data sent
   *        with the request.
   * @param {HttpAgent~RequestOptions} options Optional request options.
   * @param {number} status The HTTP response status code send by the server.
   * @param {object} body The body of HTTP error response (detailed
   *        information).
   * @param {Error} cause The low-level cause error.
   * @return {HttpProxy~ErrorParams} An object containing both the details of
   *         the error and the request that lead to it.
   */
  getErrorParams(method, url, data, options, status, body, cause) {
    let params = this._composeRequestParams(method, url, data, options);

    if (typeof body === 'undefined') {
      body = {};
    }

    let error = { status, body, cause };

    switch (status) {
      case StatusCode.TIMEOUT:
        error.errorName = 'Timeout';
        break;
      case StatusCode.BAD_REQUEST:
        error.errorName = 'Bad Request';
        break;
      case StatusCode.UNAUTHORIZED:
        error.errorName = 'Unauthorized';
        break;
      case StatusCode.FORBIDDEN:
        error.errorName = 'Forbidden';
        break;
      case StatusCode.NOT_FOUND:
        error.errorName = 'Not Found';
        break;
      case StatusCode.SERVER_ERROR:
        error.errorName = 'Internal Server Error';
        break;
      default:
        error.errorName = 'Unknown';
        break;
    }

    return Object.assign(error, params);
  }

  /**
   * Returns `true` if cookies have to be processed manually by setting
   * `Cookie` HTTP header on requests and parsing the `Set-Cookie` HTTP
   * response header.
   *
   * The result of this method depends on the current application
   * environment, the client-side usually handles cookie processing
   * automatically, leading this method returning `false`.
   *
   * At the client-side, the method tests whether the client has cookies
   * enabled (which results in cookies being automatically processed by the
   * browser), and returns `true` or `false` accordingly.
   *
   * @return {boolean} `true` if cookies are not processed automatically by
   *         the environment and have to be handled manually by parsing
   *         response headers and setting request headers, otherwise `false`.
   */
  haveToSetCookiesManually() {
    return !this._window.isClient();
  }

  /**
   * Processes the response received from the server.
   *
   * @param {HttpProxy~RequestParams} requestParams The original request's
   *        parameters.
   * @param {Response} response The Fetch API's `Response` object representing
   *        the server's response.
   * @param {*} responseBody The server's response body.
   * @return {HttpAgent~Response} The server's response along with all related
   *         metadata.
   */
  _processResponse(requestParams, response, responseBody) {
    if (response.ok) {
      return {
        status: response.status,
        body: responseBody,
        params: requestParams,
        headers: this._headersToPlainObject(response.headers),
        headersRaw: response.headers,
        cached: false
      };
    } else {
      throw new GenericError('The request failed', {
        status: response.status,
        body: responseBody
      });
    }
  }

  /**
   * Converts the provided Fetch API's `Headers` object to a plain object.
   *
   * @param {Headers} headers The headers to convert.
   * @return {Object.<string, string>} Converted headers.
   */
  _headersToPlainObject(headers) {
    let plainHeaders = {};

    if (headers.entries) {
      for (let [key, value] of headers.entries()) {
        plainHeaders[key] = value;
      }
    } else if (headers.forEach) {
      /**
       * Check for forEach() has to be here because in old Firefoxes (versions lower than 44) there is not
       * possibility to iterate through all the headers - according to docs
       * (https://developer.mozilla.org/en-US/docs/Web/API/Headers) where is "entries(), keys(), values(), and support
       * of for...of" is supported from Firefox version 44
       */
      if (headers.getAll) {
        /**
         * @todo This branch should be removed with node-fetch release
         *       2.0.0.
         */
        headers.forEach((_, headerName) => {
          plainHeaders[headerName] = headers.getAll(headerName).join(', ');
        });
      } else if (headers.get) {
        /**
         * In case that Headers.getAll() from previous branch doesn't exist because it is obsolete and deprecated - in
         * newer versions of the Fetch spec, Headers.getAll() has been deleted, and Headers.get() has been updated to
         * fetch all header values instead of only the first one - according to docs
         * (https://developer.mozilla.org/en-US/docs/Web/API/Headers/getAll)
         */
        headers.forEach((_, headerName) => {
          plainHeaders[headerName] = headers.get(headerName);
        });
      } else {
        /**
         * @todo If Microsoft Edge supported headers.entries(), we'd remove
         *       this branch.
         */
        headers.forEach((headerValue, headerName) => {
          plainHeaders[headerName] = headerValue;
        });
      }
    }

    return plainHeaders;
  }

  /**
   * Processes the provided Fetch API or internal error and creates an error
   * to expose to the calling API.
   *
   * @param {Error} fetchError The internal error to process.
   * @param {HttpProxy~RequestParams} requestParams An object representing the
   *        complete request parameters used to create and send the HTTP
   *        request.
   * @return {GenericError} The error to provide to the calling API.
   */
  _processError(fetchError, requestParams) {
    const errorParams =
      fetchError instanceof GenericError ? fetchError.getParams() : {};
    return this._createError(
      fetchError,
      requestParams,
      errorParams.status || StatusCode.SERVER_ERROR,
      errorParams.body || null
    );
  }

  /**
   * Creates an error that represents a failed HTTP request.
   *
   * @param {Error} cause The error's message.
   * @param {HttpProxy~RequestParams} requestParams An object representing the
   *        complete request parameters used to create and send the HTTP
   *        request.
   * @param {number} status Server's response HTTP status code.
   * @param {*} responseBody The body of the server's response, if any.
   * @return {GenericError} The error representing a failed HTTP request.
   */
  _createError(cause, requestParams, status, responseBody = null) {
    return new GenericError(
      cause.message,
      this.getErrorParams(
        requestParams.method,
        requestParams.url,
        requestParams.data,
        requestParams.options,
        status,
        responseBody,
        cause
      )
    );
  }

  /**
   * Returns {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch window.fetch}
   * compatible API to use, depending on the method being used at the server
   * (polyfill) or client (native/polyfill) side.
   *
   * @return {function((string|Request), RequestInit=): Promise.<Response>} An
   *         implementation of the Fetch API to use.
   */
  _getFetchApi() {
    const fetch = 'node-fetch';

    return this._window.isClient()
      ? this._window.getWindow().fetch
      : require(fetch);
  }

  /**
   * Composes an object representing the HTTP request parameters from the
   * provided arguments.
   *
   * @param {string} method The HTTP method to use.
   * @param {string} url The URL to which the request should be sent.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to
   *        send with the request.
   * @param {HttpAgent~RequestOptions} options Optional request options.
   * @return {HttpProxy~RequestParams} An object
   *         representing the complete request parameters used to create and
   *         send the HTTP request.
   */
  _composeRequestParams(method, url, data, options) {
    return {
      method,
      url,
      transformedUrl: this._transformer.transform(url),
      data,
      options
    };
  }

  /**
   * Composes an init object, which can be used as a second argument of
   * `window.fetch` method.
   *
   * @param {string} method The HTTP method to use.
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @param {HttpAgent~RequestOptions} options Options provided by the HTTP
   *        agent.
   * @return {RequestInit} A `RequestInit` object of the Fetch API.
   */
  _composeRequestInit(method, data, options) {
    options.headers['Content-Type'] = this._getContentType(
      method,
      data,
      options
    );

    for (let [headerName, headerValue] of this._defaultHeaders) {
      options.headers[headerName] = headerValue;
    }

    let requestInit = {
      method: method.toUpperCase(),
      headers: options.headers,
      credentials: options.withCredentials ? 'include' : 'same-origin',
      redirect: 'follow'
    };

    if (this._shouldRequestHaveBody(method, data)) {
      requestInit.body = this._transformRequestBody(data, options.headers);
    }

    Object.assign(requestInit, options.fetchOptions || {});

    return requestInit;
  }

  /**
   * Gets a `Content-Type` header value for defined method, data and options.
   *
   * @param {string} method The HTTP method to use.
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @param {HttpAgent~RequestOptions} options Options provided by the HTTP
   *        agent.
   * @return {string} A `Content-Type` header value.
   */
  _getContentType(method, data, options) {
    if (options.headers['Content-Type']) {
      return options.headers['Content-Type'];
    }

    if (this._shouldRequestHaveBody(method, data)) {
      return 'application/json';
    }

    return '';
  }

  /**
   * Transforms the provided URL using the current URL transformer and adds
   * the provided data to the URL's query string.
   *
   * @param {string} url The URL to prepare for use with the fetch API.
   * @param {Object<string, (boolean|number|string|Date)>} data The data to be
   *        attached to the query string.
   * @return {string} The transformed URL with the provided data attached to
   *         its query string.
   */
  _composeRequestUrl(url, data) {
    const transformedUrl = this._transformer.transform(url);
    const queryString = this._convertObjectToQueryString(data || {});
    const delimeter = queryString
      ? transformedUrl.includes('?')
        ? '&'
        : '?'
      : '';

    return `${transformedUrl}${delimeter}${queryString}`;
  }

  /**
   * Checks if a request should have a body (`GET` and `HEAD` requests don't
   * have a body).
   *
   * @param {string} method The HTTP method.
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @return {boolean} `true` if a request has a body, otherwise `false`.
   */
  _shouldRequestHaveBody(method, data) {
    return ['get', 'head'].indexOf(method.toLowerCase()) === -1 && data;
  }

  /**
   * Formats request body according to request headers.
   *
   * @param {Object.<string, (boolean|number|string|Date)>} data The data to
   *        be send with a request.
   * @param {Object.<string, string>} headers Headers object from options provided by the HTTP
   *        agent.
   * @returns {string|Object|FormData}
   * @private
   */
  _transformRequestBody(data, headers) {
    switch (headers['Content-Type']) {
      case 'application/json':
        return JSON.stringify(data);
      case 'application/x-www-form-urlencoded':
        return this._convertObjectToQueryString(data);
      case 'multipart/form-data':
        return this._convertObjectToFormData(data);
      default:
        return data;
    }
  }

  /**
   * Returns query string representation of the data parameter.
   * (Returned string does not contain ? at the beginning)
   *
   * @param {Object.<string, (boolean|number|string|Date)>} object The object to be converted
   * @returns {string} Query string representation of the given object
   * @private
   */
  _convertObjectToQueryString(object) {
    return Object.keys(object)
      .map(key => [key, object[key]].map(encodeURIComponent).join('='))
      .join('&');
  }

  /**
   * Converts given data to FormData object.
   * If FormData object is not supported by the browser the original object is returned.
   *
   * @param {Object.<string, (boolean|number|string|Date)>} object The object to be converted
   * @returns {Object|FormData}
   * @private
   */
  _convertObjectToFormData(object) {
    const window = this._window.getWindow();

    if (!window || !window.FormData) {
      return object;
    }
    const formDataObject = new FormData();
    Object.keys(object).forEach(key => formDataObject.append(key, object[key]));

    return formDataObject;
  }
}

/**
 * Utility for transforming URLs according to the configured replacement rules.
 */
class UrlTransformer {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the URL transformer.
   */
  constructor() {
    /**
     * @type {Object<string, string>}
     */
    this._rules = {};
  }

  /**
   * Adds the provided replacement rule to the rules used by this URL
   * transformer.
   *
   * @param {string} pattern Regexp patter to look for (must be escaped as if
   *        for use in the {@linkcode Regexp} constructor).
   * @param {string} replacement The replacement of the matched patter in any
   *        matched URL.
   * @return {UrlTransformer} This transformer.
   */
  addRule(pattern, replacement) {
    this._rules[pattern] = replacement;

    return this;
  }

  /**
   * Clears all rules.
   *
   * @return {UrlTransformer} This transformer.
   */
  clear() {
    this._rules = {};

    return this;
  }

  /**
   * Applies all rules registered with this URL transformer to the provided
   * URL and returns the result. The rules will be applied in the order they
   * were registered.
   *
   * @param {string} str The URL for transformation.
   * @return {string} Transformed URL.
   */
  transform(str) {
    let rulesKey = Object.keys(this._rules);

    if (rulesKey.length === 0) {
      return str;
    }

    let reg = new RegExp(rulesKey.join('|'), 'g');

    return str.replace(reg, ruleKey => this._rules[ruleKey]);
  }
}

/**
 * The Meta manager is a utility for managing various page attributes related
 * to the SEO (search engine optimization) and social network integration.
 *
 * The Meta manager is used to manage the following:
 * - page title, set using the contents of the {@code &lt;title&gt;} element
 * - page links, linking related documents and meta-information, added to the
 *   using {@code &lt;link&gt;} elements
 * - page meta information:
 *   - the generic named meta information added to the page via
 *     {@code &lt;meta&gt;} elements with the {@code name} attribute, for
 *     example the {@code keywords}.
 *   - specialized meta information added to the page via {@code &lt;meta&gt;}
 *     elements with the {@code property} attribute, for example the OG meta
 *     tags ({@code og:type}, {@code og:image}, etc.).
 *
 * @interface
 */
class MetaManager {
  /**
   * Sets the page title.
   *
   * @param {string} title The new page title.
   */
  setTitle() {}

  /**
   * Returns the page title. The method returns an empty string if no page
   * title has been set yet.
   *
   * Note that the page title is cached internally by the meta manager and
   * may therefore differ from the current document title if it has been
   * modified by a 3rd party code.
   *
   * @return {string} The current page title.
   */
  getTitle() {}

  /**
   * Set the specified named meta information property.
   *
   * @param {string} name Meta information property name, for example
   *        {@code keywords}.
   * @param {string} value The meta information value.
   */
  setMetaName() {}

  /**
   * Returns the value of the specified named meta information property. The
   * method returns an empty string for missing meta information (to make the
   * returned value React-friendly).
   *
   * @param {string} name The name of the named meta information property.
   * @return {string} The value of the generic meta information, or an empty
   *         string.
   */
  getMetaName() {}

  /**
   * Returns the names of the currently specified named meta information
   * properties.
   *
   * @return {string[]} The names of the currently specified named meta
   *         information properties.
   */
  getMetaNames() {}

  /**
   * Sets the specified specialized meta information property.
   *
   * @param {string} name Name of the specialized meta information property.
   * @param {string} value The value of the meta information property.
   */
  setMetaProperty() {}

  /**
   * Returns the value of the specified specialized meta information
   * property. The method returns an empty string for missing meta
   * information (to make the returned value React-friendly).
   *
   * @param {string} name The name of the specialized meta information
   *        property.
   * @return {string} The value of the specified meta information, or an
   *         empty string.
   */
  getMetaProperty() {}

  /**
   * Returns the names of the currently specified specialized meta
   * information properties.
   *
   * @return {string[]} The names of the currently specified specialized meta
   *         information properties.
   */
  getMetaProperties() {}

  /**
   * Sets the specified specialized link information.
   *
   * @param {string} relation The relation of the link target to the current
   *        page.
   * @param {string} reference The reference to the location of the related
   *        document, e.g. a URL.
   */
  setLink() {}

  /**
   * Return the reference to the specified related linked document. The
   * method returns an empty string for missing meta information (to make the
   * returned value React-friendly).
   *
   * @param {string} relation The relation of the link target to the current
   *        page.
   * @return {string} The reference to the location of the related document,
   *         e.g. a URL.
   */
  getLink() {}

  /**
   * Returns the relations of the currently set related documents linked to
   * the current page.
   *
   * @return {string[]}
   */
  getLinks() {}
}

/**
 * Default implementation of the {@codelink MetaManager} interface.
 */
class MetaManagerImpl extends MetaManager {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the meta page attributes manager.
   */
  constructor() {
    super();

    /**
     * The page title.
     *
     * @type {string}
     */
    this._title = '';

    /**
     * Storage of generic meta information.
     *
     * @type {Map<string, string>}
     */
    this._metaName = new Map();

    /**
     * Storage of specialized meta information.
     *
     * @type {Map<string, string>}
     */
    this._metaProperty = new Map();

    /**
     * Storage of generic link information.
     *
     * @type {Map<string, string>}
     */
    this._link = new Map();
  }

  /**
   * @inheritdoc
   */
  setTitle(title) {
    this._title = title;
  }

  /**
   * @inheritdoc
   */
  getTitle() {
    return this._title;
  }

  /**
   * @inheritdoc
   */
  setMetaName(name, value) {
    this._metaName.set(name, value);
  }

  /**
   * @inheritdoc
   */
  getMetaName(name) {
    return this._metaName.get(name) || '';
  }

  /**
   * @inheritdoc
   */
  getMetaNames() {
    return Array.from(this._metaName.keys());
  }

  /**
   * @inheritdoc
   */
  setMetaProperty(name, value) {
    this._metaProperty.set(name, value);
  }

  /**
   * @inheritdoc
   */
  getMetaProperty(name) {
    return this._metaProperty.get(name) || '';
  }

  /**
   * @inheritdoc
   */
  getMetaProperties() {
    return Array.from(this._metaProperty.keys());
  }

  /**
   * @inheritdoc
   */
  setLink(relation, value) {
    this._link.set(relation, value);
  }

  /**
   * @inheritdoc
   */
  getLink(relation) {
    return this._link.get(relation) || '';
  }

  /**
   * @inheritdoc
   */
  getLinks() {
    return Array.from(this._link.keys());
  }
}

/**
 * Retrieves the view utilities from the component's current context or
 * properties (preferring the context).
 *
 * @param {Object<string, *>} props The component's current properties.
 * @param {Object<string, *>} context The component's current context.
 * @return {Object<string, *>} The retrieved view utilities.
 * @throws Error Throw if the view utils cannot be located in the provided
 *         properties nor context.
 */
function getUtils(props, context) {
  const utils = context ? context.$Utils || props.$Utils : props.$Utils;

  if ($Debug && !utils) {
    throw new Error(
      'The component cannot access the view utils because they were ' +
        'not passed in the initial props or context as $Utils.'
    );
  }

  return utils;
}

/**
 * Returns the localized phrase identified by the specified key. The
 * placeholders in the localization phrase will be replaced by the provided
 * values.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requiring the localization.
 * @param {string} key Localization key.
 * @param {Object<string, (number|string)>=} params Values for replacing the
 *        placeholders in the localization phrase.
 * @return {string} Localized phrase.
 */
function localize(component, key, params) {
  return component.utils.$Dictionary.get(key, params);
}

/**
 * Generates an absolute URL using the provided route name (see the
 * <code>app/config/routes.js</code> file). The provided parameters will
 * replace the placeholders in the route pattern, while the extraneous
 * parameters will be appended to the generated URL's query string.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requiring the generating of the URL.
 * @param {string} name The route name.
 * @param {Object<string, (number|string)>=} params Router parameters and
 *        extraneous parameters to add to the URL as a query string.
 * @return {string} The generated URL.
 */
function link(component, name, params) {
  return component.utils.$Router.link(name, params);
}

/**
 * Generate a string of CSS classes from the properties of the passed-in
 * object that resolve to {@code true}.
 *
 * @example
 *        this.cssClasses('my-class my-class-modificator', true);
 * @example
 *        this.cssClasses({
 *            'my-class': true,
 *            'my-class-modificator': this.props.modificator
 *        }, true);
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requiring the composition of the CSS class names.
 * @param {(string|Object<string, boolean>)} classRules CSS classes in a
 *        string separated by whitespace, or a map of CSS class names to
 *        boolean values. The CSS class name will be included in the result
 *        only if the value is {@code true}.
 * @param {boolean} includeComponentClassName
 * @return {string} String of CSS classes that had their property resolved
 *         to {@code true}.
 */
function cssClasses(component, classRules, includeComponentClassName) {
  return component.utils.$CssClasses(
    classRules,
    includeComponentClassName && component
  );
}

/**
 * Generate a string of CSS classes from the properties of the passed-in
 * object that resolve to {@code true}.
 *
 * @param {(string|Object<string, boolean>)} classRules CSS classes in a
 *        string separated by whitespace, or a map of CSS class names to
 *        boolean values. The CSS class name will be included in the result
 *        only if the value is {@code true}.
 * @param {?(AbstractComponent|AbstractPureComponent|string)} component The component
 *        requiring the composition of the CSS class names, if it has the
 *        {@code className} property set and requires its inclusion this time.
 * @return {string} String of CSS classes that had their property resolved
 *         to {@code true}.
 */
function defaultCssClasses(classRules, component) {
  let extraClasses = typeof component === 'string' ? component : null;

  if (
    !extraClasses &&
    (component instanceof React.Component ||
      component instanceof React.PureComponent)
  ) {
    extraClasses = component.props.className;
  }

  return classnames(classRules, extraClasses);
}

/**
 * Creates and sends a new IMA.js DOM custom event from the provided component.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        at which's root element the event will originate.
 * @param {string} eventName The name of the event.
 * @param {*=} data Data to send within the event.
 */
function fire(component, eventName, data = null) {
  return component.utils.$EventBus.fire(
    ReactDOM.findDOMNode(component), //eslint-disable-line react/no-find-dom-node
    eventName,
    data
  );
}

/**
 * Registers the provided event listener for execution whenever an IMA.js
 * DOM custom event of the specified name occurs at the specified event
 * target.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requesting the registration of the event listener.
 * @param {(React.Element|EventTarget)} eventTarget The react component or
 *        event target at which the listener should listen for the event.
 * @param {string} eventName The name of the event for which to listen.
 * @param {function(Event)} listener The listener for event to register.
 */
function listen(component, eventTarget, eventName, listener) {
  if (eventTarget && !eventTarget.addEventListener) {
    // Safari doesn't have EventTarget
    eventTarget = ReactDOM.findDOMNode(eventTarget); //eslint-disable-line react/no-find-dom-node
  }

  return component.utils.$EventBus.listen(eventTarget, eventName, listener);
}

/**
 * Deregisters the provided event listener for an IMA.js DOM custom event
 * of the specified name at the specified event target.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        that requested the registration of the event listener.
 * @param {(React.Element|EventTarget)} eventTarget The react component or
 *        event target at which the listener should listen for the event.
 * @param {string} eventName The name of the event for which to listen.
 * @param {function(Event)} listener The listener for event to register.
 */
function unlisten(component, eventTarget, eventName, listener) {
  if (eventTarget && !eventTarget.addEventListener) {
    // Safari doesn't have EventTarget
    eventTarget = ReactDOM.findDOMNode(eventTarget); //eslint-disable-line react/no-find-dom-node
  }

  const eventBus = component.utils.$EventBus;
  return eventBus.unlisten(eventTarget, eventName, listener);
}

/**
 * Factory for page.
 */
class PageFactory {
  /**
   * Factory used by page management classes.
   *
   * @param {ObjectContainer} oc
   */
  constructor(oc) {
    /**
     * The current application object container.
     *
     * @type {ObjectContainer}
     */
    this._oc = oc;
  }

  /**
   * Create new instance of {@linkcode Controller}.
   *
   * @param {(string|function(new:Controller))} controller
   * @return {Controller}
   */
  createController(controller) {
    let controllerInstance = this._oc.create(controller);

    return controllerInstance;
  }

  /**
   * Retrieves the specified react component class.
   *
   * @param {(string|function(new: React.Component))} view The namespace
   *        referring to a react component class, or a react component class
   *        constructor.
   * @return {function(new: React.Component)} The react component class
   *         constructor.
   */
  createView(view) {
    if (typeof view === 'function') {
      return view;
    }
    let classConstructor = this._oc.getConstructorOf(view);

    if (classConstructor) {
      return classConstructor;
    } else {
      throw new GenericError(
        `ima.page.Factory:createView hasn't name of view "${view}".`
      );
    }
  }

  /**
   * Returns decorated controller for ease setting seo params in controller.
   *
   * @param {Controller} controller
   * @return {Controller}
   */
  decorateController(controller) {
    let metaManager = this._oc.get('$MetaManager');
    let router = this._oc.get('$Router');
    let dictionary = this._oc.get('$Dictionary');
    let settings = this._oc.get('$Settings');

    let decoratedController = this._oc.create('$ControllerDecorator', [
      controller,
      metaManager,
      router,
      dictionary,
      settings
    ]);

    return decoratedController;
  }

  /**
   * Returns decorated page state manager for extension.
   *
   * @param {PageStateManager} pageStateManager
   * @param {string[]} allowedStateKeys
   * @return {PageStateManager}
   */
  decoratePageStateManager(pageStateManager, allowedStateKeys) {
    let decoratedPageStateManager = this._oc.create(
      '$PageStateManagerDecorator',
      [pageStateManager, allowedStateKeys]
    );

    return decoratedPageStateManager;
  }
}

/**
 *
 */
class PageHandler {
  /**
   * Initializes the page handler.
   */
  init() {}

  /**
   * Called before a PageManager starts to transition from previous page to
   * a new one.
   *
   * @param {?ManagedPage} managedPage The currently managed page - soon-to-be
   *        previously managed page.
   * @param {?ManagedPage} nextManagedPage The data of the page that's about to
   *        be managed.
   * @param {{
   *          type: string,
   *          event: Event,
   *          url: string
   *        }} [action] An action object describing what triggered the routing.
   */
  handlePreManagedState() {}

  /**
   * Called after a PageManager finishes transition from previous page to
   * a new one.
   *
   * @param {?ManagedPage} managedPage The currently managed page.
   * @param {?ManagedPage} previousManagedPage The data of the page that was
   *        previously managed.
   * @param {{
   *          type: string,
   *          event: Event,
   *          url: string
   *        }} [action] An action object describing what triggered the routing.
   */
  handlePostManagedState() {}

  /**
   * Finalization callback, called when the page manager is being discarded.
   * This usually happens when the page is hot-reloaded at the client side.
   */
  destroy() {}
}

/**
 * Execution is an abstract class that defines a standard for executing jobs.
 * The execution can be either done in serial or in parallel way.
 *
 * When executing jobs in parallel an option should define how to deal with
 * a result of each individual job execution. One option would be to return the
 * result of a job that completes first. Second option is to return result of
 * all jobs once they're all complete.
 *
 * For serial execution you should define an option that affects how arguments
 * passed to the {@code execute} method are distributed. They could be either
 * supplied to each job individually (thus meaning one job's mutation won't
 * affect another job) or they could be supplied to the first job and then
 * piped through other jobs.
 *
 * @interface
 */
class Execution {
  /**
   * Adds a new job to be executed. The job is appended at the end of the
   * list of current jobs therefore is executed last.
   *
   * @param {Array<function(): Promise>} jobs The jobs to be executed.
   */
  append() {}

  /**
   * Start executing collected jobs. In the end a {@code Promise} is returned
   * with a resulting value. On the returned {@code Promise} a {@code catch}
   * method can be called to prevent any unwanted interruption.
   *
   * @param {...any} args Arguments to be passed when executing jobs
   * @returns {Promise}
   */
  execute() {}
}

const CLASS_REGEX = /^\s*class\b/;

/**
 * Basic implementation of the {@link Execution} interface. Provides the basic
 * functionality for appending and validating jobs.
 *
 * @abstract
 * @extends Execution
 */
class AbstractExecution extends Execution {
  constructor(jobs = []) {
    super();

    this._jobs = jobs.filter(this._validateJob);
  }

  /**
   * @inheritDoc
   */
  append(jobs) {
    if (!Array.isArray(jobs)) {
      jobs = [jobs];
    }

    this._jobs = this._jobs.concat(jobs.filter(this._validateJob));
  }

  /**
   * @inheritDoc
   */
  execute() {
    throw new GenericError(
      'The ima.execution.AbstractExecution.execute method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * Return {@code true} if the given job can be executed
   *
   * @protected
   * @param {function(): Promise} job
   * @returns {boolean}
   */
  _validateJob(job) {
    if (typeof job === 'function') {
      if (!CLASS_REGEX.test(job.toString())) {
        return true;
      }
    }

    if ($Debug) {
      console.warn(
        'ima.execution.AbstractExecution: Given job is not a callable ' +
          'function therefore it will be excluded from execution.',
        {
          job
        }
      );
    }

    return false;
  }
}

/**
 *
 *
 * @extends AbstractExecution
 */
class SerialBatch extends AbstractExecution {
  /**
   * @inheritDoc
   */
  execute(...args) {
    const zeroStage = Promise.resolve([]);

    return this._jobs.reduce(
      (lastStage, currentStage) =>
        lastStage.then(results =>
          this._executeJob(currentStage, args).then(
            Array.prototype.concat.bind(results)
          )
        ),
      zeroStage
    );
  }

  _executeJob(stage, args) {
    let result = stage(...args);

    if (!(result instanceof Promise)) {
      result = Promise.resolve(result);
    }

    return result;
  }
}

class PageHandlerRegistry extends PageHandler {
  /**
   * Creates an instance of HandlerRegistry and creates {@code SerialBatch}
   * instance for pre-handlers and post-handlers.
   *
   * @param {...PageHandler} pageHandlers
   * @memberof HandlerRegistry
   */
  constructor(...pageHandlers) {
    super(...pageHandlers);

    /**
     * Page handlers.
     *
     * @protected
     * @type {PageHandler[]}
     */
    this._pageHandlers = pageHandlers;

    /**
     * Page handlers.
     *
     * @protected
     * @type {Execution}
     */
    this._preManageHandlers = pageHandlers;

    /**
     * Page handlers.
     *
     * @protected
     * @type {Execution}
     */
    this._postManageHandlers = pageHandlers;
  }

  /**
   * @inheritdoc
   */
  init() {
    this._pageHandlers.forEach(handler => handler.init());

    this._preManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers.map(handler =>
          handler.handlePreManagedState.bind(handler)
        )
      ]
    );

    this._postManageHandlers = Reflect.construct(
      PageHandlerRegistry.ExecutionMethod,
      [
        this._pageHandlers.map(handler =>
          handler.handlePostManagedState.bind(handler)
        )
      ]
    );
  }

  /**
   * Executes the pre-manage handlers with given arguments
   *
   * @param {?ManagedPage} managedPage
   * @param {?ManagedPage} nextManagedPage
   * @param {{ type: string, event: Event, url: string }} action
   * @return {Promise<any>}
   */
  handlePreManagedState(managedPage, nextManagedPage, action) {
    return this._preManageHandlers.execute(
      managedPage,
      nextManagedPage,
      action
    );
  }

  /**
   * Executes the post-manage handlers with given arguments
   *
   * @param {?ManagedPage} managedPage
   * @param {?ManagedPage} previousManagedPage
   * @param {{ type: string, event: Event, url: string }} action
   * @return {Promise<any>}
   */
  handlePostManagedState(managedPage, previousManagedPage, action) {
    return this._postManageHandlers.execute(
      managedPage,
      previousManagedPage,
      action
    );
  }

  /**
   * @inheritdoc
   */
  destroy() {
    this._pageHandlers.forEach(handler => handler.destroy());

    this._preManageHandlers = null;
    this._postManageHandlers = null;
    this._pageHandlers = null;
  }
}

PageHandlerRegistry.ExecutionMethod = SerialBatch;

/**
 * Name of actions that can trigger routing
 *
 * @enum {string}
 * @type {Object<string, string>}
 */
const ActionTypes = Object.freeze({
  /**
   * @const
   * @type {string}
   */
  REDIRECT: 'redirect',

  /**
   * @const
   * @type {string}
   */
  CLICK: 'click',

  /**
   * @const
   * @type {string}
   */
  POP_STATE: 'popstate',

  /**
   * @const
   * @type {string}
   */
  ERROR: 'error'
});

/**
 *
 */
class PageNavigationHandler extends PageHandler {
  static get $dependencies() {
    return [Window];
  }

  /**
   * @param {Window} window The utility for manipulating the global context
   *        and global client-side-specific APIs.
   */
  constructor(window) {
    super();

    /**
     * The utility for manipulating the global context and global
     * client-side-specific APIs.
     *
     * @type {ima.window.Window}
     */
    this._window = window;
  }

  /**
   * @inheritDoc
   */
  init() {
    // Setup history object to leave the scrolling to us and to not interfere
    const browserWindow = this._window.getWindow();

    if ('scrollRestoration' in browserWindow.history) {
      browserWindow.history.scrollRestoration = 'manual';
    }
  }

  /**
   * @inheritDoc
   */
  handlePreManagedState(managedPage, nextManagedPage, action) {
    const {
      options: { autoScroll }
    } = nextManagedPage;

    if (
      managedPage &&
      action &&
      action.type !== ActionTypes.POP_STATE &&
      action.type !== ActionTypes.ERROR
    ) {
      this._saveScrollHistory();
      this._setAddressBar(action.url);
    }

    if (autoScroll) {
      this._scrollTo({ x: 0, y: 0 });
    }
  }

  /**
   * @inheritDoc
   */
  handlePostManagedState(managedPage, previousManagedPage, action) {
    const { event } = action;
    const {
      options: { autoScroll }
    } = managedPage;

    if (event && event.state && event.state.scroll && autoScroll) {
      this._scrollTo(event.state.scroll);
    }
  }

  /**
   * Save user's scroll state to history.
   *
   * Replace scroll values in current state for actual scroll values in
   * document.
   */
  _saveScrollHistory() {
    const url = this._window.getUrl();
    const scroll = {
      x: this._window.getScrollX(),
      y: this._window.getScrollY()
    };
    const state = { url, scroll };

    const oldState = this._window.getHistoryState();
    const newState = Object.assign({}, oldState, state);

    this._window.replaceState(newState, null, url);
  }

  /**
   * Scrolls to give coordinates on a page.
   *
   * @param {Object} scroll
   * @param {number} [scroll.x]
   * @param {number} [scroll.y]
   */
  _scrollTo({ x = 0, y = 0 }) {
    setTimeout(() => {
      this._window.scrollTo(x, y);
    }, 0);
  }

  /**
   * Sets the provided URL to the browser's address bar by pushing a new
   * state to the history.
   *
   * The state object pushed to the history will be an object with the
   * following structure: {@code {url: string}}. The {@code url} field will
   * be set to the provided URL.
   *
   * @param {string} url The URL.
   */
  _setAddressBar(url) {
    let scroll = {
      x: 0,
      y: 0
    };
    let state = { url, scroll };

    this._window.pushState(state, null, url);
  }
}

/**
 * The page manager is a utility for managing the current controller and its
 * view.
 */
class PageManager {
  /**
   * Initializes the page manager.
   */
  init() {}

  /**
   * Starts to manage the provided controller and its view. The manager
   * stops the management of any previously managed controller and view.
   *
   * The controller and view will be initialized and rendered either into the
   * UI (at the client-side) or to the response to send to the client (at the
   * server-side).
   *
   * @param {Route} route A route instance that holds information about the
   *        page we should manage.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: ima.controller.Controller, ...*)),
   *              function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              )
   *            ): boolean
   *          ),
   *          autoScroll: boolean,
   *          allowSPA: boolean,
   *          documentView: ?function(new: AbstractDocumentView),
   *          managedRootView: ?function(new: React.Component),
   *          viewAdapter: ?function(new: React.Component)
   *        }} options The current route options.
   * @param {Object<string, string>=} [params={}] The route parameters of the
   *        current route.
   * @param {{
   *          type: string,
   *          event: Event,
   *          url: string
   *        }} [action] An action object describing what triggered the routing.
   * @return {Promise<{
   *           status: number,
   *           content: ?string,
   *           pageState: Object<string, *>
   *         }>} A promise that will resolve to information about the rendered page.
   *         The {@code status} will contain the HTTP status code to send to the
   *         client (at the server side) or determine the type of error page
   *         to navigate to (at the client side).
   *         The {@code content} field will contain the rendered markup of
   *         the page at the server-side, or {@code null} at the client-side.
   */
  manage() {}

  /**
   * Finalization callback, called when the page manager is being discarded.
   * This usually happens when the page is hot-reloaded at the client side.
   *
   * @return {Promise<undefined>}
   */
  destroy() {}
}

/**
 * An Object used to configure a route
 *
 * @typedef {{
 *            onlyUpdate: (
 *              boolean|
 *              function(
 *                (string|function(new: Controller)),
 *                function(new: React.Component,
 *                 Object<string, *>,
 *                 ?Object<string, *>
 *               )
 *              ): boolean
 *            ),
 *            autoScroll: boolean,
 *            allowSPA: boolean,
 *            documentView: ?function(new: AbstractDocumentView),
 *            managedRootView: ?function(new: React.Component),
 *            viewAdapter: ?function(new: React.Component)
 *          }} RouteOptions
 */

/**
 * An object representing a page that's currently managed by PageManager
 *
 * @typedef {{
 *            controller: ?(string|function(new: Controller)),
 *            controllerInstance: ?Controller,
 *            decoratedController: ?Controller,
 *            view: ?React.Component,
 *            viewInstance: ?React.Element,
 *            options: ?RouteOptions,
 *            params: ?Object<string, string>,
 *            state: {
 *              activated: boolean
 *            }
 *          }} ManagedPage
 */

/**
 * Page manager for controller.
 */
class AbstractPageManager extends PageManager {
  /**
   * Initializes the page manager.
   *
   * @param {PageFactory} pageFactory Factory used by the page manager to
   *        create instances of the controller for the current route, and
   *        decorate the controllers and page state managers.
   * @param {PageRenderer} pageRenderer The current renderer of the page.
   * @param {PageStateManager} pageStateManager The current page state
   *        manager.
   * @param {HandlerRegistry} pageHandlerRegistry Instance of HandlerRegistry that
   *        holds a list of pre-manage and post-manage handlers.
   */
  constructor(
    pageFactory,
    pageRenderer,
    pageStateManager,
    pageHandlerRegistry
  ) {
    super();

    /**
     * Factory used by the page manager to create instances of the
     * controller for the current route, and decorate the controllers and
     * page state managers.
     *
     * @protected
     * @type {PageFactory}
     */
    this._pageFactory = pageFactory;

    /**
     * The current renderer of the page.
     *
     * @protected
     * @type {PageRenderer}
     */
    this._pageRenderer = pageRenderer;

    /**
     * The current page state manager.
     *
     * @protected
     * @type {PageStateManager}
     */
    this._pageStateManager = pageStateManager;

    /**
     * A registry that holds a list of pre-manage and post-manage handlers.
     *
     * @protected
     * @type {PageHandlerRegistry}
     */
    this._pageHandlerRegistry = pageHandlerRegistry;

    /**
     * Details of the currently managed page.
     *
     * @protected
     * @type {ManagedPage}
     */
    this._managedPage = {};

    /**
     * Snapshot of the previously managed page before it was replaced with
     * a new one
     *
     * @protected
     * @type {ManagedPage}
     */
    this._previousManagedPage = {};
  }

  /**
   * @inheritdoc
   */
  init() {
    this._clearManagedPageValue();
    this._pageStateManager.onChange = newState => {
      this._onChangeStateHandler(newState);
    };
    this._pageHandlerRegistry.init();
  }

  /**
   * @inheritdoc
   */
  async manage(route, options, params = {}, action = {}) {
    const controller = route.getController();
    const view = route.getView();

    this._storeManagedPageSnapshot();

    if (this._hasOnlyUpdate(controller, view, options)) {
      this._managedPage.params = params;

      await this._runPreManageHandlers(this._managedPage, action);
      const response = await this._updatePageSource();
      await this._runPostManageHandlers(this._previousManagedPage, action);

      return response;
    }

    // Construct new managedPage value
    const pageFactory = this._pageFactory;
    const controllerInstance = pageFactory.createController(controller);
    const decoratedController = pageFactory.decorateController(
      controllerInstance
    );
    const viewInstance = pageFactory.createView(view);
    const newManagedPage = this._constructManagedPageValue(
      controller,
      view,
      route,
      options,
      params,
      controllerInstance,
      decoratedController,
      viewInstance
    );

    // Run pre-manage handlers before affecting anything
    await this._runPreManageHandlers(newManagedPage, action);

    // Deactivate the old instances and clearing state
    await this._deactivatePageSource();
    await this._destroyPageSource();

    this._pageStateManager.clear();
    this._clearComponentState(options);
    this._clearManagedPageValue();

    // Store the new managedPage object and initialize controllers and
    // extensions
    this._managedPage = newManagedPage;
    await this._initPageSource();

    const response = await this._loadPageSource();
    await this._runPostManageHandlers(this._previousManagedPage, action);

    return response;
  }

  /**
   * @inheritdoc
   */
  async destroy() {
    this._pageHandlerRegistry.destroy();
    this._pageStateManager.onChange = null;

    await this._deactivatePageSource();
    await this._destroyPageSource();

    this._pageStateManager.clear();

    this._clearManagedPageValue();
  }

  /**
   * @protected
   * @param {(string|function)} controller
   * @param {(string|function)} view
   * @param {Route} route
   * @param {RouteOptions} options
   * @param {Object<string, string>} params The route parameters.
   * @param {AbstractController} controllerInstance
   * @param {ControllerDecorator} decoratedController
   * @param {React.Component} viewInstance
   * @returns {ManagedPage}
   */
  _constructManagedPageValue(
    controller,
    view,
    route,
    options,
    params,
    controllerInstance,
    decoratedController,
    viewInstance
  ) {
    return {
      controller,
      controllerInstance,
      decoratedController,
      view,
      viewInstance,
      route,
      options,
      params,
      state: {
        activated: false
      }
    };
  }

  /**
   * Creates a cloned version of currently managed page and stores it in
   * a helper property.
   * Snapshot is used in manager handlers to easily determine differences
   * between the current and the previous state.
   *
   * @protected
   * @returns {ManagedPage}
   */
  _storeManagedPageSnapshot() {
    this._previousManagedPage = Object.assign({}, this._managedPage);

    return this._previousManagedPage;
  }

  /**
   * Clear value from managed page.
   *
   * @protected
   */
  _clearManagedPageValue() {
    this._managedPage = {
      controller: null,
      controllerInstance: null,
      decoratedController: null,
      view: null,
      viewInstance: null,
      route: null,
      options: null,
      params: null,
      state: {
        activated: false
      }
    };
  }

  /**
   * Removes properties we do not want to propagate outside of the page manager
   *
   * @protected
   * @param {ManagedPage} value The managed page object to strip down
   * @returns {{
   *            controller: ?(string|function(new: Controller)),
   *            view: ?React.Component,
   *            route: Route,
   *            options: ?RouteOptions,
   *            params: ?Object<string, string>
   *          }}
   */
  _stripManagedPageValueForPublic(value) {
    const { controller, view, route, options, params } = value;

    return { controller, view, route, options, params };
  }

  /**
   * Set page state manager to extension which has restricted rights to set
   * global state.
   *
   * @param {ima.extension.Extension} extension
   * @param {Object<string, *>} extensionState
   */
  _setRestrictedPageStateManager(extension, extensionState) {
    let stateKeys = Object.keys(extensionState);
    let allowedKey = extension.getAllowedStateKeys();
    let allAllowedStateKeys = stateKeys.concat(allowedKey);

    let pageFactory = this._pageFactory;
    let decoratedPageStateManager = pageFactory.decoratePageStateManager(
      this._pageStateManager,
      allAllowedStateKeys
    );

    extension.setPageStateManager(decoratedPageStateManager);
  }

  /**
   * For defined extension switches to pageStageManager and clears partial state
   * after extension state is loaded.
   *
   * @param {ima.extension.Extension} extension
   * @param {Object<string, *>} extensionState
   */
  _switchToPageStateManagerAfterLoaded(extension, extensionState) {
    let stateValues = Object.values(extensionState);

    Promise.all(stateValues)
      .then(() => {
        extension.switchToStateManager();
        extension.clearPartialState();
      })
      .catch(() => {});
  }

  /**
   * Initialize page source so call init method on controller and his
   * extensions.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _initPageSource() {
    await this._initController();
    await this._initExtensions();
  }

  /**
   * Initializes managed instance of controller with the provided parameters.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _initController() {
    let controller = this._managedPage.controllerInstance;

    controller.setRouteParams(this._managedPage.params);
    await controller.init();
  }

  /**
   * Initialize extensions for managed instance of controller with the
   * provided parameters.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _initExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.setRouteParams(this._managedPage.params);
      await extension.init();
    }
  }

  /**
   * Iterates over extensions of current controller and switches each one to
   * pageStateManager and clears their partial state.
   *
   * @protected
   */
  _switchToPageStateManager() {
    const controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      extension.switchToStateManager();
      extension.clearPartialState();
    }
  }

  /**
   * Load page source so call load method on controller and his extensions.
   * Merge loaded state and render it.
   *
   * @protected
   * @return {Object<string, (Promise<*>|*)>}
   */
  async _loadPageSource() {
    const controllerState = await this._getLoadedControllerState();
    const extensionsState = await this._getLoadedExtensionsState(
      controllerState
    );
    const loadedPageState = Object.assign({}, extensionsState, controllerState);

    const response = await this._pageRenderer.mount(
      this._managedPage.decoratedController,
      this._managedPage.viewInstance,
      loadedPageState,
      this._managedPage.options
    );

    return response;
  }

  /**
   * Load controller state from managed instance of controller.
   *
   * @protected
   * @return {Object<string, (Promise<*>|*)>}
   */
  async _getLoadedControllerState() {
    let controller = this._managedPage.controllerInstance;
    let controllerState = await controller.load();

    controller.setPageStateManager(this._pageStateManager);

    return controllerState;
  }

  /**
   * Load extensions state from managed instance of controller.
   *
   * @protected
   * @param {Object<string, *>} controllerState
   * @return {Object<string, (Promise<*>|*)>}
   */
  async _getLoadedExtensionsState(controllerState) {
    const controller = this._managedPage.controllerInstance;
    let extensionsState = Object.assign({}, controllerState);

    for (let extension of controller.getExtensions()) {
      extension.setPartialState(extensionsState);
      extension.switchToPartialState();
      const extensionState = await extension.load();

      this._switchToPageStateManagerAfterLoaded(extension, extensionState);
      this._setRestrictedPageStateManager(extension, extensionState);

      Object.assign(extensionsState, extensionState);
    }

    return extensionsState;
  }

  /**
   * Activate page source so call activate method on controller and his
   * extensions.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _activatePageSource() {
    let controller = this._managedPage.controllerInstance;
    let isNotActivated = !this._managedPage.state.activated;

    if (controller && isNotActivated) {
      await this._activateController();
      await this._activateExtensions();
      this._managedPage.state.activated = true;
    }
  }

  /**
   * Activate managed instance of controller.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _activateController() {
    let controller = this._managedPage.controllerInstance;

    await controller.activate();
  }

  /**
   * Activate extensions for managed instance of controller.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _activateExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      await extension.activate();
    }
  }

  /**
   * Update page source so call update method on controller and his
   * extensions. Merge updated state and render it.
   *
   * @protected
   * @return {Promise<{status: number, content: ?string}>}
   */
  async _updatePageSource() {
    const updatedControllerState = await this._getUpdatedControllerState();
    const updatedExtensionState = await this._getUpdatedExtensionsState(
      updatedControllerState
    );
    const updatedPageState = Object.assign(
      {},
      updatedExtensionState,
      updatedControllerState
    );

    const response = await this._pageRenderer.update(
      this._managedPage.decoratedController,
      updatedPageState
    );

    return response;
  }

  /**
   * Return updated controller state for current page controller.
   *
   * @protected
   * @return {Object<string, (Promise<*>|*)>}
   */
  _getUpdatedControllerState() {
    let controller = this._managedPage.controllerInstance;
    let lastRouteParams = controller.getRouteParams();

    controller.setRouteParams(this._managedPage.params);

    return controller.update(lastRouteParams);
  }

  /**
   * Return updated extensions state for current page controller.
   *
   * @protected
   * @param {Object<string, *>} controllerState
   * @return {Object<string, (Promise|*)>}
   */
  async _getUpdatedExtensionsState(controllerState) {
    const controller = this._managedPage.controllerInstance;
    let extensionsState = Object.assign({}, controllerState);

    for (let extension of controller.getExtensions()) {
      const lastRouteParams = extension.getRouteParams();
      extension.setRouteParams(this._managedPage.params);
      extension.setPartialState(extensionsState);
      extension.switchToPartialState();
      const extensionState = await extension.update(lastRouteParams);

      this._switchToPageStateManagerAfterLoaded(extension, extensionState);
      this._setRestrictedPageStateManager(extension, extensionState);

      Object.assign(extensionsState, extensionState);
    }

    return extensionsState;
  }

  /**
   * Deactivate page source so call deactivate method on controller and his
   * extensions.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _deactivatePageSource() {
    let controller = this._managedPage.controllerInstance;
    let isActivated = this._managedPage.state.activated;

    if (controller && isActivated) {
      await this._deactivateExtensions();
      await this._deactivateController();
    }
  }

  /**
   * Deactivate last managed instance of controller only If controller was
   * activated.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _deactivateController() {
    let controller = this._managedPage.controllerInstance;

    await controller.deactivate();
  }

  /**
   * Deactivate extensions for last managed instance of controller only if
   * they were activated.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _deactivateExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      await extension.deactivate();
    }
  }

  /**
   * Destroy page source so call destroy method on controller and his
   * extensions.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _destroyPageSource() {
    let controller = this._managedPage.controllerInstance;

    if (controller) {
      await this._destroyExtensions();
      await this._destroyController();
    }
  }

  /**
   * Destroy last managed instance of controller.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _destroyController() {
    let controller = this._managedPage.controllerInstance;

    await controller.destroy();
    controller.setPageStateManager(null);
  }

  /**
   * Destroy extensions for last managed instance of controller.
   *
   * @protected
   * @return {Promise<undefined>}
   */
  async _destroyExtensions() {
    let controller = this._managedPage.controllerInstance;

    for (let extension of controller.getExtensions()) {
      await extension.destroy();
      extension.setPageStateManager(null);
    }
  }

  /**
   * The method clear state on current renderred component to DOM.
   *
   * @param {RouteOptions} options The current route options.
   */
  _clearComponentState(options) {
    let managedOptions = this._managedPage.options;

    if (
      managedOptions &&
      managedOptions.documentView === options.documentView &&
      managedOptions.managedRootView === options.managedRootView &&
      managedOptions.viewAdapter === options.viewAdapter
    ) {
      this._pageRenderer.clearState();
    } else {
      this._pageRenderer.unmount();
    }
  }

  /**
   * On change event handler set state to view.
   *
   * @param {Object<string, *>} state
   */
  _onChangeStateHandler(state) {
    let controller = this._managedPage.controllerInstance;

    if (controller) {
      this._pageRenderer.setState(state);
    }
  }

  /**
   * Return true if manager has to update last managed controller and view.
   *
   * @protected
   * @param {string|function} controller
   * @param {string|function} view
   * @param {RouteOptions} options
   * @return {boolean}
   */
  _hasOnlyUpdate(controller, view, options) {
    if (options.onlyUpdate instanceof Function) {
      return options.onlyUpdate(
        this._managedPage.controller,
        this._managedPage.view
      );
    }

    return (
      options.onlyUpdate &&
      this._managedPage.controller === controller &&
      this._managedPage.view === view
    );
  }

  /**
   *
   *
   * @protected
   * @param {ManagedPage} nextManagedPage
   * @param {{ type: string, event: Event}}
   * @returns {Promise<any>}
   */
  async _runPreManageHandlers(nextManagedPage, action) {
    return this._pageHandlerRegistry.handlePreManagedState(
      this._managedPage.controller
        ? this._stripManagedPageValueForPublic(this._managedPage)
        : null,
      this._stripManagedPageValueForPublic(nextManagedPage) || null,
      action
    );
  }

  /**
   *
   *
   * @protected
   * @param {ManagedPage} previousManagedPage
   * @param {{ type: string, event: Event}}
   * @returns {Promise<any>}
   */
  _runPostManageHandlers(previousManagedPage, action) {
    return this._pageHandlerRegistry.handlePostManagedState(
      this._managedPage.controller
        ? this._stripManagedPageValueForPublic(this._managedPage)
        : null,
      this._stripManagedPageValueForPublic(previousManagedPage) || null,
      action
    );
  }
}

/**
 * The page renderer is a utility for rendering the page at either the
 * client-side or the server-side, handling the differences in the environment.
 */
class PageRenderer {
  /**
   * Renders the page using the provided controller and view. The actual
   * behavior of this method differs at the client-side and the at
   * server-side in the following way:
   *
   * At the server, the method first waits for all the resources to load, and
   * then renders the page to a string containing HTML markup to send to the
   * client.
   *
   * At the client, the method uses the already available resources to render
   * the page into DOM, re-using the DOM created from the HTML markup send by
   * the server if possible. After this the method will re-render the page
   * every time another resource being loaded finishes its loading and
   * becomes available.
   *
   * Note that the method renders the page at the client-side only after all
   * resources have been loaded if this is the first time this method is
   * invoked at the client.
   *
   * @param {Controller} controller The current page controller.
   * @param {React.Component} view The page's view.
   * @param {Object<string, (*|Promise<*>)>} pageResources The resources for
   *        the view loaded by the controller.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (
   *                string|
   *                function(
   *                  new: React.Component,
   *                  Object<string, *>,
   *                  ?Object<string, *>
   *                )
   *              )
   *            ): boolean
   *          ),
   *          autoScroll: boolean,
   *          allowSPA: boolean,
   *          documentView: ?function(new: AbstractDocumentView),
   *          managedRootView: ?function(new: React.Component)=
   *        }} routeOptions The current route options.
   * @return {Promise<{
   *           status: number,
   *           content: ?string,
   *           pageState: Object<string, ?>
   *         }>} A promise that will resolve to information about the
   *         rendered page. The {@code status} will contain the HTTP status
   *         code to send to the client (at the server side) or determine the
   *         type of error page to navigate to (at the client side).
   *         The {@code content} field will contain the rendered markup of
   *         the page at the server-side, or {@code null} at the client-side.
   */
  mount() {}

  /**
   * Handles update of the current route that does not replace the current
   * controller and view.
   *
   * The method will use the already available resource to update the
   * controller's state and the view immediately. After that, the method will
   * update the controller's state and view with every resource that becomes
   * resolved.
   *
   * @param {Controller} controller The current page controller.
   * @param {Object<string, (*|Promise<*>)>} resourcesUpdate The resources
   *        that represent the update the of current state according to the
   *        current route and its parameters.
   * @return {Promise<{
   *           status: number,
   *           content: ?string,
   *           pageState: Object<string, *>
   *         }>} A promise that will resolve to information about the
   *         rendered page. The {@code status} will contain the HTTP status
   *         code to send to the client (at the server side) or determine the
   *         type of error page to navigate to (at the client side).
   *         The {@code content} field will contain the rendered markup of
   *         the page at the server-side, or {@code null} at the client-side.
   */
  update() {}

  /**
   * Unmounts the view from the DOM.
   *
   * This method has no effect at the server-side.
   */
  unmount() {}

  /**
   * Sets the provided state to the currently rendered view.
   *
   * This method has no effect at the server-side.
   *
   * @param {Object<string, *>=} [state={}] The state to set to the currently
   *        rendered view.
   */
  setState() {}

  /**
   * Clears the state to the currently rendered view.
   *
   * This method has no effect at the server-side.
   */
  clearState() {}
}

/**
 * Manager of the current page state and state history.
 */
class PageStateManager {
  /**
   * Clears the state history.
   */
  clear() {}

  /**
   * Sets a new page state by applying the provided patch to the current
   * state.
   *
   * @param {Object<string, *>} statePatch The patch of the current state.
   */
  setState() {}

  /**
   * Returns the current page state.
   *
   * @return {Object<string, *>} The current page state.
   */
  getState() {}

  /**
   * Returns the recorded history of page states. The states will be
   * chronologically sorted from the oldest to the newest.
   *
   * Note that the implementation may limit the size of the recorded history,
   * therefore the complete history may not be available.
   *
   * @return {Object<string, *>[]} The recorded history of page states.
   */
  getAllStates() {}
}

// @client-side

/**
 * Page manager for controller on the client side.
 */
class ClientPageManager extends AbstractPageManager {
  static get $dependencies() {
    return [
      PageFactory,
      PageRenderer,
      PageStateManager,
      '$PageHandlerRegistry',
      Window,
      EventBus
    ];
  }

  /**
   * Initializes the client-side page manager.
   *
   * @param {PageFactory} pageFactory Factory used by the page manager to
   *        create instances of the controller for the current route, and
   *        decorate the controllers and page state managers.
   * @param {PageRenderer} pageRenderer The current renderer of the page.
   * @param {PageStateManager} stateManager The current page state manager.
   * @param {HandlerRegistry} handlerRegistry Instance of HandlerRegistry that
   *        holds a list of pre-manage and post-manage handlers.
   * @param {Window} window The utility for manipulating the global context
   *        and global client-side-specific APIs.
   * @param {EventBus} eventBus The event bus for dispatching and listening
   *        for custom IMA events propagated through the DOM.
   */
  constructor(
    pageFactory,
    pageRenderer,
    stateManager,
    handlerRegistry,
    window,
    eventBus
  ) {
    super(pageFactory, pageRenderer, stateManager, handlerRegistry);

    /**
     * The utility for manipulating the global context and global
     * client-side-specific APIs.
     *
     * @type {ima.window.Window}
     */
    this._window = window;

    /**
     * The event bus for dispatching and listening for custom IMA events
     * propagated through the DOM.
     *
     * @type {ima.event.EventBus}
     */
    this._eventBus = eventBus;

    /**
     * Event listener for the custom DOM events used by the event bus,
     * bound to this instance.
     *
     * @type {function(this: ClientPageManager, Event)}
     */
    this._boundOnCustomEventHandler = event => {
      this._onCustomEventHandler(event);
    };
  }

  /**
   * @inheritdoc
   */
  init() {
    super.init();
    this._eventBus.listenAll(
      this._window.getWindow(),
      this._boundOnCustomEventHandler
    );
  }

  /**
   * @inheritdoc
   */
  async manage(route, options, params = {}, action) {
    const response = await super.manage(route, options, params, action);
    await this._activatePageSource();

    return response;
  }

  /**
   * @inheritdoc
   */
  async destroy() {
    await super.destroy();

    this._eventBus.unlistenAll(
      this._window.getWindow(),
      this._boundOnCustomEventHandler
    );
  }

  /**
   * Custom DOM event handler.
   *
   * The handler invokes the event listener in the active controller, if such
   * listener is present. The name of the controller's listener method is
   * created by turning the first symbol of the event's name to upper case,
   * and then prefixing the result with the 'on' prefix.
   *
   * For example: for an event named 'toggle' the controller's listener
   * would be named 'onToggle'.
   *
   * The controller's listener will be invoked with the event's data as an
   * argument.
   *
   * @param {CustomEvent} event The encountered event bus DOM event.
   */
  _onCustomEventHandler(event) {
    let { method, data, eventName } = this._parseCustomEvent(event);
    let controllerInstance = this._managedPage.controllerInstance;

    if (controllerInstance) {
      let handled = this._handleEventWithController(method, data);

      if (!handled) {
        handled = this._handleEventWithExtensions(method, data);
      }

      if ($Debug) {
        if (!handled) {
          console.warn(
            `The active controller has no listener for ` +
              `the encountered event '${eventName}'. Check ` +
              `your event name for typos, or create an ` +
              `'${method}' event listener method on the ` +
              `active controller or add an event listener ` +
              `that stops the propagation of this event to ` +
              `an ancestor component of the component that ` +
              `fired this event.`
          );
        }
      }
    }
  }

  /**
   * Extracts the details of the provided event bus custom DOM event, along
   * with the expected name of the current controller's method for
   * intercepting the event.
   *
   * @param {CustomEvent} event The encountered event bus custom DOM event.
   * @return {{ method: string, data: *, eventName: string }} The event's
   *         details.
   */
  _parseCustomEvent(event) {
    let eventName = event.detail.eventName;
    let method = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
    let data = event.detail.data;

    return { method, data, eventName };
  }

  /**
   * Attempts to handle the currently processed event bus custom DOM event
   * using the current controller. The method returns {@code true} if the
   * event is handled by the controller.
   *
   * @param {string} method The name of the method the current controller
   *        should use to process the currently processed event bus custom
   *        DOM event.
   * @param {Object<string, *>} data The custom event's data.
   * @return {boolean} {@code true} if the event has been handled by the
   *         controller, {@code false} if the controller does not have a
   *         method for processing the event.
   */
  _handleEventWithController(method, data) {
    let controllerInstance = this._managedPage.controllerInstance;

    if (typeof controllerInstance[method] === 'function') {
      controllerInstance[method](data);

      return true;
    }

    return false;
  }

  /**
   * Attempts to handle the currently processed event bus custom DOM event
   * using the registered extensions of the current controller. The method
   * returns {@code true} if the event is handled by the controller.
   *
   * @param {string} method The name of the method the current controller
   *        should use to process the currently processed event bus custom
   *        DOM event.
   * @param {Object<string, *>} data The custom event's data.
   * @return {boolean} {@code true} if the event has been handled by one of
   *         the controller's extensions, {@code false} if none of the
   *         controller's extensions has a method for processing the event.
   */
  _handleEventWithExtensions(method, data) {
    let controllerInstance = this._managedPage.controllerInstance;
    let extensions = controllerInstance.getExtensions();

    for (let extension of extensions) {
      if (typeof extension[method] === 'function') {
        extension[method](data);

        return true;
      }
    }

    return false;
  }
}

// @server-side class ServerPageManager extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerPageManager;

/**
 * Page manager for controller on the server side.
 */
class ServerPageManager extends AbstractPageManager {
  static get $dependencies() {
    return [
      PageFactory,
      PageRenderer,
      PageStateManager,
      '$PageHandlerRegistry'
    ];
  }
}

/**
 * Blank managed root view does not nothing except for rendering the current
 * page view.
 *
 * This is the default managed root view.
 */
class BlankManagedRootView extends React.Component {
  static get defaultProps() {
    return {
      $pageView: null
    };
  }

  /**
   * @inheritdoc
   */
  render() {
    let pageView = this.props.$pageView;
    if (!pageView) {
      return null;
    }

    return React.createElement(pageView, this.props);
  }
}

const Context = React.createContext({});

/**
 * An adapter component providing the current page controller's state to the
 * page view component through its properties.
 */
class ViewAdapter extends React.Component {
  /**
   * Initializes the adapter component.
   *
   * @param {{
   *          state: Object<string, *>,
   *          view: function(new:React.Component, Object<string, *>)
   *        }} props Component properties, containing the actual page view
   *        and the initial page state to pass to the view.
   */
  constructor(props) {
    super(props.props);

    /**
     * The current page state as provided by the controller.
     *
     * @type {Object<string, *>}
     */
    this.state = props.state;

    /**
     * The actual page view to render.
     *
     * @type {function(new:React.Component, Object<string, *>)}
     */
    this._view = props.view;

    /**
     * The memoized context value.
     *
     * @type {function}
     */
    this._getContextValue = memoizeOne($Utils => {
      return { $Utils };
    });
  }

  /**
   * Fixes an issue where when there's an error in React component,
   * the defined ErrorPage may not get re-rendered and white
   * blank page appears instead.
   *
   * @inheritdoc
   */
  componentDidCatch() {}

  /**
   * @inheritdoc
   */
  render() {
    return React.createElement(
      Context.Provider,
      { value: this._getContextValue(this.props.$Utils) },
      React.createElement(this._view, this.state)
    );
  }
}

/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events = Object.freeze({
  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.mounted} after
   * current page view is mounted to the DOM. Event's data contain
   * {@code {type: string}}.
   *
   * @const
   * @type {string}
   */
  MOUNTED: '$IMA.$PageRenderer.mounted',

  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.updated} after
   * current state is updated in the DOM. Event's data contain
   * {@code {state: Object<string, *>}}.
   *
   * @const
   * @type {string}
   */
  UPDATED: '$IMA.$PageRenderer.updated',

  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.unmounted} after current view is
   * unmounted from the DOM. Event's data contain
   * {@code {type: string}}.
   *
   * @const
   * @type {string}
   */
  UNMOUNTED: '$IMA.$PageRenderer.unmounted',

  /**
   * PageRenderer fire event {@code $IMA.$PageRenderer.error} when there is
   * no _viewContainer in _renderToDOM method. Event's data contain
   * {@code {message: string}}.
   *
   * @const
   * @type {string}
   */
  ERROR: '$IMA.$PageRenderer.error'
});

/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Types = Object.freeze({
  /**
   * The RENDER type is set if mounting use React.render method.
   *
   * @const
   * @type {string}
   */
  RENDER: '$IMA.$PageRenderer.type.render',
  /**
   * The HYDRATE type is set if mounting use React.hydrate method.
   *
   * @const
   * @type {string}
   */
  HYDRATE: '$IMA.$PageRenderer.type.hydrate',
  /**
   * The UNMOUNT type is set if unmounting use React.unmountComponentAtNode method.
   *
   * @const
   * @type {string}
   */
  UNMOUNT: '$IMA.$PageRenderer.type.unmount',
  /**
   * The CLEAR_STATE type is set if unmounting only clear component state.
   *
   * @const
   * @type {string}
   */
  CLEAR_STATE: '$IMA.$PageRenderer.type.clearState'
});

/**
 * Base class for implementations of the {@linkcode PageRenderer} interface.
 */
class AbstractPageRenderer extends PageRenderer {
  /**
   * Initializes the abstract page renderer.
   *
   * @param {PageRendererFactory} factory Factory for receive $Utils to view.
   * @param {vendor.$Helper} Helper The IMA.js helper methods.
   * @param {vendor.ReactDOM} ReactDOM React framework instance, will be used
   *        to render the page.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Object<string, *>} settings Application settings for the current
   *        application environment.
   */
  constructor(factory, Helper, ReactDOM, dispatcher, settings) {
    super();

    /**
     * Factory for receive $Utils to view.
     *
     * @protected
     * @type {PageRendererFactory}
     */
    this._factory = factory;

    /**
     * The IMA.js helper methods.
     *
     * @protected
     * @type {Vendor.$Helper}
     */
    this._Helper = Helper;

    /**
     * Rect framework instance, used to render the page.
     *
     * @protected
     * @type {Vendor.ReactDOM}
     */
    this._ReactDOM = ReactDOM;

    /**
     * Dispatcher fires events to app.
     *
     * @type {Dispatcher}
     */
    this._dispatcher = dispatcher;

    /**
     * Application setting for the current application environment.
     *
     * @protected
     * @type {Object<string, *>}
     */
    this._settings = settings;

    /**
     * @protected
     * @type {?React.Component}
     */
    this._reactiveView = null;
  }

  /**
   * @inheritdoc
   * @abstract
   */
  mount() {
    throw new GenericError(
      'The mount() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  update() {
    throw new GenericError(
      'The update() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  unmount() {
    throw new GenericError(
      'The unmount() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  clearState() {
    if (this._reactiveView && this._reactiveView.state) {
      let emptyState = Object.keys(this._reactiveView.state).reduce(
        (state, key) => {
          state[key] = undefined;

          return state;
        },
        {}
      );

      this._reactiveView.setState(emptyState, () => {
        this._dispatcher.fire(
          Events.UNMOUNTED,
          { type: Types.CLEAR_STATE },
          true
        );
      });
    }
  }

  /**
   * @inheritdoc
   */
  setState(state = {}) {
    if (this._reactiveView) {
      this._reactiveView.setState(state, () => {
        this._dispatcher.fire(Events.UPDATED, { state }, true);
      });
    }
  }

  /**
   * Generate properties for view from state.
   *
   * @protected
   * @param {function(new:React.Component, Object<string, *>)} view The page
   *        view React component to wrap.
   * @param {Object<string, *>=} [state={}]
   * @return {Object<string, *>}
   */
  _generateViewProps(view, state = {}) {
    let props = {
      view,
      state,
      $Utils: this._factory.getUtils()
    };

    return props;
  }

  /**
   * Returns wrapped page view component with managed root view and view adapter.
   *
   * @param {ControllerDecorator} controller
   * @param {function(new: React.Component)} view
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (
   *                string|
   *                function(
   *                  new: React.Component,
   *                  Object<string, *>,
   *                  ?Object<string, *>
   *                )
   *              )
   *            ): boolean
   *          ),
   *          autoScroll: boolean,
   *          allowSPA: boolean,
   *          documentView: ?function(new: AbstractDocumentView),
   *          managedRootView: ?function(new: React.Component),
   *          viewAdapter: ?function(new: React.Component)
   *        }} routeOptions The current route options.
   */
  _getWrappedPageView(controller, view, routeOptions) {
    let managedRootView = this._factory.getManagedRootView(
      routeOptions.managedRootView ||
        this._settings.$Page.$Render.managedRootView ||
        BlankManagedRootView
    );
    let props = this._generateViewProps(
      managedRootView,
      Object.assign({}, controller.getState(), { $pageView: view })
    );

    return this._factory.wrapView(
      routeOptions.viewAdapter ||
        this._settings.$Page.$Render.viewAdapter ||
        ViewAdapter,
      props
    );
  }

  /**
   * Returns the class constructor of the specified document view component.
   *
   * @param {(function(new: React.Component)|string)} documentView The
   *        namespace path pointing to the document view component, or the
   *        constructor of the document view component.
   * @return {function(new: React.Component)} The constructor of the document
   *         view component.
   */
  _getDocumentView(routeOptions) {
    return this._factory.getDocumentView(
      routeOptions.documentView || this._settings.$Page.$Render.documentView
    );
  }
}

// @client-side

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
class ClientPageRenderer extends AbstractPageRenderer {
  /**
   * Initializes the client-side page renderer.
   *
   * @param {PageRendererFactory} factory Factory for receive $Utils to view.
   * @param {vendor.$Helper} Helper The IMA.js helper methods.
   * @param {vendor.ReactDOM} ReactDOM React framework instance to use to
   *        render the page on the client side.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Object<string, *>} settings The application setting for the
   *        current application environment.
   * @param {Window} window Helper for manipulating the global object
   *        ({@code window}) regardless of the client/server-side
   *        environment.
   */
  constructor(factory, Helper, ReactDOM, dispatcher, settings, window) {
    super(factory, Helper, ReactDOM, dispatcher, settings);

    /**
     * Flag signalling that the page is being rendered for the first time.
     *
     * @type {boolean}
     */
    this._firstTime = true;

    /**
     * Helper for manipulating the global object ({@code window})
     * regardless of the client/server-side environment.
     *
     * @type {Window}
     */
    this._window = window;

    /**
     * The HTML element containing the current application view for the
     * current route.
     *
     * @type {?HTMLElement}
     */
    this._viewContainer = null;
  }

  /**
   * @inheritdoc
   */
  async mount(controller, view, pageResources, routeOptions) {
    let separatedData = this._separatePromisesAndValues(pageResources);
    let defaultPageState = separatedData.values;
    let loadedPromises = separatedData.promises;

    if (!this._firstTime) {
      controller.setState(defaultPageState);
      await this._renderToDOM(controller, view, routeOptions);
      this._patchPromisesToState(controller, loadedPromises);
    }

    return this._Helper
      .allPromiseHash(loadedPromises)
      .then(async fetchedResources => {
        let pageState = Object.assign({}, defaultPageState, fetchedResources);

        if (this._firstTime) {
          controller.setState(pageState);
          await this._renderToDOM(controller, view, routeOptions);
          this._firstTime = false;
        }

        controller.setMetaParams(pageState);
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          content: null,
          status: controller.getHttpStatus(),
          pageState
        };
      })
      .catch(error => this._handleError(error));
  }

  /**
   * @inheritdoc
   */
  update(controller, resourcesUpdate) {
    let separatedData = this._separatePromisesAndValues(resourcesUpdate);
    let defaultPageState = separatedData.values;
    let updatedPromises = separatedData.promises;

    controller.setState(defaultPageState);
    this._patchPromisesToState(controller, updatedPromises);

    return this._Helper
      .allPromiseHash(updatedPromises)
      .then(fetchedResources => {
        controller.setMetaParams(controller.getState());
        this._updateMetaAttributes(controller.getMetaManager());

        return {
          content: null,
          status: controller.getHttpStatus(),
          pageState: Object.assign({}, defaultPageState, fetchedResources)
        };
      })
      .catch(error => this._handleError(error));
  }

  /**
   * @inheritdoc
   */
  unmount() {
    if (this._reactiveView) {
      this._ReactDOM.unmountComponentAtNode(this._viewContainer, () => {
        this._dispatcher.fire(Events.UNMOUNTED, { type: Types.UNMOUNT }, true);
      });
      this._reactiveView = null;
    }
  }

  /**
   * Show error to console in $Debug mode and re-throw that error
   * for other error handler.
   *
   * @param {Error} error
   * @throws {Error} Re-throws the handled error.
   */
  _handleError(error) {
    if ($Debug) {
      console.error('Render Error:', error);
    }

    throw error;
  }

  /**
   * Patch promise values to controller state.
   *
   * @param {ControllerDecorator} controller
   * @param {Object<string, Promise<*>>} patchedPromises
   */
  _patchPromisesToState(controller, patchedPromises) {
    for (let resourceName of Object.keys(patchedPromises)) {
      patchedPromises[resourceName]
        .then(resource => {
          controller.setState({
            [resourceName]: resource
          });
        })
        .catch(error => this._handleError(error));
    }
  }

  /**
   * Renders the current route to DOM.
   *
   * @param {ControllerDecorator} controller
   * @param {function(new: React.Component)} view
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (
   *                string|
   *                function(
   *                  new: React.Component,
   *                  Object<string, *>,
   *                  ?Object<string, *>
   *                )
   *              )
   *            ): boolean
   *          ),
   *          autoScroll: boolean,
   *          allowSPA: boolean,
   *          documentView: ?function(new: AbstractDocumentView),
   *          managedRootView: ?function(new: React.Component)
   *        }} routeOptions The current route options.
   * @return {Promise<undefined>}
   */
  _renderToDOM(controller, view, routeOptions) {
    let reactElementView = this._getWrappedPageView(
      controller,
      view,
      routeOptions
    );

    let documentView = this._getDocumentView(routeOptions);
    let masterElementId = documentView.masterElementId;
    this._viewContainer = this._window.getElementById(masterElementId);

    if (!this._viewContainer) {
      const errorMessage =
        `ima.page.renderer.ClientPageRenderer:_renderToDOM: ` +
        `Element with ID "${masterElementId}" was not found in the DOM. ` +
        `Maybe the DOM is not in the interactive mode yet.`;

      if ($Debug) {
        console.warn(errorMessage);
      }

      this._dispatcher.fire(Events.ERROR, { message: errorMessage }, true);

      return Promise.resolve();
    }

    if (this._viewContainer.children.length) {
      return new Promise(resolve => setTimeout(resolve, 1000 / 240)).then(
        () => {
          this._reactiveView = this._ReactDOM.hydrate(
            reactElementView,
            this._viewContainer,
            () => {
              this._dispatcher.fire(
                Events.MOUNTED,
                { type: Types.HYDRATE },
                true
              );
            }
          );
        }
      );
    } else {
      this._reactiveView = this._ReactDOM.render(
        reactElementView,
        this._viewContainer,
        () => {
          this._dispatcher.fire(Events.MOUNTED, { type: Types.RENDER }, true);
        }
      );
      return Promise.resolve();
    }
  }

  /**
   * Separate promises and values from provided data map. Values will be use
   * for default page state. Promises will be patched to state after their
   * resolve.
   *
   * @param {Object<string, *>} dataMap A map of data.
   * @return {{
   *           promises: Object<string, Promise<*>>,
   *           values: Object<string, *>
   *         }} Return separated promises and other values.
   */
  _separatePromisesAndValues(dataMap) {
    let promises = {};
    let values = {};

    for (let field of Object.keys(dataMap)) {
      let value = dataMap[field];

      if (value instanceof Promise) {
        promises[field] = value;
      } else {
        values[field] = value;
      }
    }

    return { promises, values };
  }

  /**
   * Updates the title and the contents of the meta elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaAttributes(metaManager) {
    this._window.setTitle(metaManager.getTitle());

    this._updateMetaNameAttributes(metaManager);
    this._updateMetaPropertyAttributes(metaManager);
    this._updateMetaLinkAttributes(metaManager);
  }

  /**
   * Updates the contents of the generic meta elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaNameAttributes(metaManager) {
    let metaTagKey = null;
    let metaTag;

    for (metaTagKey of metaManager.getMetaNames()) {
      metaTag = this._window.querySelector(`meta[name="${metaTagKey}"]`);

      if (metaTag) {
        metaTag.content = metaManager.getMetaName(metaTagKey);
      }
    }
  }

  /**
   * Updates the contents of the specialized meta elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaPropertyAttributes(metaManager) {
    let metaTagKey = null;
    let metaTag;

    for (metaTagKey of metaManager.getMetaProperties()) {
      metaTag = this._window.querySelector(`meta[property="${metaTagKey}"]`);

      if (metaTag) {
        metaTag.content = metaManager.getMetaProperty(metaTagKey);
      }
    }
  }

  /**
   * Updates the href of the specialized link elements used for SEO.
   *
   * @param {MetaManager} metaManager meta attributes storage providing the
   *        new values for page meta elements and title.
   */
  _updateMetaLinkAttributes(metaManager) {
    let linkTagKey = null;
    let linkTag;

    for (linkTagKey of metaManager.getLinks()) {
      linkTag = this._window.querySelector(`link[rel="${linkTagKey}"]`);

      if (linkTag && linkTag.href) {
        linkTag.href = metaManager.getLink(linkTagKey);
      }
    }
  }
}

class ComponentUtils {
  /**
   * Initializes the registry used for managing component utils.
   *
   * @param {ObjectContainer} oc The application's dependency injector - the
   *        object container.
   */
  constructor(oc) {
    /**
     * The application's dependency injector - the object container.
     *
     * @type {ObjectContainer}
     */
    this._oc = oc;

    /**
     * Map of registered utilities.
     *
     * @type {Object<string, function(new: T, ...*)|function(...*): T>}
     */
    this._utilityClasses = {};

    /**
     * Map of instantiated utilities
     *
     * @type {Object<string, Object>}
     */
    this._utilities = null;

    /**
     * Map of referrers to utilities
     *
     * @type {Object<string, string>}
     */
    this._utilityReferrers = {};
  }

  /**
   * Registers single utility class or multiple classes in alias->class mapping.
   *
   * @param {string|Object<string, function(new: T, ...*)|function(...*): T>} name
   * @param {function(new: T, ...*)|function(...*): T} componentUtilityClass
   * @param {?string} referrer
   */
  register(name, componentUtilityClass, referrer = null) {
    if (typeof componentUtilityClass === 'function') {
      const alias = String(name);
      this._utilityClasses[alias] = componentUtilityClass;

      if (referrer && typeof referrer === 'string') {
        this._utilityReferrers[alias] = referrer;
      }

      if (this._utilities) {
        this._createUtilityInstance(alias, componentUtilityClass);
      }
    } else if (
      name &&
      typeof name === 'object' &&
      name.constructor === Object
    ) {
      const utilityClasses = name;
      referrer = componentUtilityClass;

      for (const alias of Object.keys(utilityClasses)) {
        if (!Object.prototype.hasOwnProperty.call(utilityClasses, alias)) {
          continue;
        }

        this.register(alias, utilityClasses[alias], referrer);
      }
    }
  }

  /**
   * Returns object containing all registered utilities
   *
   * @returns {Object<string, Object>}
   */
  getUtils() {
    if (this._utilities) {
      return this._utilities;
    }

    this._utilities = {};

    // create instance of each utility class
    for (const alias of Object.keys(this._utilityClasses)) {
      this._createUtilityInstance(alias, this._utilityClasses[alias]);
    }

    if (this._oc.has('$Utils')) {
      // fallback for backward compatibility
      Object.assign(this._utilities, this._oc.get('$Utils'));
    }

    return this._utilities;
  }

  /**
   * @returns {Object<string, string>}
   */
  getReferrers() {
    return this._utilityReferrers;
  }

  /**
   * @template T
   * @param {string} alias
   * @param {function(new: T, ...*)|function(...*): T} utilityClass
   * @return {T}
   */
  _createUtilityInstance(alias, utilityClass) {
    return (this._utilities[alias] = this._oc.get(utilityClass));
  }
}

/**
 * The base class for all pure (state-less) view components.
 *
 * Unlike the "regular" components, pure components do not have any external
 * state, and therefore are pure functions of their props and state. This
 * allows for some nice optimizations on react's part (see the link).
 *
 * Because of this, this class does not provide all the APIs provided by the
 * {@linkcode AbstractComponent} class (e.g. {@code listen}) as there is next
 * to none use of them with pure components.
 *
 * @abstract
 * @see https://facebook.github.io/react/docs/react-api.html#react.purecomponent
 */
class AbstractPureComponent extends React.PureComponent {
  static get contextType() {
    return Context;
  }
  /**
   * Initializes the component.
   *
   * @param {Object<string, *>} props The component properties.
   * @param {Object<string, *>} context The component context.
   */
  constructor(props, context) {
    super(props, context);

    /**
     * The view utilities, initialized lazily upon first use from either
     * the context, or the component's props.
     *
     * @type {?Object<string, *>}
     */
    this._utils = null;
  }

  /**
   * Returns the utilities for the view components. The returned value is the
   * value bound to the {@code $Utils} object container constant.
   *
   * @return {Object<string, *>} The utilities for the view components.
   */
  get utils() {
    if (!this._utils) {
      this._utils = getUtils(this.props, this.context);
    }

    return this._utils;
  }

  /**
   * Returns the localized phrase identified by the specified key. The
   * placeholders in the localization phrase will be replaced by the provided
   * values.
   *
   * @param {string} key Localization key.
   * @param {Object<string, (number|string)>=} params Values for replacing
   *        the placeholders in the localization phrase.
   * @return {string} Localized phrase.
   */
  localize(key, params = {}) {
    return localize(this, key, params);
  }

  /**
   * Generates an absolute URL using the provided route name (see the
   * <code>app/config/routes.js</code> file). The provided parameters will
   * replace the placeholders in the route pattern, while the extraneous
   * parameters will be appended to the generated URL's query string.
   *
   * @param {string} name The route name.
   * @param {Object<string, (number|string)>=} params Router parameters and
   *        extraneous parameters to add to the URL as a query string.
   * @return {string} The generated URL.
   */
  link(name, params = {}) {
    return link(this, name, params);
  }

  /**
   * Generate a string of CSS classes from the properties of the passed-in
   * object that resolve to true.
   *
   * @example
   *        this.cssClasses('my-class my-class-modificator', true);
   * @example
   *        this.cssClasses({
   *            'my-class': true,
   *            'my-class-modificator': this.props.modificator
   *        }, true);
   *
   * @param {(string|Object<string, boolean>)} classRules CSS classes in a
   *        string separated by whitespace, or a map of CSS class names to
   *        boolean values. The CSS class name will be included in the result
   *        only if the value is {@code true}.
   * @param {boolean} includeComponentClassName
   * @return {string} String of CSS classes that had their property resolved
   *         to {@code true}.
   */
  cssClasses(classRules, includeComponentClassName = false) {
    return cssClasses(this, classRules, includeComponentClassName);
  }

  /**
   * Creates and sends a new IMA.js DOM custom event from this component.
   *
   * @param {string} eventName The name of the event.
   * @param {*=} data Data to send within the event.
   */
  fire(eventName, data = null) {
    fire(this, eventName, data);
  }

  /**
   * Registers the provided event listener for execution whenever an IMA.js
   * DOM custom event of the specified name occurs at the specified event
   * target.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to register.
   */
  listen(eventTarget, eventName, listener) {
    listen(this, eventTarget, eventName, listener);
  }

  /**
   * Deregisters the provided event listener for an IMA.js DOM custom event
   * of the specified name at the specified event target.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to register.
   */
  unlisten(eventTarget, eventName, listener) {
    unlisten(this, eventTarget, eventName, listener);
  }
}

const PRIVATE = {
  masterElementId: Symbol('masterElementId')
};

if (typeof $Debug !== 'undefined' && $Debug) {
  Object.freeze(PRIVATE);
}

// @server-side class AbstractDocumentView extends __VARIABLE__ {__CLEAR__}\nexports.default = AbstractDocumentView;

/**
 * The base class for document view components. The document view components
 * create the basic markup, i.e. the {@code html} or {@code head} elements,
 * along with an element that will contain the view associated with the current
 * route.
 *
 * Note that the document views are always rendered only at the server-side and
 * cannot be switched at the client-side. Because of this, the document view
 * component must be pure and cannot contain a state.
 *
 * @abstract
 */
class AbstractDocumentView extends AbstractPureComponent {
  /**
   * Returns the ID of the element (the value of the {@code id} attribute)
   * generated by this component that will contain the rendered page view.
   *
   * @abstract
   * @return {string} The ID of the element generated by this component that
   *         will contain the rendered page view.
   */
  static get masterElementId() {
    if (this[PRIVATE.masterElementId] !== undefined) {
      return this[PRIVATE.masterElementId];
    }

    throw new Error(
      'The masterElementId getter is abstract and must be overridden'
    );
  }

  /**
   * Setter for the ID of the element (the value of the {@code id} attribute)
   * generated by this component that will contain the rendered page view.
   *
   * This setter is used only for compatibility with the public class fields
   * and can only be used once per component.
   *
   * @param {string} masterElementId The ID of the element generated by this
   *        component that will contain the rendered page view.
   */
  static set masterElementId(masterElementId) {
    if ($Debug) {
      if (this[PRIVATE.masterElementId] !== undefined) {
        throw new Error(
          'The masterElementId can be set only once and cannot be ' +
            'reconfigured'
        );
      }
    }

    this[PRIVATE.masterElementId] = masterElementId;
  }
}

/**
 * Factory for page render.
 */
class PageRendererFactory {
  /**
   * Initializes the factory used by the page renderer.
   *
   * @param {ComponentUtils} componentUtils The registry of component utilities.
   * @param {React} React The React framework instance to use to render the
   *        page.
   */
  constructor(componentUtils, React) {
    /**
     * The registry of component utilities.
     *
     * @type {ComponentUtils}
     */
    this._componentUtils = componentUtils;

    /**
     * Rect framework instance, used to render the page.
     *
     * @protected
     * @type {React}
     */
    this._React = React;
  }

  /**
   * Return object of services which are defined for alias $Utils.
   */
  getUtils() {
    return this._componentUtils.getUtils();
  }

  /**
   * Returns the class constructor of the specified document view component.
   * Document view may be specified as a namespace path or as a class
   * constructor.
   *
   * @param {(function(new: React.Component)|string)} documentView The
   *        namespace path pointing to the document view component, or the
   *        constructor of the document view component.
   * @return {function(new: React.Component)} The constructor of the document
   *         view component.
   */
  getDocumentView(documentView) {
    let documentViewComponent = this._resolveClassConstructor(documentView);

    if ($Debug) {
      let componentPrototype = documentViewComponent.prototype;

      if (!(componentPrototype instanceof AbstractDocumentView)) {
        throw new Error(
          'The document view component must extend ' +
            'ima/page/AbstractDocumentView class'
        );
      }
    }

    return documentViewComponent;
  }

  /**
   * Returns the class constructor of the specified managed root view
   * component. Managed root view may be specified as a namespace
   * path or as a class constructor.
   *
   * @param {(function(new: React.Component)|string)} managedRootView The
   *        namespace path pointing to the managed root view component, or
   *        the constructor of the React component.
   * @return {function(new: React.Component)} The constructor of the managed
   *         root view component.
   */
  getManagedRootView(managedRootView) {
    let managedRootViewComponent = this._resolveClassConstructor(
      managedRootView
    );

    if ($Debug) {
      let componentPrototype = managedRootViewComponent.prototype;

      if (!(componentPrototype instanceof this._React.Component)) {
        throw new Error(
          'The managed root view component must extend ' + 'React.Component'
        );
      }
    }

    return managedRootViewComponent;
  }

  /**
   * Returns the class constructor of the specified view component.
   * View may be specified as a namespace path or as a class
   * constructor.
   *
   * @param {(function(new: React.Component))} view The namespace path
   *        pointing to the view component, or the constructor
   *        of the {@code React.Component}.
   * @return {function(new: React.Component)} The constructor of the view
   *         component.
   */
  _resolveClassConstructor(view) {
    if ($Debug && typeof view === 'string') {
      throw new Error(
        `The namespace was removed. You must pass react component instead of namespace ${view}.`
      );
    }

    return view;
  }

  /**
   * Wraps the provided view into the view adapter so it can access the state
   * passed from controller through the {@code props} property instead of the
   * {@code state} property.
   *
   * @param {(function(new: React.Component)|string)} view The namespace path
   *        pointing to the view component, or the constructor
   *        of the {@code React.Component}.
   * @param {{
   *          view: React.Component,
   *          state: Object<string, *>,
   *          $Utils: Object<string, *>
   *        }} props The initial props to pass to the view.
   * @return {React.Element} View adapter handling passing the controller's
   *         state to an instance of the specified page view through
   *         properties.
   */
  wrapView(view, props) {
    return this._React.createElement(
      this._resolveClassConstructor(view),
      props
    );
  }

  /**
   * Return a function that produces ReactElements of a given type.
   * Like React.createElement.
   *
   * @param {(string|function(new: React.Component))} view The react
   *        component for which a factory function should be created.
   * @return {function(Object<string, *>): React.Element} The created factory
   *         function. The factory accepts an object containing the
   *         component's properties as the argument and returns a rendered
   *         component.
   */
  createReactElementFactory(view) {
    return this._React.createFactory(view);
  }
}

// @server-side class ServerPageRenderer extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerPageRenderer;

let imaLoader = '';
let imaRunner = '';

if (typeof window === 'undefined' || window === null) {
  let nodeFs = 'fs';
  let nodePath = 'path';
  let fs = require(nodeFs);
  let path = require(nodePath);
  let folder = path.dirname(require.resolve('ima'));

  imaLoader = fs.readFileSync(`${folder}/polyfill/imaLoader.js`, 'utf8');
  imaRunner = fs.readFileSync(`${folder}/polyfill/imaRunner.js`, 'utf8');
}

/**
 * Server-side page renderer. The renderer renders the page into the HTML
 * markup and sends it to the client.
 *
 * @class ServerPageRenderer
 * @extends AbstractPageRenderer
 * @implements PageRenderer
 * @namespace ima.page.renderer
 * @module ima
 * @submodule ima.page
 */
class ServerPageRenderer extends AbstractPageRenderer {
  /**
   * Initializes the server-side page renderer.
   *
   * @param {PageRendererFactory} factory Factory for receive $Utils to view.
   * @param {vendor.$Helper} Helper The IMA.js helper methods.
   * @param {vendor.ReactDOMServer} ReactDOMServer React framework instance
   *        to use to render the page on the server side.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Object<string, *>} settings Application setting for the current
   *        application environment.
   * @param {Response} response Utility for sending the page markup to the
   *        client as a response to the current HTTP request.
   * @param {Cache} cache Resource cache caching the results of HTTP requests
   *        made by services used by the rendered page.
   */
  constructor(
    factory,
    Helper,
    ReactDOMServer,
    dispatcher,
    settings,
    response,
    cache
  ) {
    super(factory, Helper, ReactDOMServer, dispatcher, settings);

    /**
     * Utility for sending the page markup to the client as a response to
     * the current HTTP request.
     *
     * @type {Response}
     */
    this._response = response;

    /**
     * The resource cache, caching the results of all HTTP requests made by
     * the services using by the rendered page. The state of the cache will
     * then be serialized and sent to the client to re-initialize the page
     * at the client side.
     *
     * @type {Cache}
     */
    this._cache = cache;
  }

  /**
   * @inheritdoc
   * @abstract
   * @method mount
   */
  mount(controller, view, pageResources, routeOptions) {
    if (this._response.isResponseSent()) {
      return Promise.resolve(this._response.getResponseParams());
    }

    return this._Helper
      .allPromiseHash(pageResources)
      .then(pageState =>
        this._renderPage(controller, view, pageState, routeOptions)
      );
  }

  /**
   * @inheritdoc
   * @method update
   */
  update() {
    return Promise.reject(
      new GenericError('The update() is denied on server side.')
    );
  }

  /**
   * @inheritdoc
   * @method unmount
   */
  unmount() {
    // nothing to do
  }

  /**
   * The javascript code will include a settings the "revival" data for the
   * application at the client-side.
   *
   * @return {string} The javascript code to include into the
   *         rendered page.
   */
  _getRevivalSettings() {
    return `
			(function(root) {
				root.$Debug = ${this._settings.$Debug};
				root.$IMA = root.$IMA || {};
				$IMA.Cache = ${this._cache.serialize()};
				$IMA.$Language = "${this._settings.$Language}";
				$IMA.$Env = "${this._settings.$Env}";
				$IMA.$Debug = ${this._settings.$Debug};
				$IMA.$Version = "${this._settings.$Version}";
				$IMA.$App = ${JSON.stringify(this._settings.$App)};
				$IMA.$Protocol = "${this._settings.$Protocol}";
				$IMA.$Host = "${this._settings.$Host}";
				$IMA.$Path = "${this._settings.$Path}";
				$IMA.$Root = "${this._settings.$Root}";
				$IMA.$LanguagePartPath = "${this._settings.$LanguagePartPath}";
			})(typeof window !== 'undefined' && window !== null ? window : global);
			${imaRunner}
			${imaLoader}
			`;
  }

  /**
   * Creates a copy of the provided data map object that has the values of
   * its fields wrapped into Promises.
   *
   * The the values that are already Promises will referenced directly
   * without wrapping then into another Promise.
   *
   * @param {Object<string, *>=} [dataMap={}] A map of data that should have
   *        its values wrapped into Promises.
   * @return {Object<string, Promise>} A copy of the provided data map that
   *         has all its values wrapped into promises.
   */
  _wrapEachKeyToPromise(dataMap = {}) {
    let copy = {};

    for (let field of Object.keys(dataMap)) {
      let value = dataMap[field];

      if (value instanceof Promise) {
        copy[field] = value;
      } else {
        copy[field] = Promise.resolve(value);
      }
    }

    return copy;
  }

  /**
   * Render page after all promises from loaded resources is resolved.
   *
   * @param {AbstractController} controller
   * @param {React.Component} view
   * @param {Object<string, *>} pageState
   * @param {Object<string, *>} routeOptions
   * @return {{content: string, status: number,
   *         pageState: Object<string, *>}}
   */
  _renderPage(controller, view, pageState, routeOptions) {
    if (!this._response.isResponseSent()) {
      controller.setState(pageState);
      controller.setMetaParams(pageState);

      this._response
        .status(controller.getHttpStatus())
        .setPageState(pageState)
        .send(this._renderPageContentToString(controller, view, routeOptions));
    }

    return this._response.getResponseParams();
  }

  /**
   * Render page content to a string containing HTML markup.
   *
   * @param {AbstractController} controller
   * @param {function(new: React.Component)} view
   * @param {Object<string, *>} routeOptions
   * @return {string}
   */
  _renderPageContentToString(controller, view, routeOptions) {
    let reactElementView = this._getWrappedPageView(
      controller,
      view,
      routeOptions
    );
    let pageMarkup = this._ReactDOM.renderToString(reactElementView);

    let documentView = this._getDocumentView(routeOptions);
    let documentViewFactory = this._factory.createReactElementFactory(
      documentView
    );
    let appMarkup = this._ReactDOM.renderToStaticMarkup(
      documentViewFactory({
        page: pageMarkup,
        revivalSettings: this._getRevivalSettings(),
        metaManager: controller.getMetaManager(),
        $Utils: this._factory.getUtils()
      })
    );

    return '<!doctype html>\n' + appMarkup;
  }
}

/**
 * Decorator for page state manager, which add logic for limiting Extension
 * competence.
 */
class PageStateManagerDecorator extends PageStateManager {
  /**
   * Initializes the page state manager decorator.
   *
   * @param {PageStateManager} pageStateManager
   * @param {string[]} allowedStateKeys
   */
  constructor(pageStateManager, allowedStateKeys) {
    super();

    /**
     * The current page state manager.
     *
     * @type {PageStateManager}
     */
    this._pageStateManager = pageStateManager;

    /**
     * Array of access keys for state.
     *
     * @type {string[]}
     */
    this._allowedStateKeys = allowedStateKeys;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._pageStateManager.clear();
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
    if ($Debug) {
      let patchKeys = Object.keys(statePatch);
      let deniedKeys = patchKeys.filter(patchKey => {
        return this._allowedStateKeys.indexOf(patchKey) === -1;
      });

      if (deniedKeys.length > 0) {
        throw new GenericError(
          `Extension can not set state for keys ` +
            `${deniedKeys.join()}. Check your extension or add keys ` +
            `${deniedKeys.join()} to getAllowedStateKeys.`
        );
      }
    }

    this._pageStateManager.setState(statePatch);
  }

  /**
   * @inheritdoc
   */
  getState() {
    return this._pageStateManager.getState();
  }

  /**
   * @inheritdoc
   */
  getAllStates() {
    return this._pageStateManager.getAllStates();
  }
}

/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events$1 = Object.freeze({
  /**
   * PateStateManager fire event {@code $IMA.$PageStateManager.beforeChangeState} before
   * state is patched. Event's data contain
   * {@code { oldState: Object<string, *>, newState: Object<string, *>,
   * pathState:  Object<string, *> }}.
   *
   * @const
   * @type {string}
   */
  BEFORE_CHANGE_STATE: '$IMA.$PageStateManager.beforeChangeState',

  /**
   * PateStateManager fire event {@code $IMA.$PageStateManager.afterChangeState} after state
   * is patched. Event's data contain {@code {newState: Object<string, *>}}.
   *
   * @const
   * @type {string}
   */
  AFTER_CHANGE_STATE: '$IMA.$PageStateManager.afterChangeState'
});

var Events$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Events$1
});

const MAX_HISTORY_LIMIT = 10;

/**
 * The implementation of the {@linkcode PageStateManager} interface.
 */
class PageStateManagerImpl extends PageStateManager {
  static get $dependencies() {
    return [Dispatcher];
  }

  /**
   * Initializes the page state manager.
   *
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   */
  constructor(dispatcher) {
    super();

    /**
     * @type {Object<string, *>[]}
     */
    this._states = [];

    /**
     * @type {number}
     */
    this._cursor = -1;

    /**
     * @type {?function(Object<string, *>)}
     */
    this.onChange = null;

    /**
     * @type {Dispatcher}
     */
    this._dispatcher = dispatcher;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._states = [];
    this._cursor = -1;
  }

  /**
   * @inheritdoc
   */
  setState(patchState) {
    const oldState = this.getState();
    const newState = Object.assign({}, this.getState(), patchState);

    if (this._dispatcher) {
      this._dispatcher.fire(
        Events$1.BEFORE_CHANGE_STATE,
        { newState, oldState, patchState },
        true
      );
    }

    this._eraseExcessHistory();
    this._pushToHistory(newState);
    this._callOnChangeCallback(newState);
  }

  /**
   * @inheritdoc
   */
  getState() {
    return this._states[this._cursor] || {};
  }

  /**
   * @inheritdoc
   */
  getAllStates() {
    return this._states;
  }

  /**
   * Erase the oldest state from storage only if it exceed max
   * defined size of history.
   */
  _eraseExcessHistory() {
    if (this._states.length > MAX_HISTORY_LIMIT) {
      this._states.shift();
      this._cursor -= 1;
    }
  }

  /**
   * Push new state to history storage.
   *
   * @param {Object<string, *>} newState
   */
  _pushToHistory(newState) {
    this._states.push(newState);
    this._cursor += 1;
  }

  /**
   * Call registered callback function on (@codelink onChange) with newState.
   *
   * @param {Object<string, *>} newState
   */
  _callOnChangeCallback(newState) {
    if (this.onChange && typeof this.onChange === 'function') {
      this.onChange(newState);
    }

    if (this._dispatcher) {
      this._dispatcher.fire(Events$1.AFTER_CHANGE_STATE, { newState }, true);
    }
  }
}

/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events$3 = Object.freeze({
  /**
   * Router fire event {@code $IMA.$Router.beforeHandleRoute} before page
   * manager handle the route. Event's data contain
   * {@code { params: Object<string, string>}, route: ima.router.Route,
   * path: string, options: Object<string, *>}}. The {@code path} is current
   * path, the {@code params} are params extracted from path, the
   * {@code route} is handle route for path and the {@code options} is route
   * additional options.
   *
   * @const
   * @type {string}
   */
  BEFORE_HANDLE_ROUTE: '$IMA.$Router.beforeHandleRoute',

  /**
   * Router fire event {@code $IMA.$Router.afterHandleRoute} after page
   * manager handle the route. Event's data contain
   * {@code {response: Object<string, *>, params: Object<string, string>},
   * route: ima.router.Route, path: string, options: Object<string, *>}}.
   * The {@code response} is page render result. The {@code path} is current
   * path, the {@code params} are params extracted from path, the
   * {@code route} is handle route for path and the {@code options} is route
   * additional options.
   *
   * @const
   * @type {string}
   */
  AFTER_HANDLE_ROUTE: '$IMA.$Router.afterHandleRoute'
});

var Events$4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': Events$3
});

/**
 * HTTP status code constants, representing the HTTP status codes recognized
 * and processed by this proxy.
 *
 * @enum {string}
 * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 */
const RouteNames = Object.freeze({
  /**
   * The internal route name used for the "not found" error page (the 4XX
   * HTTP status code error page).
   *
   * @const
   * @type {string}
   */
  NOT_FOUND: 'notFound',

  /**
   * The internal route name used for the error page (the 5XX HTTP status
   * code error page).
   *
   * @const
   * @type {string}
   */
  ERROR: 'error'
});

/**
 * The basic implementation of the {@codelink Router} interface, providing the
 * common or default functionality for parts of the API.
 *
 * @abstract
 */
class AbstractRouter extends Router {
  /**
   * Initializes the router.
   *
   * @param {PageManager} pageManager The page manager handling UI rendering,
   *        and transitions between pages if at the client side.
   * @param {RouteFactory} factory Factory for routes.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @example
   *      router.link('article', {articleId: 1});
   * @example
   *      router.redirect('http://www.example.com/web');
   * @example
   *      router.add(
   *        'home',
   *        '/',
   *        ns.app.page.home.Controller,
   *        ns.app.page.home.View,
   *        {
   *          onlyUpdate: false,
   *          autoScroll: true,
   *          allowSPA: true,
   *          documentView: null,
   *          managedRootView: null,
   *          viewAdapter: null
   *        }
   *      );
   */
  constructor(pageManager, factory, dispatcher) {
    super();

    /**
     * The page manager handling UI rendering, and transitions between
     * pages if at the client side.
     *
     * @type {PageManager}
     */
    this._pageManager = pageManager;

    /**
     * Factory for routes.
     *
     * @type {RouteFactory}
     */
    this._factory = factory;

    /**
     * Dispatcher fires events to app.
     *
     * @type {Dispatcher}
     */
    this._dispatcher = dispatcher;

    /**
     * The current protocol used to access the application, terminated by a
     * colon (for example {@code https:}).
     *
     * @type {string}
     */
    this._protocol = '';

    /**
     * The application's host.
     *
     * @type {string}
     */
    this._host = '';

    /**
     * The URL path pointing to the application's root.
     *
     * @type {string}
     */
    this._root = '';

    /**
     * The URL path fragment used as a suffix to the {@code _root} field
     * that specifies the current language.
     *
     * @type {string}
     */
    this._languagePartPath = '';

    /**
     * Storage of all known routes. The key are the route names.
     *
     * @type {Map<string, Route>}
     */
    this._routes = new Map();
  }

  /**
   * @inheritdoc
   */
  init(config) {
    this._protocol = config.$Protocol || '';
    this._root = config.$Root || '';
    this._languagePartPath = config.$LanguagePartPath || '';
    this._host = config.$Host;
    this._currentlyRoutedPath = this.getPath();
  }

  /**
   * @inheritdoc
   */
  add(name, pathExpression, controller, view, options = undefined) {
    if (this._routes.has(name)) {
      throw new GenericError(
        `ima.router.AbstractRouter.add: The route with name ${name} ` +
          `is already defined`
      );
    }

    let factory = this._factory;
    let route = factory.createRoute(
      name,
      pathExpression,
      controller,
      view,
      options
    );
    this._routes.set(name, route);

    return this;
  }

  /**
   * @inheritdoc
   */
  remove(name) {
    this._routes.delete(name);

    return this;
  }

  /**
   * @inheritdoc
   */
  getPath() {
    throw new GenericError(
      'The getPath() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  getUrl() {
    return this.getBaseUrl() + this.getPath();
  }

  /**
   * @inheritdoc
   */
  getBaseUrl() {
    return this.getDomain() + this._root + this._languagePartPath;
  }

  /**
   * @inheritdoc
   */
  getDomain() {
    return this._protocol + '//' + this._host;
  }

  /**
   * @inheritdoc
   */
  getHost() {
    return this._host;
  }

  /**
   * @inheritdoc
   */
  getProtocol() {
    return this._protocol;
  }

  /**
   * @inheritdoc
   */
  getCurrentRouteInfo() {
    let path = this.getPath();
    let route = this._getRouteByPath(path);

    if (!route) {
      throw new GenericError(
        `ima.router.AbstractRouter.getCurrentRouteInfo: The route ` +
          `for path ${path} is not defined.`
      );
    }

    let params = route.extractParameters(path);

    return { route, params, path };
  }

  /**
   * @inheritdoc
   * @abstract
   */
  listen() {
    throw new GenericError(
      'The listen() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   * @abstract
   */
  redirect() {
    throw new GenericError(
      'The redirect() method is abstract and must be overridden.'
    );
  }

  /**
   * @inheritdoc
   */
  link(routeName, params) {
    let route = this._routes.get(routeName);

    if (!route) {
      throw new GenericError(
        `ima.router.AbstractRouter:link has undefined route with ` +
          `name ${routeName}. Add new route with that name.`
      );
    }

    return this.getBaseUrl() + route.toPath(params);
  }

  /**
   * @inheritdoc
   */
  route(path, options = {}, action) {
    this._currentlyRoutedPath = path;
    let routeForPath = this._getRouteByPath(path);
    let params = {};

    if (!routeForPath) {
      params.error = new GenericError(
        `Route for path '${path}' is not configured.`,
        { status: 404 }
      );

      return this.handleNotFound(params);
    }

    params = routeForPath.extractParameters(path);

    return this._handle(routeForPath, params, options, action);
  }

  /**
   * @inheritdoc
   */
  handleError(params, options = {}) {
    let routeError = this._routes.get(RouteNames.ERROR);

    if (!routeError) {
      let error = new GenericError(
        `ima.router.AbstractRouter:handleError cannot process the ` +
          `error because no error page route has been configured. Add ` +
          `a new route named '${RouteNames.ERROR}'.`,
        params
      );

      return Promise.reject(error);
    }

    return this._handle(routeError, params, options, {
      url: this.getUrl(),
      type: ActionTypes.ERROR
    });
  }

  /**
   * @inheritdoc
   */
  handleNotFound(params, options = {}) {
    let routeNotFound = this._routes.get(RouteNames.NOT_FOUND);

    if (!routeNotFound) {
      let error = new GenericError(
        `ima.router.AbstractRouter:handleNotFound cannot processes ` +
          `a non-matching route because no not found page route has ` +
          `been configured. Add new route named ` +
          `'${RouteNames.NOT_FOUND}'.`,
        params
      );

      return Promise.reject(error);
    }

    return this._handle(routeNotFound, params, options, {
      url: this.getUrl(),
      type: ActionTypes.ERROR
    });
  }

  /**
   * @inheritdoc
   */
  isClientError(reason) {
    return (
      reason instanceof GenericError &&
      reason.getHttpStatus() >= 400 &&
      reason.getHttpStatus() < 500
    );
  }

  /**
   * @inheritdoc
   */
  isRedirection(reason) {
    return (
      reason instanceof GenericError &&
      reason.getHttpStatus() >= 300 &&
      reason.getHttpStatus() < 400
    );
  }

  /**
   * Strips the URL path part that points to the application's root (base
   * URL) from the provided path.
   *
   * @protected
   * @param {string} path Relative or absolute URL path.
   * @return {string} URL path relative to the application's base URL.
   */
  _extractRoutePath(path) {
    return path.replace(this._root + this._languagePartPath, '');
  }

  /**
   * Handles the provided route and parameters by initializing the route's
   * controller and rendering its state via the route's view.
   *
   * The result is then sent to the client if used at the server side, or
   * displayed if used as the client side.
   *
   * @param {Route} route The route that should have its
   *        associated controller rendered via the associated view.
   * @param {Object<string, (Error|string)>} params Parameters extracted from
   *        the URL path and query.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          allowSPA: boolean=,
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=
   *        }} options The options overrides route options defined in the
   *        {@code routes.js} configuration file.
   * @param {{ type: string, event: Event, url: string }} [action] An action
   *        object describing what triggered this routing.
   * @return {Promise<Object<string, *>>} A promise that resolves when the
   *         page is rendered and the result is sent to the client, or
   *         displayed if used at the client side.
   */
  _handle(route, params, options, action = {}) {
    options = Object.assign({}, route.getOptions(), options);
    const eventData = {
      route,
      params,
      path: this._getCurrentlyRoutedPath(),
      options,
      action
    };

    this._dispatcher.fire(Events$3.BEFORE_HANDLE_ROUTE, eventData, true);

    return this._pageManager
      .manage(route, options, params, action)
      .then(response => {
        response = response || {};

        if (params.error && params.error instanceof Error) {
          response.error = params.error;
        }

        eventData.response = response;

        this._dispatcher.fire(Events$3.AFTER_HANDLE_ROUTE, eventData, true);

        return response;
      });
  }

  /**
   * Returns the route matching the provided URL path part. The path may
   * contain a query.
   *
   * @param {string} path The URL path.
   * @return {?Route} The route matching the path, or {@code null} if no such
   *         route exists.
   */
  _getRouteByPath(path) {
    for (let route of this._routes.values()) {
      if (route.matches(path)) {
        return route;
      }
    }

    return null;
  }

  /**
   * Returns path that is stored in private property when a {@code route}
   * method is called.
   *
   * @returns {string}
   */
  _getCurrentlyRoutedPath() {
    return this._currentlyRoutedPath;
  }
}

/**
 * Regular expression matching all control characters used in regular
 * expressions. The regular expression is used to match these characters in
 * path expressions and replace them appropriately so the path expression can
 * be compiled to a regular expression.
 *
 * @const
 * @type {RegExp}
 */
const CONTROL_CHARACTERS_REGEXP = /[\\.+*?^$[\](){}/'#]/g;

/**
 * Regular expression used to match and remove the starting and trailing
 * forward slashes from a path expression or a URL path.
 *
 * @const
 * @type {RegExp}
 */
const LOOSE_SLASHES_REGEXP = /^\/|\/$/g;

/**
 * Regular expression used to match the parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_UNIVERSAL = /:\??([\w-]+)/g;

/**
 * Regular expression used to match the required parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_REQUIRED = /(?:^|\\\/):([a-z0-9]+)(?=\\\/|$)/gi;

/**
 * Regular expression used to separate a camelCase parameter name
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_CORE_NAME = /[a-z0-9]+/i;

/**
 * Regular expression used to match start of parameter names from a path expression.
 *
 * @const
 * @type {String}
 */
const PARAMS_START_PATTERN = '(^|/|[_-])';

/**
 * Regular expression used to match end of parameter names from a path expression.
 *
 * @const
 * @type {String}
 */
const PARAMS_END_PATTERN = '[/?_-]|$';

/**
 * Regular expression used to never match the parameter names from a path expression.
 * It's used for wrong parameters order (optional vs. required ones)
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_NEVER_MATCH_REGEXP = /$a/;

/**
 * Regular expression used to match all main parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_MAIN_REGEXP = /(?:\\\/|^):\\\?([a-z0-9]+)(?=\\\/|$)|(?:^|\\\/):([a-z0-9]+)(?=\\\/|$)/gi;

/**
 * Regular expression used to match the required subparameter names from a path expression.
 * (e.g. for path '/:paramA-:paramB/:nextParam' are subparametres 'paramA' and 'paramB')
 *
 * @const
 * @type {Object<String, RegExp>}
 */
const SUBPARAMS_REQUIRED_REGEXP = {
  LAST: /([_-]{1})((\w-)?:[a-z0-9]+)(?=\\\/|$)/gi,
  OTHERS: /(:[a-z0-9]+)(?=[_-]{1})/gi
};

/**
 * Regular expression used to match the optional parameter names from a path expression.
 *
 * @const
 * @type {Object<String, RegExp>}
 */
const SUBPARAMS_OPT_REGEXP = {
  LAST: /([_-]{1}(\w-)?:\\\?[a-z0-9]+)(?=\\\/|$)/gi,
  OTHERS: /(:\\\?[a-z0-9]+)(?=[_-]{1}(\w-)?)/gi
};

/**
 * Regular expression used to match the parameter names from a path expression.
 *
 * @const
 * @type {RegExp}
 */
const PARAMS_REGEXP_OPT = /(?:^:\\\?([a-z0-9]+)(?=\\\/|$))|(?:(\\\/):\\\?([a-z0-9]+)(?=\\\/|$))/gi; // last part: |(?::\\\?([a-z0-9]+)(?=\\\/|$))

/**
 * Utility for representing and manipulating a single route in the router's
 * configuration.
 */
class Route {
  /**
   * Initializes the route.
   *
   * @param {string} name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param {string} pathExpression A path expression specifying the URL path
   *        part matching this route (must not contain a query string),
   *        optionally containing named parameter placeholders specified as
   *        {@code :parameterName}.
   * @param {string} controller The full name of Object Container alias
   *        identifying the controller associated with this route.
   * @param {string} view The full name or Object Container alias identifying
   *        the view class associated with this route.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          allowSPA: boolean=,
   *          documentView: ?AbstractDocumentView=,
   *          managedRootView: ?function(new: React.Component)=,
   *          viewAdapter: ?function(new: React.Component)=
   *        }} options The route additional options.
   */
  constructor(name, pathExpression, controller, view, options) {
    /**
     * The unique name of this route, identifying it among the rest of the
     * routes in the application.
     *
     * @type {string}
     */
    this._name = name;

    /**
     * The original URL path expression from which this route was created.
     *
     * @type {string}
     */
    this._pathExpression = pathExpression;

    /**
     * The full name of Object Container alias identifying the controller
     * associated with this route.
     *
     * @type {string}
     */
    this._controller = controller;

    /**
     * The full name or Object Container alias identifying the view class
     * associated with this route.
     *
     * @type {React.Component}
     */
    this._view = view;

    /**
     * The route additional options.
     *
     * @type {{
     *         onlyUpdate: (
     *           boolean|
     *           function(
     *             (string|function(new: Controller, ...*)),
     *             (string|function(
     *               new: React.Component,
     *               Object<string, *>,
     *               ?Object<string, *>
     *             ))
     *           ): boolean
     *         ),
     *         autoScroll: boolean,
     *         allowSPA: boolean,
     *         documentView: ?function(new: AbstractDocumentView),
     *         managedRootView: ?function(new: React.Component),
     *         viewAdapter: ?function(new: React.Component)
     *       }}
     */
    this._options = Object.assign(
      {
        onlyUpdate: false,
        autoScroll: true,
        allowSPA: true,
        documentView: null,
        managedRootView: null,
        viewAdapter: null
      },
      options
    );

    /**
     * The path expression with the trailing slashes trimmed.
     *
     * @type {string}
     */
    this._trimmedPathExpression = this._getTrimmedPath(pathExpression);

    /**
     * The names of the parameters in this route.
     *
     * @type {string[]}
     */
    this._parameterNames = this._getParameterNames(pathExpression);

    /**
     * Set to {@code true} if this route contains parameters in its path.
     *
     * @type {boolean}
     */
    this._hasParameters = !!this._parameterNames.length;

    /**
     * A regexp used to match URL path against this route and extract the
     * parameter values from the matched URL paths.
     *
     * @type {RegExp}
     */
    this._matcher = this._compileToRegExp(this._trimmedPathExpression);
  }

  /**
   * Creates the URL and query parts of a URL by substituting the route's
   * parameter placeholders by the provided parameter value.
   *
   * The extraneous parameters that do not match any of the route's
   * placeholders will be appended as the query string.
   *
   * @param {Object<string, (number|string)>=} [params={}] The route
   *        parameter values.
   * @return {string} Path and, if necessary, query parts of the URL
   *         representing this route with its parameters replaced by the
   *         provided parameter values.
   */
  toPath(params = {}) {
    let path = this._pathExpression;
    let query = [];

    for (let paramName of Object.keys(params)) {
      if (this._isRequiredParamInPath(path, paramName)) {
        path = this._substituteRequiredParamInPath(
          path,
          paramName,
          params[paramName]
        );
      } else if (this._isOptionalParamInPath(path, paramName)) {
        path = this._substituteOptionalParamInPath(
          path,
          paramName,
          params[paramName]
        );
      } else {
        const pair = [paramName, params[paramName]];
        query.push(pair.map(encodeURIComponent).join('='));
      }
    }
    path = this._cleanUnusedOptionalParams(path);

    path = query.length ? path + '?' + query.join('&') : path;
    path = this._getTrimmedPath(path);
    return path;
  }

  /**
   * Returns the unique identifying name of this route.
   *
   * @return {string} The name of the route, identifying it.
   */
  getName() {
    return this._name;
  }

  /**
   * Returns the full name of the controller to use when this route is
   * matched by the current URL, or an Object Container-registered alias of
   * the controller.
   *
   * @return {string} The name of alias of the controller.
   */
  getController() {
    return this._controller;
  }

  /**
   * Returns the full name of the view class or an Object
   * Container-registered alias for the view class, representing the view to
   * use when this route is matched by the current URL.
   *
   * @return {string} The name or alias of the view class.
   */
  getView() {
    return this._view;
  }

  /**
   * Return route additional options.
   *
   * @return {{
   *           onlyUpdate: (
   *             boolean|
   *             function(
   *               (string|function(new: Controller, ...*)),
   *               (string|function(
   *                 new: React.Component,
   *                 Object<string, *>,
   *                 ?Object<string, *>
   *               ))
   *             ): boolean
   *           ),
   *           autoScroll: boolean,
   *           allowSPA: boolean,
   *           documentView: ?AbstractDocumentView,
   *           managedRootView: ?function(new: React.Component),
   *           viewAdapter: ?function(new: React.Component)
   *         }}
   */
  getOptions() {
    return this._options;
  }

  /**
   * Returns the path expression, which is the parametrized pattern matching
   * the URL paths matched by this route.
   *
   * @return {string} The path expression.
   */
  getPathExpression() {
    return this._pathExpression;
  }

  /**
   * Tests whether the provided URL path matches this route. The provided
   * path may contain the query.
   *
   * @param {string} path The URL path.
   * @return {boolean} {@code true} if the provided path matches this route.
   */
  matches(path) {
    let trimmedPath = this._getTrimmedPath(path);
    return this._matcher.test(trimmedPath);
  }

  /**
   * Extracts the parameter values from the provided path. The method
   * extracts both the in-path parameters and parses the query, allowing the
   * query parameters to override the in-path parameters.
   *
   * The method returns an empty hash object if the path does not match this
   * route.
   *
   * @param {string} path
   * @return {Object<string, ?string>} Map of parameter names to parameter
   *         values.
   */
  extractParameters(path) {
    let trimmedPath = this._getTrimmedPath(path);
    let parameters = this._getParameters(trimmedPath);
    let query = this._getQuery(trimmedPath);

    return Object.assign({}, parameters, query);
  }

  /**
   * Replace required parameter placeholder in path with parameter value.
   *
   * @param {string} path
   * @param {string} paramName
   * @param {string} paramValue
   * @return {string} New path.
   */
  _substituteRequiredParamInPath(path, paramName, paramValue) {
    return path.replace(
      new RegExp(`${PARAMS_START_PATTERN}:${paramName}(${PARAMS_END_PATTERN})`),
      paramValue ? '$1' + encodeURIComponent(paramValue) + '$2' : ''
    );
  }

  /**
   * Replace optional param placeholder in path with parameter value.
   *
   * @param {string} path
   * @param {string} paramName
   * @param {string} paramValue
   * @return {string} New path.
   */
  _substituteOptionalParamInPath(path, paramName, paramValue) {
    const paramRegexp = `${PARAMS_START_PATTERN}:\\?${paramName}(${PARAMS_END_PATTERN})`;
    return path.replace(
      new RegExp(paramRegexp),
      paramValue ? '$1' + encodeURIComponent(paramValue) + '$2' : '/'
    );
  }

  /**
   * Remove unused optional param placeholders in path.
   *
   * @param {string} path
   * @return {string} New path.
   */
  _cleanUnusedOptionalParams(path) {
    let replacedPath = path;

    // remove last subparameters
    replacedPath = replacedPath.replace(/([_-])(:\?([a-z0-9]+))(?=\/)/gi, '$1');

    // remove parameters
    replacedPath = replacedPath.replace(
      /(\/:\?([a-z0-9]+))|(:\?([a-z0-9]+)\/?)/gi,
      ''
    );

    return replacedPath;
  }

  /**
   * Returns true, if paramName is placed in path.
   *
   * @param {string} path
   * @param {string} paramName
   * @return {boolean}
   */
  _isOptionalParamInPath(path, paramName) {
    const paramRegexp = `${PARAMS_START_PATTERN}:\\?${paramName}(?:${PARAMS_END_PATTERN})`;
    let regexp = new RegExp(paramRegexp);
    return regexp.test(path);
  }

  /**
   * Returns true, if paramName is placed in path and it's required.
   *
   * @param {string} path
   * @param {string} paramName
   * @return {boolean}
   */
  _isRequiredParamInPath(path, paramName) {
    let regexp = new RegExp(`:${paramName}`);

    return regexp.test(path);
  }

  /**
   * Extract clear parameter name, e.q. '?name' or 'name'
   *
   * @param {string} rawParam
   * @return {string}
   */
  _getClearParamName(rawParam) {
    const regExpr = /\??[a-z0-9]+/i;
    const paramMatches = rawParam.match(regExpr);
    const param = paramMatches ? paramMatches[0] : '';

    return param;
  }

  /**
   * Get pattern for subparameter.
   *
   * @param {string} delimeter Parameters delimeter
   * @return {string}
   */
  _getSubparamPattern(delimeter) {
    const pattern = `([^${delimeter}?/]+)`;

    return pattern;
  }

  /**
   * Check if all optional params are below required ones
   *
   * @param {array<string>} allMainParams
   * @return {boolean}
   */
  _checkOptionalParamsOrder(allMainParams) {
    let optionalLastId = -1;

    const count = allMainParams.length;
    for (let idx = 0; idx < count; idx++) {
      const item = allMainParams[idx];

      if (item.substr(0, 1) === '?') {
        optionalLastId = idx;
      } else {
        if (optionalLastId > -1 && idx > optionalLastId) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if main parametres have correct order.
   * It means that required param cannot follow optional one.
   *
   * @param {string} clearedPathExpr The cleared URL path (removed first and last slash, ...).
   * @return {Bool} Returns TRUE if order is correct.
   */
  _checkParametersOrder(clearedPathExpr) {
    const mainParamsMatches = clearedPathExpr.match(PARAMS_MAIN_REGEXP) || [];
    const allMainParamsCleared = mainParamsMatches.map(paramExpr =>
      this._getClearParamName(paramExpr)
    );

    const isCorrectParamOrder = this._checkOptionalParamsOrder(
      allMainParamsCleared
    );
    return isCorrectParamOrder;
  }

  /**
   * Convert main optional parameters to capture sequences
   *
   * @param {string} path The URL path.
   * @param {array<string>} optionalParams List of main optimal parameter expressions
   * @return {string} RegExp pattern.
   */
  _replaceOptionalParametersInPath(path, optionalParams) {
    const pattern = optionalParams.reduce((path, paramExpr, idx, matches) => {
      const lastIdx = matches.length - 1;
      const hasSlash = paramExpr.substr(0, 2) === '\\/';

      let separator = '';

      if (idx === 0) {
        separator = '(?:' + (hasSlash ? '/' : '');
      } else {
        separator = hasSlash ? '/?' : '';
      }

      let regExpr = separator + `([^/?]+)?(?=/|$)?`;

      if (idx === lastIdx) {
        regExpr += ')?';
      }

      return path.replace(paramExpr, regExpr);
    }, path);

    return pattern;
  }

  /**
   * Convert required subparameters to capture sequences
   *
   * @param {string} path The URL path (route definition).
   * @param {string} clearedPathExpr The original cleared URL path.
   * @return {string} RegExp pattern.
   */
  _replaceRequiredSubParametersInPath(path, clearedPathExpr) {
    const requiredSubparamsOthers =
      clearedPathExpr.match(SUBPARAMS_REQUIRED_REGEXP.OTHERS) || [];
    const requiredSubparamsLast =
      clearedPathExpr.match(SUBPARAMS_REQUIRED_REGEXP.LAST) || [];

    path = requiredSubparamsOthers.reduce((pattern, paramExpr) => {
      const paramIdx = pattern.indexOf(paramExpr) + paramExpr.length;
      const delimeter = pattern.substr(paramIdx, 1);

      const regExpr = this._getSubparamPattern(delimeter);

      return pattern.replace(paramExpr, regExpr);
    }, path);

    path = requiredSubparamsLast.reduce((pattern, rawParamExpr) => {
      const paramExpr = rawParamExpr.substr(1);
      const regExpr = '([^/?]+)';

      return pattern.replace(paramExpr, regExpr);
    }, path);

    return path;
  }

  /**
   * Convert optional subparameters to capture sequences
   *
   * @param {string} path The URL path (route definition).
   * @param {array<string>} optionalSubparamsOthers List of all subparam. expressions but last ones
   * @param {array<string>} optionalSubparamsLast List of last subparam. expressions
   * @return {string} RegExp pattern.
   */
  _replaceOptionalSubParametersInPath(
    path,
    optionalSubparamsOthers,
    optionalSubparamsLast
  ) {
    path = optionalSubparamsOthers.reduce((pattern, paramExpr) => {
      const paramIdx = pattern.indexOf(paramExpr) + paramExpr.length;
      const delimeter = pattern.substr(paramIdx, 1);
      const paramPattern = this._getSubparamPattern(delimeter);
      const regExpr = paramPattern + '?';

      return pattern.replace(paramExpr, regExpr);
    }, path);

    path = optionalSubparamsLast.reduce((pattern, rawParamExpr) => {
      const paramExpr = rawParamExpr.substr(1);
      const regExpr = '([^/?]+)?';

      return pattern.replace(paramExpr, regExpr);
    }, path);

    return path;
  }

  /**
   * Compiles the path expression to a regular expression that can be used
   * for easier matching of URL paths against this route, and extracting the
   * path parameter values from the URL path.
   *
   * @param {string} pathExpression The path expression to compile.
   * @return {RegExp} The compiled regular expression.
   */
  _compileToRegExp(pathExpression) {
    const clearedPathExpr = pathExpression
      .replace(LOOSE_SLASHES_REGEXP, '')
      .replace(CONTROL_CHARACTERS_REGEXP, '\\$&');

    const requiredMatches = clearedPathExpr.match(PARAMS_REGEXP_REQUIRED) || [];
    const optionalMatches = clearedPathExpr.match(PARAMS_REGEXP_OPT) || [];

    const optionalSubparamsLast =
      clearedPathExpr.match(SUBPARAMS_OPT_REGEXP.LAST) || [];
    const optionalSubparamsOthers =
      clearedPathExpr.match(SUBPARAMS_OPT_REGEXP.OTHERS) || [];
    const optionalSubparams = [
      ...optionalSubparamsOthers,
      ...optionalSubparamsLast
    ];

    const optionalSubparamsCleanNames = optionalSubparams.map(paramExpr => {
      return this._getClearParamName(paramExpr);
    });

    const optionalParams = optionalMatches.filter(paramExpr => {
      const param = this._getClearParamName(paramExpr);

      return !optionalSubparamsCleanNames.includes(param);
    });

    if (!!requiredMatches.length && !!optionalParams.length) {
      const isCorrectParamOrder = this._checkParametersOrder(clearedPathExpr);

      if (!isCorrectParamOrder) {
        return PARAMS_NEVER_MATCH_REGEXP;
      }
    }

    // convert required parameters to capture sequences
    let pattern = requiredMatches.reduce((pattern, rawParamExpr) => {
      const paramExpr = ':' + this._getClearParamName(rawParamExpr);
      const regExpr = '([^/?]+)';

      return pattern.replace(paramExpr, regExpr);
    }, clearedPathExpr);

    pattern = this._replaceOptionalParametersInPath(pattern, optionalParams);
    pattern = this._replaceRequiredSubParametersInPath(
      pattern,
      clearedPathExpr
    );
    pattern = this._replaceOptionalSubParametersInPath(
      pattern,
      optionalSubparamsOthers,
      optionalSubparamsLast
    );

    // add path root
    pattern = '^\\/' + pattern;

    // add query parameters matcher
    let pairPattern = '[^=&;]*(?:=[^&;]*)?';
    pattern += `(?:\\?(?:${pairPattern})(?:[&;]${pairPattern})*)?$`;

    return new RegExp(pattern);
  }

  /**
   * Parses the provided path and extract the in-path parameters. The method
   * decodes the parameters and returns them in a hash object.
   *
   * @param {string} path The URL path.
   * @return {Object<string, string>} The parsed path parameters.
   */
  _getParameters(path) {
    if (!this._hasParameters) {
      return {};
    }

    let parameterValues = path.match(this._matcher);
    if (!parameterValues) {
      return {};
    }

    parameterValues.shift(); // remove the match on whole path, and other parts

    return this._extractParameters(parameterValues);
  }

  /**
   * Extract parameters from given path.
   *
   * @param {string[]} parameterValues
   * @return {Object<string, ?string>} Params object.
   */
  _extractParameters(parameterValues) {
    let parameters = {};

    const parametersCount = this._parameterNames.length;

    // Cycle for names and values from last to 0
    for (let i = parametersCount - 1; i >= 0; i--) {
      let [rawName, rawValue] = [this._parameterNames[i], parameterValues[i]];
      let cleanParamName = this._cleanOptParamName(rawName);

      const matchesName = cleanParamName.match(PARAMS_REGEXP_CORE_NAME);
      const currentCoreName = matchesName ? matchesName[0] : '';

      if (currentCoreName) {
        const value = this._decodeURIParameter(rawValue);
        parameters[currentCoreName] = value;
      }
    }

    return parameters;
  }

  /**
   * Decoding parameters.
   *
   * @param {string} parameterValue
   * @return {string} decodedValue
   */
  _decodeURIParameter(parameterValue) {
    let decodedValue;
    if (parameterValue) {
      decodedValue = decodeURIComponent(parameterValue);
    }
    return decodedValue;
  }

  /**
   * Returns optional param name without "?"
   *
   * @param {string} paramName Full param name with "?"
   * @return {string} Strict param name without "?"
   */
  _cleanOptParamName(paramName) {
    return paramName.replace('?', '');
  }

  /**
   * Checks if parameter is optional or not.
   *
   * @param {string} paramName
   * @return {boolean} return true if is optional, otherwise false
   */
  _isParamOptional(paramName) {
    return /\?.+/.test(paramName);
  }

  /**
   * Extracts and decodes the query parameters from the provided URL path and
   * query.
   *
   * @param {string} path The URL path, including the optional query string
   *        (if any).
   * @return {Object<string, ?string>} Parsed query parameters.
   */
  _getQuery(path) {
    let query = {};
    let queryStart = path.indexOf('?');
    let hasQuery = queryStart > -1 && queryStart !== path.length - 1;

    if (hasQuery) {
      let pairs = path.substring(queryStart + 1).split(/[&;]/);

      for (let parameterPair of pairs) {
        let pair = parameterPair.split('=');
        query[decodeURIComponent(pair[0])] =
          pair.length > 1 ? decodeURIComponent(pair[1]) : true;
      }
    }

    return query;
  }

  /**
   * Trims the trailing forward slash from the provided URL path.
   *
   * @param {string} path The path to trim.
   * @return {string} Trimmed path.
   */
  _getTrimmedPath(path) {
    return `/${path.replace(LOOSE_SLASHES_REGEXP, '')}`;
  }

  /**
   * Extracts the parameter names from the provided path expression.
   *
   * @param {string} pathExpression The path expression.
   * @return {string[]} The names of the parameters defined in the provided
   *         path expression.
   */
  _getParameterNames(pathExpression) {
    let rawNames = pathExpression.match(PARAMS_REGEXP_UNIVERSAL) || [];

    return rawNames.map(rawParameterName => {
      return rawParameterName.substring(1).replace('?', '');
    });
  }
}

/**
 * Utility factory used by router to create routes.
 */
class RouteFactory {
  static get $dependencies() {
    return [];
  }

  /**
   * Create new instance of ima.router.Route.
   *
   * @param {string} name The unique name of this route, identifying it among
   *        the rest of the routes in the application.
   * @param {string} pathExpression A path expression specifying the URL path
   *        part matching this route (must not contain a query string),
   *        optionally containing named parameter placeholders specified as
   *        {@code :parameterName}.
   * @param {string} controller The full name of Object Container alias
   *        identifying the controller associated with this route.
   * @param {string} view The full name or Object Container alias identifying
   *        the view class associated with this route.
   * @param {{
   *          onlyUpdate: (
   *            boolean|
   *            function(
   *              (string|function(new: Controller, ...*)),
   *              (string|function(
   *                new: React.Component,
   *                Object<string, *>,
   *                ?Object<string, *>
   *              ))
   *            ): boolean
   *          )=,
   *          autoScroll: boolean=,
   *          allowSPA: boolean=,
   *          documentView: ?AbstractDocumentView=
   *        }} options The route additional options.
   * @return {Route} The constructed route.
   */
  createRoute(name, pathExpression, controller, view, options) {
    return new Route(name, pathExpression, controller, view, options);
  }
}

// @client-side

/**
 * Names of the DOM events the router responds to.
 *
 * @enum {string}
 * @type {Object<string, string>}
 */
const Events$5 = Object.freeze({
  /**
   * Name of the event produced when the user clicks the page using the
   * mouse, or touches the page and the touch event is not stopped.
   *
   * @const
   * @type {string}
   */
  CLICK: 'click',

  /**
   * Name of the event fired when the user navigates back in the history.
   *
   * @const
   * @type {string}
   */
  POP_STATE: 'popstate'
});

/**
 * The number used as the index of the mouse left button in DOM
 * {@code MouseEvent}s.
 *
 * @const
 * @type {number}
 */
const MOUSE_LEFT_BUTTON = 0;

/**
 * The client-side implementation of the {@codelink Router} interface.
 */
class ClientRouter extends AbstractRouter {
  static get $dependencies() {
    return [PageManager, RouteFactory, Dispatcher, Window];
  }

  /**
   * Initializes the client-side router.
   *
   * @param {PageManager} pageManager The page manager handling UI rendering,
   *        and transitions between pages if at the client side.
   * @param {RouteFactory} factory Factory for routes.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Window} window The current global client-side APIs provider.
   */
  constructor(pageManager, factory, dispatcher, window) {
    super(pageManager, factory, dispatcher);

    /**
     * Helper for accessing the native client-side APIs.
     *
     * @type {Window}
     */
    this._window = window;
  }

  /**
   * @inheritdoc
   */
  init(config) {
    super.init(config);
    this._host = config.$Host || this._window.getHost();

    return this;
  }

  /**
   * @inheritdoc
   */
  getUrl() {
    return this._window.getUrl();
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return this._extractRoutePath(this._window.getPath());
  }

  /**
   * @inheritdoc
   */
  listen() {
    let nativeWindow = this._window.getWindow();

    let eventName = Events$5.POP_STATE;
    this._window.bindEventListener(nativeWindow, eventName, event => {
      if (event.state && !event.defaultPrevented) {
        this.route(
          this.getPath(),
          {},
          {
            type: ActionTypes.POP_STATE,
            event,
            url: this.getUrl()
          }
        );
      }
    });

    this._window.bindEventListener(nativeWindow, Events$5.CLICK, event => {
      this._handleClick(event);
    });

    return this;
  }

  /**
   * @inheritdoc
   */
  redirect(
    url = '',
    options = {},
    { type = ActionTypes.REDIRECT, event } = {}
  ) {
    if (this._isSameDomain(url)) {
      let path = url.replace(this.getDomain(), '');
      path = this._extractRoutePath(path);

      this.route(path, options, { type, event, url });
    } else {
      this._window.redirect(url);
    }
  }

  /**
   * @inheritdoc
   */
  route(
    path,
    options = {},
    { event = null, type = ActionTypes.REDIRECT, url = null } = {}
  ) {
    const action = {
      event,
      type,
      url: url || this.getUrl()
    };
    return super
      .route(path, options, action)
      .catch(error => {
        return this.handleError({ error });
      })
      .catch(error => {
        this._handleFatalError(error);
      });
  }

  /**
   * @inheritdoc
   */
  handleError(params, options = {}) {
    if ($Debug) {
      console.error(params.error);
    }

    if (this.isClientError(params.error)) {
      return this.handleNotFound(params, options);
    }

    if (this.isRedirection(params.error)) {
      options.httpStatus = params.error.getHttpStatus();
      this.redirect(params.error.getParams().url, options);
      return Promise.resolve({
        content: null,
        status: options.httpStatus,
        error: params.error
      });
    }

    return super.handleError(params, options).catch(error => {
      this._handleFatalError(error);
    });
  }

  /**
   * @inheritdoc
   */
  handleNotFound(params, options = {}) {
    return super.handleNotFound(params, options).catch(error => {
      return this.handleError({ error });
    });
  }

  /**
   * Handle a fatal error application state. IMA handle fatal error when IMA
   * handle error.
   *
   * @param {Error} error
   */
  _handleFatalError(error) {
    if ($IMA && typeof $IMA.fatalErrorHandler === 'function') {
      $IMA.fatalErrorHandler(error);
    } else {
      if ($Debug) {
        console.warn(
          'You must implement $IMA.fatalErrorHandler in ' + 'services.js'
        );
      }
    }
  }

  /**
   * Handles a click event. The method performs navigation to the target
   * location of the anchor (if it has one).
   *
   * The navigation will be handled by the router if the protocol and domain
   * of the anchor's target location (href) is the same as the current,
   * otherwise the method results in a hard redirect.
   *
   * @param {MouseEvent} event The click event.
   */
  _handleClick(event) {
    let target = event.target || event.srcElement;
    let anchorElement = this._getAnchorElement(target);

    if (!anchorElement || typeof anchorElement.href !== 'string') {
      return;
    }

    let anchorHref = anchorElement.href;
    let isDefinedTargetHref = anchorHref !== undefined && anchorHref !== null;
    let isSetTarget = anchorElement.getAttribute('target') !== null;
    let isLeftButton = event.button === MOUSE_LEFT_BUTTON;
    let isCtrlPlusLeftButton = event.ctrlKey && isLeftButton;
    let isCMDPlusLeftButton = event.metaKey && isLeftButton;
    let isSameDomain = this._isSameDomain(anchorHref);
    let isHashLink = this._isHashLink(anchorHref);
    let isLinkPrevented = event.defaultPrevented;

    if (
      !isDefinedTargetHref ||
      isSetTarget ||
      !isLeftButton ||
      !isSameDomain ||
      isHashLink ||
      isCtrlPlusLeftButton ||
      isCMDPlusLeftButton ||
      isLinkPrevented
    ) {
      return;
    }

    event.preventDefault();
    this.redirect(
      anchorHref,
      {},
      { type: ActionTypes.CLICK, event, url: anchorHref }
    );
  }

  /**
   * The method determines whether an anchor element or a child of an anchor
   * element has been clicked, and if it was, the method returns anchor
   * element else null.
   *
   * @param {Node} target
   * @return {?Node}
   */
  _getAnchorElement(target) {
    let self = this;

    while (target && !hasReachedAnchor(target)) {
      target = target.parentNode;
    }

    function hasReachedAnchor(nodeElement) {
      return (
        nodeElement.parentNode &&
        nodeElement !== self._window.getBody() &&
        nodeElement.href !== undefined &&
        nodeElement.href !== null
      );
    }

    return target;
  }

  /**
   * Tests whether the provided target URL contains only an update of the
   * hash fragment of the current URL.
   *
   * @param {string} targetUrl The target URL.
   * @return {boolean} {@code true} if the navigation to target URL would
   *         result only in updating the hash fragment of the current URL.
   */
  _isHashLink(targetUrl) {
    if (targetUrl.indexOf('#') === -1) {
      return false;
    }

    let currentUrl = this._window.getUrl();
    let trimmedCurrentUrl =
      currentUrl.indexOf('#') === -1
        ? currentUrl
        : currentUrl.substring(0, currentUrl.indexOf('#'));
    let trimmedTargetUrl = targetUrl.substring(0, targetUrl.indexOf('#'));

    return trimmedTargetUrl === trimmedCurrentUrl;
  }

  /**
   * Tests whether the the protocol and domain of the provided URL are the
   * same as the current.
   *
   * @param {string=} [url=''] The URL.
   * @return {boolean} {@code true} if the protocol and domain of the
   *         provided URL are the same as the current.
   */
  _isSameDomain(url = '') {
    return !!url.match(this.getBaseUrl());
  }
}

// @server-side class Request {__CLEAR__}\nexports.default = Request;

/**
 * Wrapper for the ExpressJS request, exposing only the necessary minimum.
 */
class Request {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the request.
   */
  constructor() {
    /**
     * The current ExpressJS request object, or {@code null} if running at
     * the client side.
     *
     * @type {?Express.Request}
     */
    this._request = null;
  }

  /**
   * Initializes the request using the provided ExpressJS request object.
   *
   * @param {?Express.Request} request The ExpressJS request object
   *        representing the current request. Use {@code null} at the client
   *        side.
   */
  init(request) {
    this._request = request;
  }

  /**
   * Returns the path part of the URL to which the request was made.
   *
   * @return {string} The path to which the request was made.
   */
  getPath() {
    return this._request ? this._request.originalUrl : '';
  }

  /**
   * Returns the {@code Cookie} HTTP header value.
   *
   * @return {string} The value of the {@code Cookie} header.
   */
  getCookieHeader() {
    return this._request ? this._request.get('Cookie') : '';
  }

  /**
   * Returns uploaded file to server and meta information.
   *
   * @return {?Object<string, *>}
   */
  getFile() {
    return this._request ? this._request.file : null;
  }

  /**
   * Returns upaloaded files to server with their meta information.
   *
   * @return {?Object<string, *>}
   */
  getFiles() {
    return this._request ? this._request.files : null;
  }

  /**
   * Returns body of request.
   *
   * @return {?string}
   */
  getBody() {
    return this._request ? this._request.body || null : null;
  }

  /**
   * Returns the specified HTTP request header.
   *
   * @param {string} header
   * @return {?string}
   */
  getHeader(header) {
    return this._request ? this._request.get(header) || null : null;
  }

  /**
   * Returns the remote IP address of the request.
   *
   * @return {?string}
   */
  getIP() {
    return this._request ? this._request.ip : null;
  }

  /**
   * Returns array of IP addresses specified in the “X-Forwarded-For”
   * request header.
   *
   * @return {string[]}
   */
  getIPs() {
    return this._request ? this._request.ips || [] : [];
  }
}

// @server-side class Response {__CLEAR__}\nexports.default = Response;

/**
 * Wrapper for the ExpressJS response, exposing only the necessary minimum.
 */
class Response {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the response.
   */
  constructor() {
    /**
     * The ExpressJS response object, or {@code null} if running at the
     * client side.
     *
     * @type {?Express.Response}
     */
    this._response = null;

    /**
     * It is flag for sent response for request.
     *
     * @type {boolean}
     */
    this._isSent = false;

    /**
     * HTTP Status code.
     *
     * @type {number}
     */
    this._status = 500;

    /**
     * The content of response.
     *
     * @type {string}
     */
    this._content = '';

    /**
     * The rendered page state.
     *
     * @type {Object<string, *>}
     */
    this._pageState = {};

    /**
     * Internal cookie storage for Set-Cookie header.
     *
     * @type {Map<string, {
     *         value: string,
     *         options: {domain: string=, expires: (number|string)=}
     *       }>}
     */
    this._internalCookieStorage = new Map();

    /**
     * Transform function for cookie value.
     *
     * @type {{encode: function, decode: function}}
     */
    this._cookieTransformFunction = {
      encode: value => value,
      decode: value => value
    };
  }

  /**
   * Initializes this response wrapper with the provided ExpressJS response
   * object.
   *
   * @param {?Express.Response} response The ExpressJS response, or
   *        {@code null} if the code is running at the client side.
   * @param {{
   *          encode: function(string): string=,
   *          decode: function(string): string
   *        }=} cookieTransformFunction
   * @return {ima.router.Response} This response.
   */
  init(response, cookieTransformFunction = {}) {
    this._cookieTransformFunction = Object.assign(
      this._cookieTransformFunction,
      cookieTransformFunction
    );
    this._response = response;
    this._isSent = false;
    this._status = 500;
    this._content = '';
    this._pageState = {};
    this._internalCookieStorage = new Map();

    return this;
  }

  /**
   * Redirects the client to the specified location, with the specified
   * redirect HTTP response code.
   *
   * For full list of HTTP response status codes see
   * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
   *
   * Use this method only at the server side.
   *
   * @param {string} url The URL to which the client should be redirected.
   * @param {number=} [status=302] The HTTP status code to send to the
   *        client.
   * @return {Response} This response.
   */
  redirect(url, status = 302) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.url = url;

        throw new GenericError(
          'ima.router.Response:redirect The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._isSent = true;
    this._status = status;
    this._setCookieHeaders();
    this._response.redirect(status, url);

    return this;
  }

  /**
   * Sets the HTTP status code that will be sent to the client when the
   * response is sent.
   *
   * For full list of available response codes see
   * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
   *
   * Use this method only at the server side.
   *
   * @param {number} httpStatus HTTP response status code to send to the
   *        client.
   * @return {Response} This response.
   */
  status(httpStatus) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();

        throw new GenericError(
          'ima.router.Response:status The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._status = httpStatus;
    this._response.status(httpStatus);

    return this;
  }

  /**
   * Sends the response to the client with the provided content. Use this
   * method only at the server side.
   *
   * @param {string} content The response body.
   * @return {Response} This response.
   */
  send(content) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.content = content;

        throw new GenericError(
          'ima.router.Response:send The response has already been ' +
            'sent. Check your workflow.',
          params
        );
      }
    }

    this._isSent = true;
    this._content = content;
    this._setCookieHeaders();
    this._response.send(content);

    return this;
  }

  /**
   * Sets the rendered page state.
   *
   * @param {Object<string, *>} pageState The rendered page state.
   * @return {Response} This response.
   */
  setPageState(pageState) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.pageState = pageState;

        throw new GenericError(
          'ima.router.Response:setState The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    this._pageState = pageState;

    return this;
  }

  /**
   * Sets a cookie, which will be sent to the client with the response.
   *
   * @param {string} name The cookie name.
   * @param {(boolean|number|string)} value The cookie value, will be
   *        converted to string.
   * @param {{domain: string=, expires: (number|string)=, maxAge: number=}}
   *        options Cookie attributes. Only the attributes listed in the type
   *        annotation of this field are supported. For documentation and full
   *        list of cookie attributes
   *        see http://tools.ietf.org/html/rfc2965#page-5
   * @return {Response} This response.
   */
  setCookie(name, value, options = {}) {
    if ($Debug) {
      if (this._isSent === true) {
        let params = this.getResponseParams();
        params.name = name;
        params.value = value;
        params.options = options;

        throw new GenericError(
          'ima.router.Response:setCookie The response has already ' +
            'been sent. Check your workflow.',
          params
        );
      }
    }

    let advancedOptions = Object.assign(
      {},
      this._cookieTransformFunction,
      options
    );

    this._internalCookieStorage.set(name, {
      value,
      options: advancedOptions
    });

    return this;
  }

  /**
   * Return object which contains response status, content and rendered
   * page state.
   *
   * @return {{status: number, content: string, pageState: Object<string, *>}}
   */
  getResponseParams() {
    return {
      status: this._status,
      content: this._content,
      pageState: this._pageState
    };
  }

  /**
   * Return true if response is sent from server to client.
   *
   * @return {boolean}
   */
  isResponseSent() {
    return this._isSent;
  }

  /**
   * Set cookie headers for response.
   */
  _setCookieHeaders() {
    for (let [name, param] of this._internalCookieStorage) {
      let options = this._prepareCookieOptionsForExpress(param.options);
      this._response.cookie(name, param.value, options);
    }
  }

  /**
   * Prepares cookie options for Express.
   *
   * @param {{domain: string=, expires: (number|string)=, maxAge: number=}}
   *        options Cookie attributes. Only the attributes listed in the type
   *        annotation of this field are supported. For documentation and full
   *        list of cookie attributes
   *        see http://tools.ietf.org/html/rfc2965#page-5
   * @return {Object} Cookie options prepared for Express.
   */
  _prepareCookieOptionsForExpress(options) {
    let expressOptions = Object.assign({}, options);

    if (typeof expressOptions.maxAge === 'number') {
      expressOptions.maxAge *= 1000;
    } else {
      delete expressOptions.maxAge;
    }

    return expressOptions;
  }
}

// @server-side class ServerRouter extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerRouter;

/**
 * The server-side implementation of the {@codelink Router} interface.
 */
class ServerRouter extends AbstractRouter {
  static get $dependencies() {
    return [PageManager, RouteFactory, Dispatcher, Request, Response];
  }

  /**
   * Initializes the router.
   *
   * @param {PageManager} pageManager The current page manager.
   * @param {RouteFactory} factory The router factory used to create routes.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Request} request The current HTTP request.
   * @param {Response} response The current HTTP response.
   */
  constructor(pageManager, factory, dispatcher, request, response) {
    super(pageManager, factory, dispatcher);

    /**
     * The current HTTP request.
     *
     * @type {Request}
     */
    this._request = request;

    /**
     * The current HTTP response.
     *
     * @type {Response}
     */
    this._response = response;
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return this._extractRoutePath(this._request.getPath());
  }

  /**
   * @inheritdoc
   */
  listen() {
    return this;
  }

  /**
   * @inheritdoc
   */
  redirect(url = '/', options = {}) {
    this._response.redirect(url, options.httpStatus || 302);
  }
}

/**
 * The {@codelink Storage} is an unordered collection of named values of any
 * type. Values in the storage are named using {@code string} keys. The storage
 * can be therefore thought of as a {@code Map<string, *>}.
 *
 * @interface
 */
class Storage {
  /**
   * This method is used to finalize the initialization of the storage after
   * the dependencies provided through the constructor have been prepared for
   * use.
   *
   * This method must be invoked only once and it must be the first method
   * invoked on this instance.
   *
   * @return {Storage} This storage.
   */
  init() {}

  /**
   * Returns {@code true} if the entry identified by the specified key exists
   * in this storage.
   *
   * @param {string} key The key identifying the storage entry.
   * @return {boolean} {@code true} if the storage entry exists.
   */
  has() {}

  /**
   * Retrieves the value of the entry identified by the specified . The
   * method returns {@code undefined} if the entry does not exists.
   *
   * Entries set to the {@code undefined} value can be tested for existence
   * using the {@codelink has} method.
   *
   * @param {string} key The key identifying the storage entry.
   * @return {*} The value of the storage entry.
   */
  get() {}

  /**
   * Sets the storage entry identified by the specified key to the provided
   * value. The method creates the entry if it does not exist already.
   *
   * @param {string} key The key identifying the storage entry.
   * @param {*} value The storage entry value.
   * @return {Storage} This storage.
   */
  set() {}

  /**
   * Deletes the entry identified by the specified key from this storage.
   *
   * @param {string} key The key identifying the storage entry.
   * @return {Storage} This storage.
   */
  delete() {}

  /**
   * Clears the storage of all entries.
   *
   * @return {Storage} This storage.
   */
  clear() {}

  /**
   * Returns an iterator for traversing the keys in this storage. The order
   * in which the keys are traversed is undefined.
   *
   * @return {Iterator<string>} An iterator for traversing the keys in this
   *         storage. The iterator also implements the iterable protocol,
   *         returning itself as its own iterator, allowing it to be used in
   *         a {@code for..of} loop.
   */
  keys() {}

  /**
   * Returns the number of entries in this storage.
   *
   * @return {number} The number of entries in this storage.
   */
  size() {}
}

/**
 * Implementation of the {@codelink Storage} interface that relies on the
 * native {@code Map} for storage.
 */
class MapStorage extends Storage {
  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the map storage.
   */
  constructor() {
    super();

    /**
     * The internal storage of entries.
     *
     * @protected
     * @type {Map<string, *>}
     */
    this._storage = new Map();
  }

  /**
   * @inheritdoc
   */
  init() {
    return this;
  }

  /**
   * @inheritdoc
   */
  has(key) {
    return this._storage.has(key);
  }

  /**
   * @inheritdoc
   */
  get(key) {
    return this._storage.get(key);
  }

  /**
   * @inheritdoc
   */
  set(key, value) {
    this._storage.set(key, value);
    return this;
  }

  /**
   * @inheritdoc
   */
  delete(key) {
    this._storage.delete(key);
    return this;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._storage.clear();
    return this;
  }

  /**
   * @inheritdoc
   */
  keys() {
    return this._storage.keys();
  }

  /**
   * @override
   */
  size() {
    return this._storage.size;
  }
}

/**
 * Implementation note: This is the largest possible safe value that has been
 * tested, used to represent "infinity".
 *
 * @const
 * @type {Date}
 */
const MAX_EXPIRE_DATE = new Date('Sat Sep 13 275760 00:00:00 GMT+0000 (UTC)');

/**
 * Separator used to separate cookie declarations in the {@code Cookie} HTTP
 * header or the return value of the {@code document.cookie} property.
 *
 * @const
 * @type {string}
 */
const COOKIE_SEPARATOR = '; ';

/**
 * Storage of cookies, mirroring the cookies to the current request / response
 * at the server side and the {@code document.cookie} property at the client
 * side. The storage caches the cookies internally.
 */
class CookieStorage extends MapStorage {
  static get $dependencies() {
    return [Window, Request, Response];
  }

  /**
   * Initializes the cookie storage.
   *
   * @param {Window} window The window utility.
   * @param {Request} request The current HTTP request.
   * @param {Response} response The current HTTP response.
   * @example
   *      cookie.set('cookie', 'value', { expires: 10 }); // cookie expires
   *                                                      // after 10s
   *      cookie.set('cookie'); // delete cookie
   *
   */
  constructor(window, request, response) {
    super();

    /**
     * The window utility used to determine whether the IMA is being run
     * at the client or at the server.
     *
     * @type {Window}
     */
    this._window = window;

    /**
     * The current HTTP request. This field is used at the server side.
     *
     * @type {Request}
     */
    this._request = request;

    /**
     * The current HTTP response. This field is used at the server side.
     *
     * @type {Response}
     */
    this._response = response;

    /**
     * The overriding cookie attribute values.
     *
     * @type {{
     *         path: string,
     *         secure: boolean,
     *         httpOnly: boolean,
     *         domain: string,
     *         expires: ?(number|Date),
     *         maxAge: ?number
     *       }}
     */
    this._options = {
      path: '/',
      expires: null,
      maxAge: null,
      secure: false,
      httpOnly: false,
      domain: ''
    };

    /**
     * Transform encode and decode functions for cookie value.
     *
     * @type {{
     *         encode: function(string): string,
     *         decode: function(string): string
     *       }}
     */
    this._transformFunction = {
      encode: value => value,
      decode: value => value
    };
  }

  /**
   * @inheritdoc
   * @param {{
   *          path: string=,
   *          secure: boolean=,
   *          httpOnly: boolean=,
   *          domain: string=,
   *          expires: ?(number|Date)=,
   *          maxAge: ?number=
   *        }} options
   * @param {{
   *          encode: function(string): string=,
   *          decode: function(string): string=
   *        }} transformFunction
   */
  init(options = {}, transformFunction = {}) {
    this._transformFunction = Object.assign(
      this._transformFunction,
      transformFunction
    );
    this._options = Object.assign(this._options, options);
    this._parse();

    return this;
  }

  /**
   * @inheritdoc
   */
  has(name) {
    return super.has(name);
  }

  /**
   * @inheritdoc
   */
  get(name) {
    if (super.has(name)) {
      return super.get(name).value;
    } else {
      return undefined;
    }
  }

  /**
   * @inheritdoc
   * @param {string} name The key identifying the storage entry.
   * @param {*} value The storage entry value.
   * @param {{
   *          maxAge: number=,
   *          expires: (string|Date)=,
   *          domain: string=,
   *          path: string=,
   *          httpOnly: boolean=,
   *          secure: boolean=
   *        }=} options The cookie options. The {@code maxAge} is the maximum
   *        age in seconds of the cookie before it will be deleted, the
   *        {@code expires} is an alternative to that, specifying the moment
   *        at which the cookie will be discarded. The {@code domain} and
   *        {@code path} specify the cookie's domain and path. The
   *        {@code httpOnly} and {@code secure} flags set the flags of the
   *        same name of the cookie.
   */
  set(name, value, options = {}) {
    options = Object.assign({}, this._options, options);

    if (value === undefined) {
      // Deletes the cookie
      options.maxAge = 0;
      options.expires = this._getExpirationAsDate(-1);
    } else {
      this._recomputeCookieMaxAgeAndExpires(options);
    }

    value = this._sanitizeCookieValue(value + '');

    if (this._window.isClient()) {
      document.cookie = this._generateCookieString(name, value, options);
    } else {
      this._response.setCookie(name, value, options);
    }
    super.set(name, { value, options });

    return this;
  }

  /**
   * Deletes the cookie identified by the specified name.
   *
   * @param {string} name Name identifying the cookie.
   * @param {{
   *          domain: string=,
   *          path: string=,
   *          httpOnly: boolean=,
   *          secure: boolean=
   *        }=} options The cookie options. The {@code domain} and
   *        {@code path} specify the cookie's domain and path. The
   *        {@code httpOnly} and {@code secure} flags set the flags of the
   *        same name of the cookie.
   * @return {Storage} This storage.
   */
  delete(name, options = {}) {
    if (this.has(name)) {
      this.set(name, undefined, options);
      super.delete(name);
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  clear() {
    for (let cookieName of super.keys()) {
      this.delete(cookieName);
    }

    return super.clear();
  }

  /**
   * @inheritdoc
   */
  keys() {
    return super.keys();
  }

  /**
   * @inheritdoc
   */
  size() {
    return super.size();
  }

  /**
   * Returns all cookies in this storage serialized to a string compatible
   * with the {@code Cookie} HTTP header.
   *
   * @return {string} All cookies in this storage serialized to a string
   *         compatible with the {@code Cookie} HTTP header.
   */
  getCookiesStringForCookieHeader() {
    let cookieStrings = [];

    for (let cookieName of super.keys()) {
      let cookieItem = super.get(cookieName);

      cookieStrings.push(
        this._generateCookieString(cookieName, cookieItem.value, {})
      );
    }

    return cookieStrings.join(COOKIE_SEPARATOR);
  }

  /**
   * Parses cookies from the provided {@code Set-Cookie} HTTP header value.
   *
   * The parsed cookies will be set to the internal storage, and the current
   * HTTP response (via the {@code Set-Cookie} HTTP header) if at the server
   * side, or the browser (via the {@code document.cookie} property).
   *
   * @param {string} setCookieHeader The value of the {@code Set-Cookie} HTTP
   *        header.
   */
  parseFromSetCookieHeader(setCookieHeader) {
    let cookie = this._extractCookie(setCookieHeader);

    if (cookie.name !== null) {
      this.set(cookie.name, cookie.value, cookie.options);
    }
  }

  /**
   * Parses cookies from a cookie string and sets the parsed cookies to the
   * internal storage.
   *
   * The method obtains the cookie string from the request's {@code Cookie}
   * HTTP header when used at the server side, and the {@code document.cookie}
   * property at the client side.
   */
  _parse() {
    let cookiesString = this._window.isClient()
      ? document.cookie
      : this._request.getCookieHeader();
    let cookiesArray = cookiesString
      ? cookiesString.split(COOKIE_SEPARATOR)
      : [];

    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = this._extractCookie(cookiesArray[i]);

      if (cookie.name !== null) {
        cookie.options = Object.assign({}, this._options, cookie.options);

        super.set(cookie.name, {
          value: this._sanitizeCookieValue(cookie.value),
          options: cookie.options
        });
      }
    }
  }

  /**
   * Creates a copy of the provided word (or text) that has its first
   * character converted to lower case.
   *
   * @param {string} word The word (or any text) that should have its first
   *        character converted to lower case.
   * @return {string} A copy of the provided string with its first character
   *         converted to lower case.
   */
  _firstLetterToLowerCase(word) {
    return word.charAt(0).toLowerCase() + word.substring(1);
  }

  /**
   * Generates a string representing the specified cookied, usable either
   * with the {@code document.cookie} property or the {@code Set-Cookie} HTTP
   * header.
   *
   * (Note that the {@code Cookie} HTTP header uses a slightly different
   * syntax.)
   *
   * @param {string} name The cookie name.
   * @param {(boolean|number|string)} value The cookie value, will be
   *        converted to string.
   * @param {{
   *          path: string=,
   *          domain: string=,
   *          expires: Date=,
   *          maxAge: Number=,
   *          secure: boolean=
   *        }} options Cookie attributes. Only the attributes listed in the
   *        type annotation of this field are supported. For documentation
   *        and full list of cookie attributes see
   *        http://tools.ietf.org/html/rfc2965#page-5
   * @return {string} A string representing the cookie. Setting this string
   *         to the {@code document.cookie} property will set the cookie to
   *         the browser's cookie storage.
   */
  _generateCookieString(name, value, options) {
    let cookieString = name + '=' + this._transformFunction.encode(value);

    cookieString += options.domain ? ';Domain=' + options.domain : '';
    cookieString += options.path ? ';Path=' + options.path : '';
    cookieString += options.expires
      ? ';Expires=' + options.expires.toUTCString()
      : '';
    cookieString += options.maxAge ? ';Max-Age=' + options.maxAge : '';
    cookieString += options.httpOnly ? ';HttpOnly' : '';
    cookieString += options.secure ? ';Secure' : '';

    return cookieString;
  }

  /**
   * Converts the provided cookie expiration to a {@code Date} instance.
   *
   * @param {(number|string|Date)} expiration Cookie expiration in seconds
   *        from now, or as a string compatible with the {@code Date}
   *        constructor.
   * @return {Date} Cookie expiration as a {@code Date} instance.
   */
  _getExpirationAsDate(expiration) {
    if (expiration instanceof Date) {
      return expiration;
    }

    if (typeof expiration === 'number') {
      return expiration === Infinity
        ? MAX_EXPIRE_DATE
        : new Date(Date.now() + expiration * 1000);
    }

    return expiration ? new Date(expiration) : MAX_EXPIRE_DATE;
  }

  /**
   * Extract cookie name, value and options from cookie string.
   *
   * @param {string} cookieString The value of the {@code Set-Cookie} HTTP
   *        header.
   * @return {{
   *           name: ?string,
   *           value: ?string,
   *           options: Object<string, (boolean|Date)>
   *         }}
   */
  _extractCookie(cookieString) {
    let cookieOptions = {};
    let cookieName = null;
    let cookieValue = null;

    let cookiePairs = cookieString.split(COOKIE_SEPARATOR.trim());

    cookiePairs.forEach((pair, index) => {
      let [name, value] = this._extractNameAndValue(pair, index);

      if (index === 0) {
        cookieName = name;
        cookieValue = value;
      } else {
        cookieOptions[name] = value;
      }
    });

    return {
      name: cookieName,
      value: cookieValue,
      options: cookieOptions
    };
  }

  /**
   * Extract name and value for defined pair and pair index.
   *
   * @param {string} pair
   * @param {number} pairIndex
   * @return {Array<?(boolean|string|Date)>}
   */
  _extractNameAndValue(pair, pairIndex) {
    let separatorIndexEqual = pair.indexOf('=');
    let name = '';
    let value = null;

    if (pairIndex === 0 && separatorIndexEqual < 0) {
      return [null, null];
    }

    if (separatorIndexEqual < 0) {
      name = pair.trim();
      value = true;
    } else {
      name = pair.substring(0, separatorIndexEqual).trim();

      value = this._transformFunction.decode(
        pair.substring(separatorIndexEqual + 1).trim()
      );

      // erase quoted values
      if ('"' === value[0]) {
        value = value.slice(1, -1);
      }

      if (name === 'Expires') {
        value = this._getExpirationAsDate(value);
      }

      if (name === 'Max-Age') {
        name = 'maxAge';
        value = parseInt(value, 10);
      }
    }

    if (pairIndex !== 0) {
      name = this._firstLetterToLowerCase(name);
    }

    return [name, value];
  }

  /**
   * Sanitize cookie value by rules in
   * (@see http://tools.ietf.org/html/rfc6265#section-4r.1.1). Erase all
   * invalid characters from cookie value.
   *
   * @param {string} value Cookie value
   * @return {string} Sanitized value
   */
  _sanitizeCookieValue(value) {
    let sanitizedValue = '';

    for (let keyChar = 0; keyChar < value.length; keyChar++) {
      let charCode = value.charCodeAt(keyChar);
      let char = value[keyChar];

      let isValid =
        charCode >= 33 &&
        charCode <= 126 &&
        char !== '"' &&
        char !== ';' &&
        char !== '\\';
      if (isValid) {
        sanitizedValue += char;
      } else {
        if ($Debug) {
          throw new GenericError(
            `Invalid char ${char} code ${charCode} in ${value}. ` +
              `Dropping the invalid character from the cookie's ` +
              `value.`,
            { value, charCode, char }
          );
        }
      }
    }

    return sanitizedValue;
  }

  /**
   * Recomputes cookie's attributes maxAge and expires between each other.
   *
   * @param {{
   *          path: string=,
   *          domain: string=,
   *          expires: Date=,
   *          maxAge: Number=,
   *          secure: boolean=
   *        }} options Cookie attributes. Only the attributes listed in the
   *        type annotation of this field are supported. For documentation
   *        and full list of cookie attributes see
   *        http://tools.ietf.org/html/rfc2965#page-5
   */
  _recomputeCookieMaxAgeAndExpires(options) {
    if (options.maxAge || options.expires) {
      options.expires = this._getExpirationAsDate(
        options.maxAge || options.expires
      );
    }

    if (!options.maxAge && options.expires) {
      options.maxAge = Math.floor(
        (options.expires.valueOf() - Date.now()) / 1000
      );
    }
  }
}

/**
 * Implementation of the {@codelink Storage} interface that relies on the
 * native {@code sessionStorage} DOM storage for storing its entries.
 */
class SessionStorage extends Storage {
  static get $dependencies() {
    return [Window];
  }

  /**
   * Initializes the session storage.
   * @param {Window} window
   */
  constructor(window) {
    super();

    /**
     * The DOM storage providing the actual storage of the entries.
     *
     * @type {Storage}
     */
    this._storage = window.getWindow().sessionStorage;
  }

  /**
   * @inheritdoc
   */
  init() {
    return this;
  }

  /**
   * @inheritdoc
   */
  has(key) {
    return !!this._storage.getItem(key);
  }

  /**
   * @inheritdoc
   */
  get(key) {
    try {
      return JSON.parse(this._storage.getItem(key)).value;
    } catch (error) {
      throw new GenericError(
        'ima.storage.SessionStorage.get: Failed to parse a session ' +
          `storage item value identified by the key ${key}: ` +
          error.message
      );
    }
  }

  /**
   * @inheritdoc
   */
  set(key, value) {
    try {
      this._storage.setItem(
        key,
        JSON.stringify({
          created: Date.now(),
          value
        })
      );
    } catch (error) {
      let storage = this._storage;
      let isItemTooBig =
        storage.length === 0 ||
        (storage.length === 1 && storage.key(0) === key);

      if (isItemTooBig) {
        throw error;
      }

      this._deleteOldestEntry();
      this.set(key, value);
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  delete(key) {
    this._storage.removeItem(key);
    return this;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._storage.clear();
    return this;
  }

  /**
   * @inheritdoc
   */
  keys() {
    return new StorageIterator(this._storage);
  }

  /**
   * @override
   */
  size() {
    return this._storage.length;
  }

  /**
   * Deletes the oldest entry in this storage.
   */
  _deleteOldestEntry() {
    let oldestEntry = {
      key: null,
      created: Date.now() + 1
    };

    for (let key of this.keys()) {
      let value = JSON.parse(this._storage.getItem(key));
      if (value.created < oldestEntry.created) {
        oldestEntry = {
          key,
          created: value.created
        };
      }
    }

    if (typeof oldestEntry.key === 'string') {
      this.delete(oldestEntry.key);
    }
  }
}

/**
 * Implementation of the iterator protocol and the iterable protocol for DOM
 * storage keys.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
 */
class StorageIterator {
  /**
   * Initializes the DOM storage iterator.
   *
   * @param {Storage} storage The DOM storage to iterate through.
   */
  constructor(storage) {
    /**
     * The DOM storage being iterated.
     *
     * @type {Storage}
     */
    this._storage = storage;

    /**
     * The current index of the DOM storage key this iterator will return
     * next.
     *
     * @type {number}
     */
    this._currentKeyIndex = 0;
  }

  /**
   * Iterates to the next item. This method implements the iterator protocol.
   *
   * @return {{done: boolean, value: (undefined|string)}} The next value in
   *         the sequence and whether the iterator is done iterating through
   *         the values.
   */
  next() {
    if (this._currentKeyIndex >= this._storage.length) {
      return {
        done: true,
        value: undefined
      };
    }

    let key = this._storage.key(this._currentKeyIndex);
    this._currentKeyIndex++;

    return {
      done: false,
      value: key
    };
  }

  /**
   * Returns the iterator for this object (this iterator). This method
   * implements the iterable protocol and provides compatibility with the
   * {@code for..of} loops.
   *
   * @return {StorageIterator} This iterator.
   */
  [Symbol.iterator]() {
    return this;
  }
}

/**
 * The {@codelink SessionMap} storage is an implementation of the
 * {@codelink Storage} interface acting as a synchronization proxy between
 * the underlying map storage and the {@code sessionStorage} DOM storage.
 */
class SessionMapStorage extends Storage {
  static get $dependencies() {
    return [MapStorage, SessionStorage];
  }

  /**
   * Initializes the storage.
   *
   * @param {MapStorage} map The map storage to use.
   * @param {SessionStorage} session The session storage to use.
   */
  constructor(map, session) {
    super();

    /**
     * The map storage, synced with the session storage.
     *
     * @type {MapStorage}
     */
    this._map = map;

    /**
     * The session storage, synced with the map storage.
     *
     * @type {SessionStorage}
     */
    this._session = session;
  }

  /**
   * @inheritdoc
   */
  init() {
    this._map.clear();
    for (let key of this._session.keys()) {
      this._map.set(key, this._session[key]);
    }

    return this;
  }

  /**
   * @inheritdoc
   */
  has(key) {
    return this._map.has(key);
  }

  /**
   * @inheritdoc
   */
  get(key) {
    return this._map.get(key);
  }

  /**
   * @inheritdoc
   */
  set(key, value) {
    let canBeSerializedToJSON =
      !(value instanceof Promise) &&
      (!(value instanceof CacheEntry) ||
        !(value.getValue() instanceof Promise));
    if (canBeSerializedToJSON) {
      this._session.set(key, value);
    }

    this._map.set(key, value);
    return this;
  }

  /**
   * @inheritdoc
   */
  delete(key) {
    this._session.delete(key);
    this._map.delete(key);
    return this;
  }

  /**
   * @inheritdoc
   */
  clear() {
    this._session.clear();
    this._map.clear();
    return this;
  }

  /**
   * @inheritdoc
   */
  keys() {
    return this._map.keys();
  }

  /**
   * @override
   */
  size() {
    return this._map.size();
  }
}

/**
 * A specialization of the {@codelink MapStorage} storage mimicking the native
 * {@code WeakMap} using its internal garbage collector used once the size of
 * the storage reaches the configured threshold.
 */
class WeakMapStorage extends MapStorage {
  /**
   * Initializes the storage.
   *
   * @param {{entryTtl: number}} config Weak map storage configuration. The
   *        fields have the following meaning:
   *        - entryTtl The time-to-live of a storage entry in milliseconds.
   */
  constructor(config) {
    super();

    /**
     * The time-to-live of a storage entry in milliseconds.
     *
     * @type {number}
     */
    this._entryTtl = config.entryTtl;
  }

  /**
   * @inheritdoc
   */
  has(key) {
    this._discardExpiredEntries();

    return super.has(key);
  }

  /**
   * @inheritdoc
   */
  get(key) {
    this._discardExpiredEntries();

    if (!super.has(key)) {
      return undefined;
    }

    return super.get(key).target;
  }

  /**
   * @inheritdoc
   */
  set(key, value) {
    this._discardExpiredEntries();

    return super.set(key, new WeakRef(value, this._entryTtl));
  }

  /**
   * @inheritdoc
   */
  delete(key) {
    this._discardExpiredEntries();

    return super.delete(key);
  }

  /**
   * @inheritdoc
   */
  keys() {
    this._discardExpiredEntries();

    return super.keys();
  }

  /**
   * @inheritdoc
   */
  size() {
    this._discardExpiredEntries();

    return super.size();
  }

  /**
   * Deletes all expired entries from this storage.
   */
  _discardExpiredEntries() {
    for (let key of super.keys()) {
      let targetReference = super.get(key);
      if (!targetReference.target) {
        // the reference has died
        super.delete(key);
      }
    }
  }
}

/**
 * A simple reference wrapper that emulates a weak reference. We seem to have
 * no other option, since WeakMap and WeakSet are not enumerable (so what is
 * the point of WeakMap and WeakSet if you still need to manage the keys?!) and
 * there is no native way to create a weak reference.
 */
class WeakRef {
  /**
   * Initializes the weak reference to the target reference.
   *
   * @param {Object} target The target reference that should be referenced by
   *        this weak reference.
   * @param {number} ttl The maximum number of milliseconds the weak
   *        reference should be kept. The reference will be discarded once
   *        ACCESSED after the specified timeout.
   */
  constructor(target, ttl) {
    if ($Debug) {
      if (!(target instanceof Object)) {
        throw new TypeError(
          'The target reference must point to an object, ' +
            'primitive values are not allowed'
        );
      }
      if (ttl <= 0) {
        throw new Error('The time-to-live must be positive');
      }
    }

    /**
     * The actual target reference, or {@code null} if the reference has
     * been already discarded.
     *
     * @type {?Object}
     */
    this._reference = target;

    /**
     * The UNIX timestamp with millisecond precision marking the moment at
     * or after which the reference will be discarded.
     *
     * @type {number}
     */
    this._expiration = Date.now() + ttl;
  }

  /**
   * Returns the target reference, provided that the target reference is
   * still alive. Returns {@code null} if the reference has been discarded.
   *
   * @return {?Object} The target reference, or {@code null} if the reference
   *         has been discarded by the garbage collector.
   */
  get target() {
    if (this._reference && Date.now() >= this._expiration) {
      this._reference = null; // let the GC do its job
    }

    return this._reference;
  }
}

// @client-side

/**
 * Client-side implementation of the {@code Window} utility API.
 */
class ClientWindow extends Window {
  static get $dependencies() {
    return [];
  }

  /**
   * @inheritdoc
   */
  isClient() {
    return true;
  }

  /**
   * @inheritdoc
   */
  isCookieEnabled() {
    return navigator.cookieEnabled;
  }

  /**
   * @inheritdoc
   */
  hasSessionStorage() {
    try {
      if (window.sessionStorage) {
        let sessionKey = 'IMA.jsTest';

        sessionStorage.setItem(sessionKey, 1);
        sessionStorage.removeItem(sessionKey);

        return true;
      }
    } catch (error) {
      if ($Debug) {
        console.warn('Session Storage is not accessible!', error);
      }
      return false;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  setTitle(title) {
    document.title = title;
  }

  /**
   * @inheritdoc
   */
  getWindow() {
    return window;
  }

  /**
   * @inheritdoc
   */
  getDocument() {
    return document;
  }

  /**
   * @inheritdoc
   */
  getScrollX() {
    let { pageXOffset } = window;
    let pageOffsetSupported = pageXOffset !== undefined;
    let isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

    return pageOffsetSupported
      ? pageXOffset
      : isCSS1Compatible
      ? document.documentElement.scrollLeft
      : document.body.scrollLeft;
  }

  /**
   * @inheritdoc
   */
  getScrollY() {
    let { pageYOffset } = window;
    let pageOffsetSupported = pageYOffset !== undefined;
    let isCSS1Compatible = (document.compatMode || '') === 'CSS1Compat';

    return pageOffsetSupported
      ? pageYOffset
      : isCSS1Compatible
      ? document.documentElement.scrollTop
      : document.body.scrollTop;
  }

  /**
   * @inheritdoc
   */
  scrollTo(x, y) {
    window.scrollTo(x, y);
  }

  /**
   * @inheritdoc
   */
  getDomain() {
    return window.location.protocol + '//' + window.location.host;
  }

  /**
   * @inheritdoc
   */
  getHost() {
    return window.location.host;
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return window.location.pathname + window.location.search;
  }

  /**
   * @inheritdoc
   */
  getUrl() {
    return window.location.href;
  }

  /**
   * @inheritdoc
   */
  getBody() {
    return document.body;
  }

  /**
   * @inheritdoc
   */
  getElementById(id) {
    return document.getElementById(id);
  }

  /**
   * @inheritdoc
   */
  getHistoryState() {
    return window.history.state;
  }

  /**
   * @inheritdoc
   */
  querySelector(selector) {
    return document.querySelector(selector);
  }

  /**
   * @inheritdoc
   */
  querySelectorAll(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * @inheritdoc
   */
  redirect(url) {
    window.location.href = url;
  }

  /**
   * @inheritdoc
   */
  pushState(state, title, url = null) {
    if (window.history.pushState) {
      window.history.pushState(state, title, url);
    }
  }

  /**
   * @inheritdoc
   */
  replaceState(state, title, url = null) {
    if (window.history.replaceState) {
      window.history.replaceState(state, title, url);
    }
  }

  /**
   * @inheritdoc
   */
  createCustomEvent(name, options) {
    return new CustomEvent(name, options);
  }

  /**
   * @inheritdoc
   */
  bindEventListener(eventTarget, event, listener, useCapture = false) {
    if (eventTarget.addEventListener) {
      eventTarget.addEventListener(event, listener, useCapture);
    }
  }

  /**
   * @inheritdoc
   */
  unbindEventListener(eventTarget, event, listener, useCapture = false) {
    if (eventTarget.removeEventListener) {
      eventTarget.removeEventListener(event, listener, useCapture);
    }
  }
}

// @server-side class ServerWindow extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerWindow;

/**
 * Server-side implementation of the {@code Window} utility API.
 */
class ServerWindow extends Window {
  static get $dependencies() {
    return [];
  }

  /**
   * @inheritdoc
   */
  isClient() {
    return false;
  }

  /**
   * @inheritdoc
   */
  isCookieEnabled() {
    return false;
  }

  /**
   * @inheritdoc
   */
  hasSessionStorage() {
    return false;
  }

  /**
   * @inheritdoc
   */
  setTitle() {}

  /**
   * @inheritdoc
   */
  getWindow() {
    return undefined;
  }

  /**
   * @inheritdoc
   */
  getDocument() {
    return undefined;
  }

  /**
   * @inheritdoc
   */
  getScrollX() {
    return 0;
  }

  /**
   * @inheritdoc
   */
  getScrollY() {
    return 0;
  }

  /**
   * @inheritdoc
   */
  scrollTo() {}

  /**
   * @inheritdoc
   */
  getDomain() {
    return '';
  }

  /**
   * @inheritdoc
   */
  getHost() {
    return '';
  }

  /**
   * @inheritdoc
   */
  getPath() {
    return '';
  }

  /**
   * @inheritdoc
   */
  getUrl() {
    return '';
  }

  /**
   * @inheritdoc
   */
  getBody() {
    return undefined;
  }

  /**
   * @inheritdoc
   */
  getElementById() {
    return null;
  }

  /**
   * @inheritdoc
   */
  getHistoryState() {
    return {};
  }

  /**
   * @inheritdoc
   */
  querySelector() {
    return null;
  }

  /**
   * @inheritdoc
   */
  querySelectorAll() {
    class DummyNodeList {
      constructor() {
        this.length = 0;
      }

      item() {
        return null;
      }
    }

    return new DummyNodeList();
  }

  /**
   * @inheritdoc
   */
  redirect() {}

  /**
   * @inheritdoc
   */
  pushState() {}

  /**
   * @inheritdoc
   */
  replaceState() {}

  /**
   * @inheritdoc
   */
  createCustomEvent(name, options) {
    let dummyCustomEvent = { initCustomEvent: () => {}, detail: {} };

    return Object.assign(dummyCustomEvent, options);
  }

  /**
   * @inheritdoc
   */
  bindEventListener() {}

  /**
   * @inheritdoc
   */
  unbindEventListener() {}
}

var initBindIma = (ns, oc, config) => {
  //**************START VENDORS**************
  oc.constant('$Helper', vendorLinker.get('ima-helpers', true));

  //React
  oc.constant('$React', vendorLinker.get('react', true));
  oc.constant('$ReactDOM', vendorLinker.get('react-dom', true));
  oc.constant('$ReactDOMServer', vendorLinker.get('react-dom/server.js', true));
  //*************END VENDORS*****************

  //*************START CONSTANTS*****************
  oc.constant('$Settings', config);
  oc.constant('$Env', config.$Env);
  oc.constant('$Protocol', config.$Protocol);
  oc.constant('$Secure', config.$Protocol === 'https:');
  //*************END CONSTANTS*****************

  //*************START IMA**************

  //Request & Response
  oc.bind('$Request', Request);
  oc.bind('$Response', Response);

  //Window helper
  if (typeof window !== 'undefined' && window !== null) {
    oc.provide(Window, ClientWindow);
  } else {
    oc.provide(Window, ServerWindow);
  }
  oc.bind('$Window', Window);

  //IMA Error
  oc.bind('$Error', GenericError);

  //Dictionary
  oc.provide(Dictionary, MessageFormatDictionary);
  oc.bind('$Dictionary', Dictionary);

  //Storage
  oc.constant('$CookieTransformFunction', { encode: s => s, decode: s => s });
  oc.bind('$CookieStorage', CookieStorage);
  if (oc.get(Window).hasSessionStorage()) {
    oc.bind('$SessionStorage', SessionStorage);
  } else {
    oc.bind('$SessionStorage', MapStorage);
  }
  oc.bind('$MapStorage', MapStorage);
  oc.inject(WeakMapStorage, [
    {
      entryTtl: 30 * 60 * 1000,
      maxEntries: 1000,
      gcInterval: 60 * 1000,
      gcEntryCountTreshold: 16
    }
  ]);
  oc.bind('$WeakMapStorage', WeakMapStorage);
  oc.bind('$SessionMapStorage', SessionMapStorage);

  // Dispatcher
  oc.provide(Dispatcher, DispatcherImpl);
  oc.bind('$Dispatcher', Dispatcher);

  // Custom Event Bus
  oc.provide(EventBus, EventBusImpl);
  oc.bind('$EventBus', EventBus);

  //Cache
  if (oc.get('$Window').hasSessionStorage()) {
    oc.constant('$CacheStorage', oc.get(SessionMapStorage));
  } else {
    oc.constant('$CacheStorage', oc.get(MapStorage));
  }
  oc.bind('$CacheFactory', CacheFactory);
  oc.provide(Cache, CacheImpl, [
    '$CacheStorage',
    CacheFactory,
    '$Helper',
    config.$Cache
  ]);
  oc.bind('$Cache', Cache);

  //SEO
  oc.provide(MetaManager, MetaManagerImpl);
  oc.bind('$MetaManager', MetaManager);
  oc.bind('$ControllerDecorator', ControllerDecorator);
  oc.bind('$PageStateManagerDecorator', PageStateManagerDecorator);

  // UI components
  oc.bind('$CssClasses', function() {
    return defaultCssClasses;
  });

  //Page
  oc.provide(PageStateManager, PageStateManagerImpl);
  oc.bind('$PageStateManager', PageStateManager);

  oc.inject(PageFactory, [oc]);
  oc.bind('$PageFactory', PageFactory);

  oc.inject(ComponentUtils, [oc]);
  oc.bind('$ComponentUtils', ComponentUtils);

  oc.inject(PageRendererFactory, [ComponentUtils, '$React']);
  oc.bind('$PageRendererFactory', PageRendererFactory);

  if (oc.get(Window).isClient()) {
    oc.provide(PageRenderer, ClientPageRenderer, [
      PageRendererFactory,
      '$Helper',
      '$ReactDOM',
      '$Dispatcher',
      '$Settings',
      Window
    ]);
  } else {
    oc.provide(PageRenderer, ServerPageRenderer, [
      PageRendererFactory,
      '$Helper',
      '$ReactDOMServer',
      '$Dispatcher',
      '$Settings',
      Response,
      Cache
    ]);
  }
  oc.bind('$PageRenderer', PageRenderer);

  if (oc.get(Window).isClient()) {
    oc.bind('$PageHandlerRegistry', PageHandlerRegistry, [
      PageNavigationHandler
    ]);
    oc.provide(PageManager, ClientPageManager);
  } else {
    oc.bind('$PageHandlerRegistry', PageHandlerRegistry, []);
    oc.provide(PageManager, ServerPageManager);
  }
  oc.bind('$PageManager', PageManager);

  //Router
  oc.bind('$RouteFactory', RouteFactory);

  if (oc.get(Window).isClient()) {
    oc.provide(Router, ClientRouter);
  } else {
    oc.provide(Router, ServerRouter);
  }
  oc.bind('$Router', Router);
  oc.constant('$RouteNames', RouteNames);
  oc.constant('$RouterEvents', Events$3);

  //Http agent
  oc.bind('$HttpUrlTransformer', UrlTransformer);
  oc.bind('$HttpAgentProxy', HttpProxy, ['$HttpUrlTransformer', '$Window']);
  oc.provide(HttpAgent, HttpAgentImpl, [
    '$HttpAgentProxy',
    '$Cache',
    CookieStorage,
    config.$Http
  ]);
  oc.bind('$Http', HttpAgent);
  oc.constant('$HttpStatusCode', StatusCode);

  //*************END IMA****************
};

var initServicesIma = (ns, oc, config) => {
  oc.get('$Dictionary').init(config.dictionary);

  oc.get('$Dispatcher').clear();

  if (!oc.get('$Window').isClient()) {
    oc.get('$Request').init(config.request);

    oc.get('$Response').init(
      config.response,
      oc.get('$CookieTransformFunction')
    );

    oc.get('$CookieStorage').clear();

    oc.get('$SessionStorage').clear();

    oc.get('$CacheStorage').clear();
  }

  oc.get('$CookieStorage').init(
    { secure: oc.get('$Secure') },
    oc.get('$CookieTransformFunction')
  );

  oc.get('$SessionStorage').init();

  oc.get('$CacheStorage').init();

  oc.get('$Router').init(config.router);

  oc.get('$PageManager').init();

  oc.get('$PageStateManager').clear();

  oc.get('$HttpUrlTransformer').clear();
};

/**
 * Basic implementation of the {@link Controller} interface, providing the
 * default implementation of the most of the API.
 *
 * @abstract
 * @extends Controller
 */
class AbstractController extends Controller {
  /**
   * Initializes the controller.
   */
  constructor() {
    super();

    /**
     * State manager.
     *
     * @protected
     * @type {PageStateManager}
     */
    this._pageStateManager = null;

    /**
     * The controller's extensions.
     *
     * @type {Extension[]}
     */
    this._extensions = [];

    /**
     * The HTTP response code to send to the client.
     *
     * @type {number}
     */
    this.status = 200;

    /**
     * The route parameters extracted from the current route. This field is
     * set externally by IMA right before the {@link Controller#init} or the
     * {@link Controller#update} method is called.
     *
     * @type {Object<string, string>}
     */
    this.params = {};
  }

  /**
   * @inheritdoc
   */
  init() {}

  /**
   * @inheritdoc
   */
  destroy() {}

  /**
   * @inheritdoc
   */
  activate() {}

  /**
   * @inheritdoc
   */
  deactivate() {}

  /**
   * @inheritdoc
   * @abstract
   */
  load() {
    throw new GenericError(
      'The ima.controller.AbstractController.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritdoc
   */
  update() {
    return {};
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch);
    }
  }

  /**
   * @inheritdoc
   */
  getState() {
    if (this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return {};
    }
  }

  /**
   * @inheritdoc
   */
  addExtension(extension) {
    this._extensions.push(extension);
  }

  /**
   * @inheritdoc
   */
  getExtensions() {
    return this._extensions;
  }

  /**
   * @inheritdoc
   * @abstract
   */
  setMetaParams() {
    throw new GenericError(
      'The ima.controller.AbstractController.setMetaParams method is ' +
        'abstract and must be overridden'
    );
  }

  /**
   * @inheritdoc
   */
  setRouteParams(params = {}) {
    this.params = params;
  }

  /**
   * @inheritdoc
   */
  getRouteParams() {
    return this.params;
  }

  /**
   * @inheritdoc
   */
  setPageStateManager(pageStateManager) {
    this._pageStateManager = pageStateManager;
  }

  /**
   * @inheritdoc
   */
  getHttpStatus() {
    return this.status;
  }
}

/**
 * Extensions provide means of extending the page controllers with additional
 * managed state and logic.
 *
 * An extension has access to the current route parameters, specify the
 * resources to load when the page is loading or being updated, may intercept
 * event bus events and modify the state of the page just like an ordinary
 * controller, except that the modifications are restricted to the state fields
 * which the extension explicitly specifies using its
 * {@link Extension#getAllowedStateKeys} method.
 *
 * All extensions to be used on a page must be added to the current controller
 * before the controller is initialized. After that, the extensions will go
 * through the same lifecycle as the controller.
 *
 * @interface
 */
class Extension {
  /**
   * Callback for initializing the controller extension after the route
   * parameters have been set on this extension.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  init() {}

  /**
   * Finalization callback, called when the controller is being discarded by
   * the application. This usually happens when the user navigates to a
   * different URL.
   *
   * This method is the lifecycle counterpart of the {@link Extension#init}
   * method.
   *
   * The extension should release all resources obtained in the
   * {@link Extension#init} method. The extension must release any resources
   * that might not be released automatically when the extensions's instance
   * is destroyed by the garbage collector.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  destroy() {}

  /**
   * Callback for activating the extension in the UI. This is the last
   * method invoked during controller (and extensions) initialization, called
   * after all the promises returned from the {@link Extension#load} method have
   * been resolved and the controller has configured the meta manager.
   *
   * The extension may register any React and DOM event listeners in this
   * method. The extension may start receiving event bus event after this
   * method completes.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  activate() {}

  /**
   * Callback for deactivating the extension in the UI. This is the first
   * method invoked during extension deinitialization. This usually happens
   * when the user navigates to a different URL.
   *
   * This method is the lifecycle counterpart of the {@link Extension#activate}
   * method.
   *
   * The extension should deregister listeners registered and release all
   * resources obtained in the {@link Extension#activate} method.
   *
   * @return {(Promise<undefined>|undefined)}
   */
  deactivate() {}

  /**
   * Callback the extension uses to request the resources it needs to render
   * its related parts of the view. This method is invoked after the
   * {@link Extension#init} method.
   *
   * The extension should request all resources it needs in this method, and
   * represent each resource request as a promise that will resolve once the
   * resource is ready for use (these can be data fetched over HTTP(S),
   * database connections, etc).
   *
   * The method must return a plain flat object. The field names of the
   * object identify the resources being fetched and prepared, each value
   * must be either the resource (e.g. view configuration or a value
   * retrieved synchronously) or a Promise that will resolve to the resource.
   *
   * The IMA will use the object to set the state of the controller.
   *
   * Any returned promise that gets rejected will redirect the application to
   * the error page. The error page that will be used depends on the status
   * code of the error.
   *
   * @return {(Promise<Object<string, (Promise|*)>>|Object<string, (Promise|*)>)}
   *         A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  load() {}

  /**
   * Callback for updating the extension after a route update. This method
   * is invoked if the current route has the `onlyUpdate` flag set to `true` and
   * the current controller and view match those used by the previously active
   * route, or, the `onlyUpdate` option of the current route is a callback and
   * returned `true`.
   *
   * The method must return an object with the same semantics as the result
   * of the {@link Extension#load} method. The controller's state will then be
   * patched by the returned object.
   *
   * The other extension lifecycle callbacks ({@link Extension#init},
   * {@link Extension#load}, {@link Extension#activate},
   * {@link Extension#deactivate}, {@link Extension#deinit}) are not call in
   * case this method is used.
   *
   * @param {Object<string, string>=} [prevParams={}] Previous route
   *         parameters.
   * @return {(Promise<Object<string, (Promise|*)>>|Object<string, (Promise|*)>)}
   *         A map object of promises resolved when all resources the controller
   *         requires are ready. The resolved values will be pushed to the
   *         controller's state.
   */
  update() {}

  /**
   * Patches the state of the controller using this extension by using the
   * provided object by copying the provided patch object fields to the
   * controller's state object.
   *
   * Note that the state is not patched recursively but by replacing the
   * values of the top-level fields of the state object.
   *
   * Note that the extension may modify only the fields of the state that it
   * has specified by its {@link Extension#getAllowedStateKeys} method.
   *
   * @param {Object<string, *>} statePatch Patch of the controller's state to
   *        apply.
   */
  setState() {}

  /**
   * Returns the current state of the controller using this extension.
   *
   * @return {Object<string, *>} The current state of the controller.
   */
  getState() {}

  /**
   * Patches the partial state of the extension. The extension is able
   * during its load and update phase receive state from active controller
   * using this extension and from previously loaded/updated extensions.
   *
   * @param {Object<string, *>} partialStatePatch Patch of the controller's state to
   *        apply.
   */
  setPartialState() {}

  /**
   * Returns the current partial state of the extension.
   *
   * @return {Object<string, *>} The current partial state of the extension.
   */
  getPartialState() {}

  /**
   * Clears the current partial state of the extension and sets it value to empty object.
   */
  clearPartialState() {}

  /**
   * Sets the state manager used to manage the controller's state..
   *
   * @param {?PageStateManager} pageStateManager The current state manager to
   *        use.
   */
  setPageStateManager() {}

  /**
   * Enables using PageStateManager for getting state.
   */
  switchToStateManager() {}

  /**
   * Disables using PageStateManager for getting state.
   */
  switchToPartialState() {}

  /**
   * Sets the current route parameters. This method is invoked before the
   * {@link Extension#init} method.
   *
   * @param {Object<string, string>} [params={}] The current route
   *        parameters.
   */
  setRouteParams() {}

  /**
   * Returns the current route parameters.
   *
   * @return {Object<string, string>} The current route parameters.
   */
  getRouteParams() {}

  /**
   * Returns the names of the state fields that may be manipulated by this
   * extension. Manipulations of other fields of the state will be ignored.
   *
   * @return {string[]} The names of the state fields that may be manipulated
   *         by this extension.
   */
  getAllowedStateKeys() {}
}

/**
 * Abstract extension
 *
 * @abstract
 * @extends Extension
 */
class AbstractExtension extends Extension {
  constructor() {
    super();

    /**
     * State manager.
     *
     * @protected
     * @type {PageStateManager}
     */
    this._pageStateManager = null;

    /**
     * Flag indicating whether the PageStateManager should be used instead
     * of partial state.
     *
     * @protected
     * @type {boolean}
     */
    this._usingStateManager = false;

    /**
     * The HTTP response code to send to the client.
     *
     * @type {number}
     */
    this.status = 200;

    /**
     * The route parameters extracted from the current route.
     *
     * @type {Object<string, string>}
     */
    this.params = {};

    this._partialStateSymbol = Symbol('partialState');
  }

  /**
   * @inheritdoc
   */
  init() {}

  /**
   * @inheritdoc
   */
  destroy() {}

  /**
   * @inheritdoc
   */
  activate() {}

  /**
   * @inheritdoc
   */
  deactivate() {}

  /**
   * @inheritdoc
   * @abstract
   */
  load() {
    throw new GenericError(
      'The ima.extension.AbstractExtension.load method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * @inheritdoc
   */
  update() {
    return {};
  }

  /**
   * @inheritdoc
   */
  setState(statePatch) {
    if (this._pageStateManager) {
      this._pageStateManager.setState(statePatch);
    }
  }

  /**
   * @inheritdoc
   */
  getState() {
    if (this._usingStateManager && this._pageStateManager) {
      return this._pageStateManager.getState();
    } else {
      return this.getPartialState();
    }
  }

  /**
   * @inheritdoc
   */
  setPartialState(partialStatePatch) {
    const newPartialState = Object.assign(
      {},
      this[this._partialStateSymbol],
      partialStatePatch
    );
    this[this._partialStateSymbol] = newPartialState;
  }

  /**
   * @inheritdoc
   */
  getPartialState() {
    return this[this._partialStateSymbol] || {};
  }

  /**
   * @inheritdoc
   */
  clearPartialState() {
    this[this._partialStateSymbol] = {};
  }

  /**
   * @inheritdoc
   */
  setRouteParams(params = {}) {
    this.params = params;
  }

  /**
   * @inheritdoc
   */
  getRouteParams() {
    return this.params;
  }

  /**
   * @inheritdoc
   */
  setPageStateManager(pageStateManager) {
    this._pageStateManager = pageStateManager;
  }

  /**
   * @inheritdoc
   */
  switchToStateManager() {
    this._usingStateManager = true;
  }

  /**
   * @inheritdoc
   */
  switchToPartialState() {
    this._usingStateManager = false;
  }

  /**
   * @inheritdoc
   */
  getHttpStatus() {
    return this.status;
  }

  /**
   * Returns array of allowed state keys for extension.
   *
   * @inheritdoc
   */
  getAllowedStateKeys() {
    return [];
  }
}

/**
 * The base class for all view components.
 *
 * @abstract
 */
class AbstractComponent extends React.Component {
  static get contextType() {
    return Context;
  }
  /**
   * Initializes the component.
   *
   * @param {Object<string, *>} props The component properties.
   * @param {Object<string, *>} context The component context.
   */
  constructor(props, context) {
    super(props, context);

    /**
     * The view utilities, initialized lazily upon first use from either
     * the context, or the component's props.
     *
     * @type {?Object<string, *>}
     */
    this._utils = null;
  }

  /**
   * Returns the utilities for the view components. The returned value is the
   * value bound to the {@code $Utils} object container constant.
   *
   * @return {Object<string, *>} The utilities for the view components.
   */
  get utils() {
    if (!this._utils) {
      this._utils = getUtils(this.props, this.context);
    }

    return this._utils;
  }

  /**
   * Returns the localized phrase identified by the specified key. The
   * placeholders in the localization phrase will be replaced by the provided
   * values.
   *
   * @param {string} key Localization key.
   * @param {Object<string, (number|string)>=} params Values for replacing
   *        the placeholders in the localization phrase.
   * @return {string} Localized phrase.
   */
  localize(key, params = {}) {
    return localize(this, key, params);
  }

  /**
   * Generates an absolute URL using the provided route name (see the
   * <code>app/config/routes.js</code> file). The provided parameters will
   * replace the placeholders in the route pattern, while the extraneous
   * parameters will be appended to the generated URL's query string.
   *
   * @param {string} name The route name.
   * @param {Object<string, (number|string)>=} params Router parameters and
   *        extraneous parameters to add to the URL as a query string.
   * @return {string} The generated URL.
   */
  link(name, params = {}) {
    return link(this, name, params);
  }

  /**
   * Generate a string of CSS classes from the properties of the passed-in
   * object that resolve to true.
   *
   * @example
   *        this.cssClasses('my-class my-class-modificator', true);
   * @example
   *        this.cssClasses({
   *            'my-class': true,
   *            'my-class-modificator': this.props.modificator
   *        }, true);
   *
   * @param {(string|Object<string, boolean>)} classRules CSS classes in a
   *        string separated by whitespace, or a map of CSS class names to
   *        boolean values. The CSS class name will be included in the result
   *        only if the value is {@code true}.
   * @param {boolean} includeComponentClassName
   * @return {string} String of CSS classes that had their property resolved
   *         to {@code true}.
   */
  cssClasses(classRules, includeComponentClassName = false) {
    return cssClasses(this, classRules, includeComponentClassName);
  }

  /**
   * Creates and sends a new IMA.js DOM custom event from this component.
   *
   * @param {string} eventName The name of the event.
   * @param {*=} data Data to send within the event.
   */
  fire(eventName, data = null) {
    fire(this, eventName, data);
  }

  /**
   * Registers the provided event listener for execution whenever an IMA.js
   * DOM custom event of the specified name occurs at the specified event
   * target.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to register.
   */
  listen(eventTarget, eventName, listener) {
    listen(this, eventTarget, eventName, listener);
  }

  /**
   * Deregisters the provided event listener for an IMA.js DOM custom event
   * of the specified name at the specified event target.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to register.
   */
  unlisten(eventTarget, eventName, listener) {
    unlisten(this, eventTarget, eventName, listener);
  }
}

const version="0.16.11";

/* eslint-enable no-unused-vars */

function getInitialImaConfigFunctions() {
  return { initBindIma, initServicesIma };
}

function getNamespace() {
  return ns;
}

function getInitialPluginConfig() {
  return { plugins: vendorLinker.getImaPlugins() };
}

function _getRoot() {
  return _isClient() ? window : global;
}

function _isClient() {
  return typeof window !== 'undefined' && window !== null;
}

function createImaApp() {
  let oc = new ObjectContainer(ns);
  let bootstrap = new Bootstrap(oc);

  return { oc, bootstrap };
}

function getClientBootConfig(initialAppConfigFunctions) {
  let root = _getRoot();

  if ($Debug && _isClient()) {
    if ($IMA.$Protocol !== root.location.protocol) {
      throw new Error$1(
        `Your client's protocol is not same as server's protocol. ` +
          `For right setting protocol on the server site set ` +
          `'X-Forwarded-Proto' header.`
      );
    }

    if ($IMA.$Host !== root.location.host) {
      throw new Error$1(
        `Your client's host is not same as server's host. For right ` +
          `setting host on the server site set 'X-Forwarded-Host' ` +
          `header.`
      );
    }
  }

  let bootConfig = {
    services: {
      respond: null,
      request: null,
      $IMA: $IMA,
      dictionary: {
        language: $IMA.$Language,
        dictionary: $IMA.i18n
      },
      router: {
        $Protocol: $IMA.$Protocol,
        $Host: $IMA.$Host,
        $Path: $IMA.$Path,
        $Root: $IMA.$Root,
        $LanguagePartPath: $IMA.$LanguagePartPath
      }
    },
    settings: {
      $Debug: $IMA.$Debug,
      $Env: $IMA.$Env,
      $Version: $IMA.$Version,
      $App: $IMA.$App,
      $Protocol: $IMA.$Protocol,
      $Language: $IMA.$Language,
      $Host: $IMA.$Host,
      $Path: $IMA.$Path,
      $Root: $IMA.$Root,
      $LanguagePartPath: $IMA.$LanguagePartPath
    }
  };

  return Object.assign(
    bootConfig,
    initialAppConfigFunctions,
    getInitialPluginConfig(),
    getInitialImaConfigFunctions()
  );
}

function bootClientApp(app, bootConfig) {
  app.bootstrap.run(bootConfig);

  $IMA.$Dispatcher = app.oc.get('$Dispatcher');

  let cache = app.oc.get('$Cache');
  cache.deserialize($IMA.Cache || {});

  return app;
}

function routeClientApp(app) {
  let router = app.oc.get('$Router');

  return router
    .listen()
    .route(router.getPath())
    .catch(error => {
      if (typeof $IMA.fatalErrorHandler === 'function') {
        $IMA.fatalErrorHandler(error);
      } else {
        console.warn(
          'Define function config.$IMA.fatalErrorHandler in ' + 'services.js.'
        );
      }
    });
}

function hotReloadClientApp(initialAppConfigFunctions) {
  if (!$Debug) {
    return;
  }

  let app = createImaApp();
  let bootConfig = getClientBootConfig(initialAppConfigFunctions);
  app = bootClientApp(app, bootConfig);

  let router = app.oc.get('$Router');
  let pageManager = app.oc.get('$PageManager');
  let currentRouteInfo = router.getCurrentRouteInfo();
  let currentRoute = currentRouteInfo.route;
  let currentRouteOptions = Object.assign({}, currentRoute.getOptions(), {
    onlyUpdate: false,
    autoScroll: false,
    allowSPA: false
  });

  router.listen();

  try {
    return pageManager
      .manage(currentRoute, currentRouteOptions, currentRouteInfo.params)
      .catch(error => {
        return router.handleError({ error });
      })
      .catch(error => {
        if (typeof $IMA.fatalErrorHandler === 'function') {
          $IMA.fatalErrorHandler(error);
        } else {
          console.warn(
            'Define the config.$IMA.fatalErrorHandler function ' +
              'in services.js.'
          );
        }
      });
  } catch (error) {
    return router.handleError({ error });
  }
}

function reviveClientApp(initialAppConfigFunctions) {
  let root = _getRoot();

  //set React for ReactJS extension for browser
  root.React = vendorLinker.get('react');
  root.$Debug = root.$IMA.$Debug;

  let app = createImaApp();
  let bootConfig = getClientBootConfig(initialAppConfigFunctions);
  app = bootClientApp(app, bootConfig);

  return routeClientApp(app).then(pageInfo => {
    return Object.assign({}, pageInfo || {}, { app, bootConfig });
  });
}

function onLoad() {
  vendorLinker.bindToNamespace(ns);

  if (!_isClient()) {
    return Promise.reject(null);
  }

  if (document.readyState !== 'loading') {
    return new Promise(resolve => setTimeout(resolve, 1000 / 240));
  }

  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', () => resolve(), {
      once: true
    });
  });
}

exports.AbstractComponent = AbstractComponent;
exports.AbstractController = AbstractController;
exports.AbstractDocumentView = AbstractDocumentView;
exports.AbstractExecution = AbstractExecution;
exports.AbstractExtension = AbstractExtension;
exports.AbstractPageManager = AbstractPageManager;
exports.AbstractPageRenderer = AbstractPageRenderer;
exports.AbstractPureComponent = AbstractPureComponent;
exports.AbstractRouter = AbstractRouter;
exports.ActionTypes = ActionTypes;
exports.BlankManagedRootView = BlankManagedRootView;
exports.Cache = Cache;
exports.CacheEntry = CacheEntry;
exports.CacheFactory = CacheFactory;
exports.CacheImpl = CacheImpl;
exports.ClientPageManager = ClientPageManager;
exports.ClientPageRenderer = ClientPageRenderer;
exports.ClientRouter = ClientRouter;
exports.ClientWindow = ClientWindow;
exports.Controller = Controller;
exports.ControllerDecorator = ControllerDecorator;
exports.CookieStorage = CookieStorage;
exports.Dictionary = Dictionary;
exports.Dispatcher = Dispatcher;
exports.DispatcherImpl = DispatcherImpl;
exports.Error = Error$1;
exports.EventBus = EventBus;
exports.EventBusImpl = EventBusImpl;
exports.Execution = Execution;
exports.ExtensibleError = ExtensibleError;
exports.Extension = Extension;
exports.GenericError = GenericError;
exports.HttpAgent = HttpAgent;
exports.HttpAgentImpl = HttpAgentImpl;
exports.HttpProxy = HttpProxy;
exports.MapStorage = SessionStorage;
exports.MessageFormatDictionary = MessageFormatDictionary;
exports.MetaManager = MetaManager;
exports.MetaManagerImpl = MetaManagerImpl;
exports.PageContext = Context;
exports.PageFactory = PageFactory;
exports.PageHandler = PageHandler;
exports.PageHandlerRegistry = PageHandlerRegistry;
exports.PageManager = PageManager;
exports.PageNavigationHandler = PageNavigationHandler;
exports.PageRenderer = PageRenderer;
exports.PageRendererFactory = PageRendererFactory;
exports.PageStateManager = PageStateManager;
exports.PageStateManagerDecorator = PageStateManagerDecorator;
exports.PageStateManagerImpl = PageStateManagerImpl;
exports.Request = Request;
exports.Response = Response;
exports.Route = Route;
exports.RouteFactory = RouteFactory;
exports.RouteNames = RouteNames;
exports.Router = Router;
exports.RouterEvents = Events$4;
exports.SerialBatch = SerialBatch;
exports.ServerPageManager = ServerPageManager;
exports.ServerPageRenderer = ServerPageRenderer;
exports.ServerRouter = ServerRouter;
exports.ServerWindow = ServerWindow;
exports.SessionMapStorage = SessionMapStorage;
exports.SessionStorage = SessionStorage;
exports.StateEvents = Events$2;
exports.StatusCode = StatusCode;
exports.Storage = Storage;
exports.UrlTransformer = UrlTransformer;
exports.ViewAdapter = ViewAdapter;
exports.WeakMapStorage = WeakMapStorage;
exports.Window = Window;
exports.bootClientApp = bootClientApp;
exports.createImaApp = createImaApp;
exports.cssClasses = cssClasses;
exports.defaultCssClasses = defaultCssClasses;
exports.fire = fire;
exports.getClientBootConfig = getClientBootConfig;
exports.getInitialImaConfigFunctions = getInitialImaConfigFunctions;
exports.getInitialPluginConfig = getInitialPluginConfig;
exports.getNamespace = getNamespace;
exports.getUtils = getUtils;
exports.hotReloadClientApp = hotReloadClientApp;
exports.link = link;
exports.listen = listen;
exports.localize = localize;
exports.onLoad = onLoad;
exports.reviveClientApp = reviveClientApp;
exports.routeClientApp = routeClientApp;
exports.unlisten = unlisten;
exports.vendorLinker = vendorLinker;
exports.version = version;
