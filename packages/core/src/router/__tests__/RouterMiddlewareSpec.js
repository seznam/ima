import GenericError from '../../error/GenericError';
import RouterMiddleware from '../RouterMiddleware';

describe('ima.core.router.RouterMiddleware', () => {
  let middlewareMock = jest.fn();
  var middleware = null;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if middleware argument is not provided or is not a function', () => {
    expect(() => new RouterMiddleware('middleware')).toThrow(GenericError);
    expect(() => new RouterMiddleware(undefined)).toThrow(GenericError);
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
