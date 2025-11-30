import React, { useEffect, useState } from 'react';
import { InputContainer, useEvent, bindClassNames } from '@la-jarre-a-son/ui';

import styles from './InputTextarea.module.scss';

const cx = bindClassNames(styles);

export type InputTextareaProps = {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
} & Omit<React.ComponentProps<'textarea'>, 'value' | 'onChange' | 'onBlur'>;

export const InputTextarea: React.FC<InputTextareaProps> = ({ value: inputValue, onChange, onBlur, ...otherProps }) => {
  const [value, setValue] = useState<string>(inputValue);

  const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = useEvent((event) => {
    setValue(event.target.value);
    if (onBlur) onBlur(event.target.value);
  });

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = useEvent((event) => {
    setValue(event.target.value);
    if (onChange) onChange(value);
  });

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  return (
    <InputContainer className={cx('base')}>
      <textarea value={value} onBlur={handleBlur} onChange={handleChange} {...otherProps} />
    </InputContainer>
  );
};

export default InputTextarea;
