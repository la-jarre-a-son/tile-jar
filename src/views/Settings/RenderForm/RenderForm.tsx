import React, { useCallback } from 'react';

import { bindClassNames, FormFieldset, Input, FormControlLabel, Typography, Switch } from '@la-jarre-a-son/ui';

import styles from './RenderForm.module.scss';
import { usePreset, type Preset } from '../../../contexts/PresetContext';
import { LabelWithTooltip } from '../../../components';

const cx = bindClassNames(styles);

export const RenderForm: React.FC = () => {
  const { preset, updatePreset } = usePreset();

  const updatePresetRender = useCallback((render: Partial<Preset['render']>) => updatePreset({ render }), [updatePreset]);

  return (
    <div className={cx('base')}>
      <FormFieldset label="Output">
        <FormControlLabel label="Width" hint="Width of the output render image" reverse>
          <Input
            type="number"
            onChange={(value) => updatePresetRender({ width: Number(value) })}
            value={preset.render.width ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                px
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
        <FormControlLabel label="Height" hint="Height of the output render image" reverse>
          <Input
            type="number"
            onChange={(value) => updatePresetRender({ height: Number(value) })}
            value={preset.render.height ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                px
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
      </FormFieldset>

      <FormFieldset label="Animation">
        <FormControlLabel
          label="Framerate"
          hint="Does not affect the realtime preview, only the exported animation render"
          reverse
        >
          <Input
            type="number"
            onChange={(value) => updatePresetRender({ frameRate: Number(value) })}
            value={preset.render.frameRate ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                fps
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
        <FormControlLabel
          label={<LabelWithTooltip label="Duration" icon="fi-rr-square-v" content="var(--animation-duration)" />}
          hint="Global animation duration for exported animation length"
          reverse
        >
          <Input
            type="number"
            onChange={(value) => updatePresetRender({ duration: Number(value) })}
            value={preset.render.duration ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                s
              </Typography>
            }
            style={{ width: '79px' }}
          />
        </FormControlLabel>
        <FormControlLabel label="Loop" hint="Animation will play infinitely" reverse>
          <Switch checked={preset.render.loop} onChange={(value) => updatePresetRender({ loop: value })} />
        </FormControlLabel>
      </FormFieldset>
      <FormFieldset label="Random">
        <FormControlLabel label="Seed" hint="Use a specific seed for RNG" reverse>
          <Input
            type="number"
            onChange={(value) => updatePresetRender({ seed: Number(value) })}
            value={preset.render.seed ?? null}
            style={{ width: '128px' }}
            placeholder="random seed"
          />
        </FormControlLabel>
        <Typography size="sm">
          If no seed is provided, random numbers will change at every render. You can use random number generation in animations
          or variants by using the following CSS variables:
          <ul>
            <li>var(--grid-random-x)</li>
            <li>var(--grid-random-y)</li>
            <li>var(--tile-random-x)</li>
            <li>var(--tile-random-y)</li>
          </ul>
        </Typography>
      </FormFieldset>
    </div>
  );
};

export default RenderForm;
