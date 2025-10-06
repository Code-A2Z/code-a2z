import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CreateIcon from '@mui/icons-material/Create';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '@mui/material/Button';

import A2ZTypography from '../../atoms/typography';
import UserNavigationPanel from './components/userNavigationPanel';
import SubscribeModal from './components/subscriberModal';
import ThemeToggle from '../theme-toggler';
import { UserAtom } from '../../../states/user';
import { checkNewNotifications } from './requests';
import { useDevice } from '../../../hooks/use-device';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const [user, setUser] = useAtom(UserAtom);
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { isDesktop } = useDevice();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.access_token) {
        const response = await checkNewNotifications();
        if (response.status === 200) {
          setUser(prev => ({
            ...prev,
            ...(response as { data: { new_notification_available: boolean } })
              .data,
          }));
        }
      }
    };
    fetchNotifications();
  }, [user?.access_token, setUser]);

  const handleUserNavPanel = () => {
    setUserNavPanel(currentVal => !currentVal);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;

    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey && event.key === 'k') ||
        (event.ctrlKey && event.key === 'k')
      ) {
        event.preventDefault();
        event.stopPropagation();

        if (isDesktop) {
          setTimeout(() => {
            if (searchRef.current) {
              searchRef.current.focus();
              searchRef.current.select();
            }
          }, 10);
        } else {
          setSearchBoxVisibility(true);
          setTimeout(() => {
            if (searchRef.current) {
              searchRef.current.focus();
            }
          }, 100);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isDesktop]);

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <AppBar color="inherit" position="static" enableColorOnDark>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Link to="/" className="flex-none w-10">
                <img src="/logo.png" alt="" className="w-full rounded-md" />
              </Link>

              <A2ZTypography sx={{ display: { xs: 'none', sm: 'block' } }}>
                Code A2Z
              </A2ZTypography>

              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    inputRef={searchRef}
                    placeholder={
                      searchBoxVisibility
                        ? 'Search Projects...'
                        : 'Press Ctrl+K'
                    }
                    inputProps={{ 'aria-label': 'search' }}
                    onKeyDown={handleSearch}
                    onFocus={() => setSearchBoxVisibility(true)}
                    onBlur={() => {
                      if (window.innerWidth < 1024) {
                        setSearchBoxVisibility(false);
                      }
                    }}
                  />
                </Search>
              </Box>

              <Box
                sx={{
                  display: { xs: 'flex', lg: 'none' },
                  alignItems: 'center',
                }}
              >
                <IconButton
                  size="large"
                  onClick={() => setSearchBoxVisibility(prev => !prev)}
                  aria-label="open search"
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ThemeToggle />

              <Button
                startIcon={<CreateIcon />}
                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                component={Link}
                to="/editor"
                color="inherit"
                variant="text"
              >
                Write
              </Button>

              <IconButton
                size="large"
                aria-label="start writing about your project"
                sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                component={Link}
                to="/editor"
              >
                <CreateIcon />
              </IconButton>

              {user?.access_token ? (
                <>
                  <IconButton
                    size="large"
                    aria-label={`show notifications`}
                    component={Link}
                    to="/dashboard/notifications"
                    sx={{
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <Badge
                      badgeContent={user?.new_notification_available ? 1 : 0}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          animation: user?.new_notification_available 
                            ? 'pulse 2s infinite' 
                            : 'none',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '50%': {
                              transform: 'scale(1.2)',
                              opacity: 0.8,
                            },
                            '100%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                          },
                        },
                      }}
                    >
                      <NotificationsIcon 
                        sx={{
                          color: user?.new_notification_available 
                            ? 'primary.main' 
                            : 'inherit',
                          transition: 'color 0.3s ease',
                        }}
                      />
                    </Badge>
                  </IconButton>

                  <Box
                    sx={{ position: 'relative' }}
                    onClick={handleUserNavPanel}
                    onBlur={handleBlur}
                  >
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                    >
                      <AccountCircle />
                    </IconButton>
                    {userNavPanel ? <UserNavigationPanel /> : null}
                  </Box>
                </>
              ) : (
                <>
                  <IconButton
                    size="large"
                    aria-label="subscribe"
                    onClick={() => setShowSubscribeModal(true)}
                  >
                    <MailIcon />
                  </IconButton>

                  <Button
                    color="inherit"
                    variant="contained"
                    component={Link}
                    to="/login"
                    disableElevation
                  >
                    Login
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={theme => ({
            display: { xs: searchBoxVisibility ? 'block' : 'none', lg: 'none' },
            position: 'absolute',
            left: 0,
            top: '100%',
            mt: '0.5rem',
            width: '100%',
            bgcolor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: '5vw',
            zIndex: 10,
          })}
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ position: 'relative' }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                inputRef={searchRef}
                placeholder={searchBoxVisibility ? 'Search' : 'Press Ctrl+K'}
                inputProps={{ 'aria-label': 'search' }}
                onKeyDown={handleSearch}
                onFocus={() => setSearchBoxVisibility(true)}
                onBlur={() => {
                  if (window.innerWidth < 1024) {
                    setTimeout(() => setSearchBoxVisibility(false), 100);
                  }
                }}
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  p: 1,
                  borderRadius: 9999,
                }}
              />
            </Box>
          </Box>
        </Box>

        <SubscribeModal
          showSubscribeModal={showSubscribeModal}
          setShowSubscribeModal={setShowSubscribeModal}
        />
      </Box>

      <Outlet />
    </>
  );
};

export default Navbar;
