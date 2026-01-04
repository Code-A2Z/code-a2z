import { FC } from 'react';
import { Menu, MenuItem, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { UserAtom } from '../../../../../infra/states/user';
import { useAuth } from '../../../../../shared/hooks/use-auth';
import { logout as logoutApi } from '../../../../../infra/rest/apis/auth';
import { menuId } from '../constants';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import A2ZTypography from '../../../atoms/typography';

interface RenderMenuProps {
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
}

const RenderMenu: FC<RenderMenuProps> = ({
  anchorEl,
  isMenuOpen,
  handleMenuClose,
}) => {
  const navigate = useNavigate();
  const user = useAtomValue(UserAtom);
  const { logout } = useAuth();

  const handleProfileClick = () => {
    if (user?.personal_info?.username) {
      navigate(`/user/${user.personal_info.username}`);
    }
    handleMenuClose();
  };

  const handleDashboardClick = () => {
    navigate('/dashboard/projects');
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/settings/edit-profile');
    handleMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/');
      handleMenuClose();
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>
        <PersonIcon sx={{ mr: 2 }} />
        <A2ZTypography component="span" text="Profile" />
      </MenuItem>
      <MenuItem onClick={handleDashboardClick}>
        <DashboardIcon sx={{ mr: 2 }} />
        <A2ZTypography component="span" text="Dashboard" />
      </MenuItem>
      <MenuItem onClick={handleSettingsClick}>
        <SettingsIcon sx={{ mr: 2 }} />
        <A2ZTypography component="span" text="Settings" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 2 }} />
        <A2ZTypography component="span" text="Logout" />
      </MenuItem>
    </Menu>
  );
};

export default RenderMenu;
