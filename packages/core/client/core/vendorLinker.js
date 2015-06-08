import ns from 'imajs/client/core/namespace.js';

var vendor;
if (typeof window !== 'undefined' && window !== null) {
	vendor = window.$IMA.Vendor;
} else {
	var vendorScript = require('./vendor.server.js');
	vendor = vendorScript();
}

var nsVendor = ns.namespace('Vendor');
for (var [name, lib] of vendor) {
	nsVendor[name] = lib;
}

export default vendor;
