describe('Core.Storage.Cookie', function() {

	var cookieString = 'cok1=hello;path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT; cok2=hello2;path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT';
	var setCookieString = 'cok3=hello3; Path=/; Expires=Fri, 31 Dec 9999 23:59:59 GMT';


	var request = null;
	var respond = null;
	var secure = false;
	var cookie = null;
	beforeEach(function() {
		request = oc.create('Core.Router.Request');
		respond = oc.create('Core.Router.Respond');
		cookie = oc.create('Core.Storage.Cookie', request, respond, secure);

		request.init({});
		respond.init({});

		spyOn(request, 'getCookie')
			.and
			.returnValue(cookieString);

		spyOn(respond, 'setCookie')
			.and
			.stub();

		cookie.init();
	});

	it('should be parse exist cookies', function() {
		expect(request.getCookie).toHaveBeenCalled();
		expect(cookie._cookie.size).toEqual(2);
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

		expect(respond.setCookie).toHaveBeenCalled();
	});

	it('should be delete value from cookie', function() {
		cookie.delete('cok2');

		expect(respond.setCookie).toHaveBeenCalled();
		expect(cookie._cookie.size).toEqual(1);
	});

	it('should be delete all cookies', function() {
		cookie.clear();

		expect(respond.setCookie.calls.count()).toEqual(2);
		expect(cookie._cookie.size).toEqual(0);
	});

	it('should be get cookies string', function() {
		expect(cookie.getCookiesString()).toEqual(cookieString);
	});

	it('should parse cookie from Set-Cookie header string', function() {
		spyOn(cookie, 'set');

		cookie.parseFromSetCookieHeader(setCookieString);
		expect(cookie.set).toHaveBeenCalledWith('cok3', 'hello3', {expires: cookie.MAX_EXPIRE_DATE, httpOnly: false, secure: false, path: '/'});
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
				expect(cookie._getExpiresDate(value) instanceof Date).toEqual(true);
			});
		});
	});

});