'use strict';

const proxy = require('../lib/proxy.js');

describe('Proxy', () => {

	describe('parseSetCookieHeader method should parse set-cookie header', () => {
		let t1 = 'cok1=val1';
		let t2 = 'cok2=val2; Expires=Fri, 31 Dec 9999 23:59:59 GMT; HttpOnly; Secure; Path=/';
		let t3 = 'cok3=%22%7B"watchdog"%3A1454424849%7D%22; Path=/; Expires=Wed, 01 Feb 2017 14:54:09 GMT; HttpOnly';
		let t4 = 'cok3=%22%7B"watchdog"%3A1454424849%7D%22; Path=/; Expires=Wed, 01 Feb 2017 14:54:09 GMT; HttpOnly; Max-Age=5';

		it(t1, () => {
			let { name, value, options } = proxy.parseSetCookieHeader(t1);

			expect(name).toEqual('cok1');
			expect(value).toEqual('val1');
			expect(options).toEqual({
				path: '/',
				secure: false,
				expires: new Date('Fri, 31 Dec 9999 23:59:59 UTC'),
				httpOnly: false,
				'max-Age': null
			});
		});

		it(t2, () => {
			let { name, value, options } = proxy.parseSetCookieHeader(t2);

			expect(name).toEqual('cok2');
			expect(value).toEqual('val2');
			expect(options).toEqual({
				expires: new Date('Fri, 31 Dec 9999 23:59:59 GMT'),
				httpOnly: true,
				secure: true,
				path: '/',
				'max-Age': null
			});
		});

		it(t3, () => {
			let { name, value, options } = proxy.parseSetCookieHeader(t3);

			expect(name).toEqual('cok3');
			expect(value).toEqual('"{"watchdog":1454424849}"');
			expect(options).toEqual({
				expires: new Date('Wed, 01 Feb 2017 14:54:09 GMT'),
				httpOnly: true,
				secure: false,
				path: '/',
				'max-Age': null
			});
		});

		it(t4, () => {
			let { name, value, options } = proxy.parseSetCookieHeader(t4);

			expect(name).toEqual('cok3');
			expect(value).toEqual('"{"watchdog":1454424849}"');
			expect(options).toEqual({
				expires: new Date('Wed, 01 Feb 2017 14:54:09 GMT'),
				httpOnly: true,
				secure: false,
				path: '/',
				'max-Age': '5'
			});
		});

	});

});
