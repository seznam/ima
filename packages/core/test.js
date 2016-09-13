var root = (typeof window !== 'undefined' && window !== null) ? window : global;
root.$IMA = root.$IMA || {};
root.$IMA.Test = true;

root.extend = extend;
root.using = using;
root.$import = $import;

function using(values, func) { //jshint ignore:line
	for (var i = 0, count = values.length; i < count; i++) {
		if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
			values[i] = [values[i]];
		}
		func.apply(this, values[i]);
	}
}

function extend(ChildClass, ParentClass) {
	ChildClass.prototype = new ParentClass();
	ChildClass.prototype.constructor = ChildClass;
}

function $import() {
	var modules = Array.prototype.slice.call(arguments)
		.map(function(path) {
			return $IMA.Loader.importSync(path);
		});

	if (modules.length === 1) {
		return modules[0];
	}

	return modules;
}
