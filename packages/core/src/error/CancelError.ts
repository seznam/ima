import { GenericError } from './GenericError';

/**
 * Extension of GenericError which is used in route handling ot cancel
 * currently managed route before proceeding with execution with new one.
 */
export class CancelError extends GenericError {
  constructor(message = 'Canceled', params = {}) {
    super(message, params);

    this._params = {
      ...params,
      status: 409,
    };
  }
}
