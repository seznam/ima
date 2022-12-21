import Card from '../Card';
import { shallow } from 'enzyme';

describe('Card', () => {
  it('can render', () => {
    const title = 'Test card';
    const href = 'https://www.seznam.cz';
    const children = 'Some content of the card.';

    const wrapper = shallow(Card({ children, title, href }));

    expect(wrapper).toMatchSnapshot();
  });
});
