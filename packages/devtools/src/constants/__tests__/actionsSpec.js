import Actions from '../actions';

describe('Actions constant', () => {
  it('should match snapshot', () => {
    expect(Actions).toMatchSnapshot();
  });
});
