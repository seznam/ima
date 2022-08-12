'use strict';

const devErrorPageFactory = require('../devErrorPageFactory.js');
const {
  setGlobalMockMethod,
  setGlobalKeepUnmock,
  objectKeepUnmock,
  toMock
} = require('to-mock');

setGlobalMockMethod(jest.fn);
setGlobalKeepUnmock(objectKeepUnmock);

jest.mock('fs', () => {
  const { toMockedInstance } = jest.requireActual('to-mock');
  const originalModule = jest.requireActual('fs');

  return {
    ...toMockedInstance(originalModule, {
      readFileSync() {
        return 'read file content';
      }
    })
  };
});

describe('devErrorPageFactory', () => {
  const logger = toMock(console);
  const devErrorPage = devErrorPageFactory({
    logger
  });

  const REQ = Object.freeze({});

  const RES = Object.freeze({
    status: jest.fn(),
    send: jest.fn(),
    locals: {}
  });

  const ERROR = new Error('My own Error');

  describe("Method's behaviour", () => {
    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should render error page for defined error', async () => {
      const response = await devErrorPage({ error: ERROR, req: REQ, res: RES });

      expect(logger.error).toHaveBeenCalled();
      expect(response.status).toEqual(500);
      expect(response.content.includes('read file content')).toBeTruthy();
    });
  });
});
