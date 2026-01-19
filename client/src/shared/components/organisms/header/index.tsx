import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import A2ZIconButton from '../../atoms/icon-button';
import { useHeader } from './hooks';
import { mobileMenuId } from './constants';
import RenderMobileMenu from './components/render-mobile-menu';
import Searchbar from '../../molecules/searchbar';
import { NAVBAR_HEIGHT } from '../navbar/constants';
import { HeaderAction } from './typings';

const Header = ({
  leftSideChildren,
  rightSideActions,
  enableSearch = false,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
}: {
  leftSideChildren?: ReactNode;
  rightSideActions?: HeaderAction[];
  enableSearch?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onSearchClear?: () => void;
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
  } = useHeader({
    externalSearchTerm: searchTerm,
    onSearchChange,
    onSearchSubmit,
    onSearchClear,
    enableSearch,
  });
  const hasRightActions = Boolean(rightSideActions?.length);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: theme => theme.zIndex.appBar,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          height: `${NAVBAR_HEIGHT}px`,
          minHeight: `${NAVBAR_HEIGHT}px`,
          maxHeight: `${NAVBAR_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 3 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          {leftSideChildren}
          {enableSearch && (
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
          )}
        </Box>

        {hasRightActions && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {rightSideActions?.map(action => (
              <Box key={action.key}>
                {action.desktopNode ? (
                  action.desktopNode
                ) : (
                  <A2ZIconButton
                    link={action.link}
                    props={{
                      onClick: action.onClick,
                      'aria-label': action.ariaLabel ?? action.label,
                    }}
                  >
                    {action.icon}
                  </A2ZIconButton>
                )}
              </Box>
            ))}
          </Box>
        )}

        {hasRightActions && (
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <A2ZIconButton
              props={{
                'aria-controls': mobileMenuId,
                'aria-haspopup': true,
                onClick: handleMobileMenuOpen,
                'aria-label': 'Open menu',
              }}
            >
              <MoreIcon />
            </A2ZIconButton>
          </Box>
        )}
      </Box>

      {hasRightActions && (
        <RenderMobileMenu
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          isMobileMenuOpen={isMobileMenuOpen}
          handleMobileMenuClose={handleMobileMenuClose}
          actions={rightSideActions ?? []}
        />
      )}
    </Box>
  );
};

export default Header;
