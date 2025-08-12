import { describe, expect, it } from "vitest";
import { shallow } from 'enzyme';

import Loader from '../Loader';

describe('Loader atom', () => {
  let wrapper = shallow(<Loader />);

  it('should render title if provided', () => {
    wrapper.setProps({ title: 'Loading...' });

    expect(wrapper.find('p').text()).toBe('Loading...');
  });
});
