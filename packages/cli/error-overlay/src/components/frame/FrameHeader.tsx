import { FunctionComponent } from 'react';
import { EditIcon, OpenEyeIcon } from '#/components';
import { FrameHeaderButton } from './FrameHeaderButton';

interface FrameHeaderProps {
  title: string;
  subtitle: string;
}

export const FrameHeader: FunctionComponent<FrameHeaderProps> = ({
  title,
  subtitle
}) => {
  return (
    <header className="flex flex-column justify-between items-center flex-grow p-3">
      <div>
        <h3 className="font-semibold font-mono leading-6 text-sm">{title}</h3>
        <h4 className="text-gray-600 font-mono text-xs">{subtitle}</h4>
      </div>
      <div>
        <FrameHeaderButton>
          <OpenEyeIcon className="w-5 h-5" />
        </FrameHeaderButton>
        <FrameHeaderButton>
          <EditIcon className="w-5 h-5" />
        </FrameHeaderButton>
      </div>
    </header>
  );
};
