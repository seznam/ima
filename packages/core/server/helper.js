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


	return {assignRecursively};
})();