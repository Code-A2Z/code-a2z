import { Box, useTheme } from '@mui/material';
import { Routes } from 'react-router-dom';
import { SETTINGS_SIDEBAR_WIDTH } from '../../../v1/constants';
import useIntegrationsSettingsV1 from './hooks';
import { useDevice } from '../../../../../shared/hooks/use-device';
import {
  ROUTES_SETTINGS_V1,
  ROUTES_V1,
} from '../../../../app/routes/constants/routes';
import IntegrationsHeader from './components/integrations-header';
import { IntegrationSettingType } from '../../../v1/typings';
import SidebarItem from '../../../v1/components/sidebar-item';

const Integrations = () => {
  const theme = useTheme();
  const { isMobileOrTablet } = useDevice();
  const { integrations, routes, integrationId, activeIntegration } =
    useIntegrationsSettingsV1();

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
              const { id, integrationSlug, name, icon, description, locked } =
                integration;
              const absolutePath = `${ROUTES_V1.SETTINGS}${ROUTES_SETTINGS_V1.INTEGRATIONS}/${integrationSlug}`;
              const isTabActive = integrationId === id;
              const isLastItem = index === integrations.length - 1;

              return (
                <SidebarItem
                  key={id || index}
                  id={id}
                  name={name}
                  description={description}
                  icon={icon}
                  path={absolutePath}
                  locked={locked}
                  isActive={isTabActive}
                  isLastItem={isLastItem}
                  testId={`integration-${name}`}
                />
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
