import { defineInlineTest } from 'jscodeshift/src/testUtils';
import { getOptions } from '../transformUtils/testUtils';
import transform from '../import-v17';

describe('ima.utils.transform.import-v17', () => {
  defineInlineTest(
    transform,
    getOptions(),
    `
import Foo from 'bar';

export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    `
import Foo from 'bar';

export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    "Should not touch the code if it doesn't import ima."
  );

  defineInlineTest(
    transform,
    getOptions(),
    `
import Foo from 'bar';
import AbstractComponent from 'ima/page/AbstractComponent';
import { defaultCssClasses } from 'ima/page/componentHelpers';

export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    `
import { AbstractComponent, defaultCssClasses } from '@ima/core';
import Foo from 'bar';

export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    'Should rename all ima imports to new namespaced version.'
  );
});
