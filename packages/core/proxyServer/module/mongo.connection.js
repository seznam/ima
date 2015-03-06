var mongoose = require('mongoose');
var config = require('../config/environment.js');

module.export = (() => {
	var db = mongoose.connect(config.mongo.connect);
	return db;
})();