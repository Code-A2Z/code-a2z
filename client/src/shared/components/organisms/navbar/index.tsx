import { Box, Badge, useTheme } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import CreateIcon from '@mui/icons-material/Create';
import MoreIcon from '@mui/icons-material/MoreVert';
import A2ZIconButton from '../../atoms/icon-button';
import { useNavbar } from './hooks';
import { mobileMenuId } from './constants';
import RenderMobileMenu from './components/render-mobile-menu';
import Searchbar from '../../molecules/searchbar';
import { HEADER_HEIGHT } from '../header/constants';

const Navbar = ({
  searchTerm: externalSearchTerm,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  setShowSubscribeModal,
}: {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onSearchClear?: () => void;
  setShowSubscribeModal: (show: boolean) => void;
}) => {
  const theme = useTheme();
  const {
    mobileMoreAnchorEl,
    isMobileMenuOpen,
    handleMobileMenuOpen,
    handleMobileMenuClose,
    internalSearchTerm,
    handleSearchChange,
    handleSearchSubmit,
    handleClearSearch,
    searchInputRef,
  } = useNavbar({
    externalSearchTerm,
    onSearchChange,
    onSearchSubmit,
    onSearchClear,
  });

  return (
    <Box>
      <Box
        sx={{
          height: `${HEADER_HEIGHT}px`,
          minHeight: `${HEADER_HEIGHT}px`,
          maxHeight: `${HEADER_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 3 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          gap: 2,
        }}
      >
        <Searchbar
          placeholder="Search..."
          onSearch={handleSearchChange}
          searchTerm={internalSearchTerm}
          handleOnClearClick={handleClearSearch}
          variant="fullWidth"
          autoFocus={false}
          sx={{ maxWidth: { xs: '100%', md: 400 }, width: '100%' }}
          inputRef={searchInputRef}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.keyCode === 13) {
              handleSearchSubmit();
            }
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <A2ZIconButton link="/editor">
            <Badge>
              <CreateIcon />
            </Badge>
          </A2ZIconButton>

          <A2ZIconButton>
            <Badge onClick={() => setShowSubscribeModal(true)}>
              <MailIcon />
            </Badge>
          </A2ZIconButton>
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
      </Box>

      <RenderMobileMenu
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        setShowSubscribeModal={setShowSubscribeModal}
      />
    </Box>
  );
};

export default Navbar;
