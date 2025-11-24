const {
  createUserAgentDegradation,
  createPathDegradation,
  createHeaderDegradation,
  combineAnd,
  combineOr,
  invert,
} = require('../degradation');

describe('Degradation Helpers', () => {
  describe('createUserAgentDegradation', () => {
    it('should match user agent with RegExp', () => {
      const degradation = createUserAgentDegradation(/Googlebot|Bingbot/i);
      const event = {
        req: {
          get: jest
            .fn()
            .mockReturnValue('Mozilla/5.0 (compatible; Googlebot/2.1)'),
        },
      };

      expect(degradation(event)).toBe(true);
      expect(event.req.get).toHaveBeenCalledWith('user-agent');
    });

    it('should not match when pattern does not match', () => {
      const degradation = createUserAgentDegradation(/Googlebot/i);
      const event = {
        req: {
          get: jest.fn().mockReturnValue('Mozilla/5.0 Chrome/91.0'),
        },
      };

      expect(degradation(event)).toBe(false);
    });

    it('should use custom function', () => {
      const degradation = createUserAgentDegradation(ua => ua.includes('Bot'));
      const event = {
        req: {
          get: jest.fn().mockReturnValue('MyCustomBot'),
        },
      };

      expect(degradation(event)).toBe(true);
    });

    it('should handle missing user agent', () => {
      const degradation = createUserAgentDegradation(/Bot/i);
      const event = {
        req: {
          get: jest.fn().mockReturnValue(''),
        },
      };

      expect(degradation(event)).toBe(false);
    });
  });

  describe('createPathDegradation', () => {
    it('should match path with RegExp', () => {
      const degradation = createPathDegradation(/^\/api\//);
      const event = { req: { originalUrl: '/api/users' } };

      expect(degradation(event)).toBe(true);
    });

    it('should match path with string prefix', () => {
      const degradation = createPathDegradation('/admin');
      const event = { req: { originalUrl: '/admin/dashboard' } };

      expect(degradation(event)).toBe(true);
    });

    it('should match path with array of prefixes', () => {
      const degradation = createPathDegradation(['/static', '/assets']);
      const event1 = { req: { originalUrl: '/static/css/main.css' } };
      const event2 = { req: { originalUrl: '/assets/img/logo.png' } };
      const event3 = { req: { originalUrl: '/api/users' } };

      expect(degradation(event1)).toBe(true);
      expect(degradation(event2)).toBe(true);
      expect(degradation(event3)).toBe(false);
    });

    it('should use custom function', () => {
      const degradation = createPathDegradation(
        path => path.startsWith('/api/') && path.includes('/heavy')
      );
      const event = { req: { originalUrl: '/api/data/heavy-operation' } };

      expect(degradation(event)).toBe(true);
    });
  });

  describe('createHeaderDegradation', () => {
    it('should check if header exists', () => {
      const degradation = createHeaderDegradation('authorization');
      const event = {
        req: {
          get: jest.fn().mockReturnValue('Bearer token123'),
        },
      };

      expect(degradation(event)).toBe(true);
    });

    it('should match header value with string', () => {
      const degradation = createHeaderDegradation(
        'content-type',
        'application/json'
      );
      const event = {
        req: {
          get: jest.fn().mockReturnValue('application/json'),
        },
      };

      expect(degradation(event)).toBe(true);
    });

    it('should match header value with RegExp', () => {
      const degradation = createHeaderDegradation(
        'user-agent',
        /Mobile|Android/i
      );
      const event = {
        req: {
          get: jest.fn().mockReturnValue('Mozilla/5.0 (Android; Mobile)'),
        },
      };

      expect(degradation(event)).toBe(true);
    });

    it('should use custom function', () => {
      const degradation = createHeaderDegradation(
        'x-custom',
        value => value.length > 10
      );
      const event = {
        req: {
          get: jest.fn().mockReturnValue('very-long-header-value'),
        },
      };

      expect(degradation(event)).toBe(true);
    });
  });

  describe('combineAnd', () => {
    it('should return true when all functions return true', () => {
      const fn1 = jest.fn().mockReturnValue(true);
      const fn2 = jest.fn().mockReturnValue(true);
      const fn3 = jest.fn().mockReturnValue(true);

      const combined = combineAnd(fn1, fn2, fn3);
      const event = { test: 'data' };

      expect(combined(event)).toBe(true);
      expect(fn1).toHaveBeenCalledWith(event);
      expect(fn2).toHaveBeenCalledWith(event);
      expect(fn3).toHaveBeenCalledWith(event);
    });

    it('should return false when any function returns false', () => {
      const fn1 = jest.fn().mockReturnValue(true);
      const fn2 = jest.fn().mockReturnValue(false);
      const fn3 = jest.fn().mockReturnValue(true);

      const combined = combineAnd(fn1, fn2, fn3);
      expect(combined({})).toBe(false);
    });
  });

  describe('combineOr', () => {
    it('should return true when any function returns true', () => {
      const fn1 = jest.fn().mockReturnValue(false);
      const fn2 = jest.fn().mockReturnValue(true);
      const fn3 = jest.fn().mockReturnValue(false);

      const combined = combineOr(fn1, fn2, fn3);
      expect(combined({})).toBe(true);
    });

    it('should return false when all functions return false', () => {
      const fn1 = jest.fn().mockReturnValue(false);
      const fn2 = jest.fn().mockReturnValue(false);
      const fn3 = jest.fn().mockReturnValue(false);

      const combined = combineOr(fn1, fn2, fn3);
      expect(combined({})).toBe(false);
    });
  });

  describe('invert', () => {
    it('should invert true to false', () => {
      const fn = jest.fn().mockReturnValue(true);
      const inverted = invert(fn);

      expect(inverted({})).toBe(false);
    });

    it('should invert false to true', () => {
      const fn = jest.fn().mockReturnValue(false);
      const inverted = invert(fn);

      expect(inverted({})).toBe(true);
    });
  });

  describe('Complex scenarios', () => {
    it('should combine multiple helpers correctly', () => {
      const botCheck = createUserAgentDegradation(/Googlebot/i);
      const pathCheck = createPathDegradation('/products');
      const methodCheck = event => event.req.method === 'GET';

      const combined = combineAnd(combineOr(botCheck, pathCheck), methodCheck);

      // Bot + GET = true
      const event1 = {
        req: {
          get: jest.fn().mockReturnValue('Googlebot'),
          originalUrl: '/home',
          method: 'GET',
        },
      };
      expect(combined(event1)).toBe(true);

      // Products + GET = true
      const event2 = {
        req: {
          get: jest.fn().mockReturnValue('Chrome'),
          originalUrl: '/products/item',
          method: 'GET',
        },
      };
      expect(combined(event2)).toBe(true);

      // Bot + POST = false (method mismatch)
      const event3 = {
        req: {
          get: jest.fn().mockReturnValue('Googlebot'),
          originalUrl: '/home',
          method: 'POST',
        },
      };
      expect(combined(event3)).toBe(false);

      // Neither bot nor products path = false
      const event4 = {
        req: {
          get: jest.fn().mockReturnValue('Chrome'),
          originalUrl: '/home',
          method: 'GET',
        },
      };
      expect(combined(event4)).toBe(false);
    });

    it('should work with invert in complex scenarios', () => {
      const hasAuth = createHeaderDegradation('authorization');
      const isHeavyPath = createPathDegradation('/heavy-operation');

      // Heavy operation but NOT authenticated
      const combined = combineAnd(isHeavyPath, invert(hasAuth));

      const event1 = {
        req: {
          get: jest.fn().mockReturnValue(''),
          originalUrl: '/heavy-operation',
        },
      };
      expect(combined(event1)).toBe(true);

      const event2 = {
        req: {
          get: jest.fn().mockReturnValue('Bearer token'),
          originalUrl: '/heavy-operation',
        },
      };
      expect(combined(event2)).toBe(false);
    });
  });
});
