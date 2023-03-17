import React from 'react';

import { mountHook } from '../../testUtils';
import { useWindowEvent } from '../windowEvent';

describe('useWindowEvent', () => {
  let result;
  let windowMock = {
    dispatchEvent: jest.fn(),
  };

  let contextMock = {
    $Utils: {
      $Window: {
        getWindow: jest.fn().mockReturnValue(windowMock),
        createCustomEvent: jest.fn(),
        bindEventListener: jest.fn(),
        unbindEventListener: jest.fn(),
      },
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
  });

  it('should return window and utility functions', () => {
    mountHook(() => {
      result = useWindowEvent({
        event: 'custom-event',
        callback: jest.fn(),
      });

      expect(result).toMatchInlineSnapshot(`
        {
          "createCustomEvent": [Function],
          "dispatchEvent": [Function],
          "window": {
            "dispatchEvent": [MockFunction],
          },
        }
      `);
    }, contextMock);
  });

  it('should bind event correctly with defaults', () => {
    let cb = jest.fn();

    mountHook(() => {
      result = useWindowEvent({
        event: 'custom-event',
        callback: cb,
      });

      expect(contextMock.$Utils.$Window.bindEventListener).toHaveBeenCalledWith(
        windowMock,
        'custom-event',
        cb,
        false
      );
    }, contextMock);
  });

  it('should bind event to window by default', () => {
    let cb = jest.fn();

    mountHook(() => {
      result = useWindowEvent({
        eventTarget: 'custom-target',
        event: 'custom-event',
        callback: cb,
        useCapture: true,
      });

      expect(contextMock.$Utils.$Window.bindEventListener).toHaveBeenCalledWith(
        'custom-target',
        'custom-event',
        cb,
        true
      );
    }, contextMock);
  });
});
