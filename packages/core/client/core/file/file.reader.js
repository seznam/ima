import ns from 'core/namespace/ns.js';

ns.namespace('Core.File');

/**
 * Class of File Reader. File Reader is used for load and read files, images and etc.
 * Usable only on CLIENT!
 *
 * @class Reader

 * @namespace Core.FileReader
 * @module Core
 */
class Reader {
	/**
	 * @constructor
	 * @method constructor
	 */
	constructor(fileFactory, promise) {
		/**
		 * @property _filefactory
		 * @type {FileFactory}
		 */
		 this._fileFactory = fileFactory;
		

		/**
		 * @property _promise
		 * @type {Promise}
		 */
		this._promise = promise;
	}

	/**
	 * Loads/reads file as data URL from file.
	 *
	 * @method loadFile
	 * @param {File} file - File Object from HTML input.
	 */
	loadFile(file) {
		var fr = this._fileFactory.createReader();
		return (
			new this._promise((resolve, reject) => {
				
				fr.onload = 
					() => {
						resolve(fr.result);
					};

				fr.onabort = 
					(params) => {
						var error = ns.oc.create('Error', 'Core.File.Reader:loadFile was aborted.', params);
						reject(error);
					};

				fr.onerror = 
					(params) => {
						var error = ns.oc.create('Error', 'Core.File.Reader:loadFile finish with error.', params);
						reject(error);
					};

				fr.readAsDataURL(file);
			})
		);
	}
}

ns.Core.File.Reader = Reader;