import Response from 'router/Response';

describe('ima.router.Response', () => {
	var response = null;

	beforeEach(() => {
		response = new Response();
	});

	it('should convert cookie maxAge to ms for Express', () => {
		let options = { maxAge: 1 };
		let expressOptions = response._prepareCookieOptionsForExpress(options);
		expect(options.maxAge).toEqual(1);
		expect(expressOptions.maxAge).toEqual(1000);
	});

	it('should remove cookie maxAge: null for Express', () => {
		// Because Express converts null to 0, which is not intended.
		let options = { maxAge: null };
		let expressOptions = response._prepareCookieOptionsForExpress(options);
		expect(options.maxAge).toEqual(null);
		expect(expressOptions.maxAge).toBeUndefined();
	});
});
