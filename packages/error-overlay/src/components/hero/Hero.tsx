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
    <div className='flex flex-col mb-4 md:flex-row md:justify-between md:items-center md:mb-6'>
      <div className='md:mr-2'>
        <h1
          className={clsx(
            'inline py-[0.1rem] px-2 text-[0.65rem] font-bold sm:py-1 md:text-xs',
            {
              ['text-yellow-700 bg-yellow-100']: error?.type === 'compile',
              ['text-rose-700 bg-rose-100']: error?.type === 'runtime',
            }
          )}
        >
          {errorType}
        </h1>
        <h2 className='mt-2 text-base tracking-tighter text-rose-600 break-words sm:text-xl md:text-2xl'>
          {error.name}: {error.message}
        </h2>
      </div>
      {/* Compile errors have only original sources */}
      {error.type !== 'compile' && Object.keys(error.frames).length > 0 && (
        <Button
          color={error.showOriginal ? 'gray' : 'green'}
          className='inline-flex items-center self-center mt-3 whitespace-nowrap md:mt-0'
          onClick={() =>
            dispatch({
              type: error.showOriginal ? 'viewCompiled' : 'viewOriginal',
              payload: { errorId: error.id },
            })
          }
        >
          {error.showOriginal ? (
            <>
              <Icon icon='closedEye' size='sm' className='mr-2' /> View compiled
            </>
          ) : (
            <>
              <Icon icon='openEye' size='sm' className='mr-2' /> View Original
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export { Hero };
export default memo(Hero);
