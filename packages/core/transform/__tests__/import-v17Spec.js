import { describe } from 'vitest';

const { defineInlineTest } = require('jscodeshift/src/testUtils');

const transform = require('../import-v17');
const { getOptions } = require('../transformUtils/testUtils');

describe('ima.core.utils.transform.import-v17', () => {
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
import AbstractPureComponent from 'ima/page/AbstractPureComponent';
import IMAComponent from 'ima/page/AbstractComponent';
import { defaultCssClasses } from 'ima/page/componentHelpers';
import * as ima from 'ima/main';

export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    `
import {
    AbstractPureComponent,
    AbstractComponent as IMAComponent,
    defaultCssClasses,
} from '@ima/core';

import Foo from 'bar';
import * as ima from '@ima/core';

export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    'Should rename all ima imports to new namespaced version.'
  );
});
