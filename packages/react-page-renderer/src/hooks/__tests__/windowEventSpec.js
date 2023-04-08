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
      result = useWindowEvent('custom-target', 'custom-event', jest.fn());

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

  it('should bind events correctly', () => {
    let cb = jest.fn();

    mountHook(() => {
      result = useWindowEvent('custom-target', 'custom-event', cb, true);

      expect(contextMock.$Utils.$Window.bindEventListener).toHaveBeenCalledWith(
        'custom-target',
        'custom-event',
        cb,
        true
      );
    }, contextMock);
  });
});
