var clone = require('clone');

module.exports = (() => {

	var assignRecursively = (target, ...sources) => {
		sources.forEach(source => assign(target, source));

		return target;

		function assign(target, source) {
			Object.keys(source).forEach((field) => {
				if (source[field] instanceof Array) {
					target[field] = source[field].slice();
				} else if (source[field] instanceof Object) {
					if (!(target[field] instanceof Object)) {
						target[field] = {};
					}

					assign(target[field], source[field]);
				} else {
					target[field] = source[field];
				}
			})
		}
	};

	var allPromiseHash = (hash) => {
		var keys = Object.keys(hash);
		var loadPromises = keys.map((key) => Promise.resolve(hash[key]));

		return Promise
				.all(loadPromises)
				.then((resolvedValues) => {
					var result = {};

					for (let key of keys) {
						result[key] = resolvedValues.shift();
					}

					return result;
				});
	};

	var escapeRegExp = (string) => {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	};

	return {assignRecursively, allPromiseHash, escapeRegExp, clone};
})();