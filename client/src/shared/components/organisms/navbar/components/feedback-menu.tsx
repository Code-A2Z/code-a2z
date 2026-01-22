import React, { useState } from 'react';
import {
  Badge,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import A2ZIconButton from '../../../atoms/icon-button';
import FeedbackModal from '../../feedback-modal';

const FeedbackMenu = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackAnchorEl, setFeedbackAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFeedbackToggle = (event: React.MouseEvent<HTMLElement>) => {
    setFeedbackAnchorEl(event.currentTarget);
    setFeedbackOpen(prevOpen => !prevOpen);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
  };

  const handleFeedbackModalOpen = () => {
    setIsFeedbackModalOpen(true);
    handleFeedbackClose();
  };

  const handleRequestFeatureClick = () => {
    window.open(
      'https://github.com/Code-A2Z/code-a2z/issues/new?template=feature-request.yml',
      '_blank'
    );
    handleFeedbackClose();
  };

  return (
    <>
      <A2ZIconButton
        props={{
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
        anchorEl={feedbackAnchorEl}
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

      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
};

export default FeedbackMenu;
