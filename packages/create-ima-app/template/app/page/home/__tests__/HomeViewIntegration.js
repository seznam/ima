import { initImaApp, clearImaApp } from '@ima/plugin-testing-integration';
import cards from '../../../public/cards.json';

let headers = new Map();
headers.set('content-type', 'application/json');

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(cards),
    status: 200,
    headers,
    ok: true,
    text: () => Promise.resolve(JSON.stringify(cards)),
  })
);

describe('Home page', () => {
  let app;

  beforeEach(async () => {
    app = await initImaApp();

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
