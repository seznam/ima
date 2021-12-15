import { FunctionComponent, memo } from 'react';

import { Button, Icon } from '#/components';

const Header: FunctionComponent = () => {
  return (
    <div className="flex justify-between items-center my-3">
      <div className="flex items-center">
        <Button size="xs" color="orange" className="mr-1">
          <Icon icon="chevron" size="xs" className="transform -rotate-180" />
        </Button>
        <Button size="xs" color="orange" className="mr-3">
          <Icon icon="chevron" size="xs" />
        </Button>
        <span className="text-sm text-slate-700">
          <span className="font-bold">1</span> of{' '}
          <span className="font-bold">2</span> errors are visible on the page
        </span>
      </div>
      <Button linkStyle>
        <Icon icon="cross" size="lg" className="text-slate-700" />
      </Button>
    </div>
  );
};

export { Header };
export default memo(Header);
