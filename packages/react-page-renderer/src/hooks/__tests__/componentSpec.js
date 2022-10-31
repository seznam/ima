import { mountHook } from '../../testUtils';
import { useComponent } from '../component';

describe('useComponent', () => {
  let result;

  it('should return object of component utility functions', () => {
    mountHook(() => {
      result = useComponent();
    }, {});

    expect(
      ['cssClasses', 'localize', 'link', 'fire', 'listen', 'unlisten'].every(
        key => typeof result[key] === 'function'
      )
    );
    expect(Object.keys(result)).toEqual([
      'utils',
      'cssClasses',
      'localize',
      'link',
      'fire',
      'listen',
      'unlisten'
    ]);
  });
});
