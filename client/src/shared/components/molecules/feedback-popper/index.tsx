import { useState, useRef } from 'react';
import {
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
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import A2ZIconButton from '../../atoms/icon-button';
import FeedbackModal from '../../organisms/feedback-modal';

const FeedbackPopper = () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setOpen(false);
    };

    const handleFeedbackClick = (event: Event | React.SyntheticEvent) => {
        setModalOpen(true);
        handleClose(event);
    };

    const handleRequestFeatureClick = (event: Event | React.SyntheticEvent) => {
        window.open(
            'https://github.com/Code-A2Z/code-a2z/issues/new?template=feature-request.yml',
            '_blank'
        );
        handleClose(event);
    };

    return (
        <>
            <Box>
                <A2ZIconButton
                    props={{
                        ref: anchorRef,
                        onClick: handleToggle,
                        'aria-controls': open ? 'feedback-menu' : undefined,
                        'aria-haspopup': 'true',
                        'aria-expanded': open ? 'true' : undefined,
                    }}
                >
                    <Badge>
                        <SupportAgentIcon />
                    </Badge>
                </A2ZIconButton>

                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="bottom-end"
                    disablePortal={false} // Use false to keep it in DOM flow, or true if needed
                    sx={{ zIndex: 1300 }}
                >
                    <Paper sx={{ mt: 1, minWidth: 200, boxShadow: 3 }}>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="feedback-menu">
                                <MenuItem onClick={handleFeedbackClick}>
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

            <FeedbackModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};

export default FeedbackPopper;
