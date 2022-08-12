import fs from 'fs';
import path from 'path';

import * as postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

import { numberToCssClass } from './numberToCssClass';

interface PostCssScramblerOptions {
  generateHashTable: boolean;
  hashTablePath?: string;
}

/**
 * Generate hash table from provided CSS.
 */
function createHashTable(root: postcss.Root): [string[], string[]] {
  const prefixes = new Set<string>();
  const mainParts = new Set<string>();

  const populatingParser = selectorParser(selector => {
    selector.walkClasses(classNameNode => {
      const className = classNameNode.value;

      if (/^\d+%/.test(className)) {
        // the selector parser does not handle decimal numbers in
        // selectors (used in keyframes), so we need to handle
        // those ourselves.
        return;
      }

      const parts = className.split('-');
      const prefix = parts[0];
      const mainPart = parts.slice(1).join('-');

      prefixes.add(prefix);
      mainParts.add(mainPart);
    });
  });

  root.walkRules(rule => {
    populatingParser.process(rule.selector);
  });

  return [[...prefixes], [...mainParts]];
}

/**
 * PostCSS plugin to scramble css classes and generate hash table
 * mappings of scrambled and original classes.
 */
const PostCssScrambler: postcss.PluginCreator<
  PostCssScramblerOptions
> = options => {
  const { generateHashTable, hashTablePath } = options || {};

  return {
    postcssPlugin: 'postcss-scrambler',
    Once(root) {
      if (!hashTablePath) {
        return;
      }

      let prefixesTable: string[];
      let mainPartsTable: string[];

      if (generateHashTable && hashTablePath) {
        const tableData = createHashTable(root);
        [prefixesTable, mainPartsTable] = tableData;

        const directory = path.dirname(hashTablePath);
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }

        fs.writeFileSync(hashTablePath, JSON.stringify(tableData));
      } else {
        [prefixesTable, mainPartsTable] = JSON.parse(
          fs.readFileSync(hashTablePath, 'utf8')
        );
      }

      const scramblingParser = selectorParser(selector => {
        selector.walkClasses(classNameNode => {
          const className = classNameNode.value;
          if (/^\d+%/.test(className)) {
            // the selector parser does not handle decimal numbers in
            // selectors (used in keyframes), so we need to handle
            // those ourselves.
            return;
          }

          const parts = className.split('-');
          const prefix = parts[0];
          const mainPart = parts.slice(1).join('-');
          const prefixIndex = prefixesTable.indexOf(prefix);
          const mainPartIndex = mainPartsTable.indexOf(mainPart);

          if (prefixIndex === -1 || mainPartIndex === -1) {
            throw new Error(
              `The ${className} CSS class in not in the hash table`
            );
          }

          // Repace with new class name value with source map support
          classNameNode.replaceWith(
            classNameNode.clone({
              value: `${numberToCssClass(prefixIndex)}_${numberToCssClass(
                mainPartIndex
              )}`,
            })
          );
        });
      });

      root.walkRules(rule => {
        rule.selector = scramblingParser.processSync(rule.selector);
      });
    },
  };
};

PostCssScrambler.postcss = true;

export default PostCssScrambler;
