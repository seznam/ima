module.exports = () => {

	var validateStructure = (options, testedObject, test) => {

		//console.log(testedObject);
		for (var key of Object.keys(test.structure)) {
			var rule = test.structure[key];

			if (testedObject[key] === undefined) {
				throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, key: ${key} is undefined for tested object.`);
			}

			if (!rule.validate(testedObject[key])) {
				throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, key: ${key} isnt type of ${rule.getType()}. Additional errors: ${rule.getErrors().map((error) => error.message).concat()}`);
			}
		}
	};


	var parseStructure = (respond, options) => {
		var reg = /\[([a-zA-Z-_0-9]+)(?:([<=>]+)([0-9]+))?\]/;

		//parsed path for tested structure
		if (options.tests) {
			for (var test of options.tests) {
				var testedObject = respond.body;
				var matches = null;

				if (test.name !== '') {
					var paths = test.name.split('.');

					for (var path of paths) {
						matches = path.match(reg);
						if (matches) {

							testedObject = testedObject[matches[1]];

							if (!testedObject) {
								throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, part: ${path} doesnt exist.`);
							}

							if (!Array.isArray(testedObject)) {
								throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, part: ${path} isnt array.`);
							} else {

								if (matches[2] && matches[3]) {
									var arrayLength = parseInt(matches[3], 10);

									switch(matches[2]) {
										case '=':
											if (testedObject.length !== arrayLength) {
												throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, part: ${path} has unexpected array length ${arrayLength} to equal ${testedObject.length}.`);
											}
											break;

										case '>':
											if (testedObject.length <= arrayLength) {
												throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, part: ${path} has unexpected array length ${arrayLength} greater than ${testedObject.length}.`);
											}
											break;

										case '<':
											if (testedObject.length >= arrayLength) {
												throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, part: ${path} has unexpected array length ${arrayLength} less than ${testedObject.length}.`);
											}
											break;
									}

								}
							}
						} else {
							testedObject = testedObject[path];

							if (!testedObject) {
								throw new Error(`API test for ${options.method}: ${options.host}${options.path} has invalid structure. Tests name ${test.name}, part: ${path} doesnt exist.`);
							}
						}
					}
				}

				//test structure
				if (matches && matches[1]) {
					for (var partObject of testedObject) {
						validateStructure(options, partObject, test);
					}
					//console.log(testedObject[2]);
					//validateStructure(options, testedObject[2], test);
				} else {
					validateStructure(options, testedObject, test);
				}

			}
		}
	};

	return {validateStructure, parseStructure};
};