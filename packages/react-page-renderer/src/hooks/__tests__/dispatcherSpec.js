import React from 'react';

import { mountHook } from '../../testUtils';
import { useDispatcher } from '../dispatcher';

describe('useDispatcher', () => {
  let result;

  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
  });

  it('should return `fire` callback', () => {
    mountHook(() => {
      result = useDispatcher();
    });

    expect(result).toEqual({
      fire: expect.any(Function)
    });
  });
});
