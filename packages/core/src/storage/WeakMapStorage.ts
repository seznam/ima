import MapStorage from './MapStorage';

/**
 * A specialization of the `link MapStorage` storage mimicking the native
 * `WeakMap` using its internal garbage collector used once the size of
 * the storage reaches the configured threshold.
 */
export default class WeakMapStorage<V = object> extends MapStorage<V> {
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
   * @inheritDoc
   */
  has(key: string): boolean {
    this._discardExpiredEntries();

    return super.has(key);
  }

  /**
   * @inheritDoc
   */
  get(key: string): V | undefined {
    this._discardExpiredEntries();

    if (!super.has(key)) {
      return undefined;
    }

    // Hacky cast solution to WeakRef being wrapper around set value
    return (super.get(key) as WeakRef<V>)?.target ?? undefined;
  }

  /**
   * @inheritDoc
   */
  set(key: string, value: V): this {
    this._discardExpiredEntries();

    // Hacky cast solution to WeakRef being wrapper around set value
    return super.set(key, new WeakRef<V>(value, this._entryTtl) as V);
  }

  /**
   * @inheritDoc
   */
  delete(key: string): this {
    this._discardExpiredEntries();

    return super.delete(key);
  }

  /**
   * @inheritDoc
   */
  keys(): Iterable<string> {
    this._discardExpiredEntries();

    return super.keys();
  }

  /**
   * @inheritDoc
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

      if (!(targetReference as WeakRef<V>).target) {
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
class WeakRef<V = object> {
  /**
   * The actual target reference, or `null` if the reference has
   * been already discarded.
   */
  private _reference: V | null;
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
  constructor(target: V, ttl: number) {
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
  get target(): V | null {
    if (this._reference && Date.now() >= this._expiration) {
      this._reference = null; // let the GC do its job
    }

    return this._reference;
  }
}
