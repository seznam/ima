import React from 'react';

import styles from './githubLink.module.css';

function GithubLink({ url, ...restProps }) {
  if (!url) {
    return null;
  }

  return (
    <a
      href={url}
      target='_blank'
      rel='noreferrer'
      className={styles.link}
      {...restProps}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={styles.icon}
      >
        <path d='M13.5 10.5L21 3' />
        <path d='M16 3h5v5' />
        <path d='M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5' />
      </svg>
    </a>
  );
}

export { GithubLink };
