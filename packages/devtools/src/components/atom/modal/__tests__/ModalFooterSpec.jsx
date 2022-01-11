import React from 'react';
import { shallow } from 'enzyme';
import ModalFooter from '../ModalFooter';

describe('ModalFooter atom', () => {
  let wrapper = shallow(<ModalFooter>Footer</ModalFooter>);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.text()).toBe('Footer');
  });
});
