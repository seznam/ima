import { mountHook } from '../../testUtils';
import { useSSR } from '../ssr';

describe('useSSR', () => {
  let result;
  let isClientMock = jest.fn().mockReturnValue(true);
  let contextMock = {
    $Utils: {
      $Window: {
        isClient: isClientMock,
      },
    },
  };

  it('should return object with isClient and isServer properties', () => {
    mountHook(() => {
      result = useSSR();
    }, contextMock);

    expect(result).toEqual({
      isClient: true,
      isServer: false,
    });
  });
});
