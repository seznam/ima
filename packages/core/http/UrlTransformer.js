/**
 * Utility for transforming URLs according to the configured replacement rules.
 */
export default class UrlTransformer {
  static get $dependencies() {
    return [];
  }

  /**
	 * Initializes the URL transformer.
	 */
  constructor() {
    /**
		 * @type {Object<string, string>}
		 */
    this._rules = {};
  }

  /**
	 * Adds the provided replacement rule to the rules used by this URL
	 * transformer.
	 *
	 * @param {string} pattern Regexp patter to look for (must be escaped as if
	 *        for use in the {@linkcode Regexp} constructor).
	 * @param {string} replacement The replacement of the matched patter in any
	 *        matched URL.
	 * @return {UrlTransformer} This transformer.
	 */
  addRule(pattern, replacement) {
    this._rules[pattern] = replacement;

    return this;
  }

  /**
	 * Clears all rules.
	 *
	 * @return {UrlTransformer} This transformer.
	 */
  clear() {
    this._rules = {};

    return this;
  }

  /**
	 * Applies all rules registered with this URL transformer to the provided
	 * URL and returns the result. The rules will be applied in the order they
	 * were registered.
	 *
	 * @param {string} str The URL for transformation.
	 * @return {string} Transformed URL.
	 */
  transform(str) {
    let rulesKey = Object.keys(this._rules);

    if (rulesKey.length === 0) {
      return str;
    }

    let reg = new RegExp(rulesKey.join('|'), 'g');

    return str.replace(reg, ruleKey => this._rules[ruleKey]);
  }
}
