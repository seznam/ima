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

  it('can render component', async () => {
    expect(document.querySelectorAll('.cards')).toHaveLength(1);
    expect(document.querySelectorAll('.card')).toHaveLength(cards.length);

    for (let i = 0; i < cards.length; i++) {
      let paragraphText = document
        .querySelectorAll('.card p')
        [i].innerHTML.replace(/href=".*"/, 'href="{link}"');

      expect(document.querySelectorAll('.card h3')[i].textContent).toContain(
        cards[i].title
      );
      expect(paragraphText).toContain(cards[i].content);
    }
  });
});
