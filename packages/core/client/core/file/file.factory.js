import ns from 'core/namespace/ns.js';

ns.namespace('Core.File');

/**
 * Factory for create an instance of FileReader.
 *
 * @class Factory
 * @namespace Core.File
 * @module Core
 * @submodule Core.File
 * */
class Factory {

	/**
	 * @method constructor
	 * @constructor
	 * @param {FileReader} fileReader
	 * */
	constructor(fileReader) {
		/**
		 * @property _fileReader
		 * @type {FileReader}
		 * @default fileReader
		 * */
		this._fileReader = fileReader;

	}

	/**
	 * Creates a new file reader.
	 *
	 * @method createReader
	 * */
	createReader() {
		return new this._fileReader();
	}
}

ns.Core.File.Factory = Factory;