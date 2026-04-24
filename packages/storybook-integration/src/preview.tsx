import { withPageContext } from './decorators/withPageContext';
import { setStorybookEnv } from './helpers/storybookHelper';
import { imaLoader } from './loaders/imaLoader';

setStorybookEnv(true);

export const decorators = [withPageContext];
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
