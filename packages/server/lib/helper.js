'use strict';
var clone = require('clone');

module.exports = (function () {

	var assignRecursively = function (target) {
		var sources = [].slice.call(arguments, 1);
		sources.forEach(function (source)  { assign(target, source) });

		return target;

		function assign(target, source) {
			Object.keys(source).forEach(function (field) {
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
			});
		}
	};

	var debounce = function (func, wait) {
		if (arguments.length < 2) {
			wait = 100;
		}
		var timeout = null;

		return function () {
			var args = [].slice.call(arguments);
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				func.apply(null, args);
			}, wait);
		};
	};

	var throttle = function (func, interval, scope) {
		if (arguments.length < 2) {
			interval = 100;
		}
		if (arguments.length < 3) {
			scope = null;
		}
		var timeout = null;
		var args = [];
		var shouldFireMethod = false;

		if (scope) {
			func= func.bind(scope);
		}

		var fireMethod = function () {
			timeout = setTimeout(function () {
				timeout = null;
				if (shouldFireMethod) {
					shouldFireMethod = false;
					fireMethod();
				}
			}, interval);
			func.apply(null, args);
		};

		return function () {
			var rest = [].slice.call(arguments);
			args = rest;

			if (!timeout) {
				fireMethod();
			} else {
				shouldFireMethod = true;
			}
		};
	};

	var allPromiseHash = function (hash) {
		var keys = Object.keys(hash);
		var loadPromises = keys.map(function (key) {
			return Promise.resolve(hash[key]);
		});

		return Promise
				.all(loadPromises)
				.then(function (resolvedValues) {
					var result = {};

					keys.forEach(function (key) {
						result[key] = resolvedValues.shift();
					});

					return result;
				});
	};

	var escapeRegExp = function (string) {
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	};

	return {
		assignRecursively: assignRecursively,
		allPromiseHash: allPromiseHash,
		escapeRegExp: escapeRegExp,
		clone: clone,
		debounce: debounce,
		throttle: throttle
	};
})();
