import UrlTransformer from 'http/UrlTransformer';

describe('ima.http.UrlTransformer', () => {
	var transformer = null;

	beforeEach(() => {
		transformer = new UrlTransformer();

		transformer
			.addRule(
				'//localhost:3001/something',
				'//127.0.0.1:3002/somethingElse'
			)
			.addRule(':appIdRules', '123');
	});

	it('should add next rule', () => {
		transformer.addRule('aaa', 'bbb');

		expect(Object.keys(transformer._rules).length).toEqual(3);
	});

	it('should clear rules', () => {
		transformer.clear();

		expect(Object.keys(transformer._rules).length).toEqual(0);
	});

	it('should apply one rule', () => {
		expect(
			transformer.transform('http://localhost:3001/something/otherPath')
		).toEqual('http://127.0.0.1:3002/somethingElse/otherPath');
	});

	it('should apply both rules', () => {
		expect(
			transformer.transform(
				'http://localhost:3001/something/otherPath/:appIdRules'
			)
		).toEqual('http://127.0.0.1:3002/somethingElse/otherPath/123');
	});

	it('should return same url for not match rules', () => {
		var url = 'http://www.example.com/something';

		expect(transformer.transform(url)).toEqual(url);
	});

	it('should return same url for none rules', () => {
		var url = 'http://www.example.com/something';
		transformer = new UrlTransformer();

		expect(transformer.transform(url)).toEqual(url);
	});
});
