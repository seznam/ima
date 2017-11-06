import ns from '../namespace';

ns.namespace('ima.error');

/**
 * Base class of custom error classes, extending the native {@linkcode Error}
 * class.
 *
 * This class has been introduced to fix the Babel-related issues with
 * extending the native JavaScript (Error) classes.
 *
 * @abstract
 * @class
 * @extends Error
 * @param {string} message The message describing the cause of the error.
 * @param {boolean=} dropInternalStackFrames Whether or not the call stack
 *        frames referring to the constructors of the custom errors should be
 *        excluded from the stack of this error (just like the native platform
 *        call stack frames are dropped by the JS engine).
 *        This flag is enabled by default.
 */
export default function ExtensibleError(
	message,
	dropInternalStackFrames = true
) {
	if (!(this instanceof ExtensibleError)) {
		throw new TypeError('Cannot call a class as a function');
	}
	if (this.constructor === ExtensibleError) {
		throw new TypeError(
			'The ExtensibleError is an abstract class and ' +
				'must be extended before it can be instantiated.'
		);
	}

	Error.call(this, message); // super-constructor call;

	/**
	 * The name of this error, used in the generated stack trace.
	 *
	 * @type {string}
	 */
	this.name = this.constructor.name;

	/**
	 * The message describing the cause of the error.
	 *
	 * @type {string}
	 */
	this.message = message;

	/**
	 * Native error instance we use to generate the call stack. For some reason
	 * some browsers do not generate call stacks for instances of classes
	 * extending the native {@codelink Error} class, so we bypass this
	 * shortcoming this way.
	 *
	 * @type {Error}
	 */
	this._nativeError = new Error(message);
	this._nativeError.name = this.name;

	// improve compatibility with Gecko
	if (this._nativeError.columnNumber) {
		this.lineNumber = this._nativeError.lineNumber;
		this.columnNumber = this._nativeError.columnNumber;
		this.fileName = this._nativeError.fileName;
	}

	/**
	 * The internal cache of the generated stack. The cache is filled upon
	 * first access to the {@codelink stack} property.
	 *
	 * @type {?string}
	 */
	this._stack = null;

	/**
	 * Whether or not the call stack frames referring to the constructors of
	 * the custom errors should be excluded from the stack of this error (just
	 * like the native platform call stack frames are dropped by the JS
	 * engine).
	 *
	 * @type {boolean}
	 */
	this._dropInternalStackFrames = dropInternalStackFrames;
}

ExtensibleError.prototype = Object.create(Error.prototype);
ExtensibleError.prototype.constructor = ExtensibleError;

/**
 * The call stack captured at the moment of creation of this error. The
 * formatting of the stack is browser-dependant.
 *
 * @return {string} The call stack captured at the moment of creation of this
 *         error.
 */
Object.defineProperty(ExtensibleError.prototype, 'stack', {
	configurable: true,
	enumerable: false,
	get: function() {
		if (this._stack) {
			return this._stack;
		}

		let stack = this._nativeError.stack;
		if (typeof stack !== 'string') {
			return undefined;
		}

		// drop the stack trace frames referring to the custom error
		// constructors
		if (this._dropInternalStackFrames) {
			let stackLines = stack.split('\n');

			let inheritanceDepth = 1;
			let currentPrototype = Object.getPrototypeOf(this);
			while (currentPrototype !== ExtensibleError.prototype) {
				currentPrototype = Object.getPrototypeOf(currentPrototype);
				inheritanceDepth++;
			}
			stackLines.splice(1, inheritanceDepth);

			this._stack = stackLines.join('\n');
		} else {
			this._stack = stack;
		}

		return this._stack;
	}
});

ns.ima.error.ExtensibleError = ExtensibleError;
