import Actions from '../actions';

describe('actions constant', () => {
  it('should match snapshot', () => {
    expect(Actions).toMatchSnapshot();
  });
});
