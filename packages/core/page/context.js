import React from 'react';
import {
  createNamedContext,
  withMultipleContextsFactory
} from 'consume-multiple-contexts';

const context = React.createContext();

const Utils = createNamedContext('$Utils', context);
const withContext = withMultipleContextsFactory(Utils);
const { Consumer, Provider } = context;

export { Utils, Consumer, Provider, withContext };
