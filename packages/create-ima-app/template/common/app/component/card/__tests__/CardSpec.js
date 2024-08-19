import { render } from '@ima/testing-library';

import { Card } from '../Card';

describe('Card', () => {
  it('can render', () => {
    const props = {
      title: 'Test card',
      href: 'https://www.seznam.cz',
      children: 'Some content of the card.',
    };

    const { container } = render(<Card {...props} />);

    expect(container).toMatchSnapshot();
  });
});
