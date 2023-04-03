import { Constructor } from 'type-fest';

import { OCInjectable } from './ObjectContainer';

export type EntryConstructor<T> = OCInjectable<T> | (() => T);
export type EntrySharedInstance<T> = T extends () => T ? T : Constructor<T>;
export type EntryOptions = {
  writeable: boolean;
};

/**
 * Object container entry, representing either a class, interface, constant or
 * an alias.
 */
export class Entry<T = any> {
  /**
   * The constructor of the class represented by this entry, or the
   * getter of the value of the constant represented by this entry.
   */
  classConstructor: EntryConstructor<T>;

  /**
   * The shared instance of the class represented by this entry.
   */
  sharedInstance: EntrySharedInstance<T> | null = null;

  /**
   * Dependencies of the class constructor of the class represented by
   * this entry.
   */
  #dependencies: any[];

  /**
   * The Entry options.
   */
  #options: EntryOptions;

  /**
   * The override counter
   */
  #overrideCounter = 0;

  /**
   * Reference to part of application that created
   * this entry.
   */
  #referrer?: string;

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
    classConstructor: EntryConstructor<T>,
    dependencies?: any[],
    referrer?: string,
    options?: EntryOptions
  ) {
    this.classConstructor = classConstructor;
    this.#referrer = referrer;
    this.#dependencies = dependencies || [];
    this.#options = options || {
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

      if (this.#overrideCounter >= 1) {
        throw new Error(
          `The dependencies entry can't be overridden more than once.` +
            `Fix your bind.js file for classConstructor ${this.classConstructor.name}.`
        );
      }
    }

    this.#dependencies = dependencies;
    this.#overrideCounter++;
  }

  get dependencies() {
    return this.#dependencies;
  }

  get referrer() {
    return this.#referrer;
  }

  get writeable() {
    return this.#options.writeable;
  }

  get options() {
    return this.#options;
  }

  static from<TInfer>(entry: Entry<TInfer>) {
    return new Entry(
      entry.classConstructor,
      entry.dependencies,
      entry.referrer,
      entry.options
    );
  }
}
