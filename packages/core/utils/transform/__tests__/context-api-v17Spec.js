import { defineInlineTest } from 'jscodeshift/src/testUtils';
import { getOptions } from '../transformUtils/testUtils';
import transform from '../context-api-v17';

describe('ima.utils.transform.context-api-v17', () => {
  defineInlineTest(
    transform,
    getOptions(),
    `
export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    `
export default class MyComponent extends AbstractComponent {
	render() {}
}
`,
    "Should not touch the code if it doesn't define context"
  );

  defineInlineTest(
    transform,
    getOptions(),
    `
import Core from '@ima/core';

export default class MyComponent extends AbstractComponent {
	static get contextTypes() {
		return {
			$Utils: PropTypes.object,
			urlParams: PropTypes.object
		};
	}
}
`,
    `
import Core, { PageContext } from '@ima/core';

export default class MyComponent extends AbstractComponent {
	static get contextType() {
		return PageContext;
	}
}
`,
    'Should add named import to existing @ima/core import statement'
  );

  defineInlineTest(
    transform,
    getOptions(),
    `
export default class MyComponent extends AbstractComponent {
	static get contextTypes() {
		return {
			$Utils: PropTypes.object,
			urlParams: PropTypes.object
		};
	}
}
`,
    `
import { PageContext } from '@ima/core';
export default class MyComponent extends AbstractComponent {
	static get contextType() {
		return PageContext;
	}
}
`,
    "Should add named import to top of the page if it doesn't exists"
  );

  defineInlineTest(
    transform,
    getOptions(),
    `
export default class MyComponent extends AbstractComponent {
	static get contextTypes() {
		return {
			$Utils: PropTypes.object,
			urlParams: PropTypes.object
		};
	}
}
`,
    `
import { PageContext } from '@ima/core';
export default class MyComponent extends AbstractComponent {
	static get contextType() {
		return PageContext;
	}
}
`,
    'Should replace contextTypes with contextType returning PageContext'
  );
});
