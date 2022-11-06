import { GenericError } from '@ima/core';
import './errorView.less';

export interface ErrorViewProps {
  error: Error | GenericError;
  status: number;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, status }) => (
  <div className='page-error'>
    <h1>{status} &ndash; Error</h1>
    <div className='message'>{error.message ?? ''}</div>
    <pre>{error.stack ?? ''}</pre>
  </div>
);
