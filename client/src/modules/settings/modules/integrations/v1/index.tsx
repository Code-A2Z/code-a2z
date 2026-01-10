import { Box, ButtonBase, useTheme } from '@mui/material';
import { Routes } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import { SETTINGS_SIDEBAR_WIDTH } from '../../../v1/constants';
import useIntegrationsSettings from './hooks';
import A2ZTypography from '../../../../../shared/components/atoms/typography';
import { useCustomNavigate } from '../../../../../shared/hooks/use-custom-navigate';
import { useDevice } from '../../../../../shared/hooks/use-device';
import {
  ROUTES_SETTINGS_V1,
  ROUTES_V1,
} from '../../../../app/routes/constants/routes';
import IntegrationsHeader from './components/integrations-header';
import { IntegrationSettingType } from '../../../v1/typings';

const Integrations = () => {
  const theme = useTheme();
  const { isMobileOrTablet } = useDevice();
  const navigate = useCustomNavigate();
  const { integrations, routes, integrationId, activeIntegration } =
    useIntegrationsSettings();

  // On mobile, show sidebar only when not on a detail page
  const showSidebarOnMobile = !isMobileOrTablet || !activeIntegration;

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: {
            xs: showSidebarOnMobile ? '100%' : 0,
            md: SETTINGS_SIDEBAR_WIDTH,
          },
          minWidth: {
            xs: showSidebarOnMobile ? '100%' : 0,
            md: SETTINGS_SIDEBAR_WIDTH,
          },
          maxWidth: {
            xs: showSidebarOnMobile ? '100%' : 0,
            md: SETTINGS_SIDEBAR_WIDTH,
          },
          display: {
            xs: showSidebarOnMobile ? 'flex' : 'none',
            md: 'flex',
          },
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            overflow: 'hidden',
            '&:hover': {
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'divider',
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: 'action.disabled',
                },
              },
            },
          }}
        >
          {integrations.map(
            (integration: IntegrationSettingType, index: number) => {
              const {
                id,
                integrationSlug,
                name,
                icon,
                description,
                locked = false,
              } = integration;
              const absolutePath = `${ROUTES_V1.SETTINGS}${ROUTES_SETTINGS_V1.INTEGRATIONS}/${integrationSlug}`;
              const isTabActive = integrationId === id;

              return (
                <ButtonBase<'div'>
                  key={id || index}
                  component="div"
                  sx={{
                    width: '100%',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    rowGap: 0.25,
                    borderBottom:
                      index < integrations.length - 1
                        ? `1px solid ${theme.palette.divider}`
                        : 'none',
                    bgcolor: isTabActive
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(240, 245, 240, 1)'
                      : 'transparent',
                    boxShadow: 'none',
                    outline: 'none',
                    transition: 'background-color 200ms ease-in-out',
                    '&:hover': {
                      bgcolor: isTabActive
                        ? theme.palette.mode === 'dark'
                          ? 'rgba(59, 130, 246, 0.15)'
                          : 'rgba(240, 245, 240, 0.68)'
                        : 'action.hover',
                      boxShadow: 'none',
                      outline: 'none',
                    },
                  }}
                  disabled={locked}
                  onClick={() => {
                    if (locked) {
                      return;
                    }
                    navigate({ pathname: absolutePath });
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      columnGap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        columnGap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isTabActive
                            ? 'primary.main'
                            : 'text.secondary',
                        }}
                      >
                        {icon}
                        {locked && (
                          <LockIcon
                            sx={{
                              ml: 'auto',
                              height: 15,
                              width: 15,
                              bgcolor: 'background.default',
                              p: 0.25,
                              borderRadius: '50%',
                              border: `1px solid ${theme.palette.divider}`,
                              position: 'absolute',
                              right: -4,
                              top: -6,
                              fontSize: 15,
                              color: 'text.secondary',
                            }}
                          />
                        )}
                      </Box>
                      <A2ZTypography
                        text={name}
                        variant="body1"
                        props={{
                          sx: {
                            fontSize: 16,
                            fontWeight: 600,
                            color: isTabActive
                              ? 'primary.main'
                              : 'text.primary',
                          },
                          'data-testid': `integration-${name}`,
                        }}
                      />
                    </Box>
                  </Box>
                  {description && (
                    <A2ZTypography
                      text={description}
                      variant="body2"
                      props={{
                        sx: {
                          fontSize: 14,
                          fontWeight: 400,
                          color: 'text.secondary',
                          pl: 'calc(20px + 12px)',
                        },
                      }}
                    />
                  )}
                </ButtonBase>
              );
            }
          )}
        </Box>
      </Box>

      <Box
        sx={{
          height: '100%',
          width: {
            xs: activeIntegration ? '100%' : 0,
            md: `calc(100% - ${SETTINGS_SIDEBAR_WIDTH}px)`,
          },
          minWidth: {
            xs: activeIntegration ? '100%' : 0,
            md: `calc(100% - ${SETTINGS_SIDEBAR_WIDTH}px)`,
          },
          maxWidth: {
            xs: activeIntegration ? '100%' : 0,
            md: `calc(100% - ${SETTINGS_SIDEBAR_WIDTH}px)`,
          },
          display: {
            xs: activeIntegration ? 'flex' : 'none',
            md: 'flex',
          },
          flexDirection: 'column',
          borderLeft: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
          borderColor: 'divider',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        {activeIntegration && (
          <IntegrationsHeader title={activeIntegration.name} />
        )}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          <Routes>{routes}</Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default Integrations;
