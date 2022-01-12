import React from 'react';
import { shallow } from 'enzyme';
import Alert from '../Alert';

describe('Alert atom', () => {
  let wrapper = shallow(<Alert />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.type).toBe('default');
  });

  it('should render without title if type is default', () => {
    wrapper.setProps({ type: 'default' });
    expect(wrapper.find('strong')).toHaveLength(0);
  });

  it.each([
    ['success', 'Success!'],
    ['danger', 'Danger!'],
    ['warning', 'Warning!'],
  ])('should render type %s with %s title', (type, title) => {
    wrapper.setProps({ type: type, title: null });
    const strongTag = wrapper.find('strong');

    expect(wrapper.instance().props.type).toBe(type);
    expect(strongTag).toHaveLength(1);
    expect(strongTag.text()).toBe(title);
  });

  it('should render with title if provided', () => {
    wrapper.setProps({ type: 'success', title: 'Custom Title!' });
    const strongTag = wrapper.find('strong');

    expect(strongTag).toHaveLength(1);
    expect(strongTag.text()).toBe('Custom Title!');
  });
});
