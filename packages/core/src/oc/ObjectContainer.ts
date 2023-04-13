import { AbstractConstructor, Constructor } from 'type-fest';

import { BindingState } from './BindingState';
import {
  Entry,
  EntryConstructor,
  EntryOptions,
  EntrySharedInstance,
} from './Entry';
import { DecoratedOCAliasMap, OCAliasMap } from '../config/bind';
import { GenericError } from '../error/GenericError';
import { ns, Namespace } from '../Namespace';

type WithDependencies = {
  readonly $dependencies: Dependencies;
};

export type OCInjectable<T> =
  | (Constructor<T> & WithDependencies)
  | (AbstractConstructor<T> & Partial<WithDependencies>)
  | (Function & { prototype: T } & Partial<WithDependencies>);

export type Dependencies<T = any> = Dependency<T>[];
export type Dependency<T> =
  | keyof DecoratedOCAliasMap
  | OCInjectable<T>
  | [
      OCInjectable<T>,
      {
        optional: boolean;
      }
    ];

export type OCInstanceConstrain<T = any> =
  | keyof DecoratedOCAliasMap
  | Constructor<T>
  | AbstractConstructor<T>
  | [AbstractConstructor<T> | Constructor<T>, { optional: true }];

export type OCInstance<T extends OCInstanceConstrain> =
  T extends keyof DecoratedOCAliasMap
    ? DecoratedOCAliasMap[T]
    : T extends AbstractConstructor<any> | Constructor<any>
    ? InstanceType<T>
    : T extends [
        AbstractConstructor<any> | Constructor<any>,
        { optional: true }
      ]
    ? InstanceType<T[0]> | null
    : T;

const SPREAD_RE = /^\.../;
const OPTIONAL_RE = /^(...)?\?/;

/**
 * The Object Container is an enhanced dependency injector with support for
 * aliases and constants, and allowing to reference classes in the application
 * namespace by specifying their fully qualified names.
 */
export class ObjectContainer {
  /**
   * The current binding state.
   *
   * The {@link setBindingState()} method may be called for changing
   * object container binding state only by the bootstrap script.
   */
  private _bindingState?: BindingState;

  /**
   * The current plugin binding to OC.
   *
   * The {@link setBindingState()} method may be called for changing
   * object container binding state only by the bootstrap script.
   */
  private _bindingPlugin?: string;
  private _entries: Map<Dependency<any>, Entry<any>> = new Map();

  /**
   * The namespace container, used to access classes and values using
   * their fully qualified names.
   */
  private _namespace: Namespace;

  /**
   * Initializes the object container.
   *
   * @param namespace The namespace container, used to
   *        access classes and values using their fully qualified names.
   */
  constructor(namespace: Namespace) {
    this._namespace = namespace;
  }

  /**
   * Binds the specified class or factory function and dependencies to the
   * specified alias. Binding a class or factory function to an alias allows
   * the class or function to be specified as a dependency by specifying the
   * alias and creating new instances by referring to the class or function
   * by the alias.
   *
   * Also note that the same class or function may be bound to several
   * aliases and each may use different dependencies.
   *
   * The alias will use the default dependencies bound for the class if no
   * dependencies are provided.
   *
   * @param name Alias name.
   * @param classConstructor The
   *        class constructor or a factory function.
   * @param dependencies The dependencies to pass into the
   *        constructor or factory function.
   * @return This object container.
   */
  bind<T extends keyof OCAliasMap, C>(
    name: T,
    classConstructor: OCInjectable<C>,
    dependencies?: any[]
  ): this {
    if ($Debug) {
      if (
        this._bindingState === BindingState.Plugin &&
        typeof name === 'string' &&
        name[0] !== '$'
      ) {
        throw new GenericError(
          `ima.core.ObjectContainer:bind Object container ` +
            `is locked. You do not have the permission to ` +
            `create a new alias named ${name}.`,
          {
            name,
            classConstructor: classConstructor?.toString(),
            dependencies: dependencies?.toString(),
          }
        );
      }

      if (typeof classConstructor !== 'function') {
        throw new GenericError(
          `ima.core.ObjectContainer:bind The second ` +
            `argument has to be a class constructor function, ` +
            `but ${this.#getDebugName(
              classConstructor
            )} was provided. Fix alias ` +
            `${this.#getDebugName(name)} for your bind.js file.`,
          {
            name,
            classConstructor: classConstructor,
            dependencies: dependencies?.toString(),
          }
        );
      }
    }

    const classConstructorEntry = this._entries.get(classConstructor);
    const nameEntry = this._entries.get(name);
    const entry = classConstructorEntry || nameEntry;

    /**
     * Create instance using class constructor and dependencies and bind
     * it given name.
     */
    if (classConstructorEntry && !nameEntry && dependencies) {
      const entry = this._createEntry(classConstructor, dependencies);
      this._entries.set(name, entry);

      return this;
    }

    if (entry) {
      // Update/set existing instance to new entry name
      this._entries.set(name, entry);

      // Update dependencies of existing oc entry
      if (dependencies) {
        this._updateEntryValues(entry, classConstructor, dependencies);
      }
    } else {
      /**
       * If neither name entry or class constructor entry exist,
       * we'll create both of them and add them to oc.
       */
      const entry = this._createEntry(classConstructor, dependencies);
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
   * @param name The constant name.
   * @param value The constant value.
   * @return This object container.
   */
  constant<T extends keyof OCAliasMap, V>(name: T, value: V): this {
    if ($Debug) {
      if (this._entries.has(name) || !!this._getEntryFromConstant<V>(name)) {
        throw new GenericError(
          `ima.core.ObjectContainer:constant The ${this.#getDebugName(name)} ` +
            `constant has already been declared and cannot be ` +
            `redefined.`,
          { name, value: value?.toString() }
        );
      }

      if (this._bindingState === BindingState.Plugin) {
        throw new GenericError(
          `ima.core.ObjectContainer:constant The ${this.#getDebugName(name)} ` +
            `constant can't be declared in plugin. ` +
            `The constant must be define in app/config/bind.js file.`,
          { name, value: value?.toString() }
        );
      }
    }

    const constantEntry = this._createEntry(() => value, [], {
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
   * @param classConstructor The class constructor.
   * @param dependencies The dependencies to pass into the
   *        constructor function.
   * @return This object container.
   */
  inject<T>(classConstructor: Constructor<T>, dependencies: any[]): this {
    if ($Debug) {
      if (typeof classConstructor !== 'function') {
        throw new GenericError(
          `ima.core.ObjectContainer:inject The first ` +
            `argument has to be a class constructor function, ` +
            `but ${this.#getDebugName(
              classConstructor
            )} was provided. Fix your ` +
            `bind.js file.`,
          {
            classConstructor: classConstructor,
            dependencies: dependencies?.toString(),
          }
        );
      }

      if (
        this._entries.has(classConstructor) &&
        this._bindingState === BindingState.Plugin
      ) {
        throw new GenericError(
          `ima.core.ObjectContainer:inject The ` +
            `${this.#getDebugName(
              classConstructor.name
            )} has already had its ` +
            `default dependencies configured, and the object ` +
            `container is currently locked, therefore the ` +
            `dependency configuration cannot be override. The ` +
            `dependencies of the provided class must be ` +
            `overridden from the application's bind.js ` +
            `configuration file.`,
          {
            classConstructor: classConstructor?.toString(),
            dependencies: dependencies?.toString(),
          }
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
   * @param interfaceConstructor The constructor
   *        of the interface representing the service.
   * @param implementationConstructor
   *        The constructor of the class implementing the service interface.
   * @param dependencies The dependencies to pass into the
   *        constructor function.
   * @return This object container.
   */
  provide<T, I>(
    interfaceConstructor: Constructor<I> | AbstractConstructor<I>,
    implementationConstructor: Constructor<T>,
    dependencies?: any[]
  ): this {
    if ($Debug) {
      if (
        this._entries.has(interfaceConstructor) &&
        this._bindingState === BindingState.Plugin
      ) {
        throw new GenericError(
          'ima.core.ObjectContainer:provide The ' +
            'implementation of the provided interface ' +
            `(${this.#getDebugName(
              interfaceConstructor.name
            )}) has already been ` +
            `configured and cannot be overridden.`,
          {
            interfaceConstructor: interfaceConstructor?.toString(),
            implementationConstructor: implementationConstructor?.toString(),
            dependencies: dependencies?.toString(),
          }
        );
      }

      // check that implementation really extends interface
      const prototype = implementationConstructor.prototype;

      if (!(prototype instanceof interfaceConstructor)) {
        throw new GenericError(
          'ima.core.ObjectContainer:provide The specified ' +
            `class (${this.#getDebugName(
              implementationConstructor.name
            )}) does not ` +
            `implement the ${this.#getDebugName(interfaceConstructor.name)} ` +
            `interface.`,
          {
            interfaceConstructor: interfaceConstructor?.toString(),
            implementationConstructor: implementationConstructor?.toString(),
            dependencies: dependencies?.toString(),
          }
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
   * @param name The name
   *        of the alias, class, interface, or the class, interface or a
   *        factory function.
   * @return The shared instance or value.
   */
  get<T extends OCInstanceConstrain>(name: T): OCInstance<T> {
    const entry = this._getEntry(name);

    if (entry?.sharedInstance === null) {
      entry.sharedInstance = this._createInstanceFromEntry(entry);
    }

    // Optional entries can be null if they are not found in the OC
    return entry?.sharedInstance as OCInstance<T>;
  }

  /**
   * Returns the class constructor function of the specified class.
   *
   * @param name The name by which the class
   *        is registered with this object container.
   * @return The constructor function.
   */
  getConstructorOf<T extends keyof OCAliasMap | Constructor<any>>(
    name: T
  ): Constructor<T> | null {
    const entry = this._getEntry<T>(name);

    if (!entry) {
      return null;
    }

    return entry.classConstructor as Constructor<T>;
  }

  /**
   * Returns `true` if the specified object, class or resource is
   * registered with this object container.
   *
   * @param name The resource name.
   * @return `true` if the specified object, class or
   *         resource is registered with this object container.
   */
  has<T>(name: keyof OCAliasMap | OCInjectable<T>): boolean {
    return (
      this._entries.has(name) ||
      !!this._getEntryFromConstant(name as string) ||
      !!this._getEntryFromNamespace(name as string) ||
      !!this._getEntryFromClassConstructor(name as OCInjectable<T>)
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
   * @param name The name
   *        of the alias, class, interface, or the class, interface or a
   *        factory function to use.
   * @param dependencies The dependencies to pass into the
   *        constructor or factory function.
   * @return Created instance or generated value.
   */
  create<T extends OCInstanceConstrain>(
    name: T,
    dependencies: any[] = []
  ): OCInstance<T> {
    const entry = this._getEntry(name);

    if (!entry) {
      throw new Error(
        'ima.core.ObjectContainer:create unable to create ' +
          `entry with ${name}, as it is null`
      );
    }

    return this._createInstanceFromEntry(entry, dependencies);
  }

  /**
   * Clears all entries from this object container and resets the locking
   * mechanism of this object container.
   *
   * @return This object container.
   */
  clear(): this {
    this._entries.clear();
    this._bindingState = undefined;
    this._bindingPlugin = undefined;

    return this;
  }

  setBindingState(
    bindingState: BindingState,
    bindingPluginName?: string
  ): void {
    if (
      this._bindingState === BindingState.App &&
      bindingState !== BindingState.Plugin
    ) {
      throw new GenericError(
        `ima.core.ObjectContainer:setBindingState The setBindingState() ` +
          `method  has to be called only by the bootstrap script. Other ` +
          `calls are not allowed.`,
        { bindingState, bindingPluginName }
      );
    }

    this._bindingState = bindingState;
    this._bindingPlugin =
      bindingState === BindingState.Plugin ? bindingPluginName : undefined;
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
   * @param  name Name of a constant or alias,
   *        factory function, class or interface constructor, or a fully
   *        qualified namespace path.
   * @return The retrieved entry.
   * @throws If no such constant, alias, registry, interface
   *         implementation is known to this object container.
   */
  _getEntry<T>(name: Dependency<T>): Entry<T> | null {
    let entryName = Array.isArray(name) ? name[0] : name;

    // Remove all meta symbols from the start of the alias
    if (typeof entryName === 'string') {
      entryName = entryName.replace(SPREAD_RE, '') as keyof OCAliasMap;
      entryName = entryName.replace(OPTIONAL_RE, '') as keyof OCAliasMap;
    }

    const entry =
      this._entries.get(entryName) ||
      this._getEntryFromConstant(entryName as string) ||
      this._getEntryFromNamespace(entryName as string) ||
      this._getEntryFromClassConstructor(entryName as OCInjectable<T>);

    if ($Debug && !entry && !this._isOptional<T>(name)) {
      throw new Error(
        `ima.core.ObjectContainer:_getEntry There is no constant, ` +
          `alias, registered class, registered interface with ` +
          `configured implementation or namespace entry ` +
          `identified as: <strong>${this.#getDebugName(name)}</strong>
           Check your bind.js file for ` +
          `typos or register given entry with the object container.`
      );
    }

    if (this._isSpread<T>(name)) {
      if (entry && Array.isArray(entry.sharedInstance)) {
        const spreadEntry = Entry.from(entry as Entry<any>);

        spreadEntry.sharedInstance = entry.sharedInstance.map(sharedInstance =>
          this.get(sharedInstance as OCInstanceConstrain<any>)
        );

        return spreadEntry;
      }

      if ($Debug) {
        throw new Error(
          `ima.core.ObjectContainer:_getEntry Invalid use of spread entry identified as: <strong>${this.#getDebugName(
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
   * @param name Name of a constant or alias,
   *        factory function, class or interface constructor, or a fully
   *        qualified namespace path.
   */
  _isOptional<T>(name: Dependency<T>): boolean {
    return (
      (Array.isArray(name) && name[1]?.optional) ||
      (typeof name === 'string' && OPTIONAL_RE.test(name))
    );
  }

  /**
   * Checks whether the name is marked as spread.
   *
   * @param name Name of a constant or alias,
   *        factory function, class or interface constructor, or a fully
   *        qualified namespace path.
   */
  _isSpread<T>(name: Dependency<T>): boolean {
    const normalizedName = Array.isArray(name) ? name[0] : name;

    return typeof normalizedName === 'string' && SPREAD_RE.test(normalizedName);
  }

  /**
   * The method update classConstructor and dependencies for defined entry.
   * The entry throw Error for constants and if you try override dependencies
   * more than once.
   *
   * @param classConstructor The
   *        class constructor or factory function.
   * @param entry The entry representing the class that should
   *        have its instance created or factory faction to use to create a
   *        value.
   * @param dependencies The dependencies to pass into the
   *        constructor or factory function.
   */
  _updateEntryValues<T, E extends Entry<T>>(
    entry: E,
    classConstructor: OCInjectable<T>,
    dependencies: any[]
  ): void {
    entry.classConstructor = classConstructor;
    entry.dependencies = dependencies;
  }

  /**
   * Creates a new entry for the provided class or factory function, the
   * provided dependencies and entry options.
   *
   * @template T
   * @param classConstructor The
   *        class constructor or factory function.
   * @param dependencies The dependencies to pass into the
   *        constructor or factory function.
   * @param options
   * @return Created instance or generated value.
   */
  _createEntry<T>(
    classConstructor: EntryConstructor<T>,
    dependencies?: any[],
    options?: EntryOptions
  ): Entry<T> {
    if (
      (!dependencies || dependencies.length === 0) &&
      // @ts-expect-error fixme, () => T fails
      Array.isArray(classConstructor.$dependencies)
    ) {
      // @ts-expect-error fixme, () => T fails
      dependencies = classConstructor.$dependencies;
    }

    return new Entry(
      classConstructor,
      dependencies,
      this._bindingState === BindingState.Plugin
        ? this._bindingPlugin
        : this._bindingState?.toString(),
      options
    );
  }

  /**
   * Creates a new instance of the class or retrieves the value generated by
   * the factory function represented by the provided entry, passing in the
   * provided dependencies.
   *
   * The method uses the dependencies specified by the entry if no custom
   * dependencies are provided.
   *
   * @param entry The entry representing the class that should
   *        have its instance created or factory faction to use to create a
   *        value.
   * @param dependencies The dependencies to pass into the
   *        constructor or factory function.
   * @return Created instance or generated value.
   */
  _createInstanceFromEntry<T, E extends Entry<T>>(
    entry: E,
    dependencies: any[] = []
  ): InstanceType<Constructor<T>> {
    if (dependencies.length === 0) {
      dependencies = [];

      for (const dependency of entry.dependencies) {
        // Optional and spread dependency handling
        if (
          ['function', 'string'].indexOf(typeof dependency) !== -1 ||
          Array.isArray(dependency)
        ) {
          const retrievedDependency = this.get(dependency);

          if (
            Array.isArray(retrievedDependency) &&
            this._isSpread(dependency)
          ) {
            dependencies.push(...retrievedDependency);
          } else {
            dependencies.push(retrievedDependency as Dependency<T>);
          }
        } else {
          dependencies.push(dependency);
        }
      }
    }

    return new (entry.classConstructor as Constructor<T>)(...dependencies);
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
   * @param compositionName
   * @return An entry representing the value at the specified
   *         composition name in the constants. The method returns `null`
   *         if the specified composition name does not exist in the constants.
   */
  _getEntryFromConstant<T>(compositionName: string): Entry<() => T> | null {
    if (typeof compositionName !== 'string') {
      return null;
    }

    const objectProperties = compositionName.split('.');
    let constantValue = this._entries.has(
      objectProperties[0] as Dependency<any>
    )
      ? this._entries.get(objectProperties[0] as Dependency<any>)!
          .sharedInstance
      : null;

    for (let i = 1; i < objectProperties.length && constantValue; i++) {
      constantValue = constantValue[objectProperties[i]];
    }

    if (constantValue !== undefined && constantValue !== null) {
      const entry = this._createEntry<() => T>(() => constantValue, [], {
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
   * The method then checks whether there are dependencies configured for the
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
   * @param path Namespace path pointing to
   *        a class or a value in the application namespace, or a constructor
   *        function.
   * @return An entry representing the value or class at the
   *         specified path in the namespace. The method returns `null`
   *         if the specified path does not exist in the namespace.
   */
  _getEntryFromNamespace<T>(path: string): Entry<T> | null {
    if (typeof path !== 'string' || !this._namespace.has(path)) {
      return null;
    }

    const namespaceValue = this._namespace.get(path);

    if (typeof namespaceValue === 'function') {
      if (this._entries.has(namespaceValue)) {
        return this._entries.get(namespaceValue)!;
      }

      return this._createEntry<T>(namespaceValue);
    }

    const entry = this._createEntry<T>(() => namespaceValue);
    entry.sharedInstance = namespaceValue as EntrySharedInstance<T>;

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
   * @param classConstructor
   * @return An entry representing the value at the specified
   *         classConstructor. The method returns `null`
   *         if the specified classConstructor does not have defined
   *         `$dependencies`.
   */
  _getEntryFromClassConstructor<T>(
    classConstructor: OCInjectable<T>
  ): Entry<T> | null {
    if (typeof classConstructor !== 'function') {
      return null;
    }

    if (!Array.isArray(classConstructor.$dependencies)) {
      if ($Debug) {
        debugger;
        throw new Error(
          `The class constructor identified as: ${this.#getDebugName(
            classConstructor
          )} is missing <b>static get $dependencies() {}</b> definition.`
        );
      }

      return null;
    }

    const entry = this._createEntry(
      classConstructor,
      classConstructor.$dependencies
    );

    this._entries.set(classConstructor, entry);

    return entry;
  }

  /**
   * Formats name, function, class constructor to more compact
   * name/message to allow for cleaner debug Error messages.
   */
  #getDebugName(name: any): string {
    return `<strong>${
      name?.toString().split('\n').slice(0, 5).join('\n') ?? name
    }</strong>`;
  }
}

ns.set('ns.ima.core.ObjectContainer', ObjectContainer);
