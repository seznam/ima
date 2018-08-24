import React from 'react';
import { createNamedContext } from 'consume-multiple-contexts';

const context = React.createContext();

const Utils = createNamedContext('$Utils', context);
const { Consumer, Provider } = context;

export { Utils, Consumer, Provider };
