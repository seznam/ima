import MessageFormatDictionary from 'dictionary/MessageFormatDictionary';

describe('ima.dictionary.MessageFormatDictionary', () => {

	let dictionary = null;
	const config = {
		language: 'cs',
		dictionary: {
			home:{
				title: () => 'title',
				message: () => 'message'
			}
		}
	};
	beforeEach(() => {
		dictionary = new MessageFormatDictionary();

		dictionary.init(config);
	});

	it('should be initialization', () => {
		expect(dictionary.language).not.toBe(null);
		expect(dictionary.dictionary).not.toBe(null);
	});

	it('should be return current language', () => {
		expect(dictionary.getLanguage()).toEqual(config.language);
	});


	describe('get method', () => {
		it('should be return translated text', () => {
			expect(dictionary.get('home.title')).toEqual(config.dictionary.home.title());
			expect(dictionary.get('home.message')).toEqual(config.dictionary.home.message());
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
		});

		it('should be return false for non existing keys', () => {
			expect(dictionary.has('home.non-exists-phrase')).toBe(false);
		});

		it('should be throw Error for key not referring to a localization phrase', () => {
			expect(() => dictionary.has('non-exists-phrase')).toThrow();
			expect(() => dictionary.has('home')).toThrow();
		});
	});

});
