import { mountHook } from '../../testUtils';
import { useSettings } from '../settings';

describe('useSettings', () => {
  let result;
  let contextMock = {
    $Utils: {
      $Settings: {
        $Page: {
          scripts: ['script.js'],
        },
        documentView: 'documentView',
      },
    },
  };

  it('should return settings object by default', () => {
    mountHook(() => {
      result = useSettings();
    }, contextMock);

    expect(result).toStrictEqual(contextMock.$Utils.$Settings);
  });

  it('should return specific sub-settings for given selector', () => {
    mountHook(() => {
      result = useSettings('$Page.scripts');
    }, contextMock);

    expect(result).toStrictEqual(contextMock.$Utils.$Settings.$Page.scripts);
  });

  it('should return empty object for invalid selectors', () => {
    mountHook(() => {
      result = useSettings('invalid.settings.path');
    }, contextMock);

    expect(result).toBeUndefined();
  });
});
