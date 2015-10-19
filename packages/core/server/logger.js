
var winston = require('winston');
var environment = require('./environment.js');

var FORMATTING = environment.$Server.logger.formatting;
if (['simple', 'JSON'].indexOf(FORMATTING) === -1) {
	throw new Error('Invalid logger configuration: the formatting has to be ' +
			`either "simple" or "JSON", ${FORMATTING} was provided`);
}

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
	switch (FORMATTING) {
		case 'JSON':
			return formatMetaJSON(meta);
		case 'simple':
			return formatMetaSimple(meta);
		default:
			throw new Error(`Unrecognized log message formatting: ${FORMATTING}`);
	}
}

function formatMetaSimple(meta) {
	var keys = Object.keys(meta);
	if (!meta || !keys.length) {
		return '';
	}

	var lines = keys.map((key) => {
		var value = meta[key];
		if (value instanceof Error) {
			return key + ': ' + indentLines(value.stack, '   ', true);
		} else if (value instanceof Object) {
			return key + ': ' + indentLines(
				JSON.stringify(value, null, 4),
				'   ',
				true
			);
		} else {
			return key + ': ' + value;
		}
	});

	return '\n - ' + lines.join('\n - ');
}

function indentLines(string, spaces, skipFirstLine) {
	var lines = string.split('\n');

	var indentedLines = lines.map((line, index) => {
		if (!index && skipFirstLine) {
			return line;
		}

		return spaces + line;
	});

	return indentedLines.join('\n');
}

function formatMetaJSON(meta) {
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

	var stack = error.stack.split('\n').slice(1).map((line) => {
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
