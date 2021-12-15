import clsx from 'clsx';
import { FunctionComponent, memo } from 'react';

import { Icon, Button } from '#/components';
import { ErrorWrapper } from '#/reducers';
import { useErrorsDispatcher } from '#/stores';

export type HeroProps = {
  error: ErrorWrapper;
};

const Hero: FunctionComponent<HeroProps> = ({ error }) => {
  const dispatch = useErrorsDispatcher();
  const errorType = error?.type
    ? `${error?.type.charAt(0).toUpperCase()}${error?.type.slice(1)} Error`
    : 'Unknown Error';

  return (
    <div className="flex flex-row justify-between items-center mb-6">
      <div>
        <h1
          className={clsx('inline py-1 px-2 text-xs font-bold rounded-md', {
            ['text-yellow-700 bg-yellow-100']: error?.type === 'compiler',
            ['text-rose-700 bg-rose-100']: error?.type === 'runtime'
          })}>
          {errorType}
        </h1>
        <h2 className="mt-2 text-2xl tracking-tighter text-rose-600">
          {error.name}: {error.message}
        </h2>
      </div>
      {Object.keys(error.frames).length > 0 && (
        <Button
          color={error.showOriginal ? 'gray' : 'green'}
          className="inline-flex items-center"
          onClick={() =>
            dispatch({
              type: error.showOriginal ? 'viewCompiled' : 'viewOriginal',
              payload: { errorId: error.id }
            })
          }>
          {error.showOriginal ? (
            <>
              <Icon icon="closedEye" size="sm" className="mr-2" /> View compiled
            </>
          ) : (
            <>
              <Icon icon="openEye" size="sm" className="mr-2" /> View Original
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export { Hero };
export default memo(Hero);
