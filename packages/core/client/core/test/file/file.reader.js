describe('Core.File.Reader', function() {

	var Promise = null;
	var FileReader = null;
	var fakeFactory = {
		createReader: function() {
			return fakeFileReader;
		}
	}
	var fakeFileReader = {
		readAsDataURL: function() {},
		result: 'textfile'
	};
	
	beforeEach(function() {
		Promise = ns.oc.get('$Promise');
		FileReader = ns.oc.create('Core.File.Reader', fakeFactory, Promise);
	});

	describe('loadFile method', function() {
		it('should load a file and return data of file', function(done) {
			FileReader.loadFile('file').then(
				function(e) {
					expect(e).toEqual(fakeFileReader.result);
					done();
				});
			fakeFileReader.onload();
		});

		it('should load a file and return abort error', function(done) {
			FileReader.loadFile('file').then(
				function() {
					done();
				}, function(e) {
					expect(e instanceof ns.oc.get('Error')).toEqual(true);
					done();
				});
			fakeFileReader.onabort();
		});

		it('should load a file and return abort error', function(done) {
			FileReader.loadFile('file').then(
				function() {
					done();
				}, function(e) {
					expect(e instanceof ns.oc.get('Error')).toEqual(true);
					done();
				});
			fakeFileReader.onerror();
		});
	});
});
	