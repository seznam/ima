import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Interface');

/**
 * The {@codelink Storage} is an unordered collection of named values of any
 * type. Values in the storage are named using {@code string} keys. The storage
 * can be therefore thought of as a {@code Map<string, *>}.
 *
 * @interface Storage
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class Storage {
	/**
	 * This method is used to finalize the initialization of the storage after
	 * the dependencies provided through the constructor are ready to be used.
	 *
	 * This method must be invoked only once and it must be the first method
	 * invoked on this instance.
	 *
	 * @chainable
	 * @method init
	 * @return {Core.Interface.Storage}
	 */
	init() {}

	/**
	 * Returns {@code true} if the entry identified by the specified key exists
	 * in this storage.
	 *
	 * @method has
	 * @param {string} key The key identifying the storage entry.
	 * @return {boolean} {@code true} if the storage entry exists.
	 */
	has(key) {}

	/**
	 * Retrieves the value of the entry indetified by the specified key. The
	 * method returns {@code undefined} if the entry does not exists.
	 *
	 * Entries set to the {@code undefined} value can be tested for existence
	 * using the {@codelink has} method.
	 *
	 * @method get
	 * @param {string} key The key identifying the storage entry.
	 * @return {*} The value of the storage entry.
	 */
	get(key) {}

	/**
	 * Sets the storage entry identied by the specified key to the provided
	 * value. The method creates the entry if it does not exist already.
	 *
	 * @chainable
	 * @method set
	 * @param {string} key The key identifying the storage entry.
	 * @param {*} value The storage entry value.
	 * @return {Core.Interface.Storage} This storage.
	 */
	set(key, value) {}

	/**
	 * Deletes the entry identified by the specified key from this storage.
	 *
	 * @chainable
	 * @method delete
	 * @param {string} key The key identifying the storage entry.
	 * @return {Core.Interface.Storage} This storage.
	 */
	delete(key) {}

	/**
	 * Clears the storage of all entries.
	 *
	 * @chainable
	 * @method clear
	 * @return {Core.Interface.Storage} This storage.
	 */
	clear() {}

	/**
	 * Returns an iterator for traversing the keys in this storage. The order
	 * in which the keys are traversed is undefined.
	 *
	 * @method keys
	 * @return {Iterator<string>} An iterator for traversing the keys in this
	 *         storage. The iterator also implements the iterable protocol,
	 *         returning itself as its own iterator, allowing it to be used in
	 *         a {@code for..of} loop.
	 */
	keys() {}

	/**
	 * Returns storage size.
	 *
	 * @method size
	 * @return {number}
	 */
	size() {}
}

ns.Core.Interface.Storage = Storage;
