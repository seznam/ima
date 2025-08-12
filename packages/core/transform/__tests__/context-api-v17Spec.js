import { describe } from 'vitest';

const { defineInlineTest } = require('jscodeshift/src/testUtils');

const transform = require('../context-api-v17');
const { getOptions } = require('../transformUtils/testUtils');

describe('ima.core.utils.transform.context-api-v17', () => {
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
import PropTypes from 'prop-types';

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
import PropTypes from 'prop-types';
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
import PropTypes from 'prop-types';
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

  defineInlineTest(
    transform,
    getOptions(),
    `
import PropTypes from 'prop-types';
export default class MyComponent extends AbstractComponent {
	static get contextTypes() {
		return {
			$Utils: PropTypes.object,
			urlParams: PropTypes.object
		};
	}

	static get method() {
		return PropTypes.object;
	}
}
`,
    `
import { PageContext } from '@ima/core';
import PropTypes from 'prop-types';
export default class MyComponent extends AbstractComponent {
	static get contextType() {
		return PageContext;
	}

	static get method() {
		return PropTypes.object;
	}
}
`,
    'Should replace contextTypes and keep PropTypes import since it is used elsewhere'
  );
});
