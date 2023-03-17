import { MessageFormatDictionary } from '../MessageFormatDictionary';

describe('ima.core.dictionary.MessageFormatDictionary', () => {
  let dictionary: MessageFormatDictionary;
  const config = {
    $Language: 'cs',
    dictionary: {
      home: {
        title: () => 'title',
        message: () => 'message',
        message2: {
          title: () => 'title',
        },
      },
    },
  };
  beforeEach(() => {
    dictionary = new MessageFormatDictionary();

    dictionary.init(config);
  });

  it('should be return current language', () => {
    expect(dictionary.getLanguage()).toBe(config.$Language);
  });

  describe('get method', () => {
    it('should be return translated text', () => {
      expect(dictionary.get('home.title')).toBe(config.dictionary.home.title());
      expect(dictionary.get('home.message')).toBe(
        config.dictionary.home.message()
      );
    });

    it('should be throw Error for undefined vocabulary key', () => {
      expect(() => {
        dictionary.get('home.title.text');
      }).toThrow();
    });
  });

  describe('has method', () => {
    it('should be return true', () => {
      expect(dictionary.has('home.title')).toBe(true);
      expect(dictionary.has('home.message')).toBe(true);
      expect(dictionary.has('home.message2.title')).toBe(true);
    });

    it('should be return false for non existing keys', () => {
      expect(dictionary.has('home.non-exists-phrase')).toBe(false);
      expect(dictionary.has('home.message2.non-exist-phrase')).toBe(false);
    });

    it('should be throw Error for key not referring to a localization phrase', () => {
      expect(() => dictionary.has('non-exists-phrase')).toThrow();
      expect(() => dictionary.has('home')).toThrow();
    });
  });
});
