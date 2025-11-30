import React, { useState } from 'react';

import {
  bindClassNames,
  Box,
  Button,
  StateButton,
  FormField,
  Icon,
  Input,
  Menu,
  MenuItem,
  Modal,
  ModalActions,
  ModalActionsSeparator,
  ModalContent,
  ModalHeader,
  Progress,
} from '@la-jarre-a-son/ui';

import styles from './PresetActions.module.scss';
import { useRendering } from '../../contexts/RenderingContext';
import { usePreset } from '../../contexts/PresetContext';
import { useConfirm } from '../../hooks';

const cx = bindClassNames(styles);

export const PresetActions: React.FC = () => {
  const { currentFrame, totalFrames, saveVector, saveImage, saveAnimation, cancelExport, getDataUrl } = useRendering();
  const [confirm, renderConfirm] = useConfirm();
  const { currentPreset, unsaved, save, exportPreset, importPreset } = usePreset();

  const [presetName, setPresetName] = useState<string>(currentPreset);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const openSaveModal = () => {
    setPresetName(currentPreset);
    setIsSaving(true);
  };

  const exportAnimation = () => {
    setIsExporting(true);
    saveAnimation().then(
      () => setIsExporting(false),
      () => setIsExporting(false)
    );
  };

  const handleImportPreset = async () => {
    await confirm({
      message: 'Importing preset will override current preset, so you will have to save it with a new name.',
      confirmLabel: 'Import',
      confirmIntent: 'warning',
    });

    await importPreset();
  };

  const savePreset = async () => {
    const dataUrl = await getDataUrl(256, 256);

    if (!presetName) throw new Error('Cannot be empty');

    save(presetName, dataUrl);
    setIsSaving(false);
  };

  return (
    <Box className={cx('base')} elevation={3}>
      <Button intent="success" onClick={openSaveModal} left={<Icon name="fi fi-rr-disk" />} disabled={!unsaved}>
        Save Preset
      </Button>

      <StateButton intent="neutral" onClick={handleImportPreset} left={<Icon name="fi fi-rr-upload" />}>
        Import Preset
      </StateButton>

      <Menu
        trigger={
          <Button intent="neutral" left={<Icon name="fi fi-rr-download" />}>
            Export
          </Button>
        }
      >
        <MenuItem onClick={() => exportPreset()} left={<Icon name="fi fi-rr-settings-sliders" />}>
          Export Preset
        </MenuItem>
        <MenuItem onClick={() => saveVector(currentPreset + '.svg')} left={<Icon name="fi fi-rr-vector-alt" />}>
          Export SVG
        </MenuItem>
        <MenuItem onClick={() => saveImage(undefined, currentPreset + '.png')} left={<Icon name="fi fi-rr-picture" />}>
          Export PNG
        </MenuItem>
        <MenuItem onClick={() => exportAnimation()} left={<Icon name="fi fi-rr-film" />}>
          Export Animation
        </MenuItem>
      </Menu>

      <Modal open={isSaving} onClose={() => setIsSaving(false)}>
        <ModalHeader title="Save Preset" />
        <ModalContent>
          <FormField label="Preset Name">
            <Input value={presetName} onChange={setPresetName} autoFocus />
          </FormField>
        </ModalContent>
        <ModalActions>
          <ModalActionsSeparator />
          <StateButton intent="success" onClick={savePreset}>
            Save
          </StateButton>
        </ModalActions>
      </Modal>
      <Modal open={isExporting} onClose={cancelExport}>
        <ModalHeader title="Export Animation" />
        <ModalContent>
          Export in progress
          <Progress value={currentFrame} min={1} max={totalFrames} valueText={currentFrame + ' / ' + totalFrames} />
        </ModalContent>
        <ModalActions>
          <ModalActionsSeparator />
          <Button intent="danger" onClick={cancelExport} variant="ghost">
            Cancel
          </Button>
        </ModalActions>
      </Modal>
      {renderConfirm()}
    </Box>
  );
};

export default PresetActions;
