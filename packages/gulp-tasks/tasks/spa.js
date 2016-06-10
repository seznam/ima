
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var templateProcessor = require('ima-server/lib/templateProcessor');

module.exports = (gulpConfig) => {

	var env = process.env.NODE_ENV || 'dev';
	if (env === 'production') {
		env = 'prod';
	}

	gulp.task('compile:spa', (callback) => {

		var environmentConfig = require(
			process.cwd() + '/app/environment.js'
		)[env];

		var templateVariables = {
			$App: environmentConfig.$App || {},
			$Language: environmentConfig.$Language[
				Object.keys(environmentConfig.$Language)[0]
			],
			$Version: Date.now().toString(36),
			$Env: env,
			$Debug: environmentConfig.$Debug,
			$Protocol: 'location.protocol',
			$Host: 'location.host',
			$Root: '',
			$LanguagePartPath: ''
		};

		fs.readFile('./build/static/html/spa.html', 'utf-8', (error, content) => {
			if (error) {
				console.error(error);
				callback();
				return;
			}

			global.$Debug = environmentConfig.$Debug;
			content = content.replace(/['"]\{\$Protocol}['"]/, '{$Protocol}');
			content = content.replace(/['"]\{\$Host}['"]/, '{$Host}');
			content = templateProcessor(content, templateVariables);
			fs.writeFile('./build/index.html', content, 'utf-8', () => {
				callback();
			});
		});

	});
	
	gulp.task('clean:spa', () => {
		return del('./build/ima');
	});

};
