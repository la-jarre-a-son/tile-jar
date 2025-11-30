import React from 'react';

import { bindClassNames, Box, Button, Card, CardHeader, CardThumbnail, Grid, Icon } from '@la-jarre-a-son/ui';

import styles from './PresetList.module.scss';
import { usePresetList } from '../../contexts/PresetListContext';
import { usePreset } from '../../contexts/PresetContext';
import { useConfirm } from '../../hooks';

const cx = bindClassNames(styles);

export const PresetList: React.FC = () => {
  const { presets, currentPreset, setCurrentPreset, removePreset } = usePresetList();
  const [confirm, renderConfirm] = useConfirm();
  const { unsaved } = usePreset();

  const handleSelect = async (presetName: string) => {
    if (unsaved) {
      try {
        await confirm({
          message: 'You have unsaved changes to the current preset.\nDo you want to discard changes ?',
          confirmLabel: 'Discard Changes',
          confirmIntent: 'danger',
        });
        setCurrentPreset(presetName);
      } catch (_e) {
        return;
      }
    } else {
      setCurrentPreset(presetName);
    }
  };

  const handleRemove = (presetName: string) => {
    removePreset(presetName);
  };

  return (
    <>
      <Box className={cx('base')} pad="md" elevation={2}>
        <Grid size="sm" gap="md">
          {presets.map((item) => (
            <Card
              key={item.name}
              className={cx('item')}
              interactive
              selected={item.name === currentPreset}
              onClick={() => handleSelect(item.name)}
            >
              <CardThumbnail alt="img" src={item.preview} />
              <CardHeader
                right={
                  <Button
                    intent="danger"
                    variant="ghost"
                    aria-label="remove"
                    onClick={() => handleRemove(item.name)}
                    hoverIntent
                    icon
                  >
                    <Icon name="fi fi-rr-trash" />
                  </Button>
                }
              >
                {item.name}
              </CardHeader>
            </Card>
          ))}
        </Grid>
      </Box>
      {renderConfirm()}
    </>
  );
};

export default PresetList;
