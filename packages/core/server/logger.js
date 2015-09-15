
var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			timestamp: () => {
				var now = new Date();
				var date = now.getFullYear() + '-' +
						formatNumber(now.getMonth() + 1) + '-' +
						formatNumber(now.getDate());
				var time = formatNumber(now.getHours()) + ':' +
						formatNumber(now.getMinutes()) + ':' +
						formatNumber(now.getSeconds()) + '.' +
						now.getMilliseconds();

				return date + ' ' + time;

				function formatNumber(number) {
					var asString = '' + number;
					return asString.length > 1 ? asString : ('0' + asString);
				}
			},

			formatter: (options) => {
				return options.timestamp() +
						' [' + options.level.toUpperCase() + '] ' +
						(options.message || '') +
						(
							options.meta && Object.keys(options.meta).length ?
							'\n'+ JSON.stringify(options.meta, null, '\t') :
							''
						);
			}
		})
	]
});

module.exports = logger;
