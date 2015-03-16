describe('Core.Dispatcher.Handler', function() {

	var handlers = {
		handler1: function() {},
		handler2: function() {}
	};

	var event = 'event';
	var data = {
		data: 'data'
	};

	var dispatcher = null;
	beforeEach(function() {
		dispatcher = ns.oc.create('Core.Dispatcher.Handler', new Map());
	});

	describe('listen method', function() {
		it('should be add handler for event', function() {

			dispatcher.listen(event, handlers.handler1);
			dispatcher.listen(event, handlers.handler2);
			expect(dispatcher._callbacks.get(event).handlers.length).toEqual(2);
			expect(dispatcher._callbacks.get(event).scopes.length).toEqual(2);
		});

		it('should be add handler with their scope for event', function() {

			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.listen(event, handlers.handler2, handlers);
			expect(dispatcher._callbacks.get(event).handlers.length).toEqual(2);
			expect(dispatcher._callbacks.get(event).scopes.length).toEqual(2);
		});

		it('should be throw error if handler isnt function', function() {
			expect(function() {
				dispatcher.listen(event, 'string');
			}).toThrow();
			expect(function() {
				dispatcher.listen(event, 1);
			}).toThrow();
			expect(function() {
				dispatcher.listen(event, {});
			}).toThrow();
		});
	});

	describe('unlisten method', function() {

		beforeEach(function() {
			dispatcher.clear();
		});

		it('should be remove handler for event', function() {
			dispatcher.listen(event, handlers.handler1);
			dispatcher.listen(event, handlers.handler2);

			dispatcher.unlisten(event, handlers.handler1);

			expect(dispatcher._callbacks.get(event).handlers.length).toEqual(1);
			expect(dispatcher._callbacks.get(event).scopes.length).toEqual(1);
		});

		it('should be remove handler with their scope for event', function() {
			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.listen(event, handlers.handler2, handlers);

			dispatcher.unlisten(event, handlers.handler1, handlers);

			expect(dispatcher._callbacks.get(event).handlers.length).toEqual(1);
			expect(dispatcher._callbacks.get(event).scopes.length).toEqual(1);
		});

		it('should be remove handler with their scope for event, if scope is not changing', function() {
			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.unlisten(event, handlers.handler1, handlers);

			expect(dispatcher._callbacks.get(event).handlers.length).toEqual(0);
			expect(dispatcher._callbacks.get(event).scopes.length).toEqual(0);
		});

		it('should be remove handler with their scope for event, if scope is changing', function() {
			
			dispatcher.listen(event, handlers.handler1, handlers);

			handlers.handler3 = function() {};

			dispatcher.unlisten(event, handlers.handler1, handlers);

			expect(dispatcher._callbacks.get(event).handlers.length).toEqual(0);
			expect(dispatcher._callbacks.get(event).scopes.length).toEqual(0);
		});

		it('should be throw error for undefined event', function() {
			expect(function() {
				dispatcher.unlisten(event, handlers.handler1);
			}).toThrow();
		});

		it('should be throw error for undefined handler for event', function() {
			dispatcher.listen(event, handlers.handler1);

			expect(function() {
				dispatcher.unlisten(event, handlers.handler2);
			}).toThrow();
		});
	});

	describe('fire method', function() {
		it('should be fire event for handlers', function() {
			spyOn(handlers, 'handler1');
			spyOn(handlers, 'handler2');

			dispatcher.listen(event, handlers.handler1);
			dispatcher.listen(event, handlers.handler2);

			dispatcher.fire(event, data);

			expect(handlers.handler1).toHaveBeenCalledWith(data);
			expect(handlers.handler2).toHaveBeenCalledWith(data);
		});

		it('should be throw error for undefiend event', function() {
			expect(function() {
				dispatcher.fire(event, data);
			}).toThrow();
		});
	});

	describe('clear method', function() {
		it('should be cleared dispatcher', function() {
			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.listen(event, handlers.handler2, handlers);

			dispatcher.clear();

			expect(dispatcher._callbacks.size).toEqual(0);
		});

	});

});