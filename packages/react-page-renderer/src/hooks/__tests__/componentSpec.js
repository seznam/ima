import { renderWithContext } from '@ima/testing-library';

import { renderHook } from '../../testUtils';
import { useComponent, useOnce } from '../component';

describe('useComponent', () => {
  let result;

  it('should return object of component utility functions', () => {
    renderHook(() => {
      result = useComponent();
    }, {});

    expect(
      ['cssClasses', 'localize', 'link', 'fire', 'listen', 'unlisten'].every(
        key => typeof result[key] === 'function'
      )
    ).toBeTruthy();
    expect(Object.keys(result)).toEqual([
      'utils',
      'cssClasses',
      'localize',
      'link',
      'fire',
      'listen',
      'unlisten',
    ]);
  });
});

describe('useOnce', () => {
  it('should call callback only once', async () => {
    let count = 0;

    const TestComponent = () => {
      useOnce(() => count++);

      return null;
    };

    const { rerender } = await renderWithContext(<TestComponent />);

    rerender();
    rerender();
    rerender();
    rerender();

    expect(count).toBe(1);
  });
});
