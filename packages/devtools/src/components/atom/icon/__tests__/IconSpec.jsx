import { shallow } from 'enzyme';

import Icon from '../Icon';
import Icons from '../icons';

describe('Icon atom', () => {
  it.each(Object.keys(Icons))('should render %s icon', name => {
    let wrapper = shallow(<Icon name={name} />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
