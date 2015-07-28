describe('Core.Http.Transformer', function() {

	var transformer = null;

	beforeEach(function() {
		transformer = oc.create('$HttpTransformer');

		transformer
			.addRule('//localhost:3001/something', '//127.0.0.1:3002/somethingElse')
			.addRule(':appIdRules', '123');
	});

	it('should add next rule', function() {
		transformer.addRule('aaa', 'bbb');

		expect(Object.keys(transformer._rules).length).toEqual(3);
	});

	it('should clear rules', function() {
		transformer.clear();

		expect(Object.keys(transformer._rules).length).toEqual(0);
	});

	it('should apply one rule', function() {
		expect(transformer.transform('http://localhost:3001/something/otherPath'))
			.toEqual('http://127.0.0.1:3002/somethingElse/otherPath');
	});

	it('should apply both rules', function() {
		expect(transformer.transform('http://localhost:3001/something/otherPath/:appIdRules'))
			.toEqual('http://127.0.0.1:3002/somethingElse/otherPath/123');
	});

	it('should return same url for not match rules', function() {
		var  url = 'http://www.example.com/something';

		expect(transformer.transform(url)).toEqual(url);
	});

	it('should return same url for none rules', function() {
		var  url = 'http://www.example.com/something';
		transformer = oc.create('$HttpTransformer');

		expect(transformer.transform(url)).toEqual(url);
	});
});