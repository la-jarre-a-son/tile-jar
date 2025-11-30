import { Badge, Icon, Input, Stack, type InputProps } from '@la-jarre-a-son/ui';
import React, { useState } from 'react';

export type ListInputProps = {
  value: string[];
  onChange: (value: string[], event: React.MouseEvent | React.KeyboardEvent) => void;
} & Omit<InputProps, 'onChange' | 'value'>;

export const ListInput: React.FC<ListInputProps> = ({ value, size, onChange, containerProps, ...rest }) => {
  const [text, setText] = useState<string>('');

  const handleChange = (v: string) => {
    setText(v);
  };

  const handleRemove = (index: number, event: React.MouseEvent | React.KeyboardEvent) => {
    const newValue = value.filter((_v, i) => i !== index);

    onChange(newValue, event);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Enter' || event.key === ',' || event.key === ';') {
      event.preventDefault();
      setText((v) => {
        const trimmed = v.trim();
        if (trimmed) {
          onChange([...value, trimmed], event);
          return '';
        }
        return v;
      });
    }

    if (event.code === 'Backspace') {
      if (!text) {
        handleRemove(value.length - 1, event);
      }
    }
  };

  return (
    <Input
      left={
        <Stack gap="sm" wrap style={{ maxWidth: '100%' }} tabIndex={-1}>
          {value.map((v, index) => (
            <Badge
              as="button"
              role="listitem"
              onClick={(e) => handleRemove(index, e)}
              key={index}
              size={size}
              right={<Icon name="fi fi-rr-cross" size="auto" aria-label="Remove" />}
            >
              {v}
            </Badge>
          ))}
        </Stack>
      }
      containerProps={{
        ...containerProps,
        style: { ...containerProps?.style, flexWrap: 'wrap' },
      }}
      size={size}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
};

export default ListInput;
