import ns from '../namespace';

ns.namespace('ima.storage');

/**
 * The {@codelink Storage} is an unordered collection of named values of any
 * type. Values in the storage are named using {@code string} keys. The storage
 * can be therefore thought of as a {@code Map<string, *>}.
 *
 * @interface
 */
export default class Storage {
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
  has(key) {}

  /**
	 * Retrieves the value of the entry identified by the specified key. The
	 * method returns {@code undefined} if the entry does not exists.
	 *
	 * Entries set to the {@code undefined} value can be tested for existence
	 * using the {@codelink has} method.
	 *
	 * @param {string} key The key identifying the storage entry.
	 * @return {*} The value of the storage entry.
	 */
  get(key) {}

  /**
	 * Sets the storage entry identified by the specified key to the provided
	 * value. The method creates the entry if it does not exist already.
	 *
	 * @param {string} key The key identifying the storage entry.
	 * @param {*} value The storage entry value.
	 * @return {Storage} This storage.
	 */
  set(key, value) {}

  /**
	 * Deletes the entry identified by the specified key from this storage.
	 *
	 * @param {string} key The key identifying the storage entry.
	 * @return {Storage} This storage.
	 */
  delete(key) {}

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

ns.ima.storage.Storage = Storage;
