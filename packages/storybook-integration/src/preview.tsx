import { withPageContextDecorator } from './decorators/withPageContext.js';
import { imaLoader } from './loaders/imaLoader.js';

export const decorators = [withPageContextDecorator];
export const loaders = [imaLoader];
export const argTypes = {
  context: {
    name: 'PageContext',
    control: 'object',
    defaultValue: {},
    description: 'Set additional PageContext values',
  },
};
