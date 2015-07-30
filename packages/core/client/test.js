var root = (typeof window !== 'undefined' && window !== null) ? window : GLOBAL;

root.$IMA = root.$IMA || {};
root.$IMA.Test = true;

root.extend = extend;
root.using = using;


function using(values, func){ //jshint ignore:line
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
