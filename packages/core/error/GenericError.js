import Error from './Error';

/**
 * Implementation of the ima.error.Error interface, providing more advanced
 * error API.
 */
export default class GenericError extends Error {
  /**
	 * Initializes the generic IMA error.
	 *
	 * @param {string} message The message describing the cause of the error.
	 * @param {Object<string, *>=} [params={}] A data map providing additional
	 *        details related to the error. It is recommended to set the
	 *        {@code status} field to the HTTP response code that should be sent
	 *        to the client.
	 * @param {boolean=} dropInternalStackFrames Whether or not the call stack
	 *        frames referring to the constructors of the custom errors should
	 *        be excluded from the stack of this error (just like the native
	 *        platform call stack frames are dropped by the JS engine).
	 *        This flag is enabled by default.
	 */
  constructor(message, params = {}, dropInternalStackFrames = true) {
    super(message, dropInternalStackFrames);

    /**
		 * The data providing additional details related to this error.
		 *
		 * @type {Object<string, *>}
		 */
    this._params = params;
  }

  /**
	 * @inheritdoc
	 */
  getHttpStatus() {
    return this._params.status || 500;
  }

  /**
	 * @inheritdoc
	 */
  getParams() {
    return this._params;
  }
}
