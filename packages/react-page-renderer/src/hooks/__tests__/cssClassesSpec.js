import { renderHook } from '../../testUtils';
import { useCssClasses } from '../cssClasses';

describe('useCssClasses', () => {
  let result;
  let contextMock = {
    $Utils: {
      $CssClasses: () => '$CssClasses',
    },
  };

  it('should return shortcut to $CssClasses utility', () => {
    renderHook(() => {
      result = useCssClasses();
    }, contextMock);

    expect(typeof result === 'function').toBe(true);
    expect(result()).toBe('$CssClasses');
  });
});
