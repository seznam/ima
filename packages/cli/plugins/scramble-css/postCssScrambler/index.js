/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const fs = require('fs');
const path = require('path');

const selectorParser = require('postcss-selector-parser');
const { numberToCssClass } = require('./numberToCssClass');

function generateIdentifierHash(identifier) {
  let hash = 5381,
    index = identifier.length;

  while (index) {
    hash = (hash * 33) ^ identifier.charCodeAt(--index);
  }

  return (hash >>> 0).toString(32);
}

function generateHashTable(css, uniqueIdentifier = '') {
  const prefixes = new Set();
  const mainParts = new Set();

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
  css.walkRules(rule => {
    populatingParser.process(rule.selector);
  });

  return [
    generateIdentifierHash(uniqueIdentifier),
    [...prefixes],
    [...mainParts]
  ];
}

module.exports = options => {
  return {
    postcssPlugin: 'postcss-scrambler',
    Once(root) {
      let uniqueHash, prefixesTable, mainPartsTable;

      if (options.generateHashTable) {
        const tableData = generateHashTable(root, options.uniqueIdentifier);
        [uniqueHash, prefixesTable, mainPartsTable] = tableData;

        const directory = path.dirname(options.hashTable);
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }

        fs.writeFileSync(options.hashTable, JSON.stringify(tableData));
      } else {
        [uniqueHash, prefixesTable, mainPartsTable] = JSON.parse(
          fs.readFileSync(options.hashTable)
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

          const scrambledPrefix = numberToCssClass(prefixIndex);
          const scrambledMainPart = numberToCssClass(mainPartIndex);
          classNameNode.value = `${scrambledPrefix}_${scrambledMainPart}_${uniqueHash}`;
        });
      });
      root.walkRules(rule => {
        let result = scramblingParser.process(rule.selector).result;

        // postcss-selector-parser +3.0.0 compatibility
        if (result === undefined) {
          result = scramblingParser.processSync(rule.selector);
        }

        rule.selector = result;
      });
    }
  };
};

module.exports.postcss = true;
