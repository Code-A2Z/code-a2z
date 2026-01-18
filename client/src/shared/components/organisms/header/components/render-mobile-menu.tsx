import { Menu, MenuItem } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { mobileMenuId } from '../constants';
import A2ZIconButton from '../../../atoms/icon-button';
import A2ZTypography from '../../../atoms/typography';
import { HeaderAction } from '../typings';

interface RenderMobileMenuProps {
  mobileMoreAnchorEl: HTMLElement | null;
  isMobileMenuOpen: boolean;
  handleMobileMenuClose: () => void;
  actions: HeaderAction[];
}

const RenderMobileMenu: FC<RenderMobileMenuProps> = ({
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  actions,
}) => {
  const navigate = useNavigate();

  const handleActionClick = (action: HeaderAction) => {
    if (action.onClick) {
      action.onClick();
    }
    if (action.link) {
      navigate(action.link);
    }
    handleMobileMenuClose();
  };

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
      {actions.map(action => (
        <MenuItem key={action.key} onClick={() => handleActionClick(action)}>
          <A2ZIconButton>{action.icon}</A2ZIconButton>
          <A2ZTypography component="p" text={action.label} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default RenderMobileMenu;
