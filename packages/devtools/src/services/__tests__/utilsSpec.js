import {
  extractDomainFromUrl,
  getCurrentTab,
  setIcon,
  toggleClass
} from '../utils';

describe('setIcon', () => {
  const getPath = type => {
    return {
      16: `images/icon-${type}-16.png`,
      32: `images/icon-${type}-32.png`,
      48: `images/icon-${type}-48.png`,
      128: `images/icon-${type}-128.png`
    };
  };

  global.chrome = {
    browserAction: {
      setIcon: jest.fn()
    }
  };

  beforeEach(() => {
    chrome.browserAction.setIcon.mockReset();
  });

  it('should set icon for every tab if tabId is not provided', () => {
    setIcon('alive');

    expect(chrome.browserAction.setIcon.mock.calls.length).toBe(1);
    expect(chrome.browserAction.setIcon.mock.calls[0][0]).toEqual({
      path: getPath('alive')
    });
  });

  it('should set icon only for given tab if tabId is provided', () => {
    setIcon('alive', 340);

    expect(chrome.browserAction.setIcon.mock.calls.length).toBe(1);
    expect(chrome.browserAction.setIcon.mock.calls[0][0]).toEqual({
      path: getPath('alive'),
      tabId: 340
    });
  });

  it('should not do anything if type is not equal to alive or dead', () => {
    setIcon('custom type');
    expect(chrome.browserAction.setIcon.mock.calls.length).toBe(0);

    setIcon('alive');
    expect(chrome.browserAction.setIcon.mock.calls.length).toBe(1);

    setIcon('dead');
    expect(chrome.browserAction.setIcon.mock.calls.length).toBe(2);
  });
});

describe('toggleClass', () => {
  const element = {
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    }
  };

  beforeEach(() => {
    element.classList.add.mockReset();
    element.classList.remove.mockReset();
  });

  it('should add class if active parameter is true', () => {
    toggleClass(element, true, 'activeClass');

    expect(element.classList.add.mock.calls.length).toBe(1);
    expect(element.classList.remove.mock.calls.length).toBe(0);
    expect(element.classList.add.mock.calls[0][0]).toBe('activeClass');
  });

  it('should remove class if active parameter is false', () => {
    toggleClass(element, false, 'activeClass');

    expect(element.classList.add.mock.calls.length).toBe(0);
    expect(element.classList.remove.mock.calls.length).toBe(1);
    expect(element.classList.remove.mock.calls[0][0]).toBe('activeClass');
  });

  it("should toggle 'active' class by default", () => {
    toggleClass(element, false);

    expect(element.classList.add.mock.calls.length).toBe(0);
    expect(element.classList.remove.mock.calls.length).toBe(1);
    expect(element.classList.remove.mock.calls[0][0]).toBe('active');
  });
});

describe('getCurrentTab', () => {
  it('should get tabId from inspected window if devtools object is available', async () => {
    global.chrome = {
      devtools: {
        inspectedWindow: 20
      }
    };

    const result = await getCurrentTab();
    expect(result).toBe(20);
  });

  it('should query for tabId on active current window, if devtools object is not available', async () => {
    global.chrome = {
      tabs: {
        query: jest
          .fn()
          .mockImplementation((details, callback) => callback([30]))
      }
    };

    const result = await getCurrentTab();

    expect(result).toBe(30);
    expect(chrome.tabs.query.mock.calls.length).toBe(1);
    expect(chrome.tabs.query.mock.calls[0][0]).toEqual({
      active: true,
      currentWindow: true
    });
  });
});

describe('extractDomainFromUrl', () => {
  it('should return null if url is not valid', () => {
    expect(extractDomainFromUrl('')).toBe(null);
  });

  it('should strip schema, www and part after first backslash from the url', () => {
    expect(
      extractDomainFromUrl(
        'https://imajs.io/doc/controller/controller-controller-decorator.html'
      )
    ).toBe('imajs.io');
    expect(
      extractDomainFromUrl('https://www.seznamzpravy.cz/sekce/ekonomika')
    ).toBe('seznamzpravy.cz');
    expect(
      extractDomainFromUrl('https://seznamzpravy.cz/sekce/ekonomika')
    ).toBe('seznamzpravy.cz');
  });
});
