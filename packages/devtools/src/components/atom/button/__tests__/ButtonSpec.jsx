import React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';

describe('Button atom', () => {
  let wrapper = shallow(<Button />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
