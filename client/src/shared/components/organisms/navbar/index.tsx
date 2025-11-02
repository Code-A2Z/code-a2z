import { AppBar, Box, Toolbar, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LoginIcon from '@mui/icons-material/Login';
import CreateIcon from '@mui/icons-material/Create';
import MoreIcon from '@mui/icons-material/MoreVert';
import A2ZIconButton from '../../atoms/icon-button';
import A2ZTypography from '../../atoms/typography';
import { useNavbar, useSubscribe } from './hooks';
import { menuId, mobileMenuId } from './constants';
import RenderMobileMenu from './components/render-mobile-menu';
import RenderMenu from './components/render-menu';
import SubscribeModal from './components/subscribe';
import InputBox from '../../atoms/input-box';
import { useEffect } from 'react';
import { useDevice } from '../../../hooks/use-device';
import { THEME } from '../../../states/theme';
import { useA2ZTheme } from '../../../hooks/use-theme';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import { useThrottledFetch } from '../../../hooks/use-throttle-fetch';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { isDesktop } = useDevice();
  const { theme, setTheme } = useA2ZTheme();
  const navigate = useNavigate();
  const {
    anchorEl,
    mobileMoreAnchorEl,
    isMenuOpen,
    isMobileMenuOpen,
    handleProfileMenuOpen,
    handleMobileMenuOpen,
    handleMenuClose,
    handleMobileMenuClose,
    handleSearch,
    searchRef,
    searchBoxVisibility,
    setSearchBoxVisibility,
    triggerSearchByKeyboard,
    notificationCount,
    fetchNotificationCount,
  } = useNavbar();

  const {
    subscribeEmailRef,
    showSubscribeModal,
    setShowSubscribeModal,
    handleSubscribe,
  } = useSubscribe();

  useEffect(() => {
    document.addEventListener('keydown', triggerSearchByKeyboard, true);
    return () => {
      document.removeEventListener('keydown', triggerSearchByKeyboard, true);
    };
  }, [isDesktop, triggerSearchByKeyboard]);

  useThrottledFetch({
    isAuthenticated: isAuthenticated(),
    fetch: fetchNotificationCount,
    storageKey: 'a2z_notifications_last_fetch',
  });

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <A2ZIconButton link="/" props={{ sx: { marginRight: 2 } }}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: '32px', height: '32px', borderRadius: '8px' }}
              />
            </A2ZIconButton>
            <A2ZTypography
              variant="h6"
              noWrap
              props={{ sx: { display: { xs: 'none', sm: 'block' } } }}
              text="Code A2Z"
            />

            <InputBox
              id="navbar-search"
              name="search"
              type="text"
              inputRef={searchRef}
              placeholder={
                searchBoxVisibility || !isDesktop ? 'Search...' : 'Press CTRL+K'
              }
              icon={<SearchIcon />}
              sx={{
                padding: { xs: 0, sm: '0 1.25rem' },
              }}
              slotProps={{
                htmlInput: {
                  onFocus: () => setSearchBoxVisibility(true),
                  onBlur: () => setSearchBoxVisibility(false),
                  onKeyDown: handleSearch,
                  sx: {
                    padding: '10px 0',
                  },
                },
              }}
            />

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <A2ZIconButton>
                <Badge
                  onClick={() =>
                    setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)
                  }
                >
                  {theme === THEME.DARK ? <LightModeIcon /> : <DarkModeIcon />}
                </Badge>
              </A2ZIconButton>

              <A2ZIconButton link="/editor">
                <Badge>
                  <CreateIcon />
                </Badge>
              </A2ZIconButton>

              {isAuthenticated() ? (
                <>
                  <A2ZIconButton link="/dashboard/notifications">
                    <Badge badgeContent={notificationCount} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </A2ZIconButton>
                  <A2ZIconButton
                    props={{
                      edge: 'end',
                      'aria-controls': menuId,
                      'aria-haspopup': true,
                      onClick: handleProfileMenuOpen,
                    }}
                  >
                    <AccountCircle />
                  </A2ZIconButton>
                </>
              ) : (
                <>
                  <A2ZIconButton>
                    <Badge onClick={() => setShowSubscribeModal(true)}>
                      <MailIcon />
                    </Badge>
                  </A2ZIconButton>
                  <A2ZIconButton>
                    <Badge onClick={() => navigate('/login')}>
                      <LoginIcon />
                    </Badge>
                  </A2ZIconButton>
                </>
              )}
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <A2ZIconButton
                props={{
                  'aria-controls': mobileMenuId,
                  'aria-haspopup': true,
                  onClick: handleMobileMenuOpen,
                }}
              >
                <MoreIcon />
              </A2ZIconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <RenderMobileMenu
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          isMobileMenuOpen={isMobileMenuOpen}
          handleProfileMenuOpen={handleProfileMenuOpen}
          handleMobileMenuClose={handleMobileMenuClose}
          setShowSubscribeModal={setShowSubscribeModal}
          notificationCount={notificationCount}
        />
        <RenderMenu
          anchorEl={anchorEl}
          isMenuOpen={isMenuOpen}
          handleMenuClose={handleMenuClose}
        />

        <SubscribeModal
          subscribeEmailRef={subscribeEmailRef}
          showSubscribeModal={showSubscribeModal}
          setShowSubscribeModal={setShowSubscribeModal}
          handleSubscribe={handleSubscribe}
        />
      </Box>

      <Outlet />
    </>
  );
};

export default Navbar;
