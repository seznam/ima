import ns from '../namespace';
import Storage from './Storage';

ns.namespace('ima.storage');

/**
 * Implementation of the {@codelink Storage} interface that relies on the
 * native {@code Map} for storage.
 *
 * @class Map
 * @implements Storage
 * @namespace ima.storage
 * @module ima
 * @submodule ima.storage
 *
 * @requires Map
 */
export default class MapStorage extends Storage {

	static get $dependencies() {
		return [];
	}

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

ns.ima.storage.MapStorage = MapStorage;
