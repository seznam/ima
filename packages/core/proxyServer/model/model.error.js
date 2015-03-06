var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = (database) => {

	class ErrorLog{
		/**
		 * @method constructor
		 * @constructor
		 * @param {Mongo} db
		 * */
		constructor(db) {

			/**
			 * @property _db
			 * @private
			 * @type {Mongo}
			 * @default db
			 * */
			this._db = db;

			/**
			 * @property _schema
			 * @private
			 * @type {Mongoose.Schema}
			 * @default null
			 * */
			this._schema = null;

			/**
			 * @property _model
			 * @private
			 * @type {Mongoose.Model}
			 * @default null
			 * */
			this._model = null;
		}

		/**
		 * Create new record.
		 *
		 * @method create
		 * @param {Object} data
		 * */
		create(data) {
			new this._model(data)
				.save((err) => {

					if (err) {
						console.error(err);
					}

				});
		}

		/**
		 * Init model.
		 *
		 * @method init
		 * */
		init() {
			this._schema = new Schema({
				message:  String,
				date: { type: Date, default: Date.now}
			});

			this._model = mongoose.model('errors', this._schema);
		}

	}

	return new ErrorLog(database);
};