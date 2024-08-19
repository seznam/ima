import { renderHook } from '../../testUtils';
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
    renderHook(() => {
      result = useSettings();
    }, contextMock);

    expect(result).toStrictEqual(contextMock.$Utils.$Settings);
  });

  it('should return specific sub-settings for given selector', () => {
    renderHook(() => {
      result = useSettings('$Page.scripts');
    }, contextMock);

    expect(result).toStrictEqual(contextMock.$Utils.$Settings.$Page.scripts);
  });

  it('should return empty object for invalid selectors', () => {
    renderHook(() => {
      result = useSettings('invalid.settings.path');
    }, contextMock);

    expect(result).toBeUndefined();
  });
});
