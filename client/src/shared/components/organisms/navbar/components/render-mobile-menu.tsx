import { Menu, MenuItem, Badge } from '@mui/material';
import { FC } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import { mobileMenuId } from '../constants';
import A2ZIconButton from '../../../atoms/icon-button';
import A2ZTypography from '../../../atoms/typography';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate } from 'react-router-dom';

interface RenderMobileMenuProps {
  mobileMoreAnchorEl: HTMLElement | null;
  isMobileMenuOpen: boolean;
  handleMobileMenuClose: () => void;
  setShowSubscribeModal: (show: boolean) => void;
}

const RenderMobileMenu: FC<RenderMobileMenuProps> = ({
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  setShowSubscribeModal,
}) => {
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
      </MenuItem>
    </Menu>
  );
};

export default RenderMobileMenu;
