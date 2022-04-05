import { shallow } from 'enzyme';

import Loader from '../Loader';

describe('Loader atom', () => {
  let wrapper = shallow(<Loader />);

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render title if provided', () => {
    wrapper.setProps({ title: 'Loading...' });

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('p').text()).toBe('Loading...');
  });

  describe('defaultProps', () => {
    it('should match snapshot', () => {
      expect(Loader.defaultProps).toMatchSnapshot();
    });
  });
});
