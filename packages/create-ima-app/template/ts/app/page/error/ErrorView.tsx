import './errorView.less';

export type ErrorViewProps = {
  error: Error;
};

export function ErrorView({ error }: ErrorViewProps) {
  const message = error.message ?? '';
  const stack = error.stack ?? '';

  return (
    <div className='page-error'>
      <h1>500 &ndash; Error</h1>
      <div className='message'>{message}</div>
      <pre>{stack}</pre>
    </div>
  );
}
