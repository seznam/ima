'use strict';

const path = require('path');

// Create a mock environment config path
const mockConfigPath = path.join(__dirname, '__mocks__', 'test-env-config.js');

// Mock path.resolve to return our test config path
jest.mock('path', () => {
  const actual = jest.requireActual('path');

  return {
    ...actual,
    resolve: jest.fn((...args) => {
      if (args[args.length - 1] === './server/config/environment.js') {
        return mockConfigPath;
      }

      return actual.resolve(...args);
    }),
  };
});

describe('environmentFactory', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = {
      IMA_ENV: process.env.IMA_ENV,
      NODE_ENV: process.env.NODE_ENV,
    };

    // Clear environment variables for clean test state
    delete process.env.IMA_ENV;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    // Restore original environment variables
    if (originalEnv.IMA_ENV !== undefined) {
      process.env.IMA_ENV = originalEnv.IMA_ENV;
    } else {
      delete process.env.IMA_ENV;
    }

    if (originalEnv.NODE_ENV !== undefined) {
      process.env.NODE_ENV = originalEnv.NODE_ENV;
    } else {
      delete process.env.NODE_ENV;
    }

    jest.clearAllMocks();
    jest.resetModules();
    jest.unmock(mockConfigPath);
  });

  describe('$Language default configuration', () => {
    it('should set default $Language when not provided in config', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Server: { port: 8080 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Language).toEqual({
          '//*:*': 'en',
        });
      });
    });

    it('should preserve custom $Language configuration', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Language: {
              '//www.example.com/en': 'en',
              '//www.example.com/cs': 'cs',
              '//*:*': 'cs',
            },
            $Server: { port: 8080 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Language).toEqual({
          '//www.example.com/en': 'en',
          '//www.example.com/cs': 'cs',
          '//*:*': 'cs',
        });
      });
    });

    it('should restore $Language after resolveEnvironmentSetting', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          common: {
            $Language: {
              '//*:*': 'common',
            },
            $Server: {
              staticPath: '/static',
            },
          },
          prod: {
            $Debug: false,
            $Language: {
              '//www.example.com/en': 'en',
              '//*:*': 'cs',
            },
            $Server: {
              port: 8080,
            },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        // Should preserve the prod $Language, not inherit from common
        expect(result.$Language).toEqual({
          '//www.example.com/en': 'en',
          '//*:*': 'cs',
        });
        expect(result.$Language['//*:*']).not.toBe('common');
      });
    });

    it('should set default $Language after resolveEnvironmentSetting when not provided', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          common: {
            $Server: {
              port: 3001,
            },
          },
          prod: {
            $Debug: false,
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Language).toEqual({
          '//*:*': 'en',
        });
      });
    });

    it('should not mutate original $Language config object', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const customLanguageConfig = {
          '//www.example.com/en': 'en',
          '//*:*': 'cs',
        };

        const mockConfig = {
          prod: {
            $Debug: false,
            $Language: customLanguageConfig,
            $Server: { port: 8080 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        // Modify the result
        result.$Language['//new.example.com'] = 'de';

        // Original should remain unchanged
        expect(customLanguageConfig).not.toHaveProperty('//new.example.com');
        expect(customLanguageConfig).toEqual({
          '//www.example.com/en': 'en',
          '//*:*': 'cs',
        });
      });
    });
  });

  describe('environment resolution', () => {
    it('should resolve production environment with NODE_ENV=production', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Server: { port: 8080 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Debug).toBe(false);
        expect(result.$Env).toBe('prod');
      });
    });

    it('should resolve development environment with NODE_ENV=development', () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        const mockConfig = {
          dev: {
            $Debug: true,
            $Server: { port: 3000 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Debug).toBe(true);
        expect(result.$Env).toBe('dev');
        expect(result.$Language).toEqual({
          '//*:*': 'en',
        });
      });
    });

    it('should resolve development environment with $Language defined only in dev', () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Server: { port: 8080 },
          },
          dev: {
            $Debug: true,
            $Language: {
              '//localhost/en': 'en',
              '//localhost/cs': 'cs',
              '//*:*': 'en',
            },
            $Server: { port: 3000 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Debug).toBe(true);
        expect(result.$Env).toBe('dev');
        expect(result.$Language).toEqual({
          '//localhost/en': 'en',
          '//localhost/cs': 'cs',
          '//*:*': 'en',
        });
      });
    });

    it('should resolve development environment with $Language defined only in prod', () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Language: {
              '//www.example.com/en': 'en',
              '//www.example.com/cs': 'cs',
              '//*:*': 'cs',
            },
            $Server: { port: 8080 },
          },
          dev: {
            $Debug: true,
            $Server: { port: 3000 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Debug).toBe(true);
        expect(result.$Env).toBe('dev');
        // Dev should get default $Language since it's not defined in dev
        expect(result.$Language).toEqual({
          '//www.example.com/en': 'en',
          '//www.example.com/cs': 'cs',
          '//*:*': 'cs',
        });
      });
    });

    it('should resolve development environment with $Language defined in both dev and prod', () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Language: {
              '//www.example.com/en': 'en',
              '//www.example.com/cs': 'cs',
              '//*:*': 'cs',
            },
            $Server: { port: 8080 },
          },
          dev: {
            $Debug: true,
            $Language: {
              '//localhost/en': 'en',
              '//localhost/de': 'de',
              '//*:*': 'en',
            },
            $Server: { port: 3000 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Debug).toBe(true);
        expect(result.$Env).toBe('dev');
        // Should use dev's $Language, not prod's
        expect(result.$Language).toEqual({
          '//localhost/en': 'en',
          '//localhost/de': 'de',
          '//*:*': 'en',
        });
        // Verify it's not using prod's config
        expect(result.$Language).not.toHaveProperty('//www.example.com/en');
        expect(result.$Language).not.toHaveProperty('//www.example.com/cs');
      });
    });

    it('should prioritize IMA_ENV over NODE_ENV', () => {
      process.env.NODE_ENV = 'development';
      process.env.IMA_ENV = 'prod';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Server: { port: 8080 },
          },
          dev: {
            $Debug: true,
            $Server: { port: 3000 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Debug).toBe(false);
        expect(result.$Env).toBe('prod');
        expect(result.$Language).toEqual({
          '//*:*': 'en',
        });
      });
    });
  });

  describe('processEnvironment callback', () => {
    it('should call processEnvironment callback if provided', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Server: { port: 8080 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');

        const processEnvironment = jest.fn(env => {
          return {
            ...env,
            customProperty: 'customValue',
          };
        });

        const result = factory({
          applicationFolder: __dirname,
          processEnvironment,
        });

        expect(processEnvironment).toHaveBeenCalledTimes(1);
        expect(processEnvironment).toHaveBeenCalledWith(
          expect.objectContaining({
            $Debug: false,
            $Env: 'prod',
          })
        );
        expect(result.customProperty).toBe('customValue');
      });
    });

    it('should allow processEnvironment to modify $Language', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: false,
            $Server: { port: 8080 },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');

        const processEnvironment = jest.fn(env => {
          return {
            ...env,
            $Language: {
              '//www.example.com': 'cs',
              '//*:*': 'en',
            },
          };
        });

        const result = factory({
          applicationFolder: __dirname,
          processEnvironment,
        });

        expect(result.$Language).toEqual({
          '//www.example.com': 'cs',
          '//*:*': 'en',
        });
      });
    });
  });

  describe('default environment merging', () => {
    it('should merge default environment with custom config', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            customSetting: 'customValue',
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        // Should have both default and custom settings
        expect(result.$Debug).toBe(false); // from default
        expect(result.customSetting).toBe('customValue'); // from custom config
        expect(result.$Server).toBeDefined(); // from default
      });
    });

    it('should override default settings with custom config', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        const mockConfig = {
          prod: {
            $Debug: true, // Override default false
            $Server: {
              port: 9000, // Override default port
              concurrency: 10, // Override default concurrency
            },
          },
        };

        jest.doMock(mockConfigPath, () => mockConfig, {
          virtual: true,
        });

        const factory = require('../environmentFactory.js');
        const result = factory({
          applicationFolder: __dirname,
        });

        expect(result.$Debug).toBe(true);
        expect(result.$Server.port).toBe(9000);
        expect(result.$Server.concurrency).toBe(10);
      });
    });
  });
});
