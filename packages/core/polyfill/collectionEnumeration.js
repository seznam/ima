
// fix for-of for Maps and Sets in IE9 & IE10
if (!Map.prototype[Symbol.iterator]) {
	Map.prototype[Symbol.iterator] = function () {
		return this.entries();
	};
}
if (!Set.prototype[Symbol.iterator]) {
	Set.prototype[Symbol.iterator] = function () {
		return this.values();
	};
}

[Map, Set].forEach(function (collection) {
	if (!(new collection()).entries()[Symbol.iterator]) {
		var entriesMethod = collection.prototype.entries;
		collection.prototype.entries = function () {
			var iterator = entriesMethod.call(this);
			iterator[Symbol.iterator] = function () { return iterator; };
			return iterator;
		};
	}
	if (!(new collection()).keys()[Symbol.iterator]) {
		var keysMethod = collection.prototype.keys;
		collection.prototype.keys = function () {
			var iterator = keysMethod.call(this);
			iterator[Symbol.iterator] = function () { return iterator; };
			return iterator;
		};
	}
	if (!(new collection()).values()[Symbol.iterator]) {
		var valuesMethod = collection.prototype.values;
		collection.prototype.values = function () {
			var iterator = valuesMethod.call(this);
			iterator[Symbol.iterator] = function () { return iterator; };
			return iterator;
		};
	}
});
