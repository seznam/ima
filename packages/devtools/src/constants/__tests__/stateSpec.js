import State from '../state';

describe('state constant', () => {
  it('should match snapshot', () => {
    expect(State).toMatchSnapshot();
  });
});
