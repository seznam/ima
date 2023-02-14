const j = require('jscodeshift');

const {
  addNamedImports,
  removeUnusedPackageImports,
  findImport,
} = require('../imports');
const { source } = require('../testUtils');

describe('ima.core.utils.transform.transformUtils.imports', () => {
  let ast = null;
  const testCase = `
import Atoms from '@usa/plugin-atoms';
import { ReportService } from '@usa/plugin-report';
import Utils, { RegressionHelper, LinkHelper, ImageHelper } from '@usa/utils';
import * as lod from 'lodash';

const service = new ReportService();
		`;

  beforeEach(() => {
    ast = j(testCase);
  });

  describe('addNamedImports', () => {
    it('should add specified list of named imports at top of the file', () => {
      addNamedImports(
        j,
        ast,
        ['NamedImport1', 'NamedImport2'],
        'named-import-plugin'
      );

      expect(source(ast)).toBe(`
import { NamedImport1, NamedImport2 } from 'named-import-plugin';
import Atoms from '@usa/plugin-atoms';
import { ReportService } from '@usa/plugin-report';
import Utils, { RegressionHelper, LinkHelper, ImageHelper } from '@usa/utils';
import * as lod from 'lodash';

const service = new ReportService();
		`);
    });

    it('should add specified list of named imports to existing ones', () => {
      addNamedImports(j, ast, ['Link', 'H1', 'H2'], '@usa/plugin-atoms');
      addNamedImports(j, ast, ['ComponentUtils'], '@usa/utils');

      expect(source(ast)).toBe(`
import Atoms, { Link, H1, H2 } from '@usa/plugin-atoms';
import { ReportService } from '@usa/plugin-report';
import Utils, { ComponentUtils, RegressionHelper, LinkHelper, ImageHelper } from '@usa/utils';
import * as lod from 'lodash';

const service = new ReportService();
		`);
    });

    it('should not do anything if all imports are already defined', () => {
      addNamedImports(j, ast, ['RegressionHelper', 'LinkHelper'], '@usa/utils');

      expect(source(ast)).toBe(testCase);
    });
  });

  describe('removeUnusedPackageImports', () => {
    it('should remove the import statement if package is not used', () => {
      removeUnusedPackageImports(j, ast, '@usa/utils');

      expect(source(ast)).toBe(`
import Atoms from '@usa/plugin-atoms';
import { ReportService } from '@usa/plugin-report';
import * as lod from 'lodash';

const service = new ReportService();
		`);
    });

    it('should do nothing if package is used', () => {
      removeUnusedPackageImports(j, ast, '@usa/plugin-report');

      expect(source(ast)).toBe(testCase);
    });

    /**
     * @todo Update removeUnusedPackageImports method to support this behavior
     */
    it.skip('should remove only unused imports if multiple imports from single package are used', () => {
      ast = j(`
import Sample, { UsedModule, UnusedModule } from 'sample-package';

const usedModule = new UsedModule();
		`);
      removeUnusedPackageImports(j, ast, 'sample-package');

      expect(source(ast)).toBe(`
import { UsedModule } from 'sample-package';

const usedModule = new UsedModule();
		`);
    });
  });

  describe('findImport', () => {
    it('should return empty node if import was not found', () => {
      const result = findImport(j, ast, '@usa/my-custom-package');

      expect(result.size()).toBe(0);
    });

    it('should return ImportDeclaration collection if import was found', () => {
      const result = findImport(j, ast, '@usa/utils');

      expect(result.isOfType(j.ImportDeclaration)).toBe(true);
      expect(result.size()).toBe(1);
    });
  });
});
