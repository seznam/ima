/**
 * Namespace creation, manipulation and traversal utility. This utility is used
 * to create semi-global shared namespaces for registering references to
 * interfaces, classes and constants of the application to provide access to
 * each other more easily than by using the ES6 import/export mechanism.
 */
export class Namespace {
  [key: PropertyKey]: any;

  /**
   * Initializes the namespace provider.
   *
   * This is a private constructor, you should use the exported `ns`
   * instance to create and use namespaces (see the examples).
   *
   * @private
   * @example
   *        import { ns } from '@ima/core';
   *        ns.namespace('ima.core');
   *        ns.has('ima.core');
   */

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
   * @param path The namespace path.
   * @return The value at the specified path in the namespace.
   */
  namespace<V = any>(path: string): V {
    const levels = this.#resolvePathLevels(path);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this;

    for (const levelName of levels) {
      if (!Object.prototype.hasOwnProperty.call(self, levelName)) {
        self[levelName] = {};
      }

      self = self[levelName];
    }

    return self as any as V;
  }

  /**
   * Verifies that the specified namespace path point to an existing
   * namespace or terminal value.
   *
   * @param path The namespace path to test.
   * @return `true` if the namespace or terminal value exists
   *         at the specified path.
   */
  has(path: string): boolean {
    let hasPath;
    try {
      hasPath = this.get(path) !== undefined;
    } catch (e) {
      hasPath = false;
    }

    return hasPath;
  }

  /**
   * Return value for the specified namespace path point or undefined if path is not type of string
   *
   * @param path The namespace path to get.
   * @return The value at the specified path in the namespace or undefined for any non-string path
   */
  get<V = any>(path: string): V | undefined {
    const levels = this.#resolvePathLevels(path);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this;

    for (const level of levels) {
      if (!self[level]) {
        return undefined;
      }

      self = self[level];
    }

    return self as any as V;
  }

  /**
   * Set value for the specified namespace path point.
   *
   * @param path The namespace path to set.
   * @param value
   */
  set<V>(path: string, value: V) {
    const levels = this.#resolvePathLevels(path);

    const lastKey = levels.pop() as string;
    const namespace = this.namespace<Record<string, any>>(levels.join('.'));

    namespace[lastKey] = value;
  }

  /**
   * Resolve path levels from string
   *
   * @param path The namespace path.
   * @param array of levels or undefined for not valid path
   */
  #resolvePathLevels(path: string) {
    if (!path || typeof path !== 'string') {
      throw Error('namespace.get: path is not type of string');
    }

    return path.split('.');
  }
}

export const ns = new Namespace();

export function getNamespace() {
  return ns;
}
