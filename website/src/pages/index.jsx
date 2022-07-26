import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Star, Gear, Newspaper, Devices, SettingsHorizontal } from 'akar-icons';
import clsx from 'clsx';
import React from 'react';

import { FeaturesGrid, FeaturesSeparator } from '../components/feature';

import featuresData from './features.json';
import styles from './index.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title='IMA.js | A Javascript framework for creating isomorphic applications'
      description='The IMA.js is an application development stack for developing isomorphic applications written in pure JavaScript and React.'
    >
      <header className={clsx('hero', styles.hero)}>
        <div className='container'>
          <h1 className={clsx('hero__title', styles.title)}>
            <img className={styles.logo} src='/img/logo.svg' />
            {siteConfig.title}
          </h1>
          <p className='hero__subtitle'>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className='button button--primary button--lg'
              to='/introduction/getting-started'
            >
              Get Started
            </Link>
            <Link
              className='button button--secondary button--lg'
              to='/tutorial/introduction'
            >
              Take a look at the Tutorial
            </Link>
          </div>
        </div>
      </header>

      <main>
        <FeaturesSeparator title='Features' Icon={Star} />
        <FeaturesGrid data={featuresData} />

        <FeaturesSeparator title='Plugins' Icon={Gear} />
        <FeaturesGrid data={featuresData} />

        <FeaturesSeparator title='References' Icon={Newspaper} />
        <FeaturesGrid data={featuresData} />

        <FeaturesSeparator title='Platforms' Icon={Devices} />
        <FeaturesGrid data={featuresData} />

        <FeaturesSeparator
          title='Used Technologies'
          Icon={SettingsHorizontal}
        />
        <FeaturesGrid data={featuresData} />
      </main>
    </Layout>
  );
}
