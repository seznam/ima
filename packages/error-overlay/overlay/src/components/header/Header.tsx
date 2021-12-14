import { FunctionComponent, memo } from 'react';

import { Button } from '#/components';
import { ErrorWrapper } from '#/reducers/errorsReducer';
import { useErrorsDispatcher } from '#/stores';

type HeaderProps = {
  error?: ErrorWrapper;
  showOriginal: boolean;
};

const HeaderBase: FunctionComponent<HeaderProps> = ({
  error,
  showOriginal
}) => {
  const dispatch = useErrorsDispatcher();
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="my-4 font-mono text-2xl tracking-tighter text-red-500">
        <span className="font-semibold">{error.name}:</span> {error.message}
      </h1>
      {Object.keys(error.frames).length > 0 && (
        <Button
          onClick={() =>
            dispatch({
              type: showOriginal ? 'viewCompiled' : 'viewOriginal'
            })
          }>
          View {showOriginal ? 'compiled' : 'original'}
        </Button>
      )}
    </div>
  );
};

const Header = memo(HeaderBase);
export { Header, HeaderBase };
