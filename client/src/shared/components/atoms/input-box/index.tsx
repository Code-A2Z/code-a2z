import { Dispatch, SetStateAction, useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.375rem',
    backgroundColor: theme.palette.mode === 'dark' ? '#09090b' : '#fafafa',
    paddingLeft: 0,
    '& .input-icon': {
      color: theme.palette.mode === 'dark' ? '#a3a3a3' : '#444444',
      fontSize: '1.125rem',
      lineHeight: 1,
    },
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    '& fieldset': {
      border: 'none',
    },
    '&.Mui-focused': {
      backgroundColor: 'transparent',
      borderColor: theme.palette.primary.main,
    },
    '& input::placeholder': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      opacity: 1,
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
    },
  },
  '& .MuiInputBase-input': {
    paddingLeft: '3rem',
  },
  '& .MuiInputAdornment-root': {
    marginLeft: 0,
  },
}));

interface InputBoxProps {
  name: string;
  type: string;
  id?: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  icon: string;
  autoComplete?: 'on' | 'off';
  disable?: boolean;
  className?: string;
}

const InputBox = ({
  name,
  type,
  id,
  value,
  setValue,
  placeholder,
  icon,
  autoComplete = 'on',
  disable = false,
  className,
}: InputBoxProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={`${className ?? ''} relative w-full mb-4`}>
      <StyledTextField
        name={name}
        id={id}
        type={
          type === 'password' ? (passwordVisible ? 'text' : 'password') : type
        }
        value={value}
        onChange={e => setValue?.(e.target.value)}
        placeholder={placeholder}
        disabled={disable}
        autoComplete={autoComplete}
        fullWidth
        variant="outlined"
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              <i className={`fi ${icon} input-icon`} />
            </InputAdornment>
          ) : undefined,
          endAdornment:
            type === 'password' ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  edge="end"
                  tabIndex={-1}
                >
                  {passwordVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
        }}
      />
    </div>
  );
};

export default InputBox;
