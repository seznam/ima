import React from 'react';
import { shallow } from 'enzyme';
import Alerts from '../Alerts';

describe('Alerts molecule', () => {
  const props = {
    alerts: {
      0: {
        id: '0',
        hidden: false,
        title: 'title',
        content: 'content',
        type: 'default'
      }
    },
    removeAlert: jest.fn()
  };

  let wrapper = shallow(<Alerts {...props} />);
  let instance = wrapper.instance();

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should call props.removeAlert when clicking on alert', () => {
    wrapper.find('Alert').simulate('click');

    expect(instance.props.removeAlert.mock.calls.length).toBe(1);
    expect(instance.props.removeAlert.mock.calls[0][0]).toBe('0');
  });
});
