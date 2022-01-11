import React from 'react';
import { shallow } from 'enzyme';
import EntryList from '../EntryList';

describe('entryList molecule', () => {
  const props = {
    entryIds: ['1', '2', '3', '4']
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<EntryList {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should return null if entryIds are not provided', () => {
    wrapper.setProps({ entryIds: [] });

    expect(wrapper.type()).toBeNull();
  });

  it('should render all entryIds as table body items', () => {
    expect(wrapper.find('tbody').children()).toHaveLength(4);
  });
});
