// TODO IMA@20 keep only for backwards compatibility. IMA@20 will be removed.
/**
 * Instance Recycler.
 *
 * @class InstanceRecycler
 */
class InstanceRecycler {
  constructor() {
    this._instances = [];
  }

  clear() {
    this._maxInstanceCount = 0;
    this._concurrentRequests = 0;
    this._initialized = false;
    this._instances = [];
  }

  init(instanceFactory, maxInstanceCount = 1) {
    if (this.isInitialized()) {
      throw new Error(
        'InstanceRecycler is already initialized. Use the ' +
          'clear() method first to re-initialize.'
      );
    }

    this._initialized = true;
    this._instanceFactory = instanceFactory;
    this._maxInstanceCount = maxInstanceCount;

    for (let i = 0; i < maxInstanceCount; i++) {
      this._instances.push(this._instanceFactory());
    }
  }

  isInitialized() {
    return this._initialized;
  }

  hasNextInstance() {
    return this._instances.length > 0;
  }

  hasReachedMaxConcurrentRequests() {
    return this._concurrentRequests >= this._maxInstanceCount;
  }

  getConcurrentRequests() {
    return this._concurrentRequests;
  }

  getInstance() {
    this._concurrentRequests++;

    if (this.hasNextInstance()) {
      return this._instances.shift();
    } else {
      return this._instanceFactory();
    }
  }

  clearInstance(instance) {
    this._concurrentRequests--;
    instance.oc.clear();

    if (this._instances.length < this._maxInstanceCount) {
      this._instances.push(instance);
    }
  }
}

const instanceRecycler = new InstanceRecycler();
instanceRecycler.clear();

module.exports = instanceRecycler;
