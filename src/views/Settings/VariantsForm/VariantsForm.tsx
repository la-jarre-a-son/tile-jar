import React, { Fragment, useCallback, useState } from 'react';

import {
  bindClassNames,
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
  FormFieldset,
} from '@la-jarre-a-son/ui';

import styles from './VariantsForm.module.scss';
import { usePreset } from '../../../contexts/PresetContext';
import { InputColor, InputTextarea, LabelWithTooltip } from '../../../components';

const cx = bindClassNames(styles);

export const VariantsForm: React.FC = () => {
  const { preset, updatePreset, addPresetVariant, updatePresetVariant } = usePreset();
  const [openVariant, setOpenVariant] = useState<number | null>(null);

  const handleOpenVariant = (id: number) => () => {
    setOpenVariant((p) => (p === id ? null : id));
  };

  const handleMoveUpVariant = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const variants = [...preset.variants];

      if (index < 1 || index >= variants.length) return;

      const variant = variants.splice(index, 1);
      variants.splice(index - 1, 0, ...variant);
      setOpenVariant((i) => {
        if (i === index) return i - 1;
        if (i === index - 1) return index;
        return i;
      });
      return updatePreset({ variants });
    },
    [preset.variants, updatePreset]
  );

  const handleMoveDownVariant = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const variants = [...preset.variants];

      if (index < 0 || index >= variants.length - 1) return;

      const variant = variants.splice(index, 1);
      variants.splice(index + 1, 0, ...variant);
      setOpenVariant((i) => {
        if (i === index) return i + 1;
        if (i === index + 1) return index;
        return i;
      });
      return updatePreset({ variants });
    },
    [preset.variants, updatePreset]
  );

  const handleRemoveVariant = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const variants = preset.variants.filter((_, i) => i !== index);
      setOpenVariant((i) => (i && i >= index ? i - 1 : i));
      return updatePreset({ variants });
    },
    [preset.variants, updatePreset]
  );

  return (
    <div className={cx('base')}>
      <FormFieldset
        label={<LabelWithTooltip label="Variants" icon="fi-rr-square-v" content="var(--variants) & var(--tile-variant)" />}
      >
        <Box as={List} elevation={3}>
          {preset.variants.map((variant, index) => (
            <Fragment key={index}>
              <ListItem
                as="a"
                href="#"
                interactive
                onClick={handleOpenVariant(index)}
                left={<Icon name={openVariant === index ? 'fi fi-rr-angle-up' : 'fi fi-rr-angle-down'} />}
                right={
                  <ButtonGroup>
                    <Button
                      onClick={(e) => handleMoveUpVariant(e, index)}
                      aria-label="move variant up"
                      intent="neutral"
                      hoverIntent
                      icon
                      disabled={index === 0}
                    >
                      <Icon name="fi fi-rr-arrow-up" />
                    </Button>
                    <Button
                      onClick={(e) => handleMoveDownVariant(e, index)}
                      aria-label="move variant down"
                      intent="neutral"
                      hoverIntent
                      icon
                      disabled={index === preset.variants.length - 1}
                    >
                      <Icon name="fi fi-rr-arrow-down" />
                    </Button>
                    <Button
                      onClick={(e) => handleRemoveVariant(e, index)}
                      aria-label="delete variant"
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
                  className={cx('variantPreview')}
                  style={{
                    borderColor: variant.stroke || 'transparent',
                    borderWidth: variant.strokeWidth,
                    background: variant.fill || 'transparent',
                    opacity: variant.opacity,
                  }}
                >
                  {variant.transform ? 'T' : null}
                </span>
                Variant #{index}
              </ListItem>
              <Collapse open={openVariant === index}>
                <Box elevation={2} pad="md">
                  <FormField label="Fill">
                    <InputColor
                      onChange={(value) => updatePresetVariant(index, { fill: value || null })}
                      value={variant.fill ?? ''}
                      placeholder="(none)"
                      allowNonHexColor
                    />
                  </FormField>
                  <FormField label="Stroke">
                    <InputColor
                      onChange={(value) => updatePresetVariant(index, { stroke: value || null })}
                      value={variant.stroke ?? ''}
                      placeholder="(none)"
                      allowNonHexColor
                    />
                  </FormField>
                  <FormControlLabel label="Stroke Width" reverse>
                    <Input
                      type="number"
                      onChange={(value) => updatePresetVariant(index, { strokeWidth: Number(value) })}
                      value={variant.strokeWidth ?? 0}
                      right={'px'}
                      style={{ width: '76px' }}
                    />
                  </FormControlLabel>

                  <FormControlLabel label="Opacity" reverse>
                    <Slider
                      value={variant.opacity}
                      onChange={(value: number | number[]) => updatePresetVariant(index, { opacity: Number(value) })}
                      min={0}
                      max={1}
                      step={0.01}
                      valueText={(variant.opacity * 100).toFixed(0) + '%'}
                    />
                  </FormControlLabel>

                  <FormField label="Transform">
                    <InputTextarea
                      value={variant.transform || ''}
                      onBlur={(value) => updatePresetVariant(index, { transform: value })}
                      placeholder="CSS `transform` value..."
                    />
                  </FormField>
                </Box>
              </Collapse>
            </Fragment>
          ))}
          <Button intent="success" hoverIntent block left={<Icon name="fi fi-rr-plus" />} onClick={() => addPresetVariant()}>
            Add Variant
          </Button>
        </Box>
      </FormFieldset>
      <FormField label="Variant Per Line Shift" hint="Apply variant modulo per line">
        <Slider
          value={preset.variantLineShift}
          onChange={(value: number | number[]) => updatePreset({ variantLineShift: Number(value) })}
          min={0}
          max={preset.variants.length - 1}
          step={1}
          marks={1}
          valueText={'% ' + preset.variantLineShift}
        />
      </FormField>
      <FormField label="Variant Per Column Shift" hint="Apply variant modulo per column">
        <Slider
          value={preset.variantColumnShift}
          onChange={(value: number | number[]) => updatePreset({ variantColumnShift: Number(value) })}
          min={0}
          max={preset.variants.length - 1}
          step={1}
          marks={1}
          valueText={'% ' + preset.variantColumnShift}
        />
      </FormField>
    </div>
  );
};

export default VariantsForm;
