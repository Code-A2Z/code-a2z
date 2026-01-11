import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { settingsRoutes } from '../../routes';
import { ROUTES_V1 } from '../../../app/routes/constants/routes';
import { useDevice } from '../../../../shared/hooks/use-device';

const useSettingsV1 = () => {
  const location = useLocation();
  const { isMobileOrTablet } = useDevice();
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const { settings, routes } = settingsRoutes({ isMobileOrTablet });
  const filteredSettings = useMemo(() => {
    if (!searchTerm) return settings;
    return settings.filter(setting =>
      setting.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [settings, searchTerm]);

  const activeSetting = useMemo(() => {
    const currentPath = location.pathname;
    const settingsBasePath = ROUTES_V1.SETTINGS;

    const normalizedCurrent = currentPath.replace(/\/$/, '');
    const normalizedBase = settingsBasePath.replace(/\/$/, '');

    if (normalizedCurrent === normalizedBase) {
      return undefined;
    }

    return settings.find(setting => {
      const settingPath = setting.path.startsWith('/')
        ? setting.path
        : `/${setting.path}`;
      const absolutePath = `${normalizedBase}${settingPath}`;
      const normalizedAbsolute = absolutePath.replace(/\/$/, '');

      return (
        normalizedCurrent === normalizedAbsolute ||
        normalizedCurrent.startsWith(`${normalizedAbsolute}/`)
      );
    });
  }, [location.pathname, settings]);

  const isSettingsDetailPage = useMemo(() => {
    return activeSetting !== undefined;
  }, [activeSetting]);

  return {
    searchTerm,
    setSearchTerm,
    handleClearSearch,
    settings,
    routes,
    filteredSettings,
    activeSetting,
    isSettingsDetailPage,
  };
};

export default useSettingsV1;
