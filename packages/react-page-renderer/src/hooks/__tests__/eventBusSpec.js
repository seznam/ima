import React from 'react';

import { renderHook } from '../../testUtils';
import { useEventBus } from '../eventBus';

describe('useEventBus', () => {
  let result, context;

  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    context = {
      $Utils: {
        $EventBus: {
          listen: jest.fn(),
          unlisten: jest.fn(),
        },
      },
    };
  });

  it('should return `fire` callback', () => {
    renderHook(() => {
      const ref = React.createRef(null);

      result = useEventBus(ref, 'event', () => {});
    }, context);

    expect(result).toEqual({
      fire: expect.any(Function),
    });
    expect(context.$Utils.$EventBus.listen).toHaveBeenCalledWith(
      { current: null },
      'event',
      expect.any(Function)
    );
    expect(context.$Utils.$EventBus.unlisten).not.toHaveBeenCalledWith();
  });
});
