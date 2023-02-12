import { UnknownParameters } from '../types';

/**
 * The IMA application error extends the native `Error` with additional details
 * that lead to the error and the HTTP status code to send to the client.
 */
export abstract class IMAError extends Error {
  constructor(message: string, params?: { cause?: Error | string }) {
    super(message, { cause: params?.cause });
  }

  /**
   * Returns the HTTP status to send to the client.
   *
   * If the error has occurred at the client-side, the status code is used to
   * determine the error page to show to the user.
   *
   * This method is a shorthand for the following code snippet:
   * `this.getParams().status || 500`.
   *
   * @return The HTTP status to send to the client.
   * @see http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
   */
  getHttpStatus() {
    return 500;
  }

  /**
   * Returns the error parameters providing additional details about the
   * error. The structure of the returned object is always
   * situation-dependent, but the returned object usually contains the
   * `status: number` field which represents the HTTP status to send to
   * the client.
   *
   * @return The route parameters of the route at which
   *         the error has occurred.
   * @see Error#getHttpStatus
   */
  getParams(): UnknownParameters {
    return {};
  }

  /**
   * Tests, whether the specified error was caused by the
   * client's action (for example wrong URL or request encoding).
   *
   * @return `true` if the error was caused the action of the
   *         client.
   */
  isClientError(): boolean {
    return false;
  }

  /**
   * Tests, whether the specified error should lead to a redirect.
   *
   * @return `true` if the error should cause a redirect.
   */
  isRedirection(): boolean {
    return false;
  }
}
