module.exports = (() => {

	/**
	 * Instance Recycler.
	 *
	 * @class InstanceRecycler
	 */
	class InstanceRecycler {
		/**
		 * @method constructor
		 */
		constructor() {
			this.instanceConstructor = null;
			this.maxInstanceCount = 1;
			this.instancies = [];
		}

		init(instanceConstructor, maxInstanceCount = 1) {
			this.instanceConstructor = instanceConstructor;
			this.maxInstanceCount = maxInstanceCount;

			for(var i = 0; i < maxInstanceCount; i++) {
			  this.instancies.push(this.instanceConstructor());
			}
		}

		getInstance() {
			//console.log('getInstance', this.instancies.length);
			if (this.instancies.length < 1) {
				return this.instanceConstructor();
			} else {
				return this.instancies.pop();
			}
			
		}

		clearInstance(instance) {
			//console.log('clearInstance', this.instancies.length);
			instance.getObjectContainer().clear();
			if (this.instancies.length < this.maxInstanceCount) {
				this.instancies.push(instance);
			}
		}
	}

	return new InstanceRecycler();
})();