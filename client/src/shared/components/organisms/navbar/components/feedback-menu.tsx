import React, { useState } from 'react';
import {
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FeedbackModal from '../../feedback-modal';

interface FeedbackMenuProps {
  feedbackOpen: boolean;
  feedbackAnchorEl: HTMLElement | null;
  onClose: () => void;
}

const FeedbackMenu = ({
  feedbackOpen,
  feedbackAnchorEl,
  onClose,
}: FeedbackMenuProps) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFeedbackModalOpen = () => {
    setIsFeedbackModalOpen(true);
    onClose();
  };

  const handleRequestFeatureClick = () => {
    window.open(
      'https://github.com/Code-A2Z/code-a2z/issues/new?template=feature-request.yml',
      '_blank'
    );
    onClose();
  };

  // Sync internal modal state request with external prop if needed, or handle exclusively here
  // Actually, keeping Modal local is fine, but the menu trigger is external now.

  return (
    <>
      <Popper
        open={feedbackOpen}
        anchorEl={feedbackAnchorEl}
        placement="bottom-end"
        disablePortal={false}
        sx={{ zIndex: 1300 }}
      >
        <Paper sx={{ mt: 1, minWidth: 200, boxShadow: 3 }}>
          <ClickAwayListener onClickAway={onClose}>
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
