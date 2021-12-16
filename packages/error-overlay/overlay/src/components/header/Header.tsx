import { FunctionComponent, memo } from 'react';

import { Button, Icon } from '#/components';
import { useBridgeInterface } from '#/hooks';
import { ErrorWrapper } from '#/reducers';
import { useErrorsDispatcher, useErrorsStore } from '#/stores';

export type HeaderProps = {
  error: ErrorWrapper;
};

const Header: FunctionComponent<HeaderProps> = ({ error }) => {
  const { closeOverlay, isSSRError } = useBridgeInterface();
  const dispatch = useErrorsDispatcher();
  const errorIds = useErrorsStore(context => context.state.errorIds);

  return (
    <div className="flex justify-between items-center my-3">
      {error && errorIds.length > 1 ? (
        <div className="flex items-center">
          <Button
            size="xs"
            onClick={() => dispatch({ type: 'previous' })}
            className="mr-1">
            <Icon icon="chevron" size="xs" className="transform -rotate-180" />
          </Button>
          <Button
            size="xs"
            onClick={() => dispatch({ type: 'next' })}
            className="mr-3">
            <Icon icon="chevron" size="xs" />
          </Button>
          <span className="text-sm text-slate-700">
            <span className="font-bold">{errorIds.indexOf(error.id) + 1}</span>{' '}
            of <span className="font-bold">{errorIds.length}</span> errors are
            visible on the page
          </span>
        </div>
      ) : (
        <div />
      )}
      {!isSSRError && (
        <Button onClick={closeOverlay} linkStyle>
          <Icon icon="cross" size="lg" className="text-slate-700" />
        </Button>
      )}
    </div>
  );
};

export { Header };
export default memo(Header);
