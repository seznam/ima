import Card from '../Card';
import { shallow } from 'enzyme';

describe('Card', () => {
  it('can render', () => {
    const title = 'Test card';
    const href = 'https://www.seznam.cz';
    const children = 'Some content of the card.';

    const wrapper = shallow(Card({ children, title, href }));

    expect(wrapper.hasClass('card')).toBe(true);

    const cardTitle = wrapper.find('a');
    const cardContent = wrapper.find('p');

    expect(cardTitle.props().href).toEqual(href);
    expect(cardTitle.find('h3').text()).toContain(title);
    expect(cardContent.props().dangerouslySetInnerHTML.__html).toEqual(
      children
    );
  });
});
