import React from 'react';

import { Badge, Box, Button, Container, Icon, Link, bindClassNames } from '@la-jarre-a-son/ui';

import logo from '../../assets/logo.svg';

import styles from './About.module.scss';

import packageJson from '../../../package.json';
import { ReactComponent as Changelog } from '../../../CHANGELOG.md';

const cx = bindClassNames(styles);

export const About: React.FC = () => (
  <Container className={cx('base')} size="xl">
    <div className={cx('header')}>
      <img className={cx('logo')} src={logo} alt="" />
      <h1 className={cx('appname')}>
        Tile Jar <Badge className={cx('version')}>{packageJson.version}</Badge>
      </h1>
      <div className={cx('author')}>
        {'by Rémi Jarasson / '}
        <Link href="https://ljas.fr" target="_blank" rel="noreferrer">
          La Jarre à Son
        </Link>
      </div>
    </div>
    <h2 className={cx('title')}>Features</h2>
    <div className={cx('description')}>
      <p>A website to generate tilings with SVG that can be animated and exported as PNGs.</p>
      <p>
        <strong>Your web browser must have FileSystem API enabled and supported to export images.</strong>
      </p>
      <p>
        {"If you have any ideas to improve it, don't hesitate to "}
        <Button
          size="sm"
          intent="neutral"
          as="a"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/la-jarre-a-son/tile-jar/issues/new?labels=bug"
        >
          <Icon name="fi fi-brands-github" />
          Report a bug
        </Button>
        {' or '}
        <Button
          size="sm"
          intent="neutral"
          as="a"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/la-jarre-a-son/tile-jar/issues/new?labels=enhancement"
        >
          <Icon name="fi fi-brands-github" />
          Request a feature
        </Button>
      </p>
    </div>
    <h2 className={cx('title')}>Changelog</h2>
    <Box className={cx('changelog')} elevation={1}>
      <Changelog />
    </Box>
  </Container>
);

export default About;
