'use strict';

/**
 * Utility for linking vendor node modules with the application by exporting
 * them to the IMA loader's modules.
 */
class VendorLinker extends Map {
	/**
	 * Sets the provided vendor node module to the internal registry of this
	 * vendor linker, and registers an IMA loader module of the same name,
	 * exporting the same values.
	 *
	 * @param {string} moduleName The name of the module.
	 * @param {Object<string, *>} moduleValues Values exported from the module.
	 */
	set(moduleName, moduleValues) {
		super.set(moduleName, moduleValues);

		$IMA.Loader.register(moduleName, [], (exports) => ({
			setters: [],
			execute: () => {
				// commonjs module compatibility
				exports('default', moduleValues);
				// ES2015 module compatibility
				for (let key of Object.keys(moduleValues)) {
					exports(key, moduleValues[key]);
				}
			}
		}));
	}

	/**
	 * Binds the vendor modules loaded in this vendor linker to the
	 * {@code Vendor} sub-namespace of the provided namespace.
	 *
	 * @param {Namespace} ns The namespace to which the vendor modules should
	 *        be bound.
	 */
	bindToNamespace(ns) {
		let nsVendor = ns.namespace('vendor');
		for (let [name, lib] of this) {
			if (typeof lib.__$IMAModuleRegister__ === 'function') {
				lib.__$IMAModuleRegister__(ns);
			}

			nsVendor[name] = lib;
		}
	}
}

let vendorLinker = new VendorLinker();

module.exports = vendorLinker;
$IMA.Loader.register('ima/vendorLinker', [], (exports) => {
	return {
		setters: [],
		execute: () => {
			exports('default', vendorLinker);
		}
	};
});
