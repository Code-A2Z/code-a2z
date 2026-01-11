import { Box, IconButton, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import A2ZTypography from '../../../../../../shared/components/atoms/typography';
import { HEADER_HEIGHT } from '../../../../../../shared/components/organisms/header/constants';
import { useDevice } from '../../../../../../shared/hooks/use-device';
import { useCustomNavigate } from '../../../../../../shared/hooks/use-custom-navigate';
import {
  ROUTES_SETTINGS_V1,
  ROUTES_V1,
} from '../../../../../app/routes/constants/routes';

interface IntegrationsHeaderProps {
  title: string;
}

const IntegrationsHeader = ({ title }: IntegrationsHeaderProps) => {
  const theme = useTheme();
  const { isMobileOrTablet } = useDevice();
  const navigate = useCustomNavigate();

  const handleBackClick = () => {
    navigate({
      pathname: `${ROUTES_V1.SETTINGS}${ROUTES_SETTINGS_V1.INTEGRATIONS}`,
    });
  };

  return (
    <Box
      sx={{
        height: `${HEADER_HEIGHT}px`,
        minHeight: `${HEADER_HEIGHT}px`,
        maxHeight: `${HEADER_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 3 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        gap: 2,
      }}
    >
      {isMobileOrTablet && (
        <IconButton
          onClick={handleBackClick}
          sx={{
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
          aria-label="Go back to integrations"
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <A2ZTypography
        text={title}
        variant="h6"
        props={{
          sx: {
            fontWeight: 600,
            color: 'text.primary',
            flex: 1,
          },
        }}
      />
    </Box>
  );
};

export default IntegrationsHeader;
