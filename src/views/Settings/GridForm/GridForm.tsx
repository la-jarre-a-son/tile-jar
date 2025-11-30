import React, { useCallback } from 'react';

import {
  bindClassNames,
  FormFieldset,
  Input,
  FormControlLabel,
  FormField,
  Typography,
  InputGroup,
  Select,
  Tooltip,
  InputContainerLabel,
  Icon,
} from '@la-jarre-a-son/ui';

import styles from './GridForm.module.scss';
import { usePreset, type Preset } from '../../../contexts/PresetContext';
import { InputTextarea, LabelWithTooltip } from '../../../components';

const cx = bindClassNames(styles);

export const GridForm: React.FC = () => {
  const { preset, updatePreset } = usePreset();

  const updatePresetGrid = useCallback((grid: Partial<Preset['grid']>) => updatePreset({ grid }), [updatePreset]);

  const updatePresetTile = useCallback((tile: Partial<Preset['tile']>) => updatePreset({ tile }), [updatePreset]);

  return (
    <div className={cx('base')}>
      <FormFieldset label="dimensions">
        <FormControlLabel
          label={<LabelWithTooltip label="Width" icon="fi-rr-square-v" content="var(--view-width)" />}
          hint="Horizontal size of the SVG view"
          reverse
        >
          <Input
            type="number"
            onChange={(value) => updatePreset({ width: Number(value) })}
            value={preset.width ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                px
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
        <FormControlLabel
          label={<LabelWithTooltip label="Height" icon="fi-rr-square-v" content="var(--view-height)" />}
          hint="Vertical size of the SVG view."
          reverse
        >
          <Input
            type="number"
            onChange={(value) => updatePreset({ height: Number(value) })}
            value={preset.height ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                px
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
        <FormControlLabel label="Safe Area View" hint="Size of the Safe area around view where tiles are still drawn" reverse>
          <Input
            type="number"
            onChange={(value) => updatePreset({ safeAreaSize: Number(value) })}
            value={preset.safeAreaSize ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                px
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
      </FormFieldset>

      <FormFieldset label="grid">
        <FormField label="Origin" hint="Coordinates of the first tile in the grid">
          <InputGroup block>
            <Input
              type="number"
              onChange={(value) => updatePresetGrid({ originX: Number(value) })}
              value={preset.grid.originX ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  x
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Input
              type="number"
              onChange={(value) => updatePresetGrid({ originY: Number(value) })}
              value={preset.grid.originY ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  y
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />
          </InputGroup>
        </FormField>
        <FormField label="Counts" hint="The grid size with horizontal and vertical tile counts">
          <InputGroup block>
            <Input
              type="number"
              onChange={(value) => updatePresetGrid({ countX: Number(value) })}
              value={preset.grid.countX ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  x
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  cols
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Input
              type="number"
              onChange={(value) => updatePresetGrid({ countY: Number(value) })}
              value={preset.grid.countY ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  y
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  lines
                </Typography>
              }
              style={{ width: '48px' }}
            />
          </InputGroup>
        </FormField>
        <FormField label="Groups" hint="Distribute tiles into groups. Useful for animations">
          <InputGroup block>
            <Input
              type="number"
              onChange={(value) => updatePresetGrid({ columns: Number(value) })}
              value={preset.grid.columns ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  columns
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Tooltip content="var(--columns) & var(--tile-column)">
              <InputContainerLabel className={cx('input-hint')}>
                <Icon aria-label="info" name="fi-rr-square-v" />
              </InputContainerLabel>
            </Tooltip>
            <Input
              type="number"
              onChange={(value) => updatePresetGrid({ lines: Number(value) })}
              value={preset.grid.lines ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  lines
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Tooltip content="var(--lines) & var(--tile-line)">
              <InputContainerLabel className={cx('input-hint')}>
                <Icon aria-label="info" name="fi-rr-square-v" />
              </InputContainerLabel>
            </Tooltip>
          </InputGroup>
        </FormField>
        <FormField
          label="Draw order"
          hint="Choose the order tiles are drawn in view (default is down-right => ascending x and y coordinates)"
        >
          <Select
            options={[
              { value: 'up-right', label: 'up-right' },
              { value: 'up-left', label: 'up-left' },
              { value: 'down-right', label: 'down-right' },
              { value: 'down-left', label: 'down-left' },
            ]}
            onChange={(value) => updatePresetGrid({ order: value as Preset['grid']['order'] })}
            value={preset.grid.order}
          />
        </FormField>

        <FormField label="Transform" hint="Transformation applied to the whole grid">
          <InputTextarea
            value={preset.grid.transform || ''}
            onBlur={(value) => updatePresetGrid({ transform: value })}
            placeholder="CSS `transform` value..."
          />
        </FormField>
      </FormFieldset>

      <FormFieldset label="tile">
        <FormField label="Path" hint="Shape of a tile as a path `d` attribute. Multiple paths is not implemented yet">
          <InputTextarea
            value={preset.tile.path}
            onBlur={(value) => updatePresetTile({ path: value })}
            placeholder="SVG path attribute..."
          />
        </FormField>
        <FormControlLabel
          label={<LabelWithTooltip label="Width" icon="fi-rr-square-v" content="var(--tile-width)" />}
          hint="Horizontal size of a tile"
          reverse
        >
          <Input
            type="number"
            onChange={(value) => updatePresetTile({ width: Number(value) })}
            value={preset.tile.width ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                px
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
        <FormControlLabel
          label={<LabelWithTooltip label="Height" icon="fi-rr-square-v" content="var(--tile-height)" />}
          hint="Vertical size of a tile"
          reverse
        >
          <Input
            type="number"
            onChange={(value) => updatePresetTile({ height: Number(value) })}
            value={preset.tile.height ?? null}
            right={
              <Typography weight="regular" intent="subtle">
                px
              </Typography>
            }
            style={{ width: '64px' }}
          />
        </FormControlLabel>
        <FormField label="Transform Origin" hint="Origin for all transformations">
          <InputGroup block>
            <Input
              type="number"
              onChange={(value) => updatePresetTile({ transformOriginX: Number(value) })}
              value={preset.tile.transformOriginX ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  x
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Input
              type="number"
              onChange={(value) => updatePresetTile({ transformOriginY: Number(value) })}
              value={preset.tile.transformOriginY ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  y
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />
          </InputGroup>
        </FormField>
        <FormField label="Column Delta" hint="Translate coordinates of next tile in column">
          <InputGroup block>
            <Input
              type="number"
              onChange={(value) => updatePresetTile({ columnDeltaX: Number(value) })}
              value={preset.tile.columnDeltaX ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  x
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Tooltip content="var(--tile-columnDeltaX)">
              <InputContainerLabel className={cx('input-hint')}>
                <Icon aria-label="info" name="fi-rr-square-v" />
              </InputContainerLabel>
            </Tooltip>
            <Input
              type="number"
              onChange={(value) => updatePresetTile({ columnDeltaY: Number(value) })}
              value={preset.tile.columnDeltaY ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  y
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Tooltip content="var(--tile-columnDeltaY)">
              <InputContainerLabel className={cx('input-hint')}>
                <Icon aria-label="info" name="fi-rr-square-v" />
              </InputContainerLabel>
            </Tooltip>
          </InputGroup>
        </FormField>
        <FormField label="Line Delta" hint="Translate coordinates of next tile in line">
          <InputGroup block>
            <Input
              type="number"
              onChange={(value) => updatePresetTile({ lineDeltaX: Number(value) })}
              value={preset.tile.lineDeltaX ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  x
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />{' '}
            <Tooltip content="var(--tile-lineDeltaX)">
              <InputContainerLabel className={cx('input-hint')}>
                <Icon aria-label="info" name="fi-rr-square-v" />
              </InputContainerLabel>
            </Tooltip>
            <Input
              type="number"
              onChange={(value) => updatePresetTile({ lineDeltaY: Number(value) })}
              value={preset.tile.lineDeltaY ?? null}
              left={
                <Typography weight="regular" intent="subtle">
                  y
                </Typography>
              }
              right={
                <Typography weight="regular" intent="subtle">
                  px
                </Typography>
              }
              style={{ width: '48px' }}
            />
            <Tooltip content="var(--tile-lineDeltaY)">
              <InputContainerLabel className={cx('input-hint')}>
                <Icon aria-label="info" name="fi-rr-square-v" />
              </InputContainerLabel>
            </Tooltip>
          </InputGroup>
        </FormField>
      </FormFieldset>
    </div>
  );
};

export default GridForm;
