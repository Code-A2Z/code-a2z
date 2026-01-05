import { useMemo, useState } from 'react';
import { getSettings } from './get-settings';

const useSettingsV1 = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const { settings, routes } = getSettings();
  const filteredSettings = useMemo(() => {
    if (!searchTerm) return settings;
    return settings.filter(setting =>
      setting.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [settings, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    handleClearSearch,
    settings,
    routes,
    filteredSettings,
  };
};

export default useSettingsV1;
