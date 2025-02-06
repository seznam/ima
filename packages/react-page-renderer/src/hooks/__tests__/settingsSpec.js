import { getContextValue, renderHookWithContext } from '@ima/testing-library';

import { useSettings } from '../settings';

describe('useSettings', () => {
  let contextValue;

  beforeEach(async () => {
    contextValue = await getContextValue();

    contextValue.$Utils.$Settings = {
      $Page: {
        scripts: ['script.js'],
      },
      documentView: 'documentView',
    };
  });

  it('should return settings object by default', async () => {
    const { result } = await renderHookWithContext(() => useSettings(), {
      contextValue,
    });

    expect(result.current).toStrictEqual(contextValue.$Utils.$Settings);
  });

  it('should return specific sub-settings for given selector', async () => {
    const { result } = await renderHookWithContext(
      () => useSettings('$Page.scripts'),
      { contextValue }
    );

    expect(result.current).toStrictEqual(
      contextValue.$Utils.$Settings.$Page.scripts
    );
  });

  it('should return empty object for invalid selectors', async () => {
    const { result } = await renderHookWithContext(
      () => useSettings('invalid.settings.path'),
      { contextValue }
    );

    expect(result.current).toBeUndefined();
  });
});
