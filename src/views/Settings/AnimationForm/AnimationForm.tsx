import React, { Fragment, useCallback, useState } from 'react';

import {
  bindClassNames,
  FormFieldset,
  Input,
  FormControlLabel,
  List,
  ListItem,
  Box,
  Button,
  Collapse,
  FormField,
  Icon,
  Slider,
  ButtonGroup,
  Checkbox,
  Stack,
  Switch,
  Select,
} from '@la-jarre-a-son/ui';

import styles from './AnimationForm.module.scss';
import { usePreset, type PresetGridAnimation, type PresetTileAnimation } from '../../../contexts/PresetContext';
import { InputColor, InputTextarea } from '../../../components';

const ANIMATION_COMPOSITION_OPTIONS = [
  { value: 'replace', label: 'replace' },
  { value: 'add', label: 'add' },
  { value: 'accumulate', label: 'accumulate' },
];

const cx = bindClassNames(styles);

export const AnimationForm: React.FC = () => {
  const {
    preset,
    updatePreset,
    addPresetTileAnimation,
    updatePresetTileAnimation,
    addPresetTileAnimationStep,
    updatePresetTileAnimationStep,
    addPresetGridAnimation,
    updatePresetGridAnimation,
    addPresetGridAnimationStep,
    updatePresetGridAnimationStep,
  } = usePreset();
  const [openTileAnimation, setOpenTileAnimation] = useState<number | null>(null);
  const [openGridAnimation, setOpenGridAnimation] = useState<number | null>(null);
  const [openTileAnimationStep, setOpenTileAnimationStep] = useState<number | null>(null);
  const [openGridAnimationStep, setOpenGridAnimationStep] = useState<number | null>(null);

  /* TILE ANIMATIONS */

  const handleOpenTileAnimation = (id: number) => () => {
    setOpenTileAnimation((p) => (p === id ? null : id));
    setOpenTileAnimationStep(null);
  };

  const handleOpenTileAnimationStep = (id: number) => () => {
    setOpenTileAnimationStep((p) => (p === id ? null : id));
  };

  const handleRemoveTileAnimation = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const tileAnimations = preset.tileAnimations.filter((_, i) => i !== index);
      setOpenTileAnimation((i) => (i && i >= index ? i - 1 : i));
      return updatePreset({ tileAnimations });
    },
    [preset.tileAnimations, updatePreset]
  );

  const handleRemoveTileAnimationStep = useCallback(
    (e: React.MouseEvent, animationIndex: number, stepIndex: number) => {
      e.stopPropagation();
      const animation = preset.tileAnimations[animationIndex];
      if (!animation) return;
      const steps = animation.steps.filter((_, i) => i !== stepIndex);
      setOpenTileAnimationStep((i) => (i && i >= stepIndex ? i - 1 : i));

      return updatePresetTileAnimation(animationIndex, { steps });
    },
    [preset.tileAnimations, updatePresetTileAnimation]
  );

  /* GRID ANIMATIONS */

  const handleOpenGridAnimation = (id: number) => () => {
    setOpenGridAnimation((p) => (p === id ? null : id));
    setOpenGridAnimationStep(null);
  };

  const handleOpenGridAnimationStep = (id: number) => () => {
    setOpenGridAnimationStep((p) => (p === id ? null : id));
  };

  const handleRemoveGridAnimation = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const gridAnimations = preset.gridAnimations.filter((_, i) => i !== index);
      setOpenGridAnimation((i) => (i && i >= index ? i - 1 : i));
      return updatePreset({ gridAnimations });
    },
    [preset.gridAnimations, updatePreset]
  );

  const handleRemoveGridAnimationStep = useCallback(
    (e: React.MouseEvent, animationIndex: number, stepIndex: number) => {
      e.stopPropagation();
      const animation = preset.gridAnimations[animationIndex];
      if (!animation) return;
      const steps = animation.steps.filter((_, i) => i !== stepIndex);
      setOpenGridAnimationStep((i) => (i && i >= stepIndex ? i - 1 : i));

      return updatePresetGridAnimation(animationIndex, { steps });
    },
    [preset.gridAnimations, updatePresetGridAnimation]
  );

  return (
    <div className={cx('base')}>
      <FormFieldset label="Tile Animations">
        <Box as={List} elevation={3}>
          {preset.tileAnimations.map((animation, animationIndex) => (
            <Fragment key={animationIndex}>
              <ListItem
                as="a"
                href="#"
                interactive
                className={cx('item', { '--disabled': !animation.enabled })}
                onClick={handleOpenTileAnimation(animationIndex)}
                left={<Icon name={openTileAnimation === animationIndex ? 'fi fi-rr-angle-up' : 'fi fi-rr-angle-down'} />}
                right={
                  <ButtonGroup>
                    <Button
                      onClick={(e) => handleRemoveTileAnimation(e, animationIndex)}
                      aria-label="delete animation"
                      intent="danger"
                      hoverIntent
                      icon
                    >
                      <Icon name="fi fi-rr-trash" />
                    </Button>
                  </ButtonGroup>
                }
              >
                {'tile-animation-' + animationIndex}
              </ListItem>
              <Collapse open={openTileAnimation === animationIndex}>
                <Box elevation={2} pad="md">
                  <FormControlLabel label="Enabled" reverse>
                    <Switch
                      checked={animation.enabled}
                      onChange={(value) => updatePresetTileAnimation(animationIndex, { enabled: value })}
                    />
                  </FormControlLabel>
                  <FormField label="Duration">
                    <Input
                      type="text"
                      onChange={(value) => updatePresetTileAnimation(animationIndex, { duration: value })}
                      value={animation.duration}
                    />
                  </FormField>
                  <FormField label="Easing">
                    <Input
                      type="text"
                      onChange={(value) => updatePresetTileAnimation(animationIndex, { easing: value })}
                      value={animation.easing}
                    />
                  </FormField>
                  <FormField label="Composition">
                    <Select
                      value={animation.composition}
                      onChange={(value) =>
                        updatePresetTileAnimation(animationIndex, { composition: value as PresetTileAnimation['composition'] })
                      }
                      options={ANIMATION_COMPOSITION_OPTIONS}
                    />
                  </FormField>
                  <FormField label="Delay per Tile">
                    <Input
                      type="text"
                      onChange={(value) => updatePresetTileAnimation(animationIndex, { delayPerTile: value })}
                      value={animation.delayPerTile}
                    />
                  </FormField>
                  <FormField label="Delay per Line">
                    <Input
                      type="text"
                      onChange={(value) => updatePresetTileAnimation(animationIndex, { delayPerLine: value })}
                      value={animation.delayPerLine}
                    />
                  </FormField>
                  <FormField label="Delay per Column">
                    <Input
                      type="text"
                      onChange={(value) => updatePresetTileAnimation(animationIndex, { delayPerColumn: value })}
                      value={animation.delayPerColumn}
                    />
                  </FormField>
                  <Box className={cx('steps')} as={List} elevation={3}>
                    {animation.steps.map((step, stepIndex) => (
                      <Fragment key={stepIndex}>
                        <ListItem
                          as="a"
                          href="#"
                          interactive
                          onClick={handleOpenTileAnimationStep(stepIndex)}
                          left={
                            <Icon name={openTileAnimationStep === stepIndex ? 'fi fi-rr-angle-up' : 'fi fi-rr-angle-down'} />
                          }
                          right={
                            <ButtonGroup>
                              <Button
                                onClick={(e) => handleRemoveTileAnimationStep(e, animationIndex, stepIndex)}
                                aria-label="delete step"
                                intent="danger"
                                hoverIntent
                                icon
                              >
                                <Icon name="fi fi-rr-trash" />
                              </Button>
                            </ButtonGroup>
                          }
                        >
                          <span
                            className={cx('stepPreview')}
                            style={{
                              borderColor: step.stroke || 'transparent',
                              borderWidth: step.strokeWidth || 'none',
                              background: step.fill || 'transparent',
                              opacity: step.opacity || 1,
                            }}
                          >
                            {step.transform ? 'T' : null}
                          </span>
                          Step {step.progress * 100 + '%'}
                        </ListItem>
                        <Collapse open={openTileAnimationStep === stepIndex}>
                          <Box elevation={2} pad="md">
                            <FormField label="Progress">
                              <Slider
                                value={step.progress}
                                onChange={(value: number | number[]) =>
                                  updatePresetTileAnimationStep(animationIndex, stepIndex, { progress: Number(value) })
                                }
                                min={0}
                                max={1}
                                step={0.01}
                                valueText={(step.progress * 100).toFixed(0) + '%'}
                              />
                            </FormField>
                            <FormField label="Fill">
                              <InputColor
                                onChange={(value) =>
                                  updatePresetTileAnimationStep(animationIndex, stepIndex, { fill: value || null })
                                }
                                value={step.fill ?? ''}
                                allowNonHexColor
                              />
                            </FormField>
                            <FormField label="Stroke">
                              <InputColor
                                onChange={(value) =>
                                  updatePresetTileAnimationStep(animationIndex, stepIndex, { stroke: value || null })
                                }
                                value={step.stroke ?? ''}
                                allowNonHexColor
                              />
                            </FormField>
                            <Stack align="center" block>
                              <label>
                                <Checkbox
                                  checked={step.strokeWidth !== null}
                                  onChange={(value) =>
                                    updatePresetTileAnimationStep(animationIndex, stepIndex, { strokeWidth: value ? 1 : null })
                                  }
                                />
                              </label>
                              <FormControlLabel className={cx('field')} label="Stroke Width" reverse>
                                <Input
                                  type="number"
                                  onChange={(value) =>
                                    updatePresetTileAnimationStep(animationIndex, stepIndex, { strokeWidth: Number(value) })
                                  }
                                  value={step.strokeWidth ?? 0}
                                  right={'px'}
                                  style={{ width: '76px' }}
                                  disabled={step.strokeWidth === null}
                                />
                              </FormControlLabel>
                            </Stack>

                            <Stack align="center">
                              <label>
                                <Checkbox
                                  checked={step.opacity !== null}
                                  onChange={(value) =>
                                    updatePresetTileAnimationStep(animationIndex, stepIndex, { opacity: value ? 1 : null })
                                  }
                                />
                              </label>
                              <FormControlLabel className={cx('field')} label="Opacity" reverse>
                                <Slider
                                  value={step.opacity === null ? 0 : step.opacity}
                                  onChange={(value: number | number[]) =>
                                    updatePresetTileAnimationStep(animationIndex, stepIndex, { opacity: Number(value) })
                                  }
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  valueText={step.opacity === null ? '??' : (step.opacity * 100).toFixed(0) + '%'}
                                  disabled={step.opacity === null}
                                />
                              </FormControlLabel>
                            </Stack>
                            <FormField label="Transform">
                              <InputTextarea
                                value={step.transform || ''}
                                onBlur={(value) =>
                                  updatePresetTileAnimationStep(animationIndex, stepIndex, { transform: value })
                                }
                                placeholder="CSS `transform` value..."
                              />
                            </FormField>
                          </Box>
                        </Collapse>
                      </Fragment>
                    ))}
                    <Button
                      intent="success"
                      hoverIntent
                      block
                      left={<Icon name="fi fi-rr-plus" />}
                      onClick={() => addPresetTileAnimationStep(animationIndex)}
                    >
                      Add Step
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Fragment>
          ))}
          <Button
            intent="success"
            hoverIntent
            block
            left={<Icon name="fi fi-rr-plus" />}
            onClick={() => addPresetTileAnimation()}
          >
            Add Tile Animation
          </Button>
        </Box>
      </FormFieldset>

      <FormFieldset label="Grid Animations">
        <Box as={List} elevation={3}>
          {preset.gridAnimations.map((animation, animationIndex) => (
            <Fragment key={animationIndex}>
              <ListItem
                as="a"
                href="#"
                interactive
                className={cx('item', { '--disabled': !animation.enabled })}
                onClick={handleOpenGridAnimation(animationIndex)}
                left={<Icon name={openGridAnimation === animationIndex ? 'fi fi-rr-angle-up' : 'fi fi-rr-angle-down'} />}
                right={
                  <ButtonGroup>
                    <Button
                      onClick={(e) => handleRemoveGridAnimation(e, animationIndex)}
                      aria-label="delete animation"
                      intent="danger"
                      hoverIntent
                      icon
                    >
                      <Icon name="fi fi-rr-trash" />
                    </Button>
                  </ButtonGroup>
                }
              >
                {'grid-animation-' + animationIndex}
              </ListItem>
              <Collapse open={openGridAnimation === animationIndex}>
                <Box elevation={2} pad="md">
                  <FormControlLabel label="Enabled" reverse>
                    <Switch
                      checked={animation.enabled}
                      onChange={(value) => updatePresetGridAnimation(animationIndex, { enabled: value })}
                    />
                  </FormControlLabel>
                  <FormField label="Duration">
                    <Input
                      type="text"
                      onChange={(value) => updatePresetGridAnimation(animationIndex, { duration: value })}
                      value={animation.duration}
                    />
                  </FormField>
                  <FormField label="Easing">
                    <Input
                      type="text"
                      onChange={(value) => updatePresetGridAnimation(animationIndex, { easing: value })}
                      value={animation.easing}
                    />
                  </FormField>
                  <FormField label="Composition">
                    <Select
                      value={animation.composition}
                      onChange={(value) =>
                        updatePresetGridAnimation(animationIndex, { composition: value as PresetGridAnimation['composition'] })
                      }
                      options={ANIMATION_COMPOSITION_OPTIONS}
                    />
                  </FormField>
                  <Box className={cx('steps')} as={List} elevation={3}>
                    {animation.steps.map((step, stepIndex) => (
                      <Fragment key={stepIndex}>
                        <ListItem
                          as="a"
                          href="#"
                          interactive
                          onClick={handleOpenGridAnimationStep(stepIndex)}
                          left={
                            <Icon name={openGridAnimationStep === stepIndex ? 'fi fi-rr-angle-up' : 'fi fi-rr-angle-down'} />
                          }
                          right={
                            <ButtonGroup>
                              <Button
                                onClick={(e) => handleRemoveGridAnimationStep(e, animationIndex, stepIndex)}
                                aria-label="delete step"
                                intent="danger"
                                hoverIntent
                                icon
                              >
                                <Icon name="fi fi-rr-trash" />
                              </Button>
                            </ButtonGroup>
                          }
                        >
                          Step {step.progress * 100 + '%'}
                        </ListItem>
                        <Collapse open={openGridAnimationStep === stepIndex}>
                          <Box elevation={2} pad="md">
                            <FormField label="Progress">
                              <Slider
                                value={step.progress}
                                onChange={(value: number | number[]) =>
                                  updatePresetGridAnimationStep(animationIndex, stepIndex, { progress: Number(value) })
                                }
                                min={0}
                                max={1}
                                step={0.01}
                                valueText={(step.progress * 100).toFixed(0) + '%'}
                              />
                            </FormField>
                            <FormField label="Transform">
                              <InputTextarea
                                value={step.transform || ''}
                                onBlur={(value) =>
                                  updatePresetGridAnimationStep(animationIndex, stepIndex, { transform: value })
                                }
                                placeholder="CSS `transform` value..."
                              />
                            </FormField>
                          </Box>
                        </Collapse>
                      </Fragment>
                    ))}
                    <Button
                      intent="success"
                      hoverIntent
                      block
                      left={<Icon name="fi fi-rr-plus" />}
                      onClick={() => addPresetGridAnimationStep(animationIndex)}
                    >
                      Add Step
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Fragment>
          ))}
          <Button
            intent="success"
            hoverIntent
            block
            left={<Icon name="fi fi-rr-plus" />}
            onClick={() => addPresetGridAnimation()}
          >
            Add Grid Animation
          </Button>
        </Box>
      </FormFieldset>
    </div>
  );
};

export default AnimationForm;
