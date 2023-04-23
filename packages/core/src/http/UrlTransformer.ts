import { StringParameters } from '../types';

/**
 * Utility for transforming URLs according to the configured replacement rules.
 */
export class UrlTransformer {
  protected _rules: StringParameters;

  static get $dependencies() {
    return [];
  }

  /**
   * Initializes the URL transformer.
   */
  constructor() {
    this._rules = {};
  }

  /**
   * Adds the provided replacement rule to the rules used by this URL
   * transformer.
   *
   * @param pattern Regexp patter to look for (must be escaped as if
   *        for use in the {@link Regexp} constructor).
   * @param replacement The replacement of the matched patter in any
   *        matched URL.
   * @return This transformer.
   */
  addRule(pattern: string, replacement: string) {
    this._rules[pattern] = replacement;

    return this;
  }

  /**
   * Clears all rules.
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
   * @param url The URL for transformation.
   * @return Transformed URL.
   */
  transform(url: string): string {
    const rulesKey = Object.keys(this._rules);

    if (rulesKey.length === 0) {
      return url;
    }

    const reg = new RegExp(rulesKey.join('|'), 'g');

    return url.replace(reg, ruleKey => this._rules[ruleKey]);
  }
}
