describe('Core.File.Uploader', function() {
	function mockXHR() {
		this.upload = {};
		this.status = null;
		this.response = null;
	};
	mockXHR.prototype.open = function() {};
	mockXHR.prototype.send = function(data) {};

	var Promise;
	var FileUploader;
	var mock;

	beforeEach(function() {
		mock = new mockXHR();
		Promise = ns.oc.get('$Promise');
		FileUploader = ns.oc.create('Core.File.Uploader', mock, Promise);
	});

	it('should upload a file data', function() {
		spyOn(mock, 'send')
			.and
			.callFake(function() {
				mock.status = 200;
				mock.response = 'TEST';
				this.onload();
			});

		FileUploader
			.uploadFile({url: '/file-process.py', data: 'TEST'})
			.then(
				function(response) {
					expect(response).toEqual('TEST');
					done();
				}
			);
	});

	it('should fail during uploading a file data', function() {
		spyOn(mock, 'send')
			.and
			.callFake(function() {
				mock.status = 404;
				this.onerror();
			});

		FileUploader.uploadFile({url: '/nonexistent.py', data: 'TEST'}).then(
			function() {
				done();
			},
			function(status) {
				expect(status).toEqual(404);
				done();
			}
		);
	});

	it('should indicate upload progress', function() {
		var data = '0123456789';

		spyOn(mock, 'send')
			.and
			.callFake(function() {
				this.upload.onprogress({loaded: Math.min(1, Math.round(data.length / 2)), total: data.length});
				this.upload.onprogress({loaded: data.length, total: data.length});
			});

		FileUploader.uploadFile({
			url: '/file-process.py',
			data: data,
			onprogress: function(loaded, total) {
				expect(loaded > 0 && loaded <= total).toBeTruthy();
				expect(total).toEqual(data.length);
			}});
	});
});