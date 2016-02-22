describe('Ima.MessageFormatDictionary', function() {

	var dictionary = null;
	var config = {
		language: 'cs',
		dictionary: {
			home:{
				title: function() {
					return 'title';
				},
				message: function() {
					return 'message';
				}
			}
		}
	};
	beforeEach(function() {
		dictionary = oc.create('Ima.Dictionary.MessageFormatDictionary');

		dictionary.init(config);
	});

	it('should be initialization', function() {
		expect(dictionary.language).not.toBe(null);
		expect(dictionary.dictionary).not.toBe(null);
	});

	it('should be return current language', function() {
		expect(dictionary.getLanguage()).toEqual(config.language);
	});


	describe('get method', function() {
		it('should be return translated text', function() {
			expect(dictionary.get('home.title')).toEqual(config.dictionary.home.title());
			expect(dictionary.get('home.message')).toEqual(config.dictionary.home.message());
		});

		it('should be throw Error for undefined vocabulary key', function() {
			expect(function() {dictionary.get('home.title.text');}).toThrow();
		});
	});

});
