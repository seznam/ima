import { describe, expect, it } from "vitest";
import { shallow } from 'enzyme';

import JsonView from '../JsonView';

describe('JsonView atom', () => {
  let wrapper = shallow(<JsonView src={{ json: 'data' }} />);

  it('should render null if src is not provided', () => {
    wrapper.setProps({ src: null });
    expect(wrapper.type()).toBeNull();
  });
});
