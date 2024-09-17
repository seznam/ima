import { renderHook } from '../../testUtils';
import { useLocalize } from '../localize';

describe('useLocalize', () => {
  let result;
  let contextMock = {
    $Utils: {
      $Dictionary: {
        get: () => 'Dictionary.get() function',
      },
    },
  };

  it('should return shortcut to $Dictionary.get function', () => {
    renderHook(() => {
      result = useLocalize();
    }, contextMock);

    expect(typeof result === 'function').toBe(true);
    expect(result()).toBe('Dictionary.get() function');
  });
});
