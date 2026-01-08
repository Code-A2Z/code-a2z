import { Menu, MenuItem, Badge } from '@mui/material';
import { FC } from 'react';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CreateIcon from '@mui/icons-material/Create';
import LoginIcon from '@mui/icons-material/Login';
import AssistantIcon from '@mui/icons-material/Assistant';
import { menuId, mobileMenuId } from '../constants';
import A2ZIconButton from '../../../atoms/icon-button';
import A2ZTypography from '../../../atoms/typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { THEME } from '../../../../states/theme';
import { useA2ZTheme } from '../../../../hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/use-auth';

interface RenderMobileMenuProps {
  mobileMoreAnchorEl: HTMLElement | null;
  isMobileMenuOpen: boolean;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleMobileMenuClose: () => void;
  setShowSubscribeModal: (show: boolean) => void;
  notificationCount: number;
}

const RenderMobileMenu: FC<RenderMobileMenuProps> = ({
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleProfileMenuOpen,
  handleMobileMenuClose,
  setShowSubscribeModal,
  notificationCount,
}) => {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useA2ZTheme();
  const navigate = useNavigate();
  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() => {
          setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
          handleMobileMenuClose();
        }}
      >
        <A2ZIconButton>
          <Badge>
            {theme === THEME.DARK ? <LightModeIcon /> : <DarkModeIcon />}
          </Badge>
        </A2ZIconButton>
        <A2ZTypography
          component="p"
          text={theme === THEME.LIGHT ? 'Dark' : 'Light'}
        />
      </MenuItem>

      <MenuItem
        onClick={() => {
          navigate('/editor');
          handleMobileMenuClose();
        }}
      >
        <A2ZIconButton>
          <Badge>
            <CreateIcon />
          </Badge>
        </A2ZIconButton>
        <A2ZTypography component="p" text="Write" />
      </MenuItem>
      <MenuItem
              key="Get recommendation"
              onClick={() => {
                navigate('/recommendation');
                handleMobileMenuClose();
              }}
            >
              <A2ZIconButton>
                <Badge>
                  <AssistantIcon />
                </Badge>
              </A2ZIconButton>
              <A2ZTypography component="p" text="Get recommendation" />
            </MenuItem>
      {isAuthenticated()
        ? [
            <MenuItem
              key="notifications"
              onClick={() => {
                navigate('/dashboard/notifications');
                handleMobileMenuClose();
              }}
            >
              <A2ZIconButton>
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </A2ZIconButton>
              <A2ZTypography component="p" text="Notifications" />
            </MenuItem>,
            <MenuItem key="profile" onClick={handleProfileMenuOpen}>
              <A2ZIconButton
                props={{
                  'aria-controls': menuId,
                  'aria-haspopup': true,
                }}
              >
                <AccountCircle />
              </A2ZIconButton>
              <A2ZTypography component="p" text="Profile" />
            </MenuItem>,
          ]
        : [
            <MenuItem
              key="subscribe"
              onClick={() => {
                setShowSubscribeModal(true);
                handleMobileMenuClose();
              }}
            >
              <A2ZIconButton>
                <Badge>
                  <MailIcon />
                </Badge>
              </A2ZIconButton>
              <A2ZTypography component="p" text="Subscribe" />
            </MenuItem>,
            <MenuItem
              key="login"
              onClick={() => {
                navigate('/login');
                handleMobileMenuClose();
              }}
            >
              <A2ZIconButton>
                <Badge>
                  <LoginIcon />
                </Badge>
              </A2ZIconButton>
              <A2ZTypography component="p" text="Login" />
            </MenuItem>,
          ]}
    </Menu>
  );
};

export default RenderMobileMenu;
