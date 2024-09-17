import { renderHook } from '../../testUtils';
import { useComponentUtils } from '../componentUtils';

describe('useComponentUtils', () => {
  let result;
  let contextMock = { $Utils: { CustomContextHelper: {} } };

  it('should return componentUtils', () => {
    renderHook(() => {
      result = useComponentUtils();
    }, contextMock);

    expect(Object.keys(result).includes('CustomContextHelper')).toBeTruthy();
  });
});
