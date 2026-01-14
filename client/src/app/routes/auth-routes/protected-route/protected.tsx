import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useCustomNavigate } from '../../../../shared/hooks/use-custom-navigate';
import A2ZButton from '../../../../shared/components/atoms/button';
import { ROUTES_V1 } from '../../constants/routes';

interface ProtectedPlaceholderProps {
  onClick?: () => void;
  heading?: string;
  description?: string;
  buttonText?: string;
  showButton?: boolean;
}

const ProtectedPlaceholder: FC<ProtectedPlaceholderProps> = ({
  heading = 'Access Denied',
  description = 'You do not have access to this content.',
  onClick,
  buttonText = 'Go to Home',
  showButton = true,
}) => {
  const theme = useTheme();
  const navigate = useCustomNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: { xs: 3, sm: '36px 72px' },
          borderRadius: 2,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'background.paper'
              : theme.palette.grey[50],
          boxShadow: theme.shadows[2],
          maxWidth: { xs: '90%', sm: 'auto' },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            m: 0,
            fontWeight: 600,
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {heading}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{
            mt: 2,
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          {description}
        </Typography>

        {showButton && (
          <A2ZButton
            variant="contained"
            sx={{
              mt: 6,
              px: 3,
              py: 1.5,
              fontSize: 16,
              transition: 'all 0.2s ease-in-out',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                transform: 'scale(1.05)',
                bgcolor: 'primary.dark',
              },
            }}
            onClick={() => {
              if (onClick) {
                onClick();
              } else {
                navigate({ pathname: ROUTES_V1.HOME.replace('/*', '/') });
              }
            }}
          >
            {buttonText}
          </A2ZButton>
        )}
      </Box>
    </Box>
  );
};

export default ProtectedPlaceholder;
