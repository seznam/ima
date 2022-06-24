import Card from '../Card';
import shallow from 'react-testing-library-shallow';

describe('Card', () => {
  it('can render', () => {
    const { container } = shallow(<Card title='Ahoj' />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
