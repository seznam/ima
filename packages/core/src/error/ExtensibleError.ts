/**
 * Base class of custom error classes, extending the native `Error` class.
 *
 * This class has been introduced to fix the Babel-related issues with
 * extending the native JavaScript (Error) classes.
 *
 * @param message The message describing the cause of the error.
 * @param dropInternalStackFrames Whether or not the call stack
 *        frames referring to the constructors of the custom errors should be
 *        excluded from the stack of this error (just like the native platform
 *        call stack frames are dropped by the JS engine).
 *        This flag is enabled by default.
 */
export default abstract class ExtensibleError extends Error {
  protected _dropInternalStackFrames: boolean;

  get stack() {
    const stack = super.stack;

    if (typeof stack !== 'string') {
      return undefined;
    }

    // drop the stack trace frames referring to the custom error
    // constructors
    if (this._dropInternalStackFrames) {
      const stackLines = stack.split('\n');

      let inheritanceDepth = 1;
      let currentPrototype = Object.getPrototypeOf(this);
      while (currentPrototype !== ExtensibleError.prototype) {
        currentPrototype = Object.getPrototypeOf(currentPrototype);
        inheritanceDepth++;
      }
      stackLines.splice(1, inheritanceDepth);

      return stackLines.join('\n');
    } else {
      return stack;
    }
  }

  constructor(message: string, dropInternalStackFrames = true) {
    super(message);

    this._dropInternalStackFrames = dropInternalStackFrames;
  }
}
