import React from 'react';

import { renderHook } from '../../testUtils';
import { useDispatcher } from '../dispatcher';

describe('useDispatcher', () => {
  let result;

  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
  });

  it('should return `fire` callback', () => {
    renderHook(() => {
      result = useDispatcher();
    });

    expect(result).toEqual({
      fire: expect.any(Function),
    });
  });
});
