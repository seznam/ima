import React from 'react';
import { shallow } from 'enzyme';
import SplitPane from '../SplitPane';

describe('SplitPane molecule', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SplitPane />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Search, EntryList and DataView components', () => {
    expect(wrapper.find('Connect(Search)')).toHaveLength(1);
    expect(wrapper.find('Connect(EntryList)')).toHaveLength(1);
    expect(wrapper.find('Connect(DataView)')).toHaveLength(1);
  });
});
