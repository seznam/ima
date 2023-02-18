import { shallow } from 'enzyme';

import { mountHook } from '../../testUtils';
import { useComponent, useOnce } from '../component';

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
  let wrapper;

  it('should call callback only once', () => {
    let count = 0;

    const TestComponent = () => {
      useOnce(() => count++);

      return null;
    };

    wrapper = shallow(<TestComponent />);

    wrapper.setProps({});
    wrapper.setProps({});
    wrapper.setProps({});
    wrapper.setProps({});

    expect(count).toBe(1);
  });
});
