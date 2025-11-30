import React from 'react';

import { bindClassNames, Box, TabsProvider, TabList, Tab, TabPanel } from '@la-jarre-a-son/ui';

import styles from './Settings.module.scss';
import RenderForm from './RenderForm';
import PresetForm from './GridForm';
import VariantsForm from './VariantsForm';
import AnimationForm from './AnimationForm';

const cx = bindClassNames(styles);

export const Settings: React.FC = () => {
  return (
    <TabsProvider as={Box} className={cx('base')} elevation={2}>
      <TabList className={cx('tabs')} aria-label="settings navigation" bordered>
        <Tab>Render</Tab>
        <Tab>Grid</Tab>
        <Tab>Variants</Tab>
        <Tab>Animations</Tab>
      </TabList>
      <TabPanel className={cx('panel')}>
        <RenderForm />
      </TabPanel>
      <TabPanel className={cx('panel')}>
        <PresetForm />
      </TabPanel>
      <TabPanel className={cx('panel')}>
        <VariantsForm />
      </TabPanel>
      <TabPanel className={cx('panel')}>
        <AnimationForm />
      </TabPanel>
    </TabsProvider>
  );
};

export default Settings;
