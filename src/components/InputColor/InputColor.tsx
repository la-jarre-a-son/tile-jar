import React, { useCallback } from 'react';

import { Input, type InputProps, bindClassNames } from '@la-jarre-a-son/ui';

export type InputColorProps = Omit<InputProps, 'onChange' | 'value'> & {
  className?: string;
  value: string | null;
  onChange: (value: string) => unknown;
  allowNonHexColor?: boolean;
  block?: boolean;
};

import styles from './InputColor.module.scss';

const COLOR_CHARS = '0 1 2 3 4 5 6 7 8 9 a b c d e f'.split(' ');

const cx = bindClassNames(styles);

const isHexColor = (value: string) => !!value.match(/#[0-9a-f]{3,6}/);

export const InputColor: React.FC<InputColorProps> = ({ className, value, onChange, allowNonHexColor, ...rest }) => {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (allowNonHexColor) return;

      if (!value && event.key === '#') return;
      if (event.key === 'Backspace') return;

      if (value && value.startsWith('#') && value.length < 7 && COLOR_CHARS.includes(event.key.toLowerCase())) return;
      event.preventDefault();
    },
    [value, allowNonHexColor]
  );

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value: newValue } = event.target;

      onChange(newValue.toLowerCase());
    },
    [onChange]
  );

  const handleTextChange = useCallback(
    (newValue: string) => {
      onChange(newValue.toLowerCase());
    },
    [onChange]
  );

  return (
    <Input
      className={cx('base', className)}
      value={value ?? ''}
      onKeyDown={handleKeyDown}
      onChange={handleTextChange}
      left={
        <input
          className={cx('color')}
          type="color"
          onChange={handleColorChange}
          value={isHexColor(value ?? '') ? (value as string) : '#000000'}
        />
      }
      type="text"
      {...rest}
    />
  );
};

export default InputColor;
