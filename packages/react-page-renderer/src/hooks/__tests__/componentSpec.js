import { renderHookWithContext } from '@ima/testing-library';

import { useComponent, useOnce } from '../component';

describe('useComponent', () => {
  it('should return object of component utility functions', async () => {
    const { result } = await renderHookWithContext(() => useComponent());

    expect(
      ['cssClasses', 'localize', 'link', 'fire', 'listen', 'unlisten'].every(
        key => typeof result.current[key] === 'function'
      )
    ).toBeTruthy();
    expect(Object.keys(result.current)).toEqual([
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

    const { rerender } = await renderHookWithContext(() =>
      useOnce(() => count++)
    );

    rerender();
    rerender();
    rerender();
    rerender();

    expect(count).toBe(1);
  });
});
