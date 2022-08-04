import clsx from 'clsx';
import React from 'react';

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className='padding-horiz--md'>
        <h3>{title}</h3>
        <p dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}

export { Feature };
