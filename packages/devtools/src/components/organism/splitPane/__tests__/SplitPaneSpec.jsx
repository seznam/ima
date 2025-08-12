import { beforeEach, describe, expect, it } from "vitest";
import { shallow } from 'enzyme';

import SplitPane from '../SplitPane';

describe('SplitPane molecule', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SplitPane />);
  });

  it('should render Search, EntryList and DataView components', () => {
    expect(wrapper.find('Connect(Search)')).toHaveLength(1);
    expect(wrapper.find('Connect(Component)')).toHaveLength(1);
    expect(wrapper.find('Connect(DataView)')).toHaveLength(1);
  });
});
