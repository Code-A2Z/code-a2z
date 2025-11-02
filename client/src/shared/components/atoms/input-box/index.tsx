import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface InputBoxProps extends Omit<TextFieldProps, 'onChange'> {
  id: string;
  name: string;
  type: 'text' | 'password' | 'email' | 'number';
  variant?: 'outlined' | 'filled' | 'standard';
  label?: string;
  icon?: React.ReactNode;
  disable?: boolean;
  slotProps?: TextFieldProps['slotProps'];
}

const InputBox = ({
  id,
  name,
  type,
  variant,
  label,
  placeholder,
  icon,
  autoComplete = 'on',
  disable = false,
  className,
  slotProps,
  ...props
}: InputBoxProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const mergedSlotProps = {
    ...slotProps,
    input: {
      ...slotProps?.input,
      startAdornment: icon ? (
        <InputAdornment position="start">{icon}</InputAdornment>
      ) : undefined,
      endAdornment: isPassword ? (
        <InputAdornment position="end">
          <IconButton onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      ) : undefined,
    },
  };

  return (
    <TextField
      id={id}
      name={name}
      label={label}
      type={isPassword && showPassword ? 'text' : type}
      placeholder={placeholder}
      disabled={disable}
      autoComplete={autoComplete}
      variant={variant ?? 'outlined'}
      className={className}
      slotProps={mergedSlotProps}
      {...props}
    />
  );
};

export default InputBox;
