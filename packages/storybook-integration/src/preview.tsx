import { withPageContextDecorator } from './decorators/withPageContext.js';
import { setStorybookEnv } from './helpers/storybookHelper.js';
import { imaLoader } from './loaders/imaLoader.js';

setStorybookEnv(true);

export const decorators = [withPageContextDecorator];
export const loaders = [imaLoader];
export const argTypes = {
  context: {
    name: 'context',
    control: 'object',
    defaultValue: {},
    description:
      'Set additional PageContext values, that are shallowly merged with current context containing $Utils.',
  },
};
