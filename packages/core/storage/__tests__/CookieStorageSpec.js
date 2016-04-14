describe('ima.storage.CookieStorage', function() {

	var cookieString = 'cok1=hello;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello2;Path=/;Expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieString = 'cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieStringWithFirstLetterUppercase = 'Cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieStringWithDomain = 'cok3=hello3; Path=/; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieStringWithComplex = 'cok3="hello3"; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT; HttpOnly; Secure; Path=/';
	var setCookieStringWithMaxAge = 'cok3="hello3"; Domain=localhost:3001; Expires=Fri, 31 Dec 9999 23:59:59 GMT; Max-Age=5; HttpOnly; Secure; Path=/';
	var cookiesStringForCookieHeader = 'cok1=hello; cok2=hello2';

	var request = null;
	var response = null;
	var cookie = null;
	var win = null;
	var transformFunction = {
		encode: function(s) {
			return s;
		},
		decode: function(s) {
			return s;
		}
	};

	beforeEach(function() {
		request = oc.create('ima.router.Request');
		response = oc.create('ima.router.Response');
		win = oc.create('ima.window.ServerWindow');
		cookie = oc.create('ima.storage.CookieStorage', [win, request, response]);

		request.init({});
		response.init({}, transformFunction);

		spyOn(request, 'getCookieHeader')
			.and
			.returnValue(cookieString);

		spyOn(response, 'setCookie')
			.and
			.stub();

		cookie.init({ secure: false }, transformFunction);
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
		cookie.set('cok3', 'hello3');

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
		spyOn(cookie._transformFunction, 'encode')
			.and
			.callThrough();

		expect(cookie.getCookiesStringForCookieHeader()).toEqual(cookiesStringForCookieHeader);
		expect(cookie._transformFunction.encode.calls.count()).toEqual(2);
	});

	describe('set method', function() {
		it('should set cookie as expired for undefined value', function() {
			spyOn(cookie, '_getExpirationAsDate')
				.and
				.stub();

			cookie.set('cok2');

			expect(cookie._getExpirationAsDate).toHaveBeenCalledWith(-1);
		});

		it('should prefer maxAge before expires', function() {
			spyOn(cookie, '_getExpirationAsDate')
				.and
				.stub();

			cookie.set('cok2', 'val2', { expires: new Date(), maxAge: 5 });

			expect(cookie._getExpirationAsDate).toHaveBeenCalledWith(5);
		});

		it('should set session cookie', function() {
			spyOn(cookie, '_getExpirationAsDate')
				.and
				.stub();

			cookie.set('cok2', 'val2');

			expect(cookie._getExpirationAsDate).not.toHaveBeenCalled();
		});

	});

	describe('parseFromSetCookieHeader method', function() {

		it('should parse cookie from Set-Cookie header string', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieString);
			expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', { expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), path: '/' });
		});

		it('should parse cookie from Set-Cookie header string for cookie name with first letter uppercase', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieStringWithFirstLetterUppercase);
			expect(cookie.set).toHaveBeenCalledWith('Cok3', 'hello3', { expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), path: '/' });
		});

		it('should parse cookie from Set-Cookie header string with defined domain', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieStringWithDomain);
			expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', { expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), path: '/', domain: 'localhost:3001' });
		});

		it('should parse cookie from Set-Cookie header string with complex options', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieStringWithComplex);
			expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', { expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), httpOnly: true, secure: true, path: '/', domain: 'localhost:3001' });
		});

		it('should parse cookie from Set-Cookie header string with Max-Age option', function() {
			spyOn(cookie, 'set');

			cookie.parseFromSetCookieHeader(setCookieStringWithMaxAge);
			expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', { expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'), maxAge: 5, httpOnly: true, secure: true, path: '/', domain: 'localhost:3001' });
		});

	});

	describe('should get expires date', function() {
		using([
			1,
			2,
			1000,
			Infinity,
			null,
			'Fri, 31 Dec 2000 23:59:59 GMT',
			new Date('Fri, 31 Dec 2000 23:59:59 GMT')
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
			{ value: '1', sanitizedValue: '1' },
			{ value: '7|AABBCCD===', sanitizedValue: '7|AABBCCD===' },
			{ value: '7|AABBCCD=== ', sanitizedValue: '7|AABBCCD===' },
			{ value: undefined + '', sanitizedValue: 'undefined' }
		], function(item) {
			it('should return ' + item.sanitizedValue + 'for value ' + item.value, function() {
				expect(cookie._sanitizeCookieValue(item.value)).toEqual(item.sanitizedValue);
			});
		});

	});

});
