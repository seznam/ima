import { Constructor } from 'type-fest';

import { OCInjectable } from './ObjectContainer';

export type EntryOptions = {
  writeable: boolean;
};

/**
 * Object container entry, representing either a class, interface, constant or
 * an alias.
 */
export class Entry<T> {
  /**
   * The constructor of the class represented by this entry, or the
   * getter of the value of the constant represented by this entry.
   */
  classConstructor: OCInjectable<T>;

  /**
   * The shared instance of the class represented by this entry.
   */
  sharedInstance: InstanceType<Constructor<T>> | null = null;

  /**
   * Dependencies of the class constructor of the class represented by
   * this entry.
   */
  private _dependencies: any[];

  /**
   * The Entry options.
   */
  private _options: EntryOptions;

  /**
   * The override counter
   */
  private _overrideCounter = 0;

  /**
   * Reference to part of application that created
   * this entry.
   */
  private _referrer?: string;

  /**
   * Initializes the entry.
   *
   * @param classConstructor The
   *        class constructor or constant value getter.
   * @param dependencies The dependencies to pass into the
   *        constructor function.
   * @param referrer Reference to part of application that created
   *        this entry.
   * @param options The Entry options.
   */
  constructor(
    classConstructor: OCInjectable<T>,
    dependencies?: any[],
    referrer?: string,
    options?: EntryOptions
  ) {
    this.classConstructor = classConstructor;
    this._referrer = referrer;
    this._dependencies = dependencies || [];
    this._options = options || {
      writeable: true,
    };
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
          `The dependencies entry can't be overridden more than once.` +
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

  static from<TInfer>(entry: Entry<TInfer>) {
    return new Entry(
      entry.classConstructor,
      entry.dependencies,
      entry.referrer,
      entry._options
    );
  }
}
