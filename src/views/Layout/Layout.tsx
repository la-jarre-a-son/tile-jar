import { bindClassNames, Button, Icon, Modal, ModalContainer, Stack, ToggleButton, Toolbar } from '@la-jarre-a-son/ui';

import Render from '../Render';

import styles from './Layout.module.scss';
import PresetList from '../PresetList';
import Settings from '../Settings';
import AnimationState from '../AnimationState';
import PresetActions from '../PresetActions';

import About from '../About';

import packageJson from '../../../package.json';
import logoSvg from '../../assets/logo.svg';
import { useState } from 'react';

const cx = bindClassNames(styles);

const Layout: React.FC = () => {
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  return (
    <div className={cx('base')}>
      <Toolbar as={Stack} elevation={3} className={cx('header')}>
        <h1 className={cx('title')}>
          <img src={logoSvg} width="112px" height="42px" />
        </h1>
        <div className={cx('subtitle')}>A way to generate animated tilings</div>
        <ToggleButton
          intent="neutral"
          aria-label="about"
          selected={aboutOpen}
          onClick={() => setAboutOpen(true)}
          left={<Icon name="fi fi-rr-info" />}
        >
          v{packageJson.version}
        </ToggleButton>
        <Button aria-label="github" icon>
          <Icon name="fi fi-brands-github" />
        </Button>
      </Toolbar>
      {!window.showDirectoryPicker && (
        <div className={cx('unsupported')}>
          Your browser does not support the FileSystem API (or it is disabled), you won't be able to export/import files. Use a
          browser based on Chromium, and/or enable the FileSystem API in its settings.
        </div>
      )}
      <div className={cx('modalContainer')}>
        <ModalContainer>
          <div className={cx('content')}>
            <PresetList />
            <div className={cx('render')}>
              <PresetActions />
              <Render />
              <AnimationState />
            </div>
            <Settings />
          </div>
        </ModalContainer>
      </div>
      <Modal open={aboutOpen} onClose={() => setAboutOpen(false)}>
        <About />
      </Modal>
    </div>
  );
};

export default Layout;
