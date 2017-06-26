
let del = require('del');
let fs = require('fs');
let templateProcessor = require('ima-server/lib/templateProcessor');

exports.__requiresConfig = true;

exports.default = (gulpConfig) => {
	let env = process.env.NODE_ENV || 'dev';
	if (env === 'production') {
		env = 'prod';
	}

	function spaCompile(done) {
		let environmentConfig = require(
			process.cwd() + '/app/environment.js'
		)[env];

		let templateVariables = {
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

		let sourceTemplate = './build/static/html/spa.html';
		fs.readFile(sourceTemplate, 'utf-8', (error, content) => {
			if (error) {
				console.error(error);
				done();
				return;
			}

			global.$Debug = environmentConfig.$Debug;
			content = content.replace(/['"]\{\$Protocol}['"]/, '{$Protocol}');
			content = content.replace(/['"]\{\$Host}['"]/, '{$Host}');
			content = templateProcessor(content, templateVariables);
			fs.writeFile('./build/index.html', content, 'utf-8', () => {
				done();
			});
		});
	}

	function spaClean() {
		return del('./build/ima');
	}

	return {
		'spa:clean': spaClean,
		'spa:compile': spaCompile
	};
};
