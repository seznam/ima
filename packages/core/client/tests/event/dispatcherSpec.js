describe('Core.Event.Dispatcher', function() {

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
		dispatcher = oc.create('Core.Event.Dispatcher');
	});

	describe('listen method', function() {
		it('should add handler for event', function() {

			dispatcher.listen(event, handlers.handler1);
			dispatcher.listen(event, handlers.handler2);
			expect(dispatcher._eventListeners.get(event).size).toEqual(2);
			expect(dispatcher._eventListeners.get(event).get(handlers.handler1).size).toEqual(1);
			expect(dispatcher._eventListeners.get(event).get(handlers.handler2).size).toEqual(1);
		});

		it('should add handler with their scope for event', function() {

			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.listen(event, handlers.handler2, handlers);
			expect(dispatcher._eventListeners.get(event).size).toEqual(2);
			expect(dispatcher._eventListeners.get(event).get(handlers.handler1).size).toEqual(1);
			expect(dispatcher._eventListeners.get(event).get(handlers.handler2).size).toEqual(1);
		});

		it('should throw error if handler isnt function', function() {
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

		it('should remove handler for event', function() {
			dispatcher.listen(event, handlers.handler1);
			dispatcher.listen(event, handlers.handler2);

			dispatcher.unlisten(event, handlers.handler1);

			expect(dispatcher._eventListeners.get(event).size).toEqual(1);
		});

		it('should remove handler with their scope for event', function() {
			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.listen(event, handlers.handler2, handlers);

			dispatcher.unlisten(event, handlers.handler1, handlers);

			expect(dispatcher._eventListeners.get(event).size).toEqual(1);
		});

		it('should remove handler with their scope for event, if scope is not changing', function() {
			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.unlisten(event, handlers.handler1, handlers);

			expect(dispatcher._eventListeners.get(event)).toBeUndefined();
		});

		it('should remove handler with their scope for event, if scope is changing', function() {

			dispatcher.listen(event, handlers.handler1, handlers);

			handlers.handler3 = function() {};

			dispatcher.unlisten(event, handlers.handler1, handlers);

			expect(dispatcher._eventListeners.get(event)).toBeUndefined();
		});

		it('should show warning for undefined event', function() {
			spyOn(console, 'warn')
				.and
				.stub();

			dispatcher.unlisten(event, handlers.handler1);

			expect(console.warn).toHaveBeenCalled();
		});

		it('should show warning for undefined handler for event', function() {
			spyOn(console, 'warn')
				.and
				.stub();

			dispatcher.listen(event, handlers.handler1);
			dispatcher.unlisten(event, handlers.handler2);

			expect(console.warn).toHaveBeenCalled();
		});
	});

	describe('fire method', function() {
		it('should fire event for handlers', function() {
			spyOn(handlers, 'handler1');
			spyOn(handlers, 'handler2');

			dispatcher.listen(event, handlers.handler1);
			dispatcher.listen(event, handlers.handler2);

			dispatcher.fire(event, data);

			expect(handlers.handler1).toHaveBeenCalledWith(data);
			expect(handlers.handler2).toHaveBeenCalledWith(data);
		});

		it('should show warning for none listeners', function() {
			spyOn(console, 'warn')
				.and
				.stub();

			dispatcher.fire(event, data);

			expect(console.warn).toHaveBeenCalled();
		});

		it('should not show warning for $IMA internal event', function() {
			spyOn(console, 'warn')
				.and
				.stub();

			dispatcher.fire(event, data, true);

			expect(console.warn).not.toHaveBeenCalled();
		});
	});

	describe('clear method', function() {
		it('should cleared dispatcher', function() {
			dispatcher.listen(event, handlers.handler1, handlers);
			dispatcher.listen(event, handlers.handler2, handlers);

			dispatcher.clear();

			expect(dispatcher._eventListeners.size).toEqual(0);
		});

	});

});