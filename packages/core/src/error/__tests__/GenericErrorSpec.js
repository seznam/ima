import { GenericError } from '../GenericError';

describe('GenericError', () => {
  it('throws instance of native error', () => {
    expect(() => {
      throw new GenericError('My Message');
    }).toThrow(Error);
  });

  it('can get http status', () => {
    const error = new GenericError('My Message', { status: 502 });

    expect(error.getHttpStatus()).toBe(502);
  });

  it('can get params', () => {
    const params = { status: 502, cause: new Error('Native Error Cause') };
    const error = new GenericError('My Message', params);

    expect(error.getParams()).toEqual(params);
  });

  it('can define error cause', () => {
    const params = { cause: new Error('Native Error Cause') };
    const error = new GenericError('My Message', params);

    expect(error.cause).toEqual(params.cause);
  });

  it('can detect client error', () => {
    const error = new GenericError('My Message', { status: 404 });

    expect(error.isClientError()).toBe(true);
  });

  it('can detect non-client error', () => {
    const error = new GenericError('My Message', { status: 302 });

    expect(error.isClientError()).toBe(false);
  });

  it('can detect redirect error', () => {
    const error = new GenericError('My Message', { status: 302 });

    expect(error.isRedirection()).toBe(true);
  });

  it('can detect non-redirect error', () => {
    const error = new GenericError('My Message', { status: 404 });

    expect(error.isRedirection()).toBe(false);
  });
});
