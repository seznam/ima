import { initImaApp, clearImaApp } from '@ima/plugin-testing-integration';

const REGEX_STRING = /^.*(dev|test)\.dszn\.cz.*$/gm;

describe('Home page', () => {
  let app;

  beforeEach(async () => {
    app = await initImaApp();
  });

  afterEach(() => {
    clearImaApp(app);
  });

  it('can load homepage', () => {
    const settings = app.oc.get('$Settings');
    const matches = JSON.stringify(settings, null, 1).match(REGEX_STRING);
    let matchedCases = '';

    if (matches) {
      matches.forEach(match => (matchedCases += `${match}\n`));
    }

    expect(matchedCases).toBe('');
  });
});
