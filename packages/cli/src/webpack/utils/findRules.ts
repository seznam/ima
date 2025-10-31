import { Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';

/**
 * Recursively finds a reference to a given loader.
 */
export function findLoader(
  rule: RuleSetRule | RuleSetRule[],
  loader: string
): RuleSetUseItem[] | null {
  if (Array.isArray(rule)) {
    // Flatten all loader results from recursive calls
    const results: RuleSetUseItem[] = [];
    for (const r of rule) {
      const loaderResults = findLoader(r, loader);
      if (loaderResults) {
        results.push(...loaderResults);
      }
    }
    return results.length > 0 ? results : null;
  }

  if (rule.loader?.includes(loader)) {
    // Return the loader configuration object, not the whole rule
    return [rule.loader as RuleSetUseItem];
  }

  if (rule.oneOf) {
    // Flatten all loader results from oneOf
    const results: RuleSetUseItem[] = [];
    for (const r of rule.oneOf) {
      if (Array.isArray(r)) {
        for (const subRule of r) {
          const loaderResults = findLoader(subRule, loader);
          if (loaderResults) {
            results.push(...loaderResults);
          }
        }
      } else if (typeof r === 'object' && r) {
        const loaderResults = findLoader(r, loader);
        if (loaderResults) {
          results.push(...loaderResults);
        }
      }
    }
    return results.length > 0 ? results : null;
  }

  if (Array.isArray(rule.use)) {
    const result = rule.use.filter(r => {
      if (
        (typeof r === 'string' && r.includes(loader)) ||
        (typeof r === 'object' && r && r.loader && r.loader.includes(loader))
      ) {
        return true;
      }
      return false;
    }) as RuleSetUseItem[];

    return result.length > 0 ? result : null;
  }

  return null;
}

/**
 * Helper for finding rules with given loader in webpack config.
 */
export function findRules(
  config: Configuration,
  testString: string,
  loader?: string
): RuleSetRule[] | RuleSetUseItem[] {
  const foundRules = [];
  const rules = config.module?.rules;

  if (!rules) {
    return [];
  }

  (function recurseFindRules(rule: RuleSetRule | RuleSetRule[]): void {
    if (Array.isArray(rule)) {
      for (const r of rule) {
        recurseFindRules(r);
      }

      return;
    }

    if (
      rule.test &&
      ((typeof rule.test === 'function' && rule.test(testString)) ||
        (rule.test instanceof RegExp && rule.test.test(testString)) ||
        (typeof rule.test === 'string' && rule.test === testString))
    ) {
      foundRules.push(rule);
    }

    if (rule.oneOf) {
      return recurseFindRules(rule.oneOf as RuleSetRule);
    }
  })(rules as RuleSetRule[]);

  if (!loader) {
    return foundRules;
  }

  // Remove duplicates
  return Array.from(new Set(findLoader(foundRules, loader) ?? []));
}
