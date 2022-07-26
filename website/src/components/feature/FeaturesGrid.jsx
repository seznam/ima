import React from 'react';

import { Feature } from './Feature';

function FeaturesGrid({ data }) {
  return (
    <section>
      <div className='container'>
        <div className='row'>
          {data.map((props, index) => (
            <Feature key={index} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeaturesGrid };
