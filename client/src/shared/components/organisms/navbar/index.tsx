import { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Badge,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import A2ZIconButton from '../../atoms/icon-button';
import Logo from '../../atoms/logo';
import { useA2ZTheme } from '../../../hooks/use-theme';
import { THEME } from '../../../states/theme';
import { NAVBAR_HEIGHT } from './constants';
import FeedbackModal from '../feedback-modal';

const Navbar = () => {
  const { theme, setTheme } = useA2ZTheme();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const feedbackAnchorRef = useRef<HTMLButtonElement>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFeedbackToggle = () => {
    setFeedbackOpen(prevOpen => !prevOpen);
  };

  const handleFeedbackClose = (event: Event | React.SyntheticEvent) => {
    if (
      feedbackAnchorRef.current &&
      feedbackAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setFeedbackOpen(false);
  };

  const handleFeedbackModalOpen = (event: Event | React.SyntheticEvent) => {
    setIsFeedbackModalOpen(true);
    handleFeedbackClose(event);
  };

  const handleRequestFeatureClick = (event: Event | React.SyntheticEvent) => {
    window.open(
      'https://github.com/Code-A2Z/code-a2z/issues/new?template=feature-request.yml',
      '_blank'
    );
    handleFeedbackClose(event);
  };

  return (
    <AppBar
      position="static"
      sx={{
        minHeight: `${NAVBAR_HEIGHT}px`,
        maxHeight: `${NAVBAR_HEIGHT}px`,
        height: `${NAVBAR_HEIGHT}px`,
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${NAVBAR_HEIGHT}px !important`,
          maxHeight: `${NAVBAR_HEIGHT}px`,
          height: `${NAVBAR_HEIGHT}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Logo />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <A2ZIconButton
            props={{
              onClick: () =>
                setTheme(theme === THEME.DARK ? THEME.LIGHT : THEME.DARK),
            }}
          >
            <Badge>
              {theme === THEME.DARK ? <LightModeIcon /> : <DarkModeIcon />}
            </Badge>
          </A2ZIconButton>

          <Box>
            <A2ZIconButton
              props={{
                ref: feedbackAnchorRef,
                onClick: handleFeedbackToggle,
                'aria-controls': feedbackOpen ? 'feedback-menu' : undefined,
                'aria-haspopup': 'true',
                'aria-expanded': feedbackOpen ? 'true' : undefined,
              }}
            >
              <Badge>
                <SupportAgentIcon />
              </Badge>
            </A2ZIconButton>

            <Popper
              open={feedbackOpen}
              anchorEl={feedbackAnchorRef.current}
              placement="bottom-end"
              disablePortal={false}
              sx={{ zIndex: 1300 }}
            >
              <Paper sx={{ mt: 1, minWidth: 200, boxShadow: 3 }}>
                <ClickAwayListener onClickAway={handleFeedbackClose}>
                  <MenuList autoFocusItem={feedbackOpen} id="feedback-menu">
                    <MenuItem onClick={handleFeedbackModalOpen}>
                      <ListItemIcon>
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Feedback</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleRequestFeatureClick}>
                      <ListItemIcon>
                        <LightbulbIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Request a feature</ListItemText>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </Box>
        </Box>
      </Toolbar>
      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </AppBar>
  );
};

export default Navbar;
