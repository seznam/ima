/* eslint-disable @typescript-eslint/ban-ts-comment */
import { toMockedInstance } from 'to-mock';
import GenericError from '../../error/GenericError';
import RouterMiddleware from '../RouterMiddleware';

describe('ima.core.router.RouterMiddleware', () => {
  const middlewareMock = jest.fn();
  let middleware = toMockedInstance(RouterMiddleware);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if middleware argument is not provided or is not a function', () => {
    // @ts-ignore
    expect(() => new RouterMiddleware('middleware')).toThrow(GenericError);
    // @ts-ignore
    expect(() => new RouterMiddleware(undefined)).toThrow(GenericError);
    // @ts-ignore
    expect(() => new RouterMiddleware(true, [], {}, 'foo')).toThrow(
      GenericError
    );
  });

  describe('run method', () => {
    it('should run middleware with params and locals', async () => {
      middleware = new RouterMiddleware(middlewareMock);

      await middleware.run('params', 'locals');

      expect(middlewareMock).toHaveBeenCalledWith('params', 'locals');
    });
  });
});
