/* eslint-disable no-case-declarations */
import { Dispatch, FunctionComponent, useReducer } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

import { ErrorsAction } from '#/actions';
import {
  ErrorsState,
  errorsReducer,
  errorsInitialState,
  ErrorWrapper,
} from '#/reducers';

interface IErrorsContext {
  state: ErrorsState;
  dispatch: Dispatch<ErrorsAction>;
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

function useErrorsStore<Selected = IErrorsContext>(
  selector?: (value: IErrorsContext) => Selected
) {
  const defaultSelector = (context: IErrorsContext): IErrorsContext => context;

  return useContextSelector<IErrorsContext, Selected>(
    ErrorsContext,
    // @ts-expect-error not sure how to type this :D
    selector ?? defaultSelector
  );
}

function useErrorsDispatcher(): IErrorsContext['dispatch'] {
  return useErrorsStore(c => c.dispatch);
}

export {
  IErrorsContext,
  ErrorsContext,
  ErrorsStoreProvider,
  useErrorsStore,
  useErrorsDispatcher,
};
