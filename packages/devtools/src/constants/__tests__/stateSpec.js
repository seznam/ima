import State from '../state';

describe('State constant', () => {
  it('should match snapshot', () => {
    expect(State).toMatchSnapshot();
  });
});
