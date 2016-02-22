import ns from 'ima/namespace';
import StorageInterface from 'ima/storage/storage';

ns.namespace('Ima.Storage');

/**
 * Implementation of the {@codelink Ima.Storage.Storage} interface that
 * relies on the native {@code Map} for storage.
 *
 * @class Map
 * @implements Ima.Storage.Storage
 * @namespace Ima.Storage
 * @module Ima
 * @submodule Ima.Storage
 *
 * @requires Map
 */
export default class MapStorage extends StorageInterface {
	/**
	 * Initializes the map storage.
	 *
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();

		/**
		 * The internal storage of entries.
		 *
		 * @protected
		 * @property _storage
		 * @type {Map<string, *>}
		 */
		this._storage = new Map();
	}

	/**
	 * @inheritdoc
	 * @method init
	 */
	init() {
		return this;
	}

	/**
	 * @inheritdoc
	 * @method has
	 */
	has(key) {
		return this._storage.has(key);
	}

	/**
	 * @inheritdoc
	 * @method get
	 */
	get(key) {
		return this._storage.get(key);
	}

	/**
	 * @inheritdoc
	 * @method set
	 */
	set(key, value) {
		this._storage.set(key, value);
		return this;
	}

	/**
	 * @inheritdoc
	 * @method delete
	 */
	delete(key) {
		this._storage.delete(key);
		return this;
	}

	/**
	 * @inheritdoc
	 * @method clear
	 */
	clear() {
		this._storage.clear();
		return this;
	}

	/**
	 * @inheritdoc
	 * @method keys
	 */
	keys() {
		return this._storage.keys();
	}

	/**
	 * @override
	 * @method size
	 */
	size() {
		return this._storage.size;
	}
}

ns.Ima.Storage.MapStorage = MapStorage;
