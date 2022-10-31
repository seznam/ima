import { shallow } from 'enzyme';

import { useOnce } from '../once';

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
