'use strict';

const devErrorPageFactory = require('../devErrorPageFactory.js');
const { toMock, setGlobalMockMethod } = require('to-mock');

describe('devErrorPageFactory', () => {
  setGlobalMockMethod(jest.fn);
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
      await devErrorPage({ error: ERROR, req: REQ, res: RES });
      expect(logger.error).toHaveBeenCalled();
      expect(RES.status).toHaveBeenCalledWith(500);
      expect(RES.send).toHaveBeenCalled();
      expect(RES.send.mock.calls[0][0].includes('My own Error')).toBeTruthy();
    });
  });
});
