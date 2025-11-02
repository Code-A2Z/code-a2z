import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface A2ZButtonProps extends ButtonProps {
  loading?: boolean;
  loadingPosition?: 'start' | 'end';
}

const A2ZButton = ({
  sx,
  variant = 'contained',
  size = 'large',
  loading = false,
  loadingPosition = 'start',
  children,
  disabled,
  ...props
}: A2ZButtonProps) => {
  const isDisabled = Boolean(disabled) || loading;

  const loader = (
    <CircularProgress
      size={18}
      color="inherit"
      thickness={5}
      style={{
        marginRight: loadingPosition === 'start' ? 8 : 0,
        marginLeft: loadingPosition === 'end' ? 8 : 0,
      }}
    />
  );

  return (
    <Button
      sx={{
        borderRadius: '4px',
        ...sx,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      variant={variant}
      size={size}
      color="inherit"
      disabled={isDisabled}
      {...props}
    >
      {loading && loadingPosition === 'start' ? loader : null}
      {children}
      {loading && loadingPosition === 'end' ? loader : null}
    </Button>
  );
};

export default A2ZButton;
