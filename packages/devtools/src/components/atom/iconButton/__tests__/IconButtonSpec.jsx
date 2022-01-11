import React from 'react';
import { shallow } from 'enzyme';
import IconButton from '../IconButton';

describe('iconButton atom', () => {
  let wrapper = shallow(<IconButton name='close' />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
