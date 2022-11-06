import './notFoundView.less';

export interface NotFoundViewProps {
  status: number;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ status }) => (
  <div className='page-not-found'>
    <h1>{status} &ndash; Not Found</h1>
  </div>
);
