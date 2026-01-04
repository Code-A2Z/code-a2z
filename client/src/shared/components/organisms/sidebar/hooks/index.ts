import { useCallback, useState, useMemo } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import { SideBarItemsType } from '../typings';
import {
  ROUTES_PAGE_V1,
  ROUTES_V1,
} from '../../../../../modules/app/routes/constants/routes';

const logoutStyle = {
  marginTop: 'auto',
  marginBottom: 0,
};

const useSidebar = () => {
  const [showExpandedView, setShowExpandedView] = useState(false);

  const handleMouseHoverIn = useCallback(() => {
    setShowExpandedView(true);
  }, []);

  const handleMouseHoverOut = useCallback(() => {
    setShowExpandedView(false);
  }, []);

  const sidebarItems = useMemo(() => {
    const items: SideBarItemsType[] = [
      {
        icon: HomeIcon,
        path: ROUTES_V1.HOME,
        title: 'Home',
        screenName: ROUTES_PAGE_V1.HOME,
      },
      {
        icon: SettingsIcon,
        path: ROUTES_V1.SETTINGS,
        title: 'Settings',
        screenName: ROUTES_PAGE_V1.SETTINGS,
      },
    ];
    const secondaryItems: SideBarItemsType[] = [
      {
        icon: PowerSettingsNewIcon,
        // onClick: onLogout,
        title: 'Logout',
        style: logoutStyle,
      },
    ];
    return {
      items: items.filter(({ disable }) => !disable),
      secondaryItems: secondaryItems.filter(({ disable }) => !disable),
    };
  }, []);

  return {
    showExpandedView,
    handleMouseHoverIn,
    handleMouseHoverOut,
    sidebarItems,
  };
};

export default useSidebar;
