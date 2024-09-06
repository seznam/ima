import { renderWithContext } from '@ima/testing-library';

import { Card } from '../Card';

describe('Card', () => {
  it('can render', async () => {
    const props = {
      title: 'Test card',
      href: 'https://www.seznam.cz',
      children: 'Some content of the card.',
    };

    const { container } = await renderWithContext(<Card {...props} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
