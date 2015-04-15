describe('Core.Socket.Parser', function() {

	var parser = null;
	beforeEach(function() {
		parser = oc.create('Core.Socket.Parser');
	});

	describe('method parse', function() {
		it('should be set default value for unknown format event', function() {
			parser.parse({});

			expect(parser.getType()).toEqual(parser.TYPE_UNKNOWN);
			expect(parser.getData()).toEqual({});
		});

		it('should be throw error for non valid json', function() {
			expect(function() {
				parser.parse({data:'{data: {data:xxx}}'});
			}).toThrow();
		});

		it('should be set event type and data for event', function() {
			var eventData = {
				event: {
					type: 'chat',
					data: {
						xxx: 'aaa',
						yyy: 'bbb'
					}
				}
			};
			var event = {
				data: JSON.stringify(eventData)
			};

			parser.parse(event);

			expect(parser.getType()).toEqual(eventData.event.type);
			expect(parser.getData()).toEqual(eventData.event.data);
		});
	});

});