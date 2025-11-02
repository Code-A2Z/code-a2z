import { FC } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { menuId } from '../constants';

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
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
};

export default RenderMenu;
