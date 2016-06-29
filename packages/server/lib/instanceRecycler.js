module.exports = (() => {
	'use strict';

	/**
	 * Instance Recycler.
	 *
	 * @class InstanceRecycler
	 */
	class InstanceRecycler {

		clear() {
			this._instanceConstructor = null;
			this._maxInstanceCount = 0;
			this._instancies = [];
			this._concurrencyRequests = 0;
			this._initialized = false;
		}

		init(instanceConstructor, maxInstanceCount) {
			if (this.isInitialized()) {
				throw new Error('InstanceRecycler is initialized. At first you must call ' +
						'clear method for new initialization.');
			}

			if (arguments.length < 2) {
				maxInstanceCount = 1;
			}

			this._initialized = true;
			this._instanceConstructor = instanceConstructor;
			this._maxInstanceCount = maxInstanceCount;

			for(var i = 0; i < maxInstanceCount; i++) {
			  this._instancies.push(this._instanceConstructor());
			}
		}

		isInitialized() {
			return this._initialized;
		}

		hasNextInstance() {
			return this._instancies.length > 0;
		}

		isReachToMaxConcurrencyRequests() {
			return this._concurrencyRequests > this._maxInstanceCount;
		}

		getInstance() {
			this._concurrencyRequests = this._concurrencyRequests + 1;

			if (this.hasNextInstance()) {
				return this._instancies.shift();
			} else {
				return this._instanceConstructor();
			}

		}

		clearInstance(instance) {
			this._concurrencyRequests = this._concurrencyRequests - 1;
			instance.oc.clear();

			if (this._instancies.length < this._maxInstanceCount) {
				this._instancies.push(instance);
			}
		}
	}

	var instanceRecycler = new InstanceRecycler();
	instanceRecycler.clear();

	return instanceRecycler;
})();
