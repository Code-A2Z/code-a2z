import {
  Typography,
  CircularProgress,
  CircularProgressProps,
  TypographyProps,
  Box,
  BoxProps,
} from '@mui/material';
import { FC, ReactNode } from 'react';

interface LoaderProps {
  secondary?: ReactNode;
  primary?: ReactNode;
  size?: string | number;
  containerProps?: BoxProps;
  loaderProps?: CircularProgressProps;
  textProps?: TypographyProps;
}

const Loader: FC<LoaderProps> = ({
  size,
  loaderProps,
  textProps,
  containerProps,
  primary,
  secondary,
}) => {
  return (
    <Box
      {...containerProps}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...containerProps?.sx,
      }}
    >
      {primary ? primary : <CircularProgress size={size} {...loaderProps} />}

      {typeof secondary === 'string' ? (
        <Typography
          sx={{
            marginTop: '12px',
            fontSize: '16px',
            fontWeight: '400px',
          }}
          {...textProps}
        >
          {secondary}
        </Typography>
      ) : (
        secondary
      )}
    </Box>
  );
};

export default Loader;
