import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import { notificationStatus } from '../../../../infra/rest/apis/notification';

import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const drawerWidth = 240;

const Sidebar = () => {
  const { isAuthenticated, initialized } = useAuth();
  const location = useLocation();
  const page = location.pathname.split('/')[2];

  const [pageState, setPageState] = useState(page?.replace('-', ' ') || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newNotificationAvailable, setNewNotificationAvailable] =
    useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // TEMP DEBUG: log auth init and token presence to help diagnose routing issues
  useEffect(() => {
    try {
      console.debug('Sidebar debug:', {
        initialized,
        isAuthenticated: isAuthenticated(),
        token: localStorage.getItem('access_token'),
      });
    } catch (err) {
      console.debug('Sidebar debug error', err);
    }
  }, [initialized]);

  useEffect(() => {
    // Only fetch notification status after auth initialization and when authenticated.
    if (!initialized || !isAuthenticated()) return;

    const fetchNotificationStatus = async () => {
      const response = await notificationStatus();
      if (response.status === 'success' && response.data) {
        setNewNotificationAvailable(response.data.new_notification_available);
      }
    };
    fetchNotificationStatus();
  }, [initialized, isAuthenticated]);

  // If auth hasn't finished initializing yet, render a small loader to avoid
  // premature redirects while the token/user is being restored.
  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 65px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // After initialization, if not authenticated, redirect to login.
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const handleNavClick = (text: string) => {
    setPageState(text);
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 2, mt: 1, fontWeight: 500 }}
      >
        Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <List>
        <ListItemButton
          component={NavLink}
          to="/dashboard/projects"
          onClick={() => handleNavClick('Projects')}
        >
          <ListItemIcon>
            <DescriptionOutlinedIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItemButton>

        <ListItemButton
          component={NavLink}
          to="/dashboard/notifications"
          onClick={() => handleNavClick('Notification')}
        >
          <ListItemIcon sx={{ position: 'relative' }}>
            <NotificationsNoneIcon color="action" />
            {newNotificationAvailable && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                }}
              />
            )}
          </ListItemIcon>
          <ListItemText primary="Notification" />
        </ListItemButton>

        <ListItemButton
          component={NavLink}
          to="/editor"
          onClick={() => handleNavClick('Write')}
        >
          <ListItemIcon>
            <EditNoteOutlinedIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Write" />
        </ListItemButton>
      </List>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mt: 4, mb: 2, fontWeight: 500 }}
      >
        Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <List>
        <ListItemButton
          component={NavLink}
          to="/settings/edit-profile"
          onClick={() => handleNavClick('Edit Profile')}
        >
          <ListItemIcon>
            <PersonOutlineIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Edit Profile" />
        </ListItemButton>

        <ListItemButton
          component={NavLink}
          to="/settings/change-password"
          onClick={() => handleNavClick('Change Password')}
        >
          <ListItemIcon>
            <LockOutlinedIcon color="action" />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top bar for mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="subtitle1"
              sx={{ textTransform: 'capitalize' }}
            >
              {pageState}
            </Typography>
            <Box width={40} /> {/* spacer */}
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          mt: isMobile ? 8 : 0,
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Sidebar;
