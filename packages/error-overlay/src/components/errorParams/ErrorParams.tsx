import prismjs from 'prismjs';
import { FunctionComponent } from 'react';

import { getPrismLanguage } from '@/utils';

export type ErrorParamsProps = {
  params: string;
};

const { grammar, language } = getPrismLanguage('json');

const ErrorParams: FunctionComponent<ErrorParamsProps> = ({ params }) => {
  return (
    <div className='ima-error-params'>
      <div className='ima-error-params__title'>Error params:</div>
      <pre>
        <code
          dangerouslySetInnerHTML={{
            __html: prismjs.highlight(params, grammar, language),
          }}
        />
      </pre>
    </div>
  );
};

export default ErrorParams;
