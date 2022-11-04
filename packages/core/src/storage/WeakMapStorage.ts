import MapStorage from './MapStorage';

/**
 * A specialization of the `link MapStorage` storage mimicking the native
 * `WeakMap` using its internal garbage collector used once the size of
 * the storage reaches the configured threshold.
 */
export default class WeakMapStorage extends MapStorage<WeakRef> {
  /**
   * The time-to-live of a storage entry in milliseconds.
   */
  private _entryTtl: number;

  /**
   * Initializes the storage.
   *
   * @param config Weak map storage configuration. The
   *        fields have the following meaning:
   *        - entryTtl The time-to-live of a storage entry in milliseconds.
   */
  constructor(config: { entryTtl: number }) {
    super();

    this._entryTtl = config.entryTtl;
  }

  /**
   * @inheritdoc
   */
  has(key: string): boolean {
    this._discardExpiredEntries();

    return super.has(key);
  }

  /**
   * @inheritdoc
   */
  get(key: string): WeakRef | undefined {
    this._discardExpiredEntries();

    if (super.has(key)) {
      return undefined;
    }

    return super.get(key);
  }

  /**
   * @inheritdoc
   */
  set(key: string, value: object): this {
    this._discardExpiredEntries();

    return super.set(key, new WeakRef(value as object, this._entryTtl));
  }

  /**
   * @inheritdoc
   */
  delete(key: string): this {
    this._discardExpiredEntries();

    return super.delete(key);
  }

  /**
   * @inheritdoc
   */
  keys(): Iterable<string> {
    this._discardExpiredEntries();

    return super.keys();
  }

  /**
   * @inheritdoc
   */
  size(): number {
    this._discardExpiredEntries();

    return super.size();
  }

  /**
   * Deletes all expired entries from this storage.
   */
  _discardExpiredEntries(): void {
    for (const key of super.keys()) {
      const targetReference = super.get(key);
      if (!(targetReference as WeakRef).target) {
        // the reference has died
        super.delete(key);
      }
    }
  }
}

/**
 * A simple reference wrapper that emulates a weak reference. We seem to have
 * no other option, since WeakMap and WeakSet are not enumerable (so what is
 * the point of WeakMap and WeakSet if you still need to manage the keys?!) and
 * there is no native way to create a weak reference.
 */
class WeakRef {
  /**
   * The actual target reference, or `null` if the reference has
   * been already discarded.
   */
  private _reference: object | null;
  /**
   * The UNIX timestamp with millisecond precision marking the moment at
   * or after which the reference will be discarded.
   */
  private _expiration: number;

  /**
   * Initializes the weak reference to the target reference.
   *
   * @param target The target reference that should be referenced by
   *        this weak reference.
   * @param ttl The maximum number of milliseconds the weak
   *        reference should be kept. The reference will be discarded once
   *        ACCESSED after the specified timeout.
   */
  constructor(target: object, ttl: number) {
    if ($Debug) {
      if (!(target instanceof Object)) {
        throw new TypeError(
          'The target reference must point to an object, ' +
            'primitive values are not allowed'
        );
      }
      if (ttl <= 0) {
        throw new Error('The time-to-live must be positive');
      }
    }

    this._reference = target;
    this._expiration = Date.now() + ttl;
  }

  /**
   * Returns the target reference, provided that the target reference is
   * still alive. Returns `null` if the reference has been discarded.
   *
   * @return The target reference, or `null` if the reference
   *         has been discarded by the garbage collector.
   */
  get target() {
    if (this._reference && Date.now() >= this._expiration) {
      this._reference = null; // let the GC do its job
    }

    return this._reference;
  }
}
