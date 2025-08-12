import { beforeEach, describe, expect, it } from "vitest";
import { shallow } from 'enzyme';

import EntryList from '../EntryList';

describe('EntryList molecule', () => {
  const props = {
    entryIds: ['1', '2', '3', '4'],
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<EntryList {...props} />);
  });

  it('should return null if entryIds are not provided', () => {
    wrapper.setProps({ entryIds: [] });

    expect(wrapper.type()).toBeNull();
  });

  it('should render all entryIds as table body items', () => {
    expect(wrapper.find('tbody').children()).toHaveLength(4);
  });
});
