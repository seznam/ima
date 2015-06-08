var vendor = new Map();
var helper = require('./helper.js');

vendor.set('React', function () {});
vendor.set('SuperAgent', function () {});
vendor.set('$Helper', helper);

if (typeof window !== 'undefined' && window !== null) {
	window.$IMA = window.$IMA || {};
	window.$IMA.Vendor = vendor;
}
