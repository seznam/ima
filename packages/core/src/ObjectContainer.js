import ns from './namespace';

ns.namespace('ima.core');

const SPREAD_RE = /^\.../;
const OPTIONAL_RE = /^(...)?\?/;
/**
 * The Object Container is an enhanced dependency injector with support for
 * aliases and constants, and allowing to reference classes in the application
 * namespace by specifying their fully qualified names.
 */
export default class ObjectContainer {
  /**
   * Returns constant for plugin binding state.
   *
   * When the object container is in plugin binding state, it is impossible
   * to register new aliases using the {@link bind()} method and register
   * new constant using the {@link constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@link inject()} method (classes that were not configured yet may be
   * configured using the {@link inject()} method or {@link provide()}
   * method).
   *
   * This prevents the unprivileged code (e.g. 3rd party plugins) from
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
   * to register new aliases using the {@link bind()} method and register
   * new constant using the {@link constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@link inject()} method (classes that were not configured yet may be
   * configured using the {@link inject()} method or {@link provide()}
   * method).
   *
   * @return {string} The IMA binding state.
   */
  static get IMA_BINDING_STATE() {
    return 'ima.core';
  }

  /**
   * Returns constant for app binding state.
   *
   * When the object container is in app binding state, it is possible
   * to register new aliases using the {@link bind()} method and register
   * new constant using the {@link constant()} method, or override the
   * default class dependencies of any already-configured class using the
   * {@link inject()} method (classes that were not configured yet may be
   * configured using the {@link inject()} method or {@link provide()}
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
   * @param {ima.core.Namespace} namespace The namespace container, used to
   *        access classes and values using their fully qualified names.
   */
  constructor(namespace) {
    /**
     * The namespace container, used to access classes and values using
     * their fully qualified names.
     *
     * @type {ima.core.Namespace}
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
     * The {@link setBindingState()} method may be called for changing
     * object container binding state only by the bootstrap script.
     *
     * @type {?string}
     */
    this._bindingState = null;

    /**
     * The current plugin binding to OC.
     *
     * The {@link setBindingState()} method may be called for changing
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
   * @param {Array<string|object|function>} [dependencies] The dependencies to pass into the
   *        constructor or factory function.
   * @return {ObjectContainer} This object container.
   */
  bind(name, classConstructor, dependencies) {
    if ($Debug) {
      if (
        this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE &&
        typeof name === 'string' &&
        name[0] !== '$'
      ) {
        throw new Error(
          `ima.core.ObjectContainer:bind Object container ` +
            `is locked. You do not have the permission to ` +
            `create a new alias named ${this._getDebugName(name)}.`
        );
      }

      if (typeof classConstructor !== 'function') {
        throw new Error(
          `ima.core.ObjectContainer:bind The second ` +
            `argument has to be a class constructor function, ` +
            `but ${this._getDebugName(
              classConstructor
            )} was provided. Fix alias ` +
            `${this._getDebugName(name)} for your bind.js file.`
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
   * this is the only way of passing `string` values to constructors
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
          `ima.core.ObjectContainer:constant The ${this._getDebugName(name)} ` +
            `constant has already been declared and cannot be ` +
            `redefined.`
        );
      }

      if (this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE) {
        throw new Error(
          `ima.core.ObjectContainer:constant The ${this._getDebugName(name)} ` +
            `constant can't be declared in plugin. ` +
            `The constant must be define in app/config/bind.js file.`
        );
      }
    }

    let constantEntry = this._createEntry(() => value, [], {
      writeable: false,
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
   * @param {Array<string|object|function>} dependencies The dependencies to pass into the
   *        constructor function.
   * @return {ObjectContainer} This object container.
   */
  inject(classConstructor, dependencies) {
    if ($Debug) {
      if (typeof classConstructor !== 'function') {
        throw new Error(
          `ima.core.ObjectContainer:inject The first ` +
            `argument has to be a class constructor function, ` +
            `but ${this._getDebugName(
              classConstructor
            )} was provided. Fix your ` +
            `bind.js file.`
        );
      }

      if (
        this._entries.has(classConstructor) &&
        this._bindingState === ObjectContainer.PLUGIN_BINDING_STATE
      ) {
        throw new Error(
          `ima.core.ObjectContainer:inject The ` +
            `${this._getDebugName(
              classConstructor.name
            )} has already had its ` +
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
   * dependencies or the dependencies provided to the {@link create()}
   * method.
   *
   * @template {Interface}
   * @template {Implementation} extends Interface
   * @param {function(new: Interface)} interfaceConstructor The constructor
   *        of the interface representing the service.
   * @param {function(new: Implementation, ...*)} implementationConstructor
   *        The constructor of the class implementing the service interface.
   * @param {Array<string|object|function>} dependencies The dependencies to pass into the
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
          'ima.core.ObjectContainer:provide The ' +
            'implementation of the provided interface ' +
            `(${this._getDebugName(
              interfaceConstructor.name
            )}) has already been ` +
            `configured and cannot be overridden.`
        );
      }

      // check that implementation really extends interface
      let prototype = implementationConstructor.prototype;
      if (!(prototype instanceof interfaceConstructor)) {
        throw new Error(
          'ima.core.ObjectContainer:provide The specified ' +
            `class (${this._getDebugName(
              implementationConstructor.name
            )}) does not ` +
            `implement the ${this._getDebugName(interfaceConstructor.name)} ` +
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

    if (entry?.sharedInstance === null) {
      entry.sharedInstance = this._createInstanceFromEntry(entry);
    }

    //Optional entries can be null if they are not found in the OC
    return entry?.sharedInstance;
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
   * Returns `true` if the specified object, class or resource is
   * registered with this object container.
   *
   * @template T
   * @param {string|function(new: T, ...*)} name The resource name.
   * @return {boolean} `true` if the specified object, class or
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
   * @param {Array<string|object|function>} dependencies The dependencies to pass into the
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
    if (
      this._bindingState === ObjectContainer.APP_BINDING_STATE &&
      bindingState !== ObjectContainer.PLUGIN_BINDING_STATE
    ) {
      throw new Error(
        `ima.core.ObjectContainer:setBindingState The setBindingState() ` +
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
   * The method throws an {@link Error} if no such constant, alias,
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
    let entryName = Array.isArray(name) ? name[0] : name;

    // Remove all meta symbols from the start of the alias
    if (typeof entryName === 'string') {
      entryName = entryName.replace(SPREAD_RE, '');
      entryName = entryName.replace(OPTIONAL_RE, '');
    }

    let entry =
      this._entries.get(entryName) ||
      this._getEntryFromConstant(entryName) ||
      this._getEntryFromNamespace(entryName) ||
      this._getEntryFromClassConstructor(entryName);

    if ($Debug && !entry && !this._isOptional(name)) {
      throw new Error(
        `ima.core.ObjectContainer:_getEntry There is no constant, ` +
          `alias, registered class, registered interface with ` +
          `configured implementation or namespace entry ` +
          `identified as: <strong>${this._getDebugName(name)}</strong>
           Check your bind.js file for ` +
          `typos or register given entry with the object container.`
      );
    }

    if (this._isSpread(name)) {
      if (Array.isArray(entry?.sharedInstance)) {
        let spreadEntry = Entry.from(entry);

        spreadEntry.sharedInstance = entry.sharedInstance.map(sharedInstance =>
          this.get(sharedInstance)
        );

        return spreadEntry;
      }

      if ($Debug) {
        throw new Error(
          `ima.core.ObjectContainer:_getEntry Invalid use of spread entry identified as: <strong>${this._getDebugName(
            name
          )}</strong> Check your bind.js file for ` +
            `typos or register given entry with the object container.`
        );
      }
    }

    return entry;
  }

  /**
   * Checks whether the name is marked as optional.
   *
   * @param {string} name Name of a constant or alias,
   *        factory function, class or interface constructor, or a fully
   *        qualified namespace path.
   * @return {boolean}
   */
  _isOptional(name) {
    return (
      name?.[1]?.optional ||
      (typeof name === 'string' && OPTIONAL_RE.test(name))
    );
  }

  /**
   * Checks whether the name is marked as spread.
   *
   * @param {string} name Name of a constant or alias,
   *        factory function, class or interface constructor, or a fully
   *        qualified namespace path.
   * @return {boolean}
   */
  _isSpread(name) {
    const normalizedName = Array.isArray(name) ? name[0] : name;

    return typeof normalizedName === 'string' && SPREAD_RE.test(normalizedName);
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
   * @param (Array<tring|object|function>} dependencies The dependencies to pass into the
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
   * @param {Array<string|object|function>} [dependencies] The dependencies to pass into the
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
   * @param (Array<tring|object|function>} [dependencies=[]] The dependencies to pass into the
   *        constructor or factory function.
   * @return {T} Created instance or generated value.
   */
  _createInstanceFromEntry(entry, dependencies = []) {
    if (dependencies.length === 0) {
      dependencies = [];

      for (let dependency of entry.dependencies) {
        if (
          ['function', 'string'].indexOf(typeof dependency) > -1 ||
          Array.isArray(dependency)
        ) {
          let retrievedDependency = this.get(dependency);
          if (
            Array.isArray(retrievedDependency) &&
            this._isSpread(dependency)
          ) {
            dependencies.push(...retrievedDependency);
          } else {
            dependencies.push(retrievedDependency);
          }
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
   * with this object container, otherwise return `null`.
   *
   * Finally, if the constant composition name does not resolve to value,
   * the method return `null`.
   *
   * @param {string} compositionName
   * @return {?Entry<*>} An entry representing the value at the specified
   *         composition name in the constants. The method returns `null`
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
        writeable: false,
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
   * namespace path, the method returns `null`.
   *
   * @template T
   * @param {(string|function(new: T, ...*))} path Namespace path pointing to
   *        a class or a value in the application namespace, or a constructor
   *        function.
   * @return {?Entry<T>} An entry representing the value or class at the
   *         specified path in the namespace. The method returns `null`
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
   * The method then checks whether there are defined `$dependencies`
   * property for class. Then the class is registered to this object
   * container.
   *
   * The method returns the entry for the class if the specified class
   * does not have defined `$dependencies` property return
   * `null`.
   *
   * @template T
   * @param {function(new: T, ...*)} classConstructor
   * @return {?Entry<T>} An entry representing the value at the specified
   *         classConstructor. The method returns `null`
   *         if the specified classConstructor does not have defined
   *         `$dependencies`.
   */
  _getEntryFromClassConstructor(classConstructor) {
    if (typeof classConstructor !== 'function') {
      return null;
    }

    if (!Array.isArray(classConstructor.$dependencies)) {
      if ($Debug) {
        throw new Error(
          `The class constructor identified as: ${this._getDebugName(
            classConstructor
          )} is missing <b>static get $dependencies() {}</b> definition.`
        );
      }

      return null;
    }

    let entry = this._createEntry(
      classConstructor,
      classConstructor.$dependencies
    );

    this._entries.set(classConstructor, entry);

    return entry;
  }

  /**
   * Formats name, function, class constructor to more compact
   * name/message to allow for cleaner debug Error messages.
   *
   * @param {any} name
   * @return {string}
   */
  _getDebugName(name) {
    return `<strong>${
      name?.toString().split('\n').slice(0, 5).join('\n') ?? name
    }</strong>`;
  }
}

ns.ima.core.ObjectContainer = ObjectContainer;

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
   * @param (Array<tring|object|function>} [dependencies=[]] The dependencies to pass into the
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
      writeable: true,
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
     * @type Array<string|object|function>
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

  static from(entry) {
    return new Entry(
      entry.classConstructor,
      entry.dependencies,
      entry.referrer,
      entry.options
    );
  }
}
