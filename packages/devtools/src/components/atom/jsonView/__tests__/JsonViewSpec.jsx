import { shallow } from 'enzyme';

import JsonView, { THEME } from '../JsonView';

describe('JsonView.THEME', () => {
  it('should match snapshot', () => {
    expect(THEME).toMatchSnapshot();
  });
});

describe('JsonView atom', () => {
  let wrapper = shallow(<JsonView src={{ json: 'data' }} />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.collapse).toBe(2);
  });

  it('should render null if src is not provided', () => {
    wrapper.setProps({ src: null });
    expect(wrapper.type()).toBeNull();
  });
});
