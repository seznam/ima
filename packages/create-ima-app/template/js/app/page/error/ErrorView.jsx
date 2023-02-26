import './errorView.less';

export function ErrorView({ error }) {
  const message = error.message || '';
  const stack = error.stack || '';

  return (
    <div className='page-error'>
      <h1>500 &ndash; Error</h1>
      <div className='message'>{message}</div>
      <pre>{stack}</pre>
    </div>
  );
}
