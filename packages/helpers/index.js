'use strict';
let clone = require('clone');

function assignRecursively(target) {
	let sources = [].slice.call(arguments, 1);
	sources.forEach(source => assign(target, source));

	return target;

	function assign(target, source) {
		Object.keys(source).forEach((field) => {
			if (source[field] instanceof Array) {
				target[field] = source[field].slice();
			} else if (source[field] instanceof Object &&
					!(source[field] instanceof Function)) {
						
				if (!(target[field] instanceof Object)) {
					target[field] = {};
				}

				assign(target[field], source[field]);
			} else {
				target[field] = source[field];
			}
		});
	}
}

function debounce(func, wait) {
	if (arguments.length < 2) {
		wait = 100;
	}
	let timeout = null;

	return function () {
		let args = [].slice.call(arguments);
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
}

function throttle(func, interval, scope) {
	if (arguments.length < 2) {
		interval = 100;
	}
	if (arguments.length < 3) {
		scope = null;
	}
	let timeout = null;
	let args = [];
	let shouldFireMethod = false;

	if (scope) {
		func= func.bind(scope);
	}

	function callCallback() {
		timeout = setTimeout(function () {
			timeout = null;
			if (shouldFireMethod) {
				shouldFireMethod = false;
				callCallback();
			}
		}, interval);
		func(...args);
	}

	return function () {
		let rest = [].slice.call(arguments);
		args = rest;

		if (!timeout) {
			callCallback();
		} else {
			shouldFireMethod = true;
		}
	};
}

function allPromiseHash(hash) {
	let keys = Object.keys(hash);
	let loadPromises = keys.map(key => Promise.resolve(hash[key]));

	return Promise
		.all(loadPromises)
		.then((resolvedValues) => {
			let result = {};

			keys.forEach((key) => {
				result[key] = resolvedValues.shift();
			});

			return result;
		});
}

function escapeRegExp(string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

module.exports = {
	assignRecursively,
	allPromiseHash,
	escapeRegExp,
	clone,
	debounce,
	throttle
};
