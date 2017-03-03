'use strict';

const clone = require('clone');

function assignRecursively(target, ...sources) {
	for (let source of sources) {
		assign(target, source);
	}

	return target;

	function assign(target, source) {
		for (let field of Object.keys(source)) {
			let value = source[field];
			if (value instanceof Array) {
				target[field] = value.slice();
			} else if (
				value instanceof Object &&
				!(value instanceof Function)
			) {
				if (!(target[field] instanceof Object)) {
					target[field] = {};
				}

				assign(target[field], value);
			} else {
				target[field] = value;
			}
		}
	}
}

function deepFreeze(object) {
	if (!(object instanceof Object)) {
		return object;
	}

	for (let property of Object.keys(object)) {
		deepFreeze(object[property]);
	}

	return Object.freeze(object);
}

function debounce(func, wait = 100) {
	let timeout = null;

	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(...args);
		}, wait);
	};
}

function throttle(func, interval = 100, scope = null) {
	let timeout = null;
	let args = [];
	let shouldFireFunction = false;

	if (scope) {
		func= func.bind(scope);
	}

	function callCallback() {
		timeout = setTimeout(() => {
			timeout = null;
			if (shouldFireFunction) {
				shouldFireFunction = false;
				callCallback();
			}
		}, interval);
		func(...args);
	}

	return (...currentArgs) => {
		args = currentArgs;

		if (!timeout) {
			callCallback();
		} else {
			shouldFireFunction = true;
		}
	};
}

function allPromiseHash(hash) {
	let keys = Object.keys(hash);
	let loadPromises = keys.map(key => Promise.resolve(hash[key]));

	return Promise
		.all(loadPromises)
		.then(resolvedValues => {
			let result = {};

			for (let key of keys) {
				result[key] = resolvedValues.shift();
			}

			return result;
		});
}

function escapeRegExp(string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

module.exports = {
	assignRecursively,
	deepFreeze,
	allPromiseHash,
	escapeRegExp,
	clone,
	debounce,
	throttle
};
