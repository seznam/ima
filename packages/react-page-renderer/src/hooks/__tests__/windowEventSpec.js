import React from 'react';

import { useWindowEvent } from '../windowEvent';
import { mountHook } from '../../testUtils';

describe('useWindowEvent', () => {
  let result;
  let windowMock = {
    dispatchEvent: jest.fn()
  };

  let contextMock = {
    $Utils: {
      $Window: {
        getWindow: jest.fn().mockReturnValue(windowMock),
        createCustomEvent: jest.fn(),
        bindEventListener: jest.fn(),
        unbindEventListener: jest.fn()
      }
    }
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
        callback: jest.fn()
      });

      expect(result).toEqual({
        window: windowMock,
        dispatchEvent: windowMock.dispatchEvent,
        createCustomEvent: contextMock.$Utils.$Window.createCustomEvent
      });
    }, contextMock);
  });

  it('should bind event correctly with defaults', () => {
    let cb = jest.fn();

    mountHook(() => {
      result = useWindowEvent({
        event: 'custom-event',
        callback: cb
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
        useCapture: true
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
