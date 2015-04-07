/**
 * @class Field
 * @namespace Server.Test.Api
 */

class Field{

	/**
	 * @method constructor
	 * @constructor
	 * @param {String} type
	 * @param {Array} data - Array of mixed values
	 */
	constructor(type, data = []) {
		/**
		 * @property _type
		 * @private
		 * @type {String}
		 * @default type
		 */
		this._type = type;

		/**
		 * Array of mixed value for concrete field.
		 *
		 * @property _data
		 * @private
		 * @type {Array}
		 * @default data
		 */
		this._data = data;

		/**
		 * @property _errors
		 * @private
		 * @type {Array}
		 * @default []
		 */
		this._errors = [];
	}

	/**
	 * Return type of field.
	 *
	 * @method getType
	 * @return {String}
	 */
	getType() {
		return this._type;
	}

	/**
	 * Return all errors.
	 *
	 * @method getErrors
	 * @return {Array}
	 */
	getErrors() {
		return this._errors;
	}

	/**
	 * Return true for valid value.
	 *
	 * @method validate
	 * @param {Mixed} value
	 * @return {Boolean}
	 */
	validate(value) {
		var result = false;

		switch (this._type) {
			case 'Number':
				result = !isNaN(parseFloat(value)) && isFinite(value);
				break;
			case 'String':
				result = typeof value === 'string' || value instanceof String;
				break;
			case 'Date':
				result = new Date(value) !== 'Invalid Date' && !isNaN(new Date(value)) ;
				break;
			case 'DateOrEmpty':
				result = new Date(value) !== 'Invalid Date' && !isNaN(new Date(value)) || value === '';
				break;
			case 'Boolean':
				result = typeof value === 'boolean' || value === 'true' || value === 'false' || value === '1' || value === '0';
				break;
			case 'Enum':
				result = this._data.indexOf(value) !== -1;
				if (result === false) {
					this._errors.push(new Error(`Enum possible value are ${this._data.join(',')}. You give ${value}.`))
				}
				break;
			case 'Object':
				result = typeof value === 'object';
				break;
			case 'Array':
				result = Array.isArray(value);

				if (result && this._data instanceof Field) {

					for (var arrayValue of value) {

						if (!this._data.validate(arrayValue)) {
							this._errors.push(new Error(`Array: Key isnt type of ${this._data.getType()}. Additional errors: ${this._data.getErrors().map((error) => error.message).concat()}`));
						}
					}

					result = this._errors.length === 0;
				}

				break;
			case 'EnumObject':

				var possibleVariants = this._data.filter((filteredVariant) => {
					for (var valueKey of Object.keys(value)) {

						if (!filteredVariant[valueKey]) {
							//console.log('Doesnt key', valueKey, filteredVariant);
							return false;
						}
						return true;
					}
				});

				if (possibleVariants.length > 0) {

					for (var variant of possibleVariants) {
						var testedVariant = {
							errors: []
						};

						for (var variantKey of Object.keys(variant)) {
							var rule = variant[variantKey];

							if (!rule.validate(value[variantKey])) {
								testedVariant.errors.push(new Error(`EnumObject: Key ${variantKey} isnt type of ${rule.getType()}. Additional errors: ${rule.getErrors().map((error) => error.message).concat()}`));
							}

						}

						if (this._errors.length > testedVariant.errors.length || possibleVariants.length === 1) {
							this._errors = testedVariant.errors;
						}
					}

					if (this._errors.length === 0) {
						result = true;
					}

				} else {
					this._errors.push(new Error(`EnumObject hasnt possible variant.`));
				}

				break;
		}

		return result;
	}
}

module.exports = Field;