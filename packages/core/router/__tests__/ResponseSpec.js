import Response from 'router/Response';

describe('ima.router.Response', () => {

	var response = null;

	beforeEach(() => {
		response = new Response();
	});

	it('should be 1', () => {
		expect(1).toEqual(1);
	});
});
