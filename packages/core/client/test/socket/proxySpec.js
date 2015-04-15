describe('Core.Socket.Proxy', function() {

	var proxy = null;
	var dispatcher = null;
	var config = {
		webSocketUrl: 'baseUrl',
		maxRepeatedAttempts: 1
	};
	var websocket = {
		onopen: function() {},
		onmessage: function() {},
		onerror: function() {},
		onclose: function() {},
		close: function() { this.readyState = 0;},
		readyState: 1
	};
	var socketFactory = {
		createConnection: function() {
			return websocket;
		}
	};
	var socketParser = null;
	var secure = false;
	beforeEach(function() {
		dispatcher = oc.create('$Dispatcher');
		socketParser = oc.create('Core.Socket.Parser');
		proxy = oc.create('Core.Socket.Proxy', dispatcher, socketFactory, socketParser, config, secure);
	});

	describe('method open', function() {

		it('should be connect for a new url', function() {
			spyOn(proxy, '_connect');

			proxy.open();

			expect(proxy._connect).toHaveBeenCalled();
		});

		it('should be connect for same url only once', function() {
			spyOn(proxy, '_connect')
				.and
				.callFake(function() {
					proxy._connection = 1;
				});


			proxy.open();
			proxy.open();

			expect(proxy._connect.calls.count()).toEqual(1);
		});

		it('should be close old connection and connect to new url, if url isnt same', function() {
			spyOn(proxy, '_connect')
				.and
				.callFake(function() {
					proxy._connection = 1;
				});
			spyOn(proxy, 'close');

			proxy.open();
			proxy.open('url');

			expect(proxy.close.calls.count()).toEqual(2);
			expect(proxy._connect.calls.count()).toEqual(2);
		});

	});

	describe('method close', function() {
		it('should be close opened connection', function() {
			spyOn(websocket, 'close');

			proxy._connection = websocket;
			proxy.close();

			expect(websocket.close).toHaveBeenCalled();
		});
	});

	describe('method _close', function() {

		it('should be reconnect for not manually closed connection', function() {
			spyOn(proxy, '_connect');

			proxy.__manuallyClosed = false;
			proxy._close();

			expect(proxy._connect).toHaveBeenCalled();
		});

		it('should be throw error when repeat connection attempts exceeded constant MAX_REPEATED_ATTEMPTS', function() {
			proxy.__manuallyClosed = false;
			proxy._repeatedAttempts = config.maxRepeatedAttempts;

			expect(function() {
				proxy._close();
			}).toThrow();
		});

	});

});