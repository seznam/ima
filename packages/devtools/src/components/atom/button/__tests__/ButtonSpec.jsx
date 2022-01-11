import React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';

describe('button atom', () => {
  let wrapper = shallow(<Button />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
