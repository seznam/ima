describe('Core.Helper', function() {

	var template = null;

	beforeEach(function() {
		template = ns.oc.create('Core.Helper.Template');
	});

	describe('should be join css classes', function() {


		using([
				{classes: ['class1', 'class2', 'class3'], result: 'class1 class2 class3'},
				{classes: ['class1'], result: 'class1'},
				{classes: [], result: ''}
			], function(value) {
				it('classes value are ' + value.classes, function() {
					expect(template.joinClasses(value.classes)).toEqual(value.result);
				});
			});
	});

});