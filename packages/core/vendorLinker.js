import ns from 'ima/namespace';

var vendor;
if (typeof window !== 'undefined' && window !== null) {
	vendor = window.$IMA.Vendor;
} else {
	vendor = require('./vendor.server.js');
}

var nsVendor = ns.namespace('vendor');
for (var [name, lib] of vendor) {
	if (typeof lib.__$IMAModuleRegister__ === 'function') {
		lib.__$IMAModuleRegister__(ns);
	}

	nsVendor[name] = lib;
}

// bind the vendor libraries to the module system
$IMA.Loader.register('ima/vendor', [], (_export) => {
	return {
		setters: [],
		execute: () => {
			_export('$Helper', vendor.get('$Helper'));
		}
	};
});

$IMA.Loader.register('app/vendor', [], (_export) => {
	return {
		setters: [],
		execute: () => {
			for (var [name, lib] of vendor) {
				if (name === '$Helper') {
					continue;
				}

				_export(name, lib);
			}
		}
	};
});

export default vendor;
