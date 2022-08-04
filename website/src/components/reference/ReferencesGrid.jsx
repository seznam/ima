import React from 'react';

import { Reference } from './Reference';

function ReferencesGrid({ data }) {
  return (
    <section>
      <div className='container'>
        <div className='row'>
          {data.map((props, index) => (
            <Reference key={index} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { ReferencesGrid };
