import { useAtom } from 'jotai';
import {
  NotificationSystemAtom,
  NotificationType,
} from '../../../states/notification';
import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import { SyntheticEvent } from 'react';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />; // slide in from right side
}

function A2ZNotifications() {
  const [notifications, setNotifications] = useAtom(NotificationSystemAtom);

  const handleClose = (
    id: string,
    event?: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, open: false } : n))
    );
  };

  return (
    <>
      {notifications.map(
        ({
          id,
          message,
          type = NotificationType.INFO,
          open,
          autoHideDuration,
        }) => (
          <Snackbar
            key={id}
            open={open}
            autoHideDuration={autoHideDuration ?? 4000}
            onClose={(event, reason) => handleClose(id, event, reason)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            TransitionComponent={SlideTransition}
            sx={{ zIndex: 1400 }}
          >
            <Alert
              onClose={event => handleClose(id, event)}
              severity={type}
              variant="outlined"
              sx={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: theme => theme.shadows[6],
              }}
            >
              {message}
            </Alert>
          </Snackbar>
        )
      )}
    </>
  );
}

export default A2ZNotifications;
