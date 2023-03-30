import { GenericError } from './GenericError';

/**
 * Extension of GenericError which is used in route handling ot cancel
 * currently managed route before proceeding with execution with new one.
 */
export class CancelError extends GenericError<{ status: 409 }> {
  constructor(message = 'Canceled') {
    super(message, {
      status: 409,
    });
  }
}
