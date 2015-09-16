
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
						formatMeta(options.meta);
			}
		})
	]
});

module.exports = logger;

function formatMeta(meta) {
	var keys = Object.keys(meta);
	if (!meta || !keys.length) {
		return '';
	}

	var clone = {};
	for (var key of keys) {
		if (meta[key] instanceof Error) {
			clone[key] = formatError(meta[key]);
		} else {
			clone[key] = meta[key];
		}
	}

	return JSON.stringify(clone, null, '\t');
}

function formatError(error) {
	var matcher = /^\s+at\s+([^(]+?)\s+[(](.+):(\d+):(\d+)[)]/;

	var stack = error.stack.split("\n").slice(1).map((line) => {
		var parts = line.match(matcher);
		if (!parts) {
			return line;
		}

		return {
			'function': parts[1],
			file: parts[2],
			row: parseInt(parts[3], 10) || parts[3],
			column: parseInt(parts[4], 10) || parts[4]
		};
	});

	var description = {
		type: error.name,
		message: error.message,
		stack
	};

	if (error._params) {
		description.params = error._params;
	}

	return description;
}
