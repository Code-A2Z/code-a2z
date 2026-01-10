import { Box, useTheme } from '@mui/material';
import { Routes } from 'react-router-dom';
import Searchbar from '../../../shared/components/molecules/searchbar';
import { SETTINGS_SIDEBAR_WIDTH } from './constants';
import useSettingsV1 from './hooks';
import NoResultsFound from './components/no-results-found';
import SettingsTab from './components/settings-tab';
import SettingsHeader from './components/settings-header';
import { useDevice } from '../../../shared/hooks/use-device';

const Settings = () => {
  const theme = useTheme();
  const { isMobileOrTablet } = useDevice();
  const {
    searchTerm,
    setSearchTerm,
    handleClearSearch,
    filteredSettings,
    routes,
    activeSetting,
  } = useSettingsV1();

  // On mobile, show sidebar only when not on a detail page
  const showSidebarOnMobile = !isMobileOrTablet || !activeSetting;

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
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderColor: 'divider',
            p: 0.8,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <Searchbar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            handleOnClearClick={handleClearSearch}
            variant="fullWidth"
            autoFocus={false}
          />
        </Box>

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
          {filteredSettings.length === 0 ? (
            <NoResultsFound
              searchTerm={searchTerm}
              handleOnClearClick={handleClearSearch}
            />
          ) : (
            filteredSettings.map((setting, index) => (
              <SettingsTab
                key={index}
                setting={setting}
                index={index}
                filteredSettings={filteredSettings}
              />
            ))
          )}
        </Box>
      </Box>

      <Box
        sx={{
          height: '100%',
          width: {
            xs: activeSetting ? '100%' : 0,
            md: `calc(100% - ${SETTINGS_SIDEBAR_WIDTH}px)`,
          },
          minWidth: {
            xs: activeSetting ? '100%' : 0,
            md: `calc(100% - ${SETTINGS_SIDEBAR_WIDTH}px)`,
          },
          maxWidth: {
            xs: activeSetting ? '100%' : 0,
            md: `calc(100% - ${SETTINGS_SIDEBAR_WIDTH}px)`,
          },
          display: {
            xs: activeSetting ? 'flex' : 'none',
            md: 'flex',
          },
          flexDirection: 'column',
          borderLeft: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
          borderColor: 'divider',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        {activeSetting && <SettingsHeader title={activeSetting.name} />}
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

export default Settings;
