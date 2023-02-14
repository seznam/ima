import { IMAError } from './Error';

/**
 * Implementation of the {@link Error} interface, providing more advanced
 * error API.
 *
 * @extends Error
 */
export class GenericError extends IMAError {
  protected _params: {
    cause?: Error | string;
    status?: number;
    [key: string]: unknown;
  };

  /**
   * Initializes the generic IMA error.
   *
   * @param message The message describing the cause of the error.
   * @param params A data map providing additional
   *        details related to the error. It is recommended to set the
   *        `status` field to the HTTP response code that should be sent
   *        to the client.
   */
  constructor(message: string, params = {}) {
    super(message, params);

    /**
     * The data providing additional details related to this error.
     */
    this._params = params;
  }

  /**
   * @inheritDoc
   */
  getHttpStatus(): number {
    return this._params.status || super.getHttpStatus();
  }

  /**
   * @inheritDoc
   */
  getParams() {
    return this._params;
  }

  /**
   * @inheritDoc
   */
  isClientError(): boolean {
    return this.getHttpStatus() >= 400 && this.getHttpStatus() < 500;
  }

  /**
   * @inheritDoc
   */
  isRedirection(): boolean {
    return this.getHttpStatus() >= 300 && this.getHttpStatus() < 400;
  }
}
