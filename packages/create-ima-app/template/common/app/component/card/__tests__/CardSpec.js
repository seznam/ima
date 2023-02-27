import { shallow } from 'enzyme';

import { Card } from '../Card';

describe('Card', () => {
  it('can render', () => {
    const props = {
      title: 'Test card',
      href: 'https://www.seznam.cz',
      children: 'Some content of the card.',
    };

    const wrapper = shallow(<Card {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
