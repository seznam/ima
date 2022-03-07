/* eslint-disable no-case-declarations */
import { createContext, FunctionComponent } from 'preact';
import { useContext, useReducer } from 'preact/hooks';

import { ErrorsAction } from '#/actions';
import {
  ErrorsState,
  errorsReducer,
  errorsInitialState,
  ErrorWrapper,
} from '#/reducers';

interface IErrorsContext {
  state: ErrorsState;
  dispatch: (value: ErrorsAction) => void;
  currentError: ErrorWrapper | null;
}

const ErrorsContext = createContext<IErrorsContext>({} as IErrorsContext);
const ErrorsStoreProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(errorsReducer, errorsInitialState);

  return (
    <ErrorsContext.Provider
      value={{
        state,
        dispatch,
        currentError: state.currentErrorId
          ? state.errors[state.currentErrorId]
          : null,
      }}
    >
      {children}
    </ErrorsContext.Provider>
  );
};

function useErrorsStore() {
  const errorsContext = useContext(ErrorsContext);

  return errorsContext;
}

export { IErrorsContext, ErrorsContext, ErrorsStoreProvider, useErrorsStore };
