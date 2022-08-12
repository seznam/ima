import clsx from 'clsx';
import React from 'react';

import styles from './reference.module.css';

function Reference({ title, href, img, description }) {
  return (
    <div className={clsx('col col--6', styles.container)}>
      <div className='padding-horiz--md'>
        <h3 className={styles.title}>
          <a target='_blank' href={href} rel='noreferrer'>
            {title}
          </a>
        </h3>
        <img className={styles.img} src={img} alt={title} />
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export { Reference };
