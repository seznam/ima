import ns from '../namespace';
import Storage from './Storage';

ns.namespace('ima.storage');

/**
 * Implementation of the {@codelink Storage} interface that relies on the
 * native {@code Map} for storage.
 */
export default class MapStorage extends Storage {
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

ns.ima.storage.MapStorage = MapStorage;
