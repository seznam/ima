import { initImaApp, clearImaApp } from '@ima/plugin-testing-integration';
import cards from '../../../public/cards.json';

describe('Home page', () => {
  const response = {
    body: cards,
  };
  let app;
  let http;

  beforeEach(async () => {
    app = await initImaApp({
      initBindApp: (ns, oc) => {
        http = oc.get('$Http');

        // Mock http.get method so the application
        // wont make any external requests
        // and return mocked response
        http.get = jest.fn().mockReturnValue(Promise.resolve(response));
      },
    });

    await app.oc.get('$Router').route('/');
  });

  afterEach(() => {
    clearImaApp(app);
  });

  it('can load homepage', async () => {
    expect(document.querySelectorAll('.cards')).toHaveLength(1);
    expect(document.querySelectorAll('.card')).toHaveLength(4);
  });
});
