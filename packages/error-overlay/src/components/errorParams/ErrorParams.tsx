import clsx from 'clsx';
import { FunctionComponent, useCallback, useState } from 'react';
import { JSONTree } from 'react-json-tree';

import { ParsedError } from '@/types';

import { Icon } from '..';

const LOCAL_STORAGE_KEY = 'ima-error-overlay-error-params-hidden';

export type ErrorParamsProps = {
  params: ParsedError['params'];
};

const THEME = {
  scheme: 'custom',
  author: '',
  base00: 'transparent',
  base01: '#64748b',
  base02: '#94a3b8',
  base03: '#cbd5e1',
  base04: '#e2e8f0',
  base05: '#e2e8f0',
  base06: '#cbd5e1',
  base07: '#22d3ee',
  base08: '#f472b6',
  base09: '#c084fc',
  base0A: '#818cf8',
  base0B: '#34d399',
  base0C: '#a5b4fc',
  base0D: '#67e8f9',
  base0E: '#f9a8d4',
  base0F: '#fbbf24',
};

function useLocalStorageHidden() {
  const storageValue = localStorage.getItem(LOCAL_STORAGE_KEY);
  const [hidden, setHidden] = useState(storageValue === 'true' ? true : false);

  const toggle = useCallback(() => {
    setHidden(v => {
      localStorage.setItem(LOCAL_STORAGE_KEY, !v + '');

      return !v;
    });
  }, []);

  return { hidden, toggle };
}

const ErrorParams: FunctionComponent<ErrorParamsProps> = ({ params }) => {
  const { hidden, toggle } = useLocalStorageHidden();

  // Check for empty params
  if (
    !params ||
    (typeof params === 'string' && !params) ||
    (typeof params === 'object' && Object.keys(params).length === 0)
  ) {
    return null;
  }

  let stringParams = '';
  let parsedParams = {};

  try {
    // Make sure the params are parse-able
    stringParams = typeof params !== 'string' ? JSON.stringify(params) : params;
    parsedParams = JSON.parse(stringParams);
  } catch (error) {
    return null;
  }

  return (
    <div
      className={clsx('ima-error-params', {
        'ima-error-params--hidden': hidden,
      })}
    >
      <div className='ima-error-params__title'>
        <div>Error params:</div>
        <div className='ima-error-params__size'>
          {stringParams.length} chars
          <span className='ima-error-params__separator'></span>
          <button
            className='ima-error-params__button'
            type='button'
            onClick={() => toggle()}
          >
            <Icon icon='chevron' className='ima-error-params__icon' />
          </button>
        </div>
      </div>
      {!hidden && (
        <div className='ima-error-params__json-tree'>
          <JSONTree
            hideRoot={true}
            data={parsedParams}
            shouldExpandNodeInitially={(keyPath, data, level) => level < 3}
            invertTheme={false}
            theme={{ extend: THEME }}
          />
        </div>
      )}
    </div>
  );
};

export default ErrorParams;
