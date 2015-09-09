
var helper = require('./helper.js');

module.exports = processTemplate;

var SIMPLE_ENV_CONDITION_MATCHER = /[{]ifEnv\s+([^}]+)[}]([^{]*)[{]\/ifEnv[}]/;
var IF_ELSE_ENV_CONDITION_MATCHER =
		/[{]ifEnv\s+([^}]+)[}]([^{]*)[{]else[}]([^{]*)[{]\/ifEnv[}]/;

/**
 * Processes the provided template, replacing variable placeholders with the
 * values of the variables, and evaluating all conditions.
 *
 * @param {string} template The template.
 * @param {Object<string, *>} variables The variables and their values.
 * @return {string} The processed template.
 */
function processTemplate(template, variables) {
	for (var variableName of Object.keys(variables)) {
		var value = variables[variableName];

		template = replaceVariable(template, variableName, value);
	}

	template = evaluateConditions(template, variables);

	return template;
}

/**
 * Replaces all occurrences of the specified variable in the provided template
 * with its value.
 *
 * @param {string} template The template.
 * @param {string} name The variable name.
 * @param {(number|string)} value The variable value.
 * @return {string} Processed template.
 */
function replaceVariable(template, name, value) {
	var key = `{${name}}`;
	var reg = new RegExp(helper.escapeRegExp(key), 'g');

	return template.replace(reg, value);
}

/**
 * Processes the if and if-else conditions in the template.
 *
 * @param {string} template The template to process.
 * @param {Object<string, *>} variables The variables that should be available
 *        to the predicate expressions in the conditions.
 * @return {string} Processed template.
 */
function evaluateConditions(template, variables) {
	do {
		var source = template;

		template = processSimpleConditions(template, variables);
		template = processIfElseConditions(template, variables);
	} while (source !== template);

	return template;
}

/**
 * Processes the simple if conditions without an else clause in the template.
 *
 * @param {string} template The template to process.
 * @param {Object<string, *>} variables The variables that should be available
 *        to the predicate expressions in the conditions.
 * @return {string} Processed template.
 */
function processSimpleConditions(template, variables) {
	return processCondition(template, variables, SIMPLE_ENV_CONDITION_MATCHER);
}

/**
 * Processes the if-else conditions in the template.
 *
 * @param {string} template The template to process.
 * @param {Object<string, *>} variables The variables that should be available
 *        to the predicate expressions in the conditions.
 * @return {string} Processed template.
 */
function processIfElseConditions(template, variables) {
	return processCondition(
		template,
		variables,
		IF_ELSE_ENV_CONDITION_MATCHER
	);
}

/**
 * Processes the conditions within the provided template using the provided
 * condition matcher regexp.
 *
 * @param {string} template The template to process.
 * @param {Object<string, *>} variables The variables that should be available
 *        to the predicate expressions in the conditions.
 * @param {RegExp} matcher The regexp to use to match the conditions in the
 *        template.
 * @return {string} Processed template.
 */
function processCondition(template, variables, matcher) {
	while (true) {
		var matchedCondition = template.match(matcher);
		if (!matchedCondition) {
			break;
		}

		var fragment = matchedCondition[0];
		var conditionCode = matchedCondition[1];

		var testResult = evaluateCondition(conditionCode, variables);
		var replaceWith =
				testResult ?
				matchedCondition[2] :
				(matchedCondition[3] || '');

		template = template.replace(fragment, replaceWith);
	}

	return template;
}

/**
 * Evaluates the provided JavaScript condition expression. The function uses
 * eval, so frequent calls to it may impede performance.
 *
 * @param {string} conditionCode A JavaScript expression to evaluate.
 * @param {Object<string, *>} variables The variables that should be available
 *        to the expression to evaluate.
 * @return {boolean} The result of the evaluated expression, retyped to a
 *         boolean.
 */
function evaluateCondition(conditionCode, variables) {
	var trimmedCondition = conditionCode.trim();

	if ($Debug) {
		if (!/^!?('[^']*'|"[^"]*")$/.test(trimmedCondition)) {
			throw new Error('Invalid expected value: ' + trimmedCondition);
		}
	}

	var negate = trimmedCondition.charAt(0) === '!';

	var expectedValue = trimmedCondition.slice(negate ? 2 : 1, -1);

	return negate ?
			(expectedValue !== variables.$Env) :
			(expectedValue === variables.$Env);
}
