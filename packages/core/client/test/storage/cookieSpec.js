describe('Core.Storage.Cookie', function() {

	var cookieString = 'cok1=hello;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello2;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieString = 'cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieStringWithDomain = 'cok3=hello3; Path=/; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieStringWithComplex = 'cok3="hello3"; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT; HttpOnly; Secure; Path=/';

	var request = null;
	var response = null;
	var cookie = null;
	var win = null;

	beforeEach(function() {
		request = oc.create('Core.Router.Request');
		response = oc.create('Core.Router.Response');
		win = oc.create('Core.Window.Server');
		cookie = oc.create('Core.Storage.Cookie', [win, request, response]);

		request.init({});
		response.init({});

		spyOn(request, 'getCookieHeader')
			.and
			.returnValue(cookieString);

		spyOn(response, 'setCookie')
			.and
			.stub();

		cookie.init({secure: false});
	});

	it('should be parse exist cookies', function() {
		expect(request.getCookieHeader).toHaveBeenCalled();
		expect(cookie._storage.size).toEqual(2);
	});


	it('should be has method, which return true for exist cookie other false', function() {
		expect(cookie.has('cok1')).toBe(true);
		expect(cookie.has('cok2')).toBe(true);
		expect(cookie.has('cok3')).toBe(false);
	});

	it('should be get value from cookie', function() {
		expect(cookie.get('cok1')).toEqual('hello');
		expect(cookie.get('cok2')).toEqual('hello2');
		expect(cookie.get('cok3')).toBeUndefined();
	});

	it('should be set value to cookie', function() {
		cookie.set('cok3','hello3');

		expect(response.setCookie).toHaveBeenCalled();
	});

	it('should be delete value from cookie', function() {
		cookie.delete('cok2');

		expect(response.setCookie).toHaveBeenCalled();
		expect(cookie._storage.size).toEqual(1);
	});

	it('should be delete all cookies', function() {
		cookie.clear();

		expect(response.setCookie.calls.count()).toEqual(2);
		expect(cookie._storage.size).toEqual(0);
	});

	it('should be get cookies string', function() {
		expect(cookie.getCookiesString()).toEqual(cookieString);
	});

	describe('parseFromSetCookieHeader method', function() {

		it('should parse cookie from Set-Cookie header string', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieString);
			expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), httpOnly: false, secure: false, path: '/', domain: ''});
		});

		it('should parse cookie from Set-Cookie header string with defined domain', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieStringWithDomain);
			expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), httpOnly: false, secure: false, path: '/', domain: 'localhost:3001'});
		});

		it('should parse cookie from Set-Cookie header string with complex options', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieStringWithComplex);
			expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), httpOnly: true, secure: true, path: '/', domain: 'localhost:3001'});
		});

	});

	describe('should get expires date', function() {
		using([
			1,
			2,
			1000,
			undefined,
			null,
			'Fri, 31 Dec 2000 23:59:59 GMT'
		], function(value) {
			it('for value ' + value, function() {
				expect(cookie._getExpirationAsDate(value) instanceof Date).toEqual(true);
			});
		});
	});

	describe('_sanitizeCookieValue method', function() {

		beforeEach(function() {
			$Debug = false;
		});

		afterEach(function() {
			$Debug = true;
		});

		using([
			{value: '1', sanitizedValue: '1'},
			{value: '7|AABBCCD===', sanitizedValue: '7|AABBCCD==='},
			{value: '7|AABBCCD=== ', sanitizedValue: '7|AABBCCD==='},
			{value: undefined + '', sanitizedValue: 'undefined'}
		], function(item) {
			it('should return ' + item.sanitizedValue + 'for value ' + item.value, function() {
				expect(cookie._sanitizeCookieValue(item.value)).toEqual(item.sanitizedValue);
			});
		});

	});

});